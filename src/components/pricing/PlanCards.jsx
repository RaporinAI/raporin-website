"use client";
import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Check, Info, Rocket } from "lucide-react";
import { formatTL } from "../../lib/billing/catalog";
import { BetaOfferDeadline } from "../billing/BetaOffer";

export { formatTL };

const formatPerCredit = (value) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Yıllık fiyat aylık fiyatın tam 10 katıysa kampanyayı "12 ay kullan, 10 ay öde" diye açıkça yazar ("2 ay ücretsiz"
 * 14 aylık kullanım gibi anlaşılabiliyor); diğer durumlarda (ör. "Lansmana özel %40 indirim", beta fiyatı)
 * admin paneldeki etiket kullanılır.
 */
function campaignText(plan, price, yearly) {
  const monthly = plan.prices.MONTHLY?.netPrice;
  const tenMonths = yearly && !price.highlight && monthly && Math.abs(price.netPrice - monthly * 10) < 0.01;
  return tenMonths && price.campaignLabel ? "12 ay kullan, 10 ay öde" : price.campaignLabel;
}

/** Üstü çizili fiyata göre indirim yüzdesi; üstü çizili fiyat yoksa 0. */
const discountOf = (price) =>
  price?.listPrice > price?.netPrice ? Math.round((1 - price.netPrice / price.listPrice) * 100) : 0;

/**
 * Lansman indirimi kartta nasıl anlatılır. Üstü çizili fiyatı olan (beta dışı) her fiyat lansmana özeldir:
 * - %30 ve üstü ("büyük fırsat"): kartın tepesinde "Lansmana özel" rozeti, turuncu çerçeve, üstü çizili fiyatın
 *   hemen altında tek indirim vurgusu ("%40 indirim"). Admin panelde girilen kart notu (ör. "En uygun rakibe göre %55
 *   daha ucuz") indirimle karışmasın diye fiyattan ayrı, kredi bilgilerinin altında sade bir onay satırı olarak durur.
 * - daha küçük indirimde: etiket admin panelde girilmediyse yüzdesiz, turuncu "Lansmana özel fiyat" etiketi.
 * Admin panelde girilen kampanya etiketi (ör. "Lansmana özel %40 indirim", "2 ay ücretsiz") her zaman önceliklidir.
 */
const BIG_DEAL_PERCENT = 30;
function launchDeal(price) {
  const percent = price.highlight ? 0 : discountOf(price);
  if (percent === 0) return null;
  return { percent, big: percent >= BIG_DEAL_PERCENT, saving: price.listPrice - price.netPrice };
}

/**
 * Büyük fırsat kartındaki kart notu: indirim değil kanıt gibi okunsun diye yeşil onay işaretli sade satır. Dayanağı
 * varsa ⓘ ile açılır (dokunmatik ekranda da çalışsın diye tıklamayla).
 */
function CardNote({ note, source }) {
  const [open, setOpen] = useState(false);
  const sourceId = useId();
  return (
    <div className="mt-3 text-sm">
      <p className="flex items-start gap-2 font-semibold text-teal-800">
        <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
        <span>
          {note}
          {source && (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={sourceId}
              aria-label="Karşılaştırmanın dayanağı"
              className="ml-1 inline-flex translate-y-0.5 items-center text-slate-400 hover:text-teal-700"
            >
              <Info size={14} aria-hidden="true" />
            </button>
          )}
        </span>
      </p>
      {source && open && (
        <p id={sourceId} className="ml-6 mt-1 text-xs text-slate-500">
          {source}
        </p>
      )}
    </div>
  );
}

/**
 * Fiyatlandırma başlığının altındaki "Lansmana özel fiyatlar" notu; üstü çizili fiyatı olan paket yoksa çizilmez.
 * Beta indirimi gören eczanede ({@code betaEndsAt}) çizilmez: onun odağı beta avantajıdır.
 */
