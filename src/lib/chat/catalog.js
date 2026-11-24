// Asistan için herkese açık fiyat kataloğu (sunucu tarafı). Admin paneldeki fiyatlar 10 dk içinde asistana
// yansır; backend'e ulaşılamazsa son alınan katalog, o da yoksa statik pricingPlans.js kullanılır.
import { backendFetch } from "../auth/session";
import { PRICING_PLANS } from "../pricingPlans";

const TTL_MS = 10 * 60 * 1000;
let cached = null;
let cachedAt = 0;

const tl = (value) => Math.round(Number(value)).toLocaleString("tr-TR");

function fromBackend(body) {
  const plans = (body.plans ?? [])
    .map((plan) => {
      const monthly = plan.prices?.find((p) => p.billingPeriod === "MONTHLY");
      const yearly = plan.prices?.find((p) => p.billingPeriod === "YEARLY");
      const any = monthly ?? yearly;
      if (!any) return null;
      return {
        name: plan.name,
        description: plan.description ?? "",
        credits: any.unlimited ? null : any.monthlyCredits,
        monthly: monthly ? tl(monthly.netPrice) : null,
        yearly: yearly ? tl(yearly.netPrice) : null,
        yearlyLabel: yearly?.campaignLabel ?? null,
      };
    })
    .filter(Boolean);
  return {
    plans,
    welcomeCredits: Number.isInteger(body.welcomeCredits) ? body.welcomeCredits : null,
    welcomeCreditDays: Number.isInteger(body.welcomeCreditDays) ? body.welcomeCreditDays : null,
  };
}

function fromStatic() {
  return {
    plans: PRICING_PLANS.map((p) => ({
      name: p.name,
      description: p.description,
      credits: p.monthlyCredits,
      monthly: tl(p.monthly.price),
      yearly: tl(p.yearly.price),
      yearlyLabel: p.yearly.campaignLabel ?? null,
    })),
    welcomeCredits: null,
    welcomeCreditDays: null,
  };
}

export async function getAssistantCatalog() {
  if (cached && Date.now() - cachedAt < TTL_MS) return cached;
  try {
    const response = await backendFetch("/api/public/billing/catalog", { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const catalog = fromBackend(await response.json());
      if (catalog.plans.length) {
        cached = catalog;
        cachedAt = Date.now();
        return cached;
      }
    }
  } catch {
    // aşağıdaki yedeğe düşer
  }
  // Yeniden denemeyi bir dakika ertele: backend yokken her mesaj 3 sn beklemesin.
  cachedAt = Date.now() - TTL_MS + 60_000;
  cached = cached ?? fromStatic();
  return cached;
}
