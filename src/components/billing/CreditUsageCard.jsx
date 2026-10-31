"use client";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, CirclePlus, Gift, Hourglass, Loader2, Package, SlidersHorizontal } from "lucide-react";
import AccountCard from "../account/AccountCard";
import { billingApi, formatDate } from "../../lib/billing/billingApi";
import { formatTL } from "../../lib/billing/catalog";
import {
  busiestDay,
  dailyAverage,
  dayValue,
  describeMovement,
  formatAverage,
  formatLongDay,
  formatShortDay,
  formatWeekday,
  liveTeamCredits,
  USAGE_RANGES,
} from "../../lib/billing/creditUsage";

const MOVEMENT_STYLE = {
  subscription: { icon: Package, className: "bg-teal-50 text-teal-600" },
  team: { icon: Gift, className: "bg-violet-50 text-violet-600" },
  pack: { icon: CirclePlus, className: "bg-emerald-50 text-emerald-600" },
  expire: { icon: Hourglass, className: "bg-amber-50 text-amber-600" },
  adjust: { icon: SlidersHorizontal, className: "bg-sky-50 text-sky-600" },
  other: { icon: CirclePlus, className: "bg-slate-100 text-slate-500" },
};

function RangeToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label="Dönem">
      {USAGE_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          role="radio"
          aria-checked={value === range}
          onClick={() => onChange(range)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
            value === range ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {range} gün
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#e6edf1] bg-slate-50/60 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** RaporinAI ekibinin verdiği, hâlâ kullanılabilir krediler: kullanıcı bunları ilk bakışta görmeli. */
function TeamCreditsNotice({ grants }) {
  if (!grants.length) return null;
  const remaining = grants.reduce((sum, g) => sum + g.bucketRemaining, 0);
  const soonest = grants.reduce((a, b) => (new Date(a.expiresAt) <= new Date(b.expiresAt) ? a : b));
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
        <Gift size={18} aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-slate-900">RaporinAI ekibinden {formatTL(remaining)} ek krediniz var</p>
        <p className="mt-0.5 text-sm text-slate-600">
          Kalan kredinize dahildir; süresi önce dolan kredi önce kullanılır.{" "}
          {grants.length === 1
            ? `${formatDate(soonest.expiresAt)} tarihine kadar geçerli.`
            : `İlk süresi dolacak olan ${formatTL(soonest.bucketRemaining)} kredi ${formatDate(soonest.expiresAt)} tarihine kadar geçerli.`}
        </p>
      </div>
    </div>
  );
}

/** Günlük kullanım sütun grafiği. Sütunun üzerine gelince (ya da klavyeyle odaklanınca) o günün ayrıntısı görünür. */
function UsageChart({ days, unlimited, unit }) {
  const max = Math.max(0, ...days.map((day) => dayValue(day, unlimited)));
  const today = days[days.length - 1]?.date;
  const dense = days.length > 31;
  const tooltip = (day) => {
    if (!day.analyses) return "Analiz yapılmadı";
    return unlimited
      ? `${formatTL(day.analyses)} ilaç analizi`
      : `${formatTL(day.analyses)} ilaç analizi · ${formatTL(day.credits)} kredi`;
  };

  return (
    <div>
      <div className="relative h-44 sm:h-52" role="list" aria-label={`Son ${days.length} günde günlük ${unit} kullanımı`}>
        {max > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-2" aria-hidden="true">
            <span className="text-[11px] font-medium text-slate-400">{formatTL(max)}</span>
            <span className="h-px flex-1 border-t border-dashed border-slate-200" />
          </div>
        )}
        <div className={`absolute inset-x-0 bottom-0 top-5 flex items-end border-b border-slate-200 ${dense ? "gap-px" : "gap-1 sm:gap-1.5"}`}>
          {days.map((day, index) => {
            const value = dayValue(day, unlimited);
            // Kenardaki sütunlarda ipucu kutusu kartın dışına taşmasın
            const edge = index < days.length * 0.15 ? "left-0" : index >= days.length * 0.85 ? "right-0" : "left-1/2 -translate-x-1/2";
            const isToday = day.date === today;
            const height = value === 0 || max === 0 ? 0 : Math.max(3, (value / max) * 100);
            return (
              <div
                key={day.date}
                role="listitem"
                tabIndex={0}
                aria-label={`${formatLongDay(day.date)}${isToday ? " (bugün)" : ""}: ${tooltip(day)}`}
                className="group relative flex h-full min-w-0 flex-1 items-end justify-center rounded-t-md outline-none hover:bg-teal-50/60 focus-visible:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span
                  className={`block w-full max-w-7 rounded-t-[4px] transition-colors ${
                    value === 0
                      ? "h-[2px] rounded-none bg-slate-200"
                      : isToday
                        ? "bg-[#008C87]"
                        : "bg-teal-300 group-hover:bg-teal-500 group-focus-visible:bg-teal-500"
                  }`}
                  style={value === 0 ? undefined : { height: `${height}%` }}
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute bottom-full ${edge} z-10 mb-2 hidden w-max max-w-[220px] rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block group-focus-visible:block`}
                  aria-hidden="true"
                >
                  <span className="block font-semibold capitalize">
                    {formatLongDay(day.date)}
                    {isToday && " (bugün)"}
                  </span>
                  <span className="block text-slate-300">{tooltip(day)}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {days.length <= 7 ? (
        <div className="mt-2 flex gap-1 sm:gap-1.5" aria-hidden="true">
          {days.map((day) => (
            <span
              key={day.date}
              className={`flex-1 text-center text-[11px] capitalize ${day.date === today ? "font-semibold text-teal-700" : "text-slate-400"}`}
            >
              {day.date === today ? "Bugün" : formatWeekday(day.date)}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-2 flex justify-between text-[11px] text-slate-400" aria-hidden="true">
          <span>{formatShortDay(days[0].date)}</span>
          <span>{formatShortDay(days[Math.floor(days.length / 2)].date)}</span>
          <span className="font-semibold text-teal-700">Bugün</span>
        </div>
      )}
    </div>
  );
}

function MovementRow({ movement, now }) {
  const { kind, title, live, expired } = describeMovement(movement, now);
  const { icon: Icon, className } = MOVEMENT_STYLE[kind];
  const details = [formatDate(movement.createdAt)];
  if (movement.type === "GRANT" && movement.expiresAt) {
    if (live) {
      details.push(`${formatTL(movement.bucketRemaining)} kredi kaldı`);
      details.push(`${formatDate(movement.expiresAt)} tarihine kadar geçerli`);
    } else if (expired) {
      details.push("Süresi doldu");
    } else {
      details.push("Tamamı kullanıldı");
    }
  }
  const positive = movement.amount > 0;
  return (
    <li className="flex items-center gap-3 py-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${className}`}>
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{details.join(" · ")}</p>
      </div>
      <span className={`shrink-0 text-sm font-bold ${positive ? "text-emerald-600" : "text-slate-600"}`}>
        {positive ? "+" : movement.amount < 0 ? "−" : ""}
        {formatTL(Math.abs(movement.amount))}
      </span>
    </li>
  );
}

/**
 * Hesabım > Paketim > Kredi kullanımı: dönem toplamı, günlük ortalama, gün gün grafik ve kredi
 * hareketleri (paket yüklemeleri, RaporinAI ekibinin verdiği krediler, süresi dolanlar). Analizler
 * tek tek listelenmez; önemli olan gün gün kaç kredi harcandığıdır.
 *
 * Hiç analiz ve kredi hareketi olmayan eczanede (yeni kullanıcı) boş grafik yerine kısa bir açıklama
 * gösterilir.
 *
 * @param unlimited  sınırsız paket: toplamlar analiz sayısıdır
 * @param refreshKey değişince (ör. bakiye değişti) veri yeniden alınır
 */
export default function CreditUsageCard({ unlimited, refreshKey }) {
  const [days, setDays] = useState(30);
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(null);
  // Kalan / süresi dolmuş ayrımı verinin alındığı ana göre yapılır
  const [loadedAt, setLoadedAt] = useState(0);
  const [everHadData, setEverHadData] = useState(false);

  const load = useCallback((range) => {
    let cancelled = false;
    billingApi.usage(range).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setUsage(result.data);
        setLoadedAt(Date.now());
        if (result.data.totalAnalyses > 0 || result.data.movements?.length) setEverHadData(true);
        setError(null);
      } else {
        setError("Kredi kullanımı şu anda alınamadı.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(days), [load, days, refreshKey]);

  const unit = unlimited ? "analiz" : "kredi";
  const list = usage?.days ?? [];
  const total = usage ? (unlimited ? usage.totalAnalyses : usage.totalCredits) : 0;
  const peak = busiestDay(list, unlimited);
  const teamCredits = liveTeamCredits(usage?.movements, loadedAt);
  // Dönem değişirken eski veri soluk gösterilir, yerinde kalır
  const stale = usage && list.length !== days;
  // Hiç analiz ve kredi hareketi yoksa boş grafik ve sıfırlar yerine kısa bir açıklama gösterilir
  if (usage && !everHadData) {
    return (
      <AccountCard icon={BarChart3} title="Kredi kullanımı" subtitle="Gün gün ne kadar kredi kullandığınız ve kredi hareketleriniz">
        <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
          <p className="font-semibold text-slate-900">Henüz analiz yapılmadı</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Masaüstü uygulamasında yaptığınız ilaç analizleri burada gün gün görünür. Paket yüklemeleri ve RaporinAI
            ekibinin tanımladığı ek krediler de burada listelenir.
          </p>
        </div>
      </AccountCard>
    );
  }

  return (
    <AccountCard icon={BarChart3} title="Kredi kullanımı" subtitle="Gün gün ne kadar kredi kullandığınız ve kredi hareketleriniz">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {unlimited ? "Paketiniz sınırsız; analiz sayınız gösterilir." : "1 ilaç analizi = 1 kredi"}
          </p>
          <RangeToggle value={days} onChange={setDays} />
        </div>

        {!usage && !error && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-label="Yükleniyor" />
          </div>
        )}
        {!usage && error && (
          <div className="flex flex-col items-center gap-3 py-10 text-sm text-slate-500">
            {error}
            <button type="button" onClick={() => load(days)} className="font-semibold text-teal-700 hover:underline">
              Tekrar dene
            </button>
          </div>
        )}

        {usage && (
          <div className={`space-y-6 transition-opacity ${stale ? "opacity-50" : ""}`}>
            <TeamCreditsNotice grants={teamCredits} />

            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label={`Son ${list.length} günde`} value={`${formatTL(total)} ${unit}`} hint={unlimited ? null : `${formatTL(usage.totalAnalyses)} ilaç analizi`} />
              <Stat label="Günlük ortalama" value={`${formatAverage(dailyAverage(list, unlimited))} ${unit}`} hint="Analiz yaptığınız ilk günden itibaren" />
              <Stat
                label="En yoğun gün"
                value={peak ? `${formatTL(dayValue(peak, unlimited))} ${unit}` : "—"}
                hint={peak ? formatLongDay(peak.date) : "Bu dönemde analiz yok"}
              />
            </div>

            <div className="rounded-2xl border border-[#e6edf1] p-4 sm:p-5">
              <p className="mb-4 text-sm font-semibold text-slate-900">Günlük {unit} kullanımı</p>
              {usage.totalAnalyses === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">Son {list.length} günde analiz yapılmadı.</p>
              ) : (
                <>
                  <UsageChart days={list} unlimited={unlimited} unit={unit} />
                  <p className="mt-3 text-xs text-slate-400">Bir günün ayrıntısı için sütunun üzerine gelin.</p>
                </>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Kredi hareketleri</p>
              <p className="text-xs text-slate-500">
                Paket yüklemeleri, RaporinAI ekibinin tanımladığı ek krediler ve süresi dolan krediler
              </p>
              {usage.movements?.length ? (
                <ul className="mt-2 divide-y divide-slate-100">
                  {usage.movements.map((movement) => (
                    <MovementRow key={movement.id} movement={movement} now={loadedAt} />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Henüz kredi hareketi yok.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AccountCard>
  );
}