export function LaunchPricingNote({ plans, betaEndsAt = null, className = "" }) {
  const any = plans.some((plan) => Object.values(plan.prices).some((price) => launchDeal(price)));
  if (!any || betaEndsAt) return null;
  return (
    <p
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFF1EA] to-[#FFE4E6] px-2.5 py-0.5 text-xs font-bold text-[#9A2B1E] ring-1 ring-[#FF6B3D]/25 ${className}`}
    >
      <Rocket size={12} aria-hidden="true" /> Lansmana özel fiyatlar
    </p>
  );
}

// Yönelme hâli eki, sayının okunuşuna göre: %40'a, %50'ye, %12'ye, %70'e.
const UNIT_SUFFIX = ["", "'e", "'ye", "'e", "'e", "'e", "'ya", "'ye", "'e", "'a"];
const TENS_SUFFIX = ["'e", "'a", "'ye", "'a", "'a", "'ye", "'a", "'e", "'e", "'a"];
const dative = (n) => `${n}${n % 10 ? UNIT_SUFFIX[n % 10] : TENS_SUFFIX[Math.floor(n / 10) % 10]}`;

/**
 * Aylık/Yıllık seçicideki etiket: yıllık fiyatların üstü çizili fiyata göre en büyük indirimi ("%40'a varan");
 * dar düğmede tek satır kalsın diye kısa. Üstü çizili fiyat yoksa etiket gösterilmez.
 */
export function yearlyToggleProps(plans) {
  const best = plans
    .map((plan) => plan.prices.YEARLY)
    .filter((price) => price?.listPrice > price?.netPrice)
    .reduce((max, price) => Math.max(max, Math.round((1 - price.netPrice / price.listPrice) * 100)), 0);
  return best > 0
    ? { yearlyLabel: `%${dative(best)} varan`, yearlyNote: "Yıllık ödemede daha az ödersiniz. Tutar tek seferde çekilir." }
    : { yearlyLabel: null, yearlyNote: "Yıllık ödemede tutar tek seferde çekilir." };
}

/** Üstü çizili fiyatın neyi temsil ettiği: aylık ödemede 12 ayın toplamı mı, kampanyasız normal fiyat mı. */
function listPriceText(plan, price, yearly) {
  const monthly = plan.prices.MONTHLY?.netPrice;
  return yearly && monthly && price.listPrice === monthly * 12 ? "Aylık ödemede 12 ay" : "Normal fiyat";
}

/**
 * Tek paket kartı.
 *
 * @param recommended yalnızca bir kart (beta fiyatlı olmayan, rozetli ilk paket) "Önerilen" olarak öne çıkar;
 *                    beta fiyatlı kart (yalnızca beta üyesine gelir) ayrı, sarı "Size özel %50" vurgusu alır.
 * @param betaEndsAt  beta fiyatı gösteriliyorsa indirimin son anı; kartta kalan süre yazılır
 * @param action (plan, price) => { label, onClick?, href?, disabled?, note?, upgrade? } | null
 *               upgrade: { title, amount?, detail, credits? } — yükseltmede butonun üstünde bugün ödenecek fark kutusu
 *               (amount yoksa yalnızca başlık ve açıklama; ör. aylıktan yıllığa geçişte tutar ödeme sayfasında)
 */
