import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isSameOrigin } from "../../../lib/auth/session";
import { buildSystemPrompt } from "../../../lib/chat/knowledge";
import { getAssistantCatalog } from "../../../lib/chat/catalog";
import { getAssistantKnowledge } from "../../../lib/chat/notes";
import { LIMITS, takeQuota } from "../../../lib/chat/limits";
import { streamCompletion } from "../../../lib/chat/mantle";
import { redact } from "../../../lib/chat/redact";

// Web sitesi AI asistanı. Tarayıcı yalnızca bu adresi görür; bilgi notları, prompt, model ve API anahtarı
// sunucuda kalır. Cevap düz metin akışı olarak döner (sonunda [[KOD]] buton kodları olabilir).
// Hatalar JSON: { code } — disabled | minute | day | global | conversation | invalid | unavailable.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function fail(status, code) {
  return NextResponse.json({ code }, { status, headers: NO_STORE });
}

function clientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Logda IP yerine günlük değişen kısa özet (kötüye kullanımı izlemeye yeter, IP saklanmaz). */
function ipTag(ip) {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${day}|raporin-chat`).digest("hex").slice(0, 10);
}

/** İstemciden gelen geçmiş güvenilmez: biçim, uzunluk ve sayı burada yeniden sınırlanır. */
function sanitize(body) {
  const raw = Array.isArray(body?.messages) ? body.messages : null;
  if (!raw || raw.length === 0) return null;
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .filter((m) => m.content);
  const last = messages.at(-1);
  if (!last || last.role !== "user" || last.content.length > LIMITS.maxMessageChars) return null;
  const userCount = messages.filter((m) => m.role === "user").length;
  const recent = messages.slice(-LIMITS.maxHistory).map((m) => ({
    role: m.role,
    content: m.content.slice(0, m.role === "user" ? LIMITS.maxMessageChars : 1500),
  }));
  // Geçmiş asistan mesajıyla başlamasın (kırpma ortadan kesebilir).
  while (recent.length && recent[0].role !== "user") recent.shift();
  return { messages: recent, userCount };
}

export async function POST(request) {
  if (!isSameOrigin(request)) return fail(403, "invalid");

  const started = Date.now();
  const knowledge = await getAssistantKnowledge();
  if (!knowledge.enabled || process.env.WEB_ASSISTANT_ENABLED === "false") return fail(503, "disabled");

  const body = await request.json().catch(() => null);
  const input = sanitize(body);
  if (!input) return fail(400, "invalid");
  if (input.userCount > LIMITS.maxConversationMessages) return fail(429, "conversation");

  const ip = clientIp(request);
  const quota = takeQuota(ip, knowledge.dailyLimit);
  const tag = ipTag(ip);
  const page = typeof body.page === "string" ? body.page.slice(0, 120) : "";
  const question = input.messages.at(-1).content;
  if (!quota.ok) {
    console.info(`[CHAT_LIMIT] reason=${quota.reason} ip=${tag} page=${page}`);
    return fail(429, quota.reason);
  }

  const catalog = await getAssistantCatalog();
  const system = buildSystemPrompt({ notes: knowledge.notes, catalog });
  const meta = {};
  const iterator = streamCompletion([{ role: "system", content: system }, ...input.messages], { maxTokens: 400, meta });

  let first;
  try {
    first = await iterator.next();
  } catch (error) {
    console.error(
      `[CHAT_ERROR] ip=${tag} page=${page} ms=${Date.now() - started} error=${String(error?.message ?? error).slice(0, 200)}`,
    );
    return fail(502, "unavailable");
  }

  const encoder = new TextEncoder();
  let answer = first.done ? "" : first.value;
  const stream = new ReadableStream({
    async start(controller) {
      if (answer) controller.enqueue(encoder.encode(answer));
      try {
        if (!first.done) {
          for await (const text of iterator) {
            answer += text;
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        console.error(`[CHAT_STREAM_ERROR] ip=${tag} error=${String(error?.message ?? error).slice(0, 200)}`);
      } finally {
        controller.close();
        const actions = [...answer.matchAll(/\[\[([A-Z]+)\]\]/g)].map((m) => m[1]);
        console.info(
          `[CHAT] ip=${tag} page=${page} turn=${input.userCount} model=${meta.model ?? "-"} notes=${knowledge.source} ` +
            `ms=${Date.now() - started} chars=${answer.length} actions=${actions.join(",") || "-"} ` +
            `q="${redact(question).slice(0, 300)}" a="${redact(answer).slice(0, 600)}"`,
        );
      }
    },
    cancel() {
      iterator.return?.();
    },
  });

  return new Response(stream, {
    headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8", "X-Accel-Buffering": "no" },
  });
}
