// Admin panel > Web Asistanı notları ve ayarları (sunucu tarafı). Backend'in iç ucundan okunur:
// /internal/web-assistant/knowledge (API gateway'den geçmez, ECS iç ağı) + X-Internal-Token.
// 60 sn önbellek; backend'e ulaşılamazsa son alınan bilgi, o da yoksa knowledge.js'teki yedek notlar.
import { BACKEND_URL } from "../auth/session";

const TTL_MS = 60 * 1000;
const DEFAULTS = { enabled: true, dailyLimit: 3000, notes: null, source: "fallback" };

let cached = null;
let cachedAt = 0;

export async function getAssistantKnowledge() {
  if (cached && Date.now() - cachedAt < TTL_MS) return cached;
  const token = process.env.WEB_ASSISTANT_INTERNAL_TOKEN;
  if (token) {
    try {
      const response = await fetch(`${BACKEND_URL}/internal/web-assistant/knowledge`, {
        headers: { "X-Internal-Token": token },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const body = await response.json();
        cached = {
          enabled: body.enabled !== false,
          dailyLimit: Number.isInteger(body.dailyLimit) ? body.dailyLimit : DEFAULTS.dailyLimit,
          notes: Array.isArray(body.notes) ? body.notes : null,
          source: "backend",
        };
        cachedAt = Date.now();
        return cached;
      }
      console.warn(`[CHAT_KNOWLEDGE_FAILED] status=${response.status}`);
    } catch (error) {
      console.warn(`[CHAT_KNOWLEDGE_FAILED] error=${error?.name ?? "unknown"}`);
    }
  }
  cachedAt = Date.now();
  cached = cached ?? DEFAULTS;
  return cached;
}