function PlanCard({ plan, yearly, index, compact, action, recommended, betaEndsAt }) {
  const period = yearly ? "YEARLY" : "MONTHLY";
  const price = plan.prices[period];
  if (!price) return null;

  const otherYearly = !yearly ? plan.prices.YEARLY : null;
  const featured = price.highlight;
  // Beta indirimi gören eczaneye lansman vurgusu (etiket, turuncu kart, hatırlatma) gösterilmez.
  const deal = betaEndsAt ? null : launchDeal(price);
  const bigDeal = Boolean(deal?.big);
  const popular = recommended && !featured && !bigDeal;
  const adminCampaign = campaignText(plan, price, yearly);
  // Büyük fırsatta tek indirim vurgusu üstü çizili fiyatın altında ("%40 indirim"; rozet yalnızca "Lansmana özel");
  // küçük indirimde etiket yoksa yüzde vermeden "Lansmana özel fiyat".
  const campaign = bigDeal ? `%${deal.percent} indirim` : adminCampaign ?? (deal ? "Lansmana özel fiyat" : null);
  const launchChip = !featured && Boolean(deal) && (bigDeal || !adminCampaign);
  const perMonth = yearly ? price.netPrice / 12 : price.netPrice;
  const credits = price.credits !== undefined ? price.credits : plan.credits;

  const subline = yearly ? `Aylık ${formatTL(Math.round(perMonth))} ₺'ye denk gelir` : "Aylık faturalanır";
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
      // Beta indirimi kartındaki "İndirimli paketimi seç" doğrudan bu karta kaydırır.
      id={featured ? "beta-paket" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      // Yeşil vurgu önerilen pakette; beta fiyatlı paket sarı, büyük lansman fırsatı turuncu tonla ayrışır.
      className={`relative flex scroll-mt-28 flex-col rounded-3xl border-2 transition-shadow ${compact ? "p-6" : "p-8"} ${
        featured
          ? "border-[#F5C518] bg-gradient-to-br from-[#FFFBEA] via-white to-[#FFF1BF] shadow-[0_0_36px_-14px_rgba(245,197,24,0.55)]"
          : bigDeal
            ? "border-[#FF6B3D] bg-gradient-to-br from-[#FFF4EE] via-white to-[#FFE4E6] shadow-[0_0_40px_-12px_rgba(255,107,61,0.5)] ring-2 ring-[#FF6B3D]/15"
          : popular
            ? "border-[#17C6A3] bg-gradient-to-br from-[#E6FFF9] via-[#F7FFFD] to-[#C8F7EA] shadow-[0_0_36px_-12px_rgba(23,198,163,0.35)] ring-2 ring-[#17C6A3]/15"
            : "border-[#17C6A3]/30 bg-gradient-to-br from-white via-[#FAFFFE] to-[#EEFBF7] shadow-sm hover:border-[#17C6A3]/70"
      }`}
    >
      {(popular || featured || bigDeal) && (
        <span
          className={`absolute -top-3.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            featured
              ? "bg-[#FFD84D] font-bold text-[#5A3E00]"
              : bigDeal
                ? "bg-gradient-to-r from-[#FF6B3D] to-[#E8344E] font-extrabold text-white shadow-md shadow-[#FF6B3D]/30"
                : "bg-[#17C6A3] text-white"
          } ${compact ? "left-6" : "left-8"}`}
        >
          {featured ? (
            "Size özel %50 indirim"
          ) : bigDeal ? (
            <>
              <Rocket size={13} aria-hidden="true" /> Lansmana özel
            </>
          ) : (
            "Önerilen"
          )}
        </span>
      )}

      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-1 min-h-[2.5rem] text-sm text-gray-500">{plan.description}</p>

      <div className="mt-4">
        <span className="inline-block rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700">
          {credits ? `${formatTL(credits)} kredi / ay` : "∞ Sınırsız kredi"}
        </span>
      </div>

      {/* Üstü çizili fiyat (neyi temsil ettiğiyle) ve kampanya etiketi; yoksa satır boş kalır, kartlar hizalı durur. */}
      <div className="mt-6 min-h-[1.25rem] text-sm text-gray-400">
        {price.listPrice != null && (
          <>
            {listPriceText(plan, price, yearly)} <span className="line-through">{formatTL(price.listPrice)} ₺</span>
          </>
        )}
      </div>
      <div className="mt-1.5 flex min-h-[1.5rem] flex-wrap items-center gap-2">
        {campaign && (
          <span
            className={
              featured
                ? "rounded-md bg-[#FFD84D] px-2 py-0.5 text-xs font-extrabold text-[#5A3E00] shadow-sm"
                : launchChip
                  ? `rounded-md bg-gradient-to-r from-[#FF6B3D] to-[#E8344E] px-2 py-0.5 font-bold text-white shadow-sm ${
                      bigDeal ? "text-sm" : "text-xs"
                    }`
                  : "rounded-md bg-[#17C6A3] px-2 py-0.5 text-xs font-bold text-white shadow-sm"
            }
          >
            {campaign}
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
      {yearly && <p className="text-xs font-medium text-gray-400">Yıllık tek ödeme</p>}
      {featured && <BetaOfferDeadline endsAt={betaEndsAt} />}

      <dl className="mt-6 space-y-3 border-t border-[#17C6A3]/20 pt-6 text-sm">
        {creditRows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-semibold text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      {plan.features.length > 0 && (
        // Destek kanalları gibi özellikler kredi satırlarından bir çizgiyle ayrılır.
        <ul className="mt-5 space-y-2 border-t border-[#17C6A3]/20 pt-5 text-sm text-gray-600">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      )}
      {/* Rakip karşılaştırması özelliklerin (destek kanalları vb.) altında, indirimden ayrı */}
      {bigDeal && price.cardNote && <CardNote note={price.cardNote} source={price.cardNoteSource} />}

      {/* Aylık görünümde, yıllıkta beta fiyatı ya da büyük lansman fırsatı varsa kısa hatırlatma. */}
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
          <BetaOfferDeadline endsAt={betaEndsAt} />
        </div>
      )}
      {otherYearly && !otherYearly.highlight && !betaEndsAt && launchDeal(otherYearly)?.big && (
        <div className="mt-6 rounded-2xl border-2 border-[#FF6B3D]/60 bg-gradient-to-br from-[#FFF4EE] to-[#FFE4E6] p-4 shadow-md shadow-[#FF6B3D]/15">
          <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-[#C2410C]">
            <Rocket size={13} aria-hidden="true" /> YILLIKTA LANSMANA ÖZEL %{launchDeal(otherYearly).percent} İNDİRİM
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm text-[#9A2B1E]/60 line-through">{formatTL(otherYearly.listPrice)} ₺</span>
            <span className="text-2xl font-extrabold text-[#9A2B1E]">{formatTL(otherYearly.netPrice)} ₺</span>
            <span className="text-sm text-[#9A2B1E]/80">+KDV /yıl</span>
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

/** Aylık/Yıllık seçici; "Yıllık" butonunda yıllık tasarruf etiketi (varsa), yıllık seçiliyken altında kampanya açıklaması. */
export function BillingToggle({ yearly, onChange, yearlyLabel = null, yearlyNote = null }) {
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
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
              yearly === option.value ? "bg-[#17C6A3] text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {option.label}
            {option.value && yearlyLabel && (
              <span
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  yearly ? "bg-white text-[#0F918B]" : "bg-[#17C6A3] text-white"
                }`}
              >
                {yearlyLabel}
              </span>
            )}
          </button>
        ))}
      </div>
      {yearly && yearlyNote && <p className="text-center text-sm text-gray-500">{yearlyNote}</p>}
    </div>
  );
}

/** Paket kartları: sitedeki fiyatlandırma ve Hesabım > Paketim aynı kartları kullanır. */
export default function PlanCards({ plans, yearly, compact = false, action, className = "", betaEndsAt = null }) {
  const period = yearly ? "YEARLY" : "MONTHLY";
  const visible = plans.filter((plan) => plan.prices[period]);
  if (visible.length === 0) {
    return <p className={`text-center text-sm text-gray-500 ${className}`}>Bu dönem için satışta paket yok.</p>;
  }
  // Görsel hiyerarşi için tek vurgu: bu görünümde beta fiyatı ya da büyük lansman fırsatı varsa yalnızca o öne
  // çıkar, "Önerilen" gösterilmez; yoksa rozetli ilk paket "Önerilen" olur.
  const spotlight = visible.some(
    (plan) => plan.prices[period].highlight || (!betaEndsAt && launchDeal(plan.prices[period])?.big)
  );
  const recommendedKey = spotlight ? null : visible.find((plan) => plan.prices[period].badge)?.key;
  return (
    <div className={`grid ${compact ? "gap-6" : "gap-8"} ${className}`}>
      {visible.map((plan, index) => (
        <PlanCard
          key={plan.key}
          plan={plan}
          yearly={yearly}
          index={index}
          compact={compact}
          action={action}
          recommended={plan.key === recommendedKey}
          betaEndsAt={betaEndsAt}
        />
      ))}
    </div>
  );
}
