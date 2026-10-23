import { formatDate, PERIOD_LABEL } from "../../lib/billing/billingApi";
import { formatTL } from "../../lib/billing/catalog";
import { welcomeState } from "../../lib/billing/welcome";

/**
 * Hesabım'da tek satırlık paket özeti (genel bakış kartı ve Paketim başlığı).
 *
 * @param billing GET /api/billing/me yanıtı (yüklenmediyse null)
 */
export function describePlan(billing) {
  if (billing === null || billing === undefined) return { name: "…", detail: "Paket bilgisi yükleniyor" };
  const subscription = billing.subscription;
  if (subscription) {
    const credits = billing.credits;
    const creditText = credits.unlimited ? "Sınırsız kredi" : `${formatTL(credits.available)} kredi kaldı`;
    const ending = subscription.cancelAtPeriodEnd
      ? `${formatDate(subscription.currentPeriodEnd)} tarihinde sona erecek`
      : `${PERIOD_LABEL[subscription.billingPeriod]} paket`;
    return { name: subscription.planName, detail: `${creditText} · ${ending}` };
  }
  const welcome = welcomeState(billing);
  const available = billing.credits?.available ?? 0;
  if (welcome?.active) {
    return { name: "Hoş geldin kredisi", detail: `${formatTL(available)} kredi kaldı · ${formatDate(welcome.expiresAt)} tarihine kadar` };
  }
  return {
    name: "Paket yok",
    detail:
      available > 0
        ? `${formatTL(available)} kredi kaldı`
        : welcome?.ended
          ? "Hoş geldin krediniz bitti · Paket seçin"
          : "Analiz yapmak için bir paket seçin",
  };
}
