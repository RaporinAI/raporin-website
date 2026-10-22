"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { formatOfferEnd, offerPhase, remainingLabel, splitDuration } from "../../lib/billing/betaOffer";

/**
 * Beta indiriminin bitmesine kalan süre; her saniye güncellenir, süre dolunca durur.
 *
 * @param clockOffset sunucu saati − bilgisayar saati (ms); bilgisayarın saati yanlışsa sayaç yine doğru çalışır
 */
export function useOfferCountdown(endsAt, clockOffset = 0) {
  const end = endsAt ? new Date(endsAt).getTime() : null;
  const [now, setNow] = useState(() => Date.now() + clockOffset);
  useEffect(() => {
    if (end == null) return undefined;
    const tick = () => setNow(Date.now() + clockOffset);
    tick();
    const timer = window.setInterval(() => {
      tick();
      if (Date.now() + clockOffset >= end) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [end, clockOffset]);
  const msLeft = end == null ? 0 : Math.max(0, end - now);
  return { msLeft, phase: offerPhase(msLeft) };
}

// Beta vurgusu sitedeki beta fiyat kartıyla aynı sarı; son 72 saatte turuncuya, son 24 saatte kırmızıya döner.
const PHASE_STYLE = {
  calm: {
    card: "border-[#F5C518] bg-gradient-to-br from-[#FFFBEA] via-white to-[#FFF1BF] shadow-[0_0_36px_-14px_rgba(245,197,24,0.55)]",
    chip: "bg-[#FFD84D] text-[#5A3E00]",
    box: "bg-white text-[#5A3E00] ring-1 ring-[#F5C518]/50",
    strip: "border-[#F5C518] bg-[#FFF8D6] text-[#5A3E00]",
    accent: "text-[#8A6100]",
  },
  warning: {
    card: "border-orange-300 bg-gradient-to-br from-orange-50 via-white to-amber-100 shadow-[0_0_36px_-14px_rgba(249,115,22,0.45)]",
    chip: "bg-orange-500 text-white",
    box: "bg-white text-orange-700 ring-1 ring-orange-200",
    strip: "border-orange-300 bg-orange-50 text-orange-900",
    accent: "text-orange-700",
  },
  urgent: {
    card: "border-rose-300 bg-gradient-to-br from-rose-50 via-white to-rose-100 shadow-[0_0_36px_-14px_rgba(225,29,72,0.45)]",
    chip: "bg-rose-600 text-white",
    box: "bg-white text-rose-700 ring-1 ring-rose-200",
    strip: "border-rose-300 bg-rose-50 text-rose-900",
    accent: "text-rose-700",
  },
};

const pad = (value) => String(value).padStart(2, "0");

/** Gün / Saat / Dakika / Saniye kutuları. Ekran okuyucuya tek seferlik özet okunur, her saniye değil. */
export function CountdownBoxes({ msLeft, phase, size = "md" }) {
  const { days, hours, minutes, seconds } = splitDuration(msLeft);
  const style = PHASE_STYLE[phase] ?? PHASE_STYLE.calm;
  const units = [
    [days, "Gün"],
    [hours, "Saat"],
    [minutes, "Dakika"],
    [seconds, "Saniye"],
  ];
  const box = size === "sm" ? "min-w-[3rem] px-2 py-1.5 text-lg" : "min-w-[4rem] px-3 py-2.5 text-2xl sm:text-3xl";
  return (
    <div className="flex gap-2" role="timer" aria-label={`İndirimin bitmesine ${remainingLabel(msLeft)} kaldı`}>
      {units.map(([value, label]) => (
        <div key={label} aria-hidden="true" className={`flex flex-col items-center rounded-xl shadow-sm ${style.box} ${box}`}>
          <span className="font-extrabold tabular-nums leading-none">{pad(value)}</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</span>
        </div>
      ))}
    </div>
  );
}

function headline(phase, endsAt) {
  if (phase === "urgent") return "Bugün son gün: %50 indirim hakkınız bitiyor";
  if (phase === "warning") return "Son günler: %50 indirim hakkınız bitmek üzere";
  return `%50 indirim hakkınız ${formatOfferEnd(endsAt)}'da sona eriyor`;
}

/**
 * Hesabım > Genel bakış'ın en üstündeki beta indirimi kartı: kalan süre, tek eylem. Satın almayı yalnızca
 * eczane yöneticisi yapabildiği için diğer ekip üyelerine düğme yerine hatırlatma gösterilir.
 */
export function BetaOfferCard({ offer, isAdmin, onSelectPlan }) {
  const { msLeft, phase } = useOfferCountdown(offer.endsAt, offer.clockOffset);
  if (phase === "ended") return null;
  const style = PHASE_STYLE[phase];
  return (
    <section className={`rounded-[20px] border-2 p-5 sm:p-6 ${style.card}`} aria-labelledby="beta-offer-title">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide ${style.chip}`}>
            <Sparkles size={13} aria-hidden="true" /> BETA ÜYELERİNE ÖZEL
          </span>
          <h2 id="beta-offer-title" className="mt-3 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {headline(phase, offer.endsAt)}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Beta döneminde RaporinAI&apos;yi bizimle birlikte geliştirdiniz. Teşekkür olarak ücretli paketlerde size özel{" "}
            <strong className="text-slate-900">%50 indirim</strong> tanımladık. İndirimli paket{" "}
            <strong className="text-slate-900">{formatOfferEnd(offer.endsAt)}</strong>&apos;a kadar alınabilir; bu
            tarihten sonra normal fiyatlar geçerli olur.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
          <CountdownBoxes msLeft={msLeft} phase={phase} />
          {isAdmin ? (
            <button
              type="button"
              onClick={onSelectPlan}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-5 text-sm font-semibold text-white shadow-lg shadow-teal-700/15 transition-colors hover:from-teal-800 hover:to-teal-700"
            >
              İndirimli paketimi seç <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <p className="max-w-xs text-sm font-medium text-slate-600 lg:text-right">
              Satın almayı eczane yöneticiniz yapabilir; süre dolmadan ona hatırlatın.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Paket kartlarının üstündeki ince şerit: indirimin son anı ve kalan süre. */
export function BetaOfferStrip({ endsAt, clockOffset = 0, className = "" }) {
  const { msLeft, phase } = useOfferCountdown(endsAt, clockOffset);
  if (!endsAt || phase === "ended") return null;
  const style = PHASE_STYLE[phase];
  const { hours, minutes, seconds } = splitDuration(msLeft);
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${style.strip} ${className}`}>
      <p className="flex items-center gap-2 font-semibold">
        <Sparkles size={16} className="shrink-0" aria-hidden="true" />
        Size özel %50 indirim {formatOfferEnd(endsAt)}&apos;a kadar geçerli.
      </p>
      <p className={`flex items-center gap-1.5 font-bold tabular-nums ${style.accent}`}>
        <Clock size={15} aria-hidden="true" />
        {phase === "urgent" ? `Son ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${remainingLabel(msLeft)} kaldı`}
      </p>
    </div>
  );
}

/** Beta fiyatlı paket kartındaki kısa kalan süre satırı. */
export function BetaOfferDeadline({ endsAt }) {
  const { msLeft, phase } = useOfferCountdown(endsAt);
  if (!endsAt || phase === "ended") return null;
  return (
    <p className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${PHASE_STYLE[phase].accent}`}>
      <Clock size={13} aria-hidden="true" /> İndirimin bitmesine {remainingLabel(msLeft)}
    </p>
  );
}
