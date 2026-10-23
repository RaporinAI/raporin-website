// Hesabım > Paketim > Kredi kullanımı: gün gün kullanım hesapları ve kredi hareketlerinin metinleri.
// Masaüstündeki Kredi kullanımı penceresiyle aynı kuralları izler.

export const USAGE_RANGES = [7, 30, 90];

/** Sınırsız pakette kredi düşmez; grafik ve toplamlar analiz sayısını gösterir. */
export const dayValue = (day, unlimited) => (unlimited ? day.analyses : day.credits);

/**
 * Günlük ortalama. Dönemin başında hiç kullanım yoksa (eczane yeni başladıysa) ortalama ilk kullanım
 * gününden itibaren hesaplanır; aksi halde boş günler ortalamayı yapay olarak düşürür.
 */
export function dailyAverage(days, unlimited) {
  const first = days.findIndex((day) => dayValue(day, unlimited) > 0);
  if (first === -1) return 0;
  const active = days.slice(first);
  return active.reduce((sum, day) => sum + dayValue(day, unlimited), 0) / active.length;
}

/** En yüksek kullanımlı gün (eşitlikte en yenisi); hiç kullanım yoksa null. */
export function busiestDay(days, unlimited) {
  let best = null;
  for (const day of days) {
    if (dayValue(day, unlimited) > 0 && (!best || dayValue(day, unlimited) >= dayValue(best, unlimited))) best = day;
  }
  return best;
}

/** Ör. "3,4"; 10 ve üstü tam sayı. */
export const formatAverage = (value) =>
  value <= 0
    ? "0"
    : value.toLocaleString("tr-TR", { maximumFractionDigits: value < 10 ? 1 : 0, minimumFractionDigits: 0 });

// Backend günleri "2026-10-12" olarak gönderir; saat dilimi kaymasın diye öğlen olarak okunur.
const asDate = (isoDay) => new Date(`${isoDay}T12:00:00`);
const shortDay = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const longDay = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" });
const weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "short" });

export const formatShortDay = (isoDay) => shortDay.format(asDate(isoDay));
export const formatLongDay = (isoDay) => longDay.format(asDate(isoDay));
export const formatWeekday = (isoDay) => weekday.format(asDate(isoDay));

/** RaporinAI ekibinin verdiği krediler (kampanya, hediye, telafi). */
const TEAM_SOURCES = ["PROMO", "MANUAL"];

const isLive = (movement, now) =>
  movement.bucketRemaining > 0 && movement.expiresAt && new Date(movement.expiresAt).getTime() > now;

/**
 * Bir kredi hareketinin kullanıcıya gösterilen hali.
 *
 * @param now veri alındığı an (ms); kalan/süresi dolmuş ayrımı buna göre yapılır
 * @returns {{ kind: "subscription"|"team"|"pack"|"expire"|"adjust"|"other", title: string, live: boolean, expired: boolean }}
 */
export function describeMovement(movement, now) {
  const expired = Boolean(movement.expiresAt) && new Date(movement.expiresAt).getTime() <= now;
  return { ...describeKind(movement, now), expired };
}

function describeKind(movement, now) {
  if (movement.type === "GRANT") {
    if (TEAM_SOURCES.includes(movement.source)) {
      return { kind: "team", title: "RaporinAI ekibinden ek kredi", live: isLive(movement, now) };
    }
    if (movement.source === "PACK") {
      return { kind: "pack", title: "Ek kredi paketi", live: isLive(movement, now) };
    }
    if (movement.source === "WELCOME") {
      return { kind: "team", title: "Hoş geldin kredisi", live: isLive(movement, now) };
    }
    return { kind: "subscription", title: movement.description || "Paket kredisi yüklendi", live: isLive(movement, now) };
  }
  if (movement.type === "EXPIRE") {
    return { kind: "expire", title: "Kullanılmayan kredinin süresi doldu", live: false };
  }
  if (movement.type === "ADJUST") {
    return {
      kind: "adjust",
      title: movement.amount >= 0 ? "RaporinAI ekibi kredi ekledi" : "RaporinAI ekibi kredi düzeltmesi yaptı",
      live: false,
    };
  }
  return { kind: "other", title: "Kredi hareketi", live: false };
}

/** Süresi dolmamış, hâlâ kullanılabilir RaporinAI ekibi kredileri (üstte ayrıca vurgulanır). */
export function liveTeamCredits(movements, now) {
  return (movements ?? []).filter((m) => m.type === "GRANT" && TEAM_SOURCES.includes(m.source) && isLive(m, now));
}
