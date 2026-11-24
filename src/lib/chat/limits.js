// Asistan kötüye kullanım sınırları (bellekte). Web sitesi prodda tek ECS task'ı olarak çalışır; task sayısı
// artarsa sınırlar task başına olur (Cloudflare'deki /api/chat rate-limit kuralı dış katmandır).

export const LIMITS = {
  perMinute: 6,
  perDay: 40,
  maxMessageChars: 500,
  maxHistory: 8,
  maxConversationMessages: 20,
};

const DAY_MS = 24 * 60 * 60 * 1000;
const byIp = new Map(); // ip -> { minute: number[], dayStart, dayCount }
let globalDay = { key: "", count: 0 };

function todayKey() {
  return new Date().toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" });
}

/** Bellek şişmesin: bir günden eski IP kayıtlarını ara ara at. */
function sweep(now) {
  if (byIp.size < 5000) return;
  for (const [ip, entry] of byIp) if (now - entry.dayStart > DAY_MS) byIp.delete(ip);
}

/**
 * Bir mesaj hakkı ister. Hak varsa sayar ve { ok: true } döner; yoksa { ok: false, reason } döner
 * (reason: "minute" | "day" | "global").
 */
export function takeQuota(ip, dailyLimit) {
  const now = Date.now();
  const key = todayKey();
  if (globalDay.key !== key) globalDay = { key, count: 0 };
  if (dailyLimit <= 0 || globalDay.count >= dailyLimit) return { ok: false, reason: "global" };

  sweep(now);
  let entry = byIp.get(ip);
  if (!entry || now - entry.dayStart > DAY_MS) {
    entry = { minute: [], dayStart: now, dayCount: 0 };
    byIp.set(ip, entry);
  }
  entry.minute = entry.minute.filter((t) => now - t < 60_000);
  if (entry.dayCount >= LIMITS.perDay) return { ok: false, reason: "day" };
  if (entry.minute.length >= LIMITS.perMinute) return { ok: false, reason: "minute" };

  entry.minute.push(now);
  entry.dayCount += 1;
  globalDay.count += 1;
  return { ok: true };
}

export function globalUsage() {
  return { ...globalDay };
}
