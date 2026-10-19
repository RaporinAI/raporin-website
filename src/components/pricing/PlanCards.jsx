"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { formatTL } from "../../lib/billing/catalog";

export { formatTL };

const formatPerCredit = (value) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Tek paket kartı.
 *
 * @param action (plan, price) => { label, onClick?, href?, disabled?, note?, upgrade? } | null
 *               upgrade: { title, amount?, detail, credits? } — yükseltmede butonun üstünde bugün ödenecek fark kutusu
 *               (amount yoksa yalnızca başlık ve açıklama; ör. aylıktan yıllığa geçişte tutar ödeme sayfasında)
 */
function PlanCard({ plan, yearly, index, compact, action }) {
  const period = yearly ? "YEARLY" : "MONTHLY";
  const price = plan.prices[period];
  if (!price) return null;

  const otherYearly = !yearly ? plan.prices.YEARLY : null;
  const popular = Boolean(price.badge);
  const featured = price.highlight;
  const perMonth = yearly ? price.netPrice / 12 : price.netPrice;
  const credits = price.credits !== undefined ? price.credits : plan.credits;

  const subline = yearly ? `Aylık ${formatTL(Math.round(perMonth))} ₺` : "Aylık faturalanır";
  const creditRows = credits
    ? [
        ["Aylık kredi", formatTL(credits)],
        ["Yıllık toplam", `${formatTL(credits * 12)} kredi`],
        ["Kredi başı", `${formatPerCredit(perMonth / credits)} ₺`],
      ]
    : [
        ["Aylık kredi", "Sınırsız"],
        ["Yıllık toplam", "Sınırsız"],
      ];
  const cta = action?.(plan, price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      // Çerçeve rengi "tercih edilen" etiketini, zemin ve parlama öne çıkarılan (özel fiyatlı) paketi belirler.
      className={`relative flex flex-col rounded-3xl border-2 transition-shadow ${compact ? "p-6" : "p-8"} ${
        popular ? "border-[#17C6A3]" : "border-[#17C6A3]/40 hover:border-[#17C6A3]/80"
      } ${
        featured
          ? "bg-gradient-to-br from-[#D8FFF6] via-[#F2FFFC] to-[#A8F5E0] shadow-[0_0_36px_-12px_rgba(23,198,163,0.35)] ring-2 ring-[#17C6A3]/15"
          : popular
            ? "bg-gradient-to-br from-[#E6FFF9] via-[#F7FFFD] to-[#C8F7EA] shadow-md shadow-[#17C6A3]/10"
            : "bg-gradient-to-br from-white via-[#FAFFFE] to-[#E2FAF3] shadow-sm"
      }`}
    >
      {popular && (
        <span
          className={`absolute -top-3.5 rounded-full bg-[#17C6A3] px-3 py-1 text-xs font-semibold text-white ${
            compact ? "left-6" : "left-8"
          }`}
        >
          {price.badge}
        </span>
      )}

      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-1 min-h-[2.5rem] text-sm text-gray-500">{plan.description}</p>

      <div className="mt-4">
        <span className="inline-block rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700">
          {credits ? `${formatTL(credits)} kredi / ay` : "∞ Sınırsız kredi"}
        </span>
      </div>

      {/* Üstü çizili fiyat ve kampanya etiketi; yoksa satır boş kalır, kartlar hizalı durur. */}
      <div className="mt-6 flex min-h-[1.5rem] flex-wrap items-center gap-2">
        {price.listPrice != null && (
          <span className="text-sm text-gray-400 line-through">{formatTL(price.listPrice)} ₺</span>
        )}
        {price.campaignLabel && (
          <span
            className={
              featured
                ? "rounded-md bg-[#FFD84D] px-2 py-0.5 text-xs font-extrabold text-[#5A3E00] shadow-sm"
                : "rounded-md bg-[#17C6A3] px-2 py-0.5 text-xs font-bold text-white shadow-sm"
            }
          >
            {price.campaignLabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-1">
        <span className={`font-extrabold tracking-tight text-gray-900 ${compact ? "text-3xl" : "text-4xl"}`}>
          {formatTL(price.netPrice)} ₺
        </span>
        <span className="text-sm text-gray-500">+KDV /{yearly ? "yıl" : "ay"}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{subline}</p>

      <dl className="mt-6 space-y-3 border-t border-[#17C6A3]/20 pt-6 text-sm">
        {creditRows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      {plan.features.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm text-gray-600">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Aylık görünümde, yıllıkta özel fiyat varsa kısa hatırlatma. */}
      {otherYearly?.highlight && otherYearly.campaignLabel && (
        <div className="mt-6 rounded-2xl border-2 border-[#FFD84D] bg-gradient-to-br from-[#FFF6CC] to-[#FFE88A] p-4 shadow-md shadow-amber-200/60">
          <p className="text-xs font-extrabold tracking-wide text-[#5A3E00]">YILLIKTA {otherYearly.campaignLabel}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            {otherYearly.listPrice != null && (
              <span className="text-sm text-[#5A3E00]/60 line-through">{formatTL(otherYearly.listPrice)} ₺</span>
            )}
            <span className="text-2xl font-extrabold text-[#5A3E00]">{formatTL(otherYearly.netPrice)} ₺</span>
            <span className="text-sm text-[#5A3E00]/80">+KDV /yıl</span>
          </div>
        </div>
      )}

      {cta && (
        <div className="mt-auto pt-6">
          {cta.upgrade && (
            <div className="mb-3 rounded-2xl border border-[#17C6A3]/40 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{cta.upgrade.title}</p>
              {cta.upgrade.amount && (
                <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900">{cta.upgrade.amount}</span>
                  <span className="text-xs text-gray-500">bugün, KDV dahil</span>
                </p>
              )}
              <p className="mt-1 text-xs text-gray-600">{cta.upgrade.detail}</p>
              {cta.upgrade.credits && (
                <p className="mt-2 border-t border-[#17C6A3]/20 pt-2 text-xs font-semibold text-teal-700">{cta.upgrade.credits}</p>
              )}
            </div>
          )}
          {cta.href ? (
            <a
              href={cta.href}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-5 text-sm font-semibold text-white shadow-lg shadow-teal-700/10 transition-colors hover:from-teal-800 hover:to-teal-700"
            >
              {cta.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={cta.onClick}
              disabled={cta.disabled}
              className={`flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                cta.disabled
                  ? "border border-slate-200 bg-white text-slate-400"
                  : "bg-gradient-to-r from-[#008C87] to-[#00A58E] text-white shadow-lg shadow-teal-700/10 hover:from-teal-800 hover:to-teal-700"
              }`}
            >
              {cta.label}
            </button>
          )}
          {cta.note && <p className="mt-2 text-center text-xs text-slate-500">{cta.note}</p>}
        </div>
      )}
    </motion.div>
  );
}

/** Aylık/Yıllık seçici; "Yıllık" butonunda yıllık tasarruf etiketi (varsa). */
export function BillingToggle({ yearly, onChange, yearlyLabel = "2 ay ücretsiz" }) {
  return (
    <div className="flex justify-center">
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
            {option.value && yearlyLabel && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  yearly ? "bg-white text-[#0F918B]" : "bg-[#17C6A3] text-white"
                }`}
              >
                {yearlyLabel}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Paket kartları: sitedeki fiyatlandırma ve Hesabım > Paketim aynı kartları kullanır. */
export default function PlanCards({ plans, yearly, compact = false, action, className = "" }) {
  const period = yearly ? "YEARLY" : "MONTHLY";
  const visible = plans.filter((plan) => plan.prices[period]);
  if (visible.length === 0) {
    return <p className={`text-center text-sm text-gray-500 ${className}`}>Bu dönem için satışta paket yok.</p>;
  }
  return (
    <div className={`grid ${compact ? "gap-6" : "gap-8"} ${className}`}>
      {visible.map((plan, index) => (
        <PlanCard key={plan.key} plan={plan} yearly={yearly} index={index} compact={compact} action={action} />
      ))}
    </div>
  );
}
