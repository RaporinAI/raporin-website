// Hesabım > Paketim: Next oturum route'ları üzerinden backend billing uçları.
import { accountRequest } from "../auth/accountApi";

export const billingApi = {
  me: () => accountRequest("billing/me", undefined, "GET"),
  payments: () => accountRequest("billing/payments?size=24", undefined, "GET"),
  /** Bugün dahil son `days` günün (7/30/90) gün gün kredi kullanımı ve son kredi girişleri. */
  usage: (days) => accountRequest(`billing/credits/usage?days=${days}`, undefined, "GET"),
  billingInfo: () => accountRequest("billing/billing-info", undefined, "GET"),
  saveBillingInfo: (info) => accountRequest("billing/billing-info", info, "PUT"),
  checkout: (planPriceId, legalVersion) =>
    accountRequest("billing/checkout", { planPriceId, acceptedLegalTerms: true, legalVersion }, "POST"),
  checkoutStatus: (id) => accountRequest(`billing/checkout/${id}`, undefined, "GET"),
  cancel: (reason) => accountRequest("billing/subscription/cancel", { reason: reason || null }, "POST"),
  cardUpdate: () => accountRequest("billing/subscription/card-update", {}, "POST"),
  /** Yükseltilebilecek paketler ve her birinin bugünkü farkı. */
  upgradeOptions: () => accountRequest("billing/upgrade/options", undefined, "GET"),
  upgradeCheckout: (planPriceId, legalVersion) =>
    accountRequest("billing/upgrade/checkout", { planPriceId, acceptedLegalTerms: true, legalVersion }, "POST"),
  /** Ek kredi: 100–1000 arası miktarların fiyatı ve satın alınabilirlik. */
  creditPacks: () => accountRequest("billing/credit-packs", undefined, "GET"),
  creditPackCheckout: (quantity, legalVersion) =>
    accountRequest("billing/credit-packs/checkout", { quantity, acceptedLegalTerms: true, legalVersion }, "POST"),
};

/** Mesafeli satış sözleşmesi ve ön bilgilendirme formunun onaylanan sürümü (metin değişince artırılır). */
export const LEGAL_VERSION = "2026-10";

export const SUBSCRIPTION_STATUS = {
  ACTIVE: { label: "Aktif", tone: "teal" },
  PAST_DUE: { label: "Ödeme alınamadı", tone: "amber" },
  SUSPENDED: { label: "Askıda", tone: "red" },
  PENDING: { label: "Ödeme bekleniyor", tone: "slate" },
  EXPIRED: { label: "Sona erdi", tone: "slate" },
  CANCELED: { label: "İptal edildi", tone: "slate" },
};

/** İptal penceresindeki isteğe bağlı neden seçenekleri (admin panelde abonelik notuna yazılır). */
export const CANCEL_REASONS = [
  "Fiyat yüksek",
  "Yeterince kullanmıyorum",
  "İhtiyacımı karşılamıyor",
  "Başka bir çözüme geçiyorum",
  "Eczanemi kapatıyorum / devrediyorum",
];

export const PERIOD_LABEL = { MONTHLY: "Aylık", YEARLY: "Yıllık" };

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});
export const formatDate = (value) => (value ? dateFormatter.format(new Date(value)) : "-");
