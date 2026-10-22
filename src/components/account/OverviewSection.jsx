"use client";
import Link from "next/link";
import { ArrowRight, Check, Download, Hourglass, Monitor, Package, Sparkles } from "lucide-react";
import { DESKTOP_VERSION, DOWNLOAD_URL } from "../../lib/download";
import { trackDownload } from "../../lib/analytics";
import { describePlan } from "../billing/planSummary";
import { usePendingSelection } from "../billing/usePendingSelection";
import { clearPendingPurchase } from "../../lib/billing/pendingPurchase";
import { formatTL } from "../../lib/billing/catalog";
import { formatDate, PERIOD_LABEL } from "../../lib/billing/billingApi";
import { daysLeftLabel, welcomeState } from "../../lib/billing/welcome";
import { BetaOfferCard } from "../billing/BetaOffer";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

const primaryButton =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:from-teal-800 hover:to-teal-700";
const secondaryButton =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50";

function Summary({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e6edf1] bg-white p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

const circleClass = {
  done: "bg-[#00A58E] text-white",
  current: "border-2 border-[#00A58E] bg-white text-[#008C87] ring-4 ring-teal-50",
  upcoming: "border-2 border-slate-200 bg-white text-slate-400",
};
const titleClass = { done: "text-slate-400", current: "text-slate-900", upcoming: "text-slate-500" };

/**
 * Dikey "Başlarken" akışının bir adımı. Daireler alttaki çizgiyle bir sonraki adıma bağlanır; çizgi
 * bu adım ve sonraki tamamlandıysa yeşildir. İşlem yalnızca sıradaki (ilk tamamlanmamış) adımda görünür;
 * {@code alwaysAvailable} adımların işlemi (uygulamayı indirmek gibi) sırası gelmeden de kullanılabilir.
 */
function Step({ index, state, title, description, children, last = false, nextDone = false, alwaysAvailable = false }) {
  const showAction = children && (state === "current" || (alwaysAvailable && state === "upcoming"));
  return (
    <li className="flex gap-4" aria-current={state === "current" ? "step" : undefined}>
      <div className="flex flex-col items-center">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${circleClass[state]}`}>
          {state === "done" ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : index}
        </span>
        {!last && (
          <span
            className={`my-1 w-0.5 flex-1 rounded-full ${state === "done" && nextDone ? "bg-[#00A58E]" : "bg-slate-200"}`}
            aria-hidden="true"
          />
        )}
      </div>
      <div className={`min-w-0 flex-1 pt-1 ${last ? "" : "pb-7"}`}>
        <p className={`text-sm font-semibold ${titleClass[state]}`}>{title}</p>
        {description && (
          <div className={`mt-0.5 text-sm ${state === "upcoming" ? "text-slate-400" : "text-slate-500"}`}>{description}</div>
        )}
        {showAction && <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </li>
  );
}

function DownloadButton({ secondary = false }) {
  return (
    <a href={DOWNLOAD_URL} onClick={() => trackDownload(DOWNLOAD_URL)} className={secondary ? secondaryButton : primaryButton}>
      <Download size={16} aria-hidden="true" /> Uygulamayı indir
    </a>
  );
}

/** Hoş geldin kredisi: kalan kredi ve son kullanma tarihi; bittiyse paket seçme çağrısı. */
function WelcomeBanner({ welcome, onNavigate }) {
  if (welcome.active) {
    const used = welcome.granted - welcome.remaining;
    return (
      <section className="rounded-[20px] border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="flex flex-wrap items-center gap-2 font-bold text-slate-900">
              Hoş geldin kredisi
              <span className="rounded-full bg-[#00A58E] px-2.5 py-0.5 text-xs font-semibold text-white">
                {formatTL(welcome.remaining)} kredi kaldı
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Size {formatTL(welcome.granted)} ücretsiz kredi tanımladık; her ilaç analizi 1 kredi harcar. Kalan krediyi{" "}
              {formatDate(welcome.expiresAt)} tarihine kadar kullanabilirsiniz ({daysLeftLabel(welcome.daysLeft).toLocaleLowerCase("tr")}).
              Kart bilgisi istenmedi; otomatik ücret alınmaz.
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-teal-100/70" aria-hidden="true">
          <div className="h-full rounded-full bg-[#00A58E]" style={{ width: `${(used / Math.max(1, welcome.granted)) * 100}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {formatTL(welcome.granted)} krediden {formatTL(used)} kredi kullanıldı
        </p>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
          <Hourglass size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="font-bold text-slate-900">Hoş geldin krediniz bitti</p>
          <p className="mt-1 text-sm text-slate-600">
            Analizlere devam etmek için bir paket seçin. Geçmiş analizleriniz ve bilgileriniz korunuyor.
          </p>
        </div>
      </div>
      <button type="button" onClick={() => onNavigate("paket")} className={primaryButton}>
        Paket seç <ArrowRight size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

/**
 * Genel bakış. Yeni kullanıcı için "Başlarken" adımları (hesap, eczane bilgileri, masaüstü
 * uygulaması, paket) dikey bir akışta; hepsi tamamlanınca yerini kısa bir paket ve uygulama özeti
 * alır. Yeni eczane hoş geldin kredisiyle önce uygulamayı kurup dener, sonra paketini seçer.
 */
export default function OverviewSection({ profile, pharmacy, todos, billing, betaOffer, isAdmin, onNavigate }) {
  const firstName = (profile.displayName || profile.username || "").split(/\s+/)[0];
  const pending = usePendingSelection(billing);
  const plan = describePlan(billing);
  const subscription = billing?.subscription;
  const usableSubscription = subscription && ["ACTIVE", "PAST_DUE"].includes(subscription.status);
  // Paketi olan kullanıcı paketleri "Paketler ve fiyatlar"da, olmayan "Genel durum"un altında görür.
  const selectBetaPlan = () => {
    const live = subscription && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status);
    onNavigate(live ? "paketler" : "paket");
    window.setTimeout(() => {
      const target = document.getElementById("beta-paket") ?? document.getElementById("paketler-listesi");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };
  const profileTodos = todos.filter((todo) => todo.section !== "paket");
  // Paketi olan eczaneye hoş geldin kredisi ayrıca gösterilmez (kalanı bakiyede sayılır).
  const welcome = subscription ? null : welcomeState(billing);

  // Sıra: hesap → eczane bilgileri → masaüstü uygulaması → paket. Tamamlanma gerçek durumu gösterir;
  // öne çıkan tek adım, sıradaki ilk tamamlanmamış adımdır.
  const done = [true, profileTodos.length === 0, Boolean(profile.desktopAppUsed), Boolean(usableSubscription)];
  const currentIndex = done.indexOf(false);
  const doneCount = done.filter(Boolean).length;
  const allDone = currentIndex === -1;
  const stepProps = (i) => ({
    index: i + 1,
    state: done[i] ? "done" : i === currentIndex ? "current" : "upcoming",
    nextDone: done[i + 1] ?? false,
    last: i === done.length - 1,
  });

  const PLAN = 3;
  let planStep;
  if (done[PLAN]) {
    planStep = <Step {...stepProps(PLAN)} title={`${subscription.planName} paketiniz aktif`} />;
  } else if (pending) {
    planStep = (
      <Step
        {...stepProps(PLAN)}
        title="Paketinizi satın alın"
        description={
          <>
            Seçtiğiniz paket: <span className="font-medium text-slate-700">{pending.plan.name} · {PERIOD_LABEL[pending.period]}</span>
            {" · "}
            {formatTL(pending.price.netPrice)} ₺ +KDV /{pending.period === "YEARLY" ? "yıl" : "ay"}
          </>
        }
      >
        {isAdmin ? (
          <Link href={`/hesabim/satin-al?paket=${pending.price.id}`} className={primaryButton}>
            Satın almayı tamamla <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <span className="text-xs text-slate-500">Eczane yöneticiniz satın alabilir</span>
        )}
        <button type="button" onClick={clearPendingPurchase} className="text-sm font-medium text-slate-400 hover:text-slate-600">
          Vazgeç
        </button>
      </Step>
    );
  } else {
    planStep = (
      <Step
        {...stepProps(PLAN)}
        title={welcome?.active ? "Krediniz bitmeden paketinizi seçin" : "Bir paket seçin"}
        description={
          welcome?.active
            ? `Hoş geldin krediniz ${formatDate(welcome.expiresAt)} tarihine kadar geçerli. Paketiniz satın aldığınız gün başlar; kalan krediniz silinmez.`
            : "Analiz yapabilmek için eczanenize uygun paketi seçin."
        }
      >
        <button type="button" onClick={() => onNavigate("paket")} className={primaryButton}>
          Paketleri gör <ArrowRight size={16} aria-hidden="true" />
        </button>
      </Step>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Merhaba{firstName ? `, ${firstName}` : ""}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {allDone
            ? "Hesabınızı ve eczane bilgilerinizi buradan yönetebilirsiniz."
            : welcome?.active
              ? "Uygulamayı kurun, hoş geldin kredinizle analizlere başlayın."
              : "RaporinAI'yi kullanmaya başlamak için birkaç adım kaldı."}
        </p>
      </div>

      {betaOffer && <BetaOfferCard offer={betaOffer} isAdmin={isAdmin} onSelectPlan={selectBetaPlan} />}

      {welcome && <WelcomeBanner welcome={welcome} onNavigate={onNavigate} />}

      {!allDone ? (
        <section className="rounded-[20px] border border-[#e6edf1] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-slate-900">Başlarken</h2>
            <span className="text-xs font-medium text-slate-500">
              {doneCount}/4 tamamlandı
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div className="h-full rounded-full bg-[#00A58E] transition-all" style={{ width: `${(doneCount / 4) * 100}%` }} />
          </div>
          <ol className="mt-6">
            <Step {...stepProps(0)} title="Hesabınızı oluşturun" />
            <Step
              {...stepProps(1)}
              title={done[1] ? "Eczane bilgileriniz tamam" : "Eczane bilgilerinizi tamamlayın"}
              description={
                profileTodos.length > 0 && (
                  <ul className="list-inside list-disc">
                    {profileTodos.map((todo) => (
                      <li key={todo.text}>{todo.text}</li>
                    ))}
                  </ul>
                )
              }
            >
              <button type="button" onClick={() => onNavigate(profileTodos[0]?.section)} className={primaryButton}>
                Bilgileri tamamla <ArrowRight size={16} aria-hidden="true" />
              </button>
            </Step>
            <Step
              {...stepProps(2)}
              alwaysAvailable
              title={done[2] ? "Masaüstü uygulamasına giriş yaptınız" : "Masaüstü uygulamasını indirin"}
              description={
                done[2] ? (
                  // Tamamlanmış olsa da uygulamayı kaldırıp yeniden kurmak isteyen için indirme bağlantısı kalır.
                  <a
                    href={DOWNLOAD_URL}
                    onClick={() => trackDownload(DOWNLOAD_URL)}
                    className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline"
                  >
                    <Download size={14} aria-hidden="true" /> Yeniden indir · Sürüm {DESKTOP_VERSION}
                  </a>
                ) : (
                  `Windows 10 / 11 · Sürüm ${DESKTOP_VERSION}. Kurulumdan sonra bu hesabın e-posta adresi ve şifresiyle giriş yapın.`
                )
              }
            >
              {/* İndirme hiçbir adıma bağlı değildir; sırası gelmediyse ikincil görünür. */}
              <DownloadButton secondary={currentIndex !== 2} />
            </Step>
            {planStep}
          </ol>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onNavigate("paket")}
            className="group flex items-center gap-4 rounded-[20px] border border-[#e6edf1] bg-white p-5 text-left shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-teal-200"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Package size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-400">Paketiniz</span>
              <span className="block font-bold text-slate-900">{plan.name}</span>
              <span className="block truncate text-sm text-slate-500">{plan.detail}</span>
            </span>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-teal-600" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-4 rounded-[20px] border border-[#e6edf1] bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Monitor size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-400">Masaüstü uygulaması</span>
              <span className="block font-bold text-slate-900">Sürüm {DESKTOP_VERSION}</span>
            </span>
            <DownloadButton secondary />
          </div>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="E-posta" value={profile.email} />
        <Summary label="Eczane" value={pharmacy?.name} />
        <Summary label="Ünvan" value={profile.titleDisplay} />
        <Summary label="Üyelik tarihi" value={profile.createdAt && dateFormatter.format(new Date(profile.createdAt))} />
      </section>
    </div>
  );
}
