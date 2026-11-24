// Amazon Bedrock Mantle (OpenAI uyumlu Chat Completions) istemcisi. Yalnızca sunucuda çalışır.
// Gemma modelleri Mantle'da yalnızca /openai/v1 yolunda servis edilir (/v1 yolu 400 döner, 2026-11-24).
// Mantle max_tokens'ı reddeder; çıktı sınırı max_completion_tokens ile verilir (ai-service ile aynı).

const DEFAULT_BASE = "https://bedrock-mantle.eu-central-1.api.aws/openai/v1";
const DEFAULT_MODEL = "google.gemma-4-26b-a4b";
const DEFAULT_FALLBACK = "google.gemma-4-31b";
const FIRST_TOKEN_TIMEOUT_MS = 12_000;
const TOTAL_TIMEOUT_MS = 30_000;

export function mantleConfig() {
  return {
    apiKey: process.env.WEB_ASSISTANT_MANTLE_API_KEY || "",
    base: (process.env.WEB_ASSISTANT_MANTLE_API_BASE || DEFAULT_BASE).replace(/\/+$/, ""),
    model: process.env.WEB_ASSISTANT_MODEL || DEFAULT_MODEL,
    fallback: process.env.WEB_ASSISTANT_FALLBACK_MODEL || DEFAULT_FALLBACK,
  };
}

async function open(config, model, messages, maxTokens) {
  const controller = new AbortController();
  const total = setTimeout(() => controller.abort(), TOTAL_TIMEOUT_MS);
  const response = await fetch(`${config.base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true, max_completion_tokens: maxTokens }),
    signal: controller.signal,
  }).catch((error) => {
    clearTimeout(total);
    throw error;
  });
  if (!response.ok) {
    clearTimeout(total);
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new Error(`mantle ${response.status} ${detail}`);
  }
  return { response, controller, total };
}

/** SSE akışından metin parçalarını üretir. */
async function* readDeltas(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const chunk = JSON.parse(data);
        const text = chunk.choices?.[0]?.delta?.content;
        if (text) yield text;
      } catch {
        // yarım ya da tanınmayan satır: atla
      }
    }
  }
}

/**
 * Cevabı parça parça üretir. Birincil model ilk parçayı veremezse (hata ya da zaman aşımı) yedek modelle
 * bir kez daha dener; ilk parça geldikten sonra model değiştirilmez. Kullanılan model `meta.model`a yazılır.
 */
export async function* streamCompletion(messages, { maxTokens = 400, meta = {} } = {}) {
  const config = mantleConfig();
  if (!config.apiKey) throw new Error("WEB_ASSISTANT_MANTLE_API_KEY tanımlı değil");
  const models = [config.model, config.fallback].filter((m, i, all) => m && all.indexOf(m) === i);

  let lastError;
  for (const model of models) {
    let opened;
    try {
      opened = await open(config, model, messages, maxTokens);
      const iterator = readDeltas(opened.response);
      const first = await Promise.race([
        iterator.next(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("first token timeout")), FIRST_TOKEN_TIMEOUT_MS)),
      ]);
      meta.model = model;
      if (first.done) return;
      yield first.value;
      for await (const text of iterator) yield text;
      return;
    } catch (error) {
      lastError = error;
      if (meta.model) throw error; // ilk parça gönderildiyse yedek modele geçilmez
      console.warn(`[CHAT_MODEL_FAILED] model=${model} error=${String(error?.message ?? error).slice(0, 160)}`);
    } finally {
      if (opened) {
        clearTimeout(opened.total);
        opened.controller.abort();
      }
    }
  }
  throw lastError ?? new Error("no model");
}
