"use client";
import { motion } from "framer-motion";
import { BETA_DISCOUNT_RATE, PRICING_PLANS } from "../../lib/pricingPlans";

export const formatTL = (value) => value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
const formatPerCredit = (value) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DEFAULT_DISCOUNT_LABEL = { yearly: "BETA ÜYELERİNE", monthly: "BETA ÜYELERİNE YILLIKTA" };

/**
 * Yıllık kampanyayı "12 ay kullan, N ay öde" diye açıkça yazar ("2 ay ücretsiz" 14 aylık kullanım gibi
 * anlaşılabiliyor). Üstü çizili fiyat da neyi temsil ettiğiyle birlikte gösterilir.
 */
function yearlyCampaign(plan) {
  return {
    label: "12 ay kullan, 10 ay öde",
    listLabel: plan.yearly.listPrice === plan.monthly.price * 12 ? "Aylık ödemede 12 ay" : "Normal fiyat",
  };
}

function PlanCard({ plan, yearly, index, compact, discountLabel }) {
  const pricing = yearly ? plan.yearly : plan.monthly;
  // Yıllıkta beta indirimli paketin ana fiyatı beta fiyatıdır; normal yıllık fiyat üstü çizili gösterilir.
  const betaPricing = yearly && plan.yearly.betaDiscount;
  // Yeşil "Önerilen" vurgusu tek pakette; beta fiyatlı paket sarı tonla ayrışır, ikisi yarışmaz.
  const featured = betaPricing;
  const popular = pricing.popular && !featured;
  const campaign = yearlyCampaign(plan);
  const shownPrice = betaPricing ? plan.yearly.price * (1 - BETA_DISCOUNT_RATE) : pricing.price;
  const perMonth = yearly ? Math.round(shownPrice / 12) : shownPrice;

  const subline = yearly ? `Aylık ${formatTL(perMonth)} ₺'ye denk gelir` : "Aylık faturalanır";
  const creditRows = plan.monthlyCredits
    ? [
        ["Aylık kredi", formatTL(plan.monthlyCredits)],
        ["Yıllık toplam", `${formatTL(plan.monthlyCredits * 12)} kredi`],
        ["Kredi başı", `${formatPerCredit(perMonth / plan.monthlyCredits)} ₺`],
      ]
    : [
        ["Aylık kredi", "Sınırsız"],
        ["Yıllık toplam", "Sınırsız"],
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative flex flex-col rounded-3xl border-2 transition-shadow ${compact ? "p-6" : "p-8"} ${
        featured
          ? "border-[#F5C518] bg-gradient-to-br from-[#FFFBEA] via-white to-[#FFF1BF] shadow-[0_0_36px_-14px_rgba(245,197,24,0.55)]"
          : popular
            ? "border-[#17C6A3] bg-gradient-to-br from-[#E6FFF9] via-[#F7FFFD] to-[#C8F7EA] shadow-[0_0_36px_-12px_rgba(23,198,163,0.35)] ring-2 ring-[#17C6A3]/15"
            : "border-[#17C6A3]/30 bg-gradient-to-br from-white via-[#FAFFFE] to-[#EEFBF7] shadow-sm hover:border-[#17C6A3]/70"
      }`}
    >
      {(popular || featured) && (
        <span
          className={`absolute -top-3.5 rounded-full px-3 py-1 text-xs font-semibold ${
            featured ? "bg-[#FFD84D] font-bold text-[#5A3E00]" : "bg-[#17C6A3] text-white"
          } ${compact ? "left-6" : "left-8"}`}
        >
          {featured ? "Beta üyelerine özel" : "Önerilen"}
        </span>
      )}

      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-1 min-h-[2.5rem] text-sm text-gray-500">{plan.description}</p>

      <div className="mt-4">
        <span className="inline-block rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700">
          {plan.monthlyCredits ? `${formatTL(plan.monthlyCredits)} kredi / ay` : "∞ Sınırsız kredi"}
        </span>
      </div>

      {/* Üstü çizili fiyat (neyi temsil ettiğiyle) ve kampanya etiketi; aylıkta satırlar boş kalır, hiza korunur. */}
      <div className="mt-6 min-h-[1.25rem] text-sm text-gray-400">
        {betaPricing ? (
          <>
            Normal fiyat <span className="line-through">{formatTL(plan.yearly.price)} ₺</span>
          </>
        ) : (
          yearly &&
          pricing.listPrice && (
            <>
              {campaign.listLabel} <span className="line-through">{formatTL(pricing.listPrice)} ₺</span>
            </>
          )
        )}
      </div>
      <div className="mt-1.5 flex min-h-[1.5rem] flex-wrap items-center gap-2">
        {betaPricing ? (
          <span className="rounded-md bg-[#FFD84D] px-2 py-0.5 text-xs font-extrabold text-[#5A3E00] shadow-sm">
            {discountLabel.yearly} %{BETA_DISCOUNT_RATE * 100}
          </span>
        ) : (
          yearly &&
          pricing.listPrice && (
            <span className="rounded-md bg-[#17C6A3] px-2 py-0.5 text-xs font-bold text-white shadow-sm">{campaign.label}</span>
          )
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1">
        <span className={`font-extrabold tracking-tight text-gray-900 ${compact ? "text-3xl" : "text-4xl"}`}>
          {formatTL(shownPrice)} ₺
        </span>
        <span className="text-sm text-gray-500">+KDV /{yearly ? "yıl" : "ay"}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{subline}</p>
      {yearly && <p className="text-xs font-medium text-gray-400">Yıllık tek ödeme</p>}

      <dl className="mb-6 mt-6 space-y-3 border-t border-[#17C6A3]/20 pt-6 text-sm">
        {creditRows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      {plan.yearly.betaDiscount && !yearly && (
        <div className="mt-auto rounded-2xl border-2 border-[#FFD84D] bg-gradient-to-br from-[#FFF6CC] to-[#FFE88A] p-4 shadow-md shadow-amber-200/60">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-extrabold tracking-wide text-[#5A3E00]">
            {discountLabel.monthly}
            <span className="whitespace-nowrap rounded-md bg-[#FFD84D] px-2 py-0.5 shadow-sm">
              %{BETA_DISCOUNT_RATE * 100} İNDİRİM
            </span>
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm text-[#5A3E00]/60 line-through">{formatTL(plan.yearly.price)} ₺</span>
            <span className="text-2xl font-extrabold text-[#5A3E00]">
              {formatTL(plan.yearly.price * (1 - BETA_DISCOUNT_RATE))} ₺
            </span>
            <span className="text-sm text-[#5A3E00]/80">+KDV /yıl</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/** Aylık/Yıllık seçici; "Yıllık" butonunda "2 ay ücretsiz" etiketi, yıllık seçiliyken altında kampanya açıklaması. */
export function BillingToggle({ yearly, onChange }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
        {[
          { label: "Aylık", value: false },
          { label: "Yıllık", value: true },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
              yearly === option.value ? "bg-[#17C6A3] text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {option.label}
            {option.value && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  yearly ? "bg-white text-[#0F918B]" : "bg-[#17C6A3] text-white"
                }`}
              >
                2 ay ücretsiz
              </span>
            )}
          </button>
        ))}
      </div>
      {yearly && (
        <p className="text-center text-sm text-gray-500">
          Yıllık ödemede 12 ay kullanın, 10 ayını ödeyin. Tutar tek seferde çekilir.
        </p>
      )}
    </div>
  );
}

/** Paket kartları: sitedeki fiyatlandırma ve Hesabım > Paketim aynı kartları kullanır. */
export default function PlanCards({ yearly, compact = false, discountLabel = DEFAULT_DISCOUNT_LABEL, className = "" }) {
  return (
    <div className={`grid ${compact ? "gap-6" : "gap-8"} ${className}`}>
      {PRICING_PLANS.map((plan, index) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          yearly={yearly}
          index={index}
          compact={compact}
          discountLabel={discountLabel}
        />
      ))}
    </div>
  );
}
