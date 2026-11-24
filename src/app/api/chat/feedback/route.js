import { NextResponse } from "next/server";
import { isSameOrigin } from "../../../../lib/auth/session";
import { redact } from "../../../../lib/chat/redact";

// Asistan cevabına 👍/👎. Yalnızca loglanır ([CHAT_FEEDBACK], kişisel veri maskeli): "Destek notlarına ne
// eklemeliyiz?" sorusunun kaynağı. Kayıt tutulmaz.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isSameOrigin(request)) return NextResponse.json({ code: "invalid" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const rating = body?.rating === "up" ? "up" : body?.rating === "down" ? "down" : null;
  if (!rating) return NextResponse.json({ code: "invalid" }, { status: 400 });
  const question = typeof body.question === "string" ? redact(body.question).slice(0, 300) : "";
  const answer = typeof body.answer === "string" ? redact(body.answer).slice(0, 400) : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 120) : "";
  console.info(`[CHAT_FEEDBACK] rating=${rating} page=${page} q="${question}" a="${answer}"`);
  return new NextResponse(null, { status: 204 });
}
