// Fiyatlandırma verisi: admin panelde yönetilen backend kataloğundan gelir. Tarayıcı bunu sitenin
// kendi /api/pricing route'undan okur (backend'e sunucu tarafında gider). Katalog boşsa veya
// alınamazsa sitedeki statik paketler gösterilir; satın alma o durumda kapalıdır.
import { PRICING_PLANS } from "../pricingPlans";

export const PERIODS = { MONTHLY: "MONTHLY", YEARLY: "YEARLY" };

/**
 * Kartların ortak şekli:
 * { key, name, description, features[], credits (null = sınırsız),
 *   prices: { MONTHLY?: Price, YEARLY?: Price } }
 * Price: { id, netPrice, grossPrice, vatRate, listPrice, campaignLabel, badge, highlight, purchasable }
 */
function fromCatalog(plans) {
  return plans
    .map((plan) => {
      const prices = {};
      for (const price of plan.prices) {
        prices[price.billingPeriod] = {
          id: price.id,
          netPrice: price.netPrice,
          grossPrice: price.grossPrice,
          vatRate: price.vatRate,
          listPrice: price.listPrice,
          campaignLabel: price.campaignLabel,
          badge: plan.badge,
          // Beta hedef kitleli fiyat sitede sarı "özel fiyat" vurgusuyla gösterilir.
          highlight: price.audience === "BETA",
          purchasable: price.iyzicoLinked,
          credits: price.unlimited ? null : price.monthlyCredits,
        };
      }
      const anyPrice = prices.MONTHLY ?? prices.YEARLY;
      return {
        key: plan.code,
        name: plan.name,
        description: plan.description,
        features: plan.features ?? [],
        credits: anyPrice ? anyPrice.credits : null,
        prices,
      };
    })
    .filter((plan) => plan.prices.MONTHLY || plan.prices.YEARLY);
}

function fromStatic() {
  return PRICING_PLANS.map((plan) => {
    return {
      key: plan.id,
      name: plan.name,
      description: plan.description,
      features: [],
      credits: plan.monthlyCredits,
      prices: {
        MONTHLY: {
          id: null,
          netPrice: plan.monthly.price,
          listPrice: null,
          campaignLabel: null,
          badge: plan.monthly.popular ? "Önerilen" : null,
          highlight: false,
          purchasable: false,
        },
        YEARLY: {
          id: null,
          netPrice: plan.yearly.price,
          listPrice: plan.yearly.listPrice,
          campaignLabel: "2 ay ücretsiz",
          badge: plan.yearly.popular ? "Önerilen" : null,
          highlight: false,
          purchasable: false,
        },
      },
    };
  });
}

export const STATIC_CATALOG = {
  purchaseEnabled: false,
  // Hoş geldin kredisi yalnızca admin panelden gelir; null = bilinmiyor (metinler miktar yazmaz), 0 = kapalı.
  welcomeCredits: null,
  welcomeCreditDays: null,
  plans: fromStatic(),
  creditPack: null,
  fromBackend: false,
};

/** Tarayıcıdan çağrılır; hata durumunda statik kataloğa düşer. */
export async function loadCatalog() {
  try {
    const response = await fetch("/api/pricing", { cache: "no-store" });
    if (!response.ok) return STATIC_CATALOG;
    const body = await response.json();
    const welcome = {
      welcomeCredits: Number.isInteger(body.welcomeCredits) ? body.welcomeCredits : null,
      welcomeCreditDays: Number.isInteger(body.welcomeCreditDays) ? body.welcomeCreditDays : null,
    };
    const plans = fromCatalog(body.plans ?? []);
    if (plans.length === 0) return { ...STATIC_CATALOG, ...welcome };
    return {
      purchaseEnabled: Boolean(body.purchaseEnabled),
      ...welcome,
      plans,
      // Ek kredi satışta ise { minQuantity, maxQuantity, step, vatRate, validityMonths, fromUnitNetPrice, tiers }
      creditPack: body.purchaseEnabled ? (body.creditPack ?? null) : null,
      fromBackend: true,
    };
  } catch {
    return STATIC_CATALOG;
  }
}

// Aynı sayfadaki bileşenler (üst bölüm, fiyatlandırma, rozetler) kataloğu bir kez ister; bir dakikadan eski
// sonuç yeniden alınır, böylece admin panelde yapılan değişiklik sayfa yenilenmeden de kısa sürede görünür.
let shared = null;
let sharedAt = 0;

/** {@link loadCatalog} ile aynı, ama aynı anda ve bir dakika içinde gelen istekler tek isteği paylaşır. */
export function loadCatalogShared() {
  if (!shared || Date.now() - sharedAt > 60_000) {
    sharedAt = Date.now();
    shared = loadCatalog();
  }
  return shared;
}

export const formatTL = (value) =>
  Number(value).toLocaleString("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });

/** Tam lira: ,5 ve üstü yukarı, altı aşağı (yükseltme ve ek kredi ekranları kuruş göstermez). */
export const formatTL0 = (value) => Math.round(Number(value)).toLocaleString("tr-TR", { maximumFractionDigits: 0 });

export const formatTL2 = (value) =>
  Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
