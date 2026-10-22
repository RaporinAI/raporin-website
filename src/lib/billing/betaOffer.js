/**
 * Beta üyelerine özel %50 indirim. Hakkı backend belirler (eczanenin kayıt tarihi ve indirimin son anı):
 * `/api/billing/me` yanıtındaki `betaOffer` ({ endsAt, serverTime }) ve kişisel katalogdaki
 * `betaOfferEndsAt` yalnızca hakkı olan eczanede gelir. Beta fiyatından paket alınınca ya da süre dolunca
 * backend ikisini de göndermez.
 */

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Geri sayımın aşaması: son 72 saatte uyarı, son 24 saatte acil (saniyeli sayaç, kırmızı).
 *
 * @returns {"calm" | "warning" | "urgent" | "ended"}
 */
export function offerPhase(msLeft) {
  if (msLeft <= 0) return "ended";
  if (msLeft <= DAY) return "urgent";
  if (msLeft <= 3 * DAY) return "warning";
  return "calm";
}

/** Kalan süre parçaları. */
export function splitDuration(msLeft) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** "3 gün 4 saat" / "5 saat 12 dakika" / "12 dakika": kısa, okunur kalan süre. */
export function remainingLabel(msLeft) {
  const { days, hours, minutes } = splitDuration(msLeft);
  if (days > 0) return hours > 0 ? `${days} gün ${hours} saat` : `${days} gün`;
  if (hours > 0) return minutes > 0 ? `${hours} saat ${minutes} dakika` : `${hours} saat`;
  return `${Math.max(1, minutes)} dakika`;
}

const endFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});

/** "7 Kasım Cumartesi 23:59" */
export const formatOfferEnd = (iso) => endFormatter.format(new Date(iso));

/**
 * Eczanenin gösterilecek beta indirimi: hakkı var, süre dolmamış ve beta fiyatından paket almamış.
 *
 * @param billing GET /api/billing/me yanıtı
 * @returns {{ endsAt: string, clockOffset: number } | null} clockOffset: sunucu saati − bilgisayar saati (ms)
 */
export function activeBetaOffer(billing, receivedAt = Date.now()) {
  const offer = billing?.betaOffer;
  if (!offer?.endsAt) return null;
  const clockOffset = offer.serverTime ? new Date(offer.serverTime).getTime() - receivedAt : 0;
  if (new Date(offer.endsAt).getTime() - (receivedAt + clockOffset) <= 0) return null;
  return { endsAt: offer.endsAt, clockOffset };
}
