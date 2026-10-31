"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpCircle, CalendarClock, Coins, CreditCard, Gauge, Package, PlusCircle } from "lucide-react";
import AccountCard from "../account/AccountCard";
import { Alert } from "../auth/FormControls";
import { billingApi, CANCEL_REASONS, formatDate, PERIOD_LABEL, SUBSCRIPTION_STATUS } from "../../lib/billing/billingApi";
import { formatTL, formatTL2 } from "../../lib/billing/catalog";
import { daysLeftLabel, welcomeState } from "../../lib/billing/welcome";

const TONES = {
  teal: "bg-teal-50 text-teal-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-600",
};

function Fact({ icon: Icon, label, value, hint }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e6edf1] bg-white p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
        <Icon size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

function Banner({ tone, children, action }) {
  const styles =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <div className={`mt-5 flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${styles}`}>
      <p className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{children}</span>
      </p>
      {action}
    </div>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Hesabım > Paketim: mevcut paket, kredi durumu, sonraki ödeme ve abonelik işlemleri.
 *
 * @param billing GET /api/billing/me yanıtı
 */
export default function CurrentPlanCard({ billing, isAdmin, onCardUpdate, onChanged, onNavigate }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const subscription = billing.subscription;
  const credits = billing.credits;

  if (!subscription) {
    const welcome = welcomeState(billing);
    let badge;
    let message;
    if (welcome?.active) {
      badge = <span className="rounded-full bg-[#00A58E] px-3 py-1 text-sm font-bold text-white">Hoş geldin kredisi</span>;
      message = `${daysLeftLabel(welcome.daysLeft)}. Kart bilgisi istenmedi, otomatik ücret alınmaz. Paketinizi aşağıdan seçebilirsiniz; satın aldığınız gün başlar ve kalan hoş geldin krediniz silinmez.`;
    } else if (welcome?.ended && credits.available === 0) {
      badge = <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">Hoş geldin krediniz bitti</span>;
      message = "Analizlere devam etmek için aşağıdan eczanenize uygun paketi seçin. Geçmiş analizleriniz korunuyor.";
    } else {
      badge = <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">Paket yok</span>;
      message = "Analiz yapmaya başlamak için aşağıdan eczanenize uygun paketi seçin.";
    }
    // Paketler bu kartın hemen altında açık gelir; burada yalnızca anlamlı olan bilgiler gösterilir.
    // Hiç kredisi ve kullanımı olmayan yeni kullanıcıya "0 kredi" kutuları gösterilmez.
    const hasCredits = credits.available > 0;
    const hasUsage = credits.consumedThisMonth > 0;
    return (
      <AccountCard icon={Package} title="Paketim" subtitle="Mevcut paketiniz ve kullanım hakkınız">
        <div className="flex flex-wrap items-center gap-3">
          {badge}
          <span className="text-sm text-slate-500">{message}</span>
        </div>
        {(hasCredits || hasUsage) && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {hasCredits && (
              <Fact
                icon={Coins}
                label="Kalan kredi"
                value={formatTL(credits.available)}
                hint={welcome?.active ? `${formatTL(welcome.granted)} hoş geldin kredisinden` : "Paket almadan kullanabilirsiniz"}
              />
            )}
            {welcome?.active && (
              <Fact
                icon={CalendarClock}
                label="Son kullanma"
                value={formatDate(welcome.expiresAt)}
                hint="Kullanılmayan kredi bu tarihte silinir"
              />
            )}
            {hasUsage && (
              <Fact icon={Gauge} label="Bu ay kullanılan" value={`${formatTL(credits.consumedThisMonth)} kredi`} />
            )}
          </div>
        )}
      </AccountCard>
    );
  }

  const status = SUBSCRIPTION_STATUS[subscription.status] ?? SUBSCRIPTION_STATUS.ACTIVE;
  const paid = subscription.source === "IYZICO";
  const canManage = isAdmin && paid;
  const nextCharge = paid && !subscription.cancelAtPeriodEnd && subscription.status === "ACTIVE";
  // Aylık kredinin %10'unun altına inince uyarılır (sınırsız pakette yok).
  const lowCredits =
    !credits.unlimited &&
    subscription.monthlyCredits > 0 &&
    subscription.status === "ACTIVE" &&
    credits.available <= Math.max(1, Math.floor(subscription.monthlyCredits * 0.1));

  const canUpgrade = isAdmin && Boolean(billing.actions?.canUpgrade);
  const canBuyCredits = isAdmin && Boolean(billing.actions?.canBuyCredits);

  const cancel = async () => {
    setCancelling(true);
    setError(null);
    const result = await billingApi.cancel(cancelReason);
    setCancelling(false);
    if (result.ok) {
      setConfirmCancel(false);
      onChanged();
    } else {
      setError(result.message);
    }
  };

  return (
    <AccountCard icon={Package} title="Paketim" subtitle="Mevcut paketiniz ve kullanım hakkınız">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xl font-bold text-slate-900">{subscription.planName}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {PERIOD_LABEL[subscription.billingPeriod]}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[status.tone]}`}>{status.label}</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Fact
          icon={Coins}
          label="Kalan kredi"
          value={credits.unlimited ? "Sınırsız" : formatTL(credits.available)}
          hint={subscription.monthlyCredits ? `Her ay ${formatTL(subscription.monthlyCredits)} kredi yüklenir` : null}
        />
        <Fact icon={Gauge} label="Bu ay kullanılan" value={`${formatTL(credits.consumedThisMonth)} kredi`} />
        <Fact
          icon={CalendarClock}
          label={subscription.cancelAtPeriodEnd ? "Bitiş tarihi" : "Dönem sonu"}
          value={formatDate(subscription.currentPeriodEnd)}
          hint={
            !credits.unlimited && subscription.nextCreditGrantAt
              ? `Sonraki kredi yüklemesi: ${formatDate(subscription.nextCreditGrantAt)}`
              : null
          }
        />
        <Fact
          icon={CreditCard}
          label={nextCharge ? "Sonraki ödeme" : "Ücret"}
          value={
            nextCharge
              ? `${formatTL2(subscription.grossPrice)} ₺`
              : paid
                ? "Otomatik yenileme kapalı"
                : "Raporin ekibi tanımladı"
          }
          hint={nextCharge ? `${formatDate(subscription.currentPeriodEnd)} · KDV dahil` : null}
        />
      </div>

      {lowCredits && (
        <Banner tone="amber">
          {credits.available === 0 ? "Bu ayki kredileriniz bitti." : `Kredileriniz azaldı: ${formatTL(credits.available)} kredi kaldı.`}{" "}
          {subscription.nextCreditGrantAt
            ? `Yeni krediler ${formatDate(subscription.nextCreditGrantAt)} tarihinde yüklenecek.`
            : "Paket döneminiz sona eriyor."}{" "}
          {canBuyCredits || canUpgrade
            ? "Beklemek istemezseniz ek kredi alabilir ya da paketinizi yükseltebilirsiniz."
            : isAdmin
              ? "Daha fazla krediye ihtiyacınız varsa bizimle iletişime geçin."
              : "Ek kredi veya paket yükseltme işlemini eczane yöneticiniz yapabilir."}
        </Banner>
      )}
      {subscription.status === "PAST_DUE" && (
        <Banner
          tone="amber"
          action={
            canManage && (
              <SecondaryButton onClick={onCardUpdate}>
                <CreditCard size={16} aria-hidden="true" /> Kartı güncelle
              </SecondaryButton>
            )
          }
        >
          Son yenileme ödemeniz alınamadı. Kredileriniz kısa bir süre daha kullanılabilir; kartınızı güncellediğinizde
          ödeme tekrar denenir.
        </Banner>
      )}
      {subscription.status === "SUSPENDED" && (
        <Banner
          tone="red"
          action={
            canManage && (
              <SecondaryButton onClick={onCardUpdate}>
                <CreditCard size={16} aria-hidden="true" /> Kartı güncelle
              </SecondaryButton>
            )
          }
        >
          Ödeme alınamadığı için aboneliğiniz askıya alındı. Kartınızı güncelleyerek devam edebilirsiniz.
        </Banner>
      )}
      {subscription.cancelAtPeriodEnd && subscription.status === "ACTIVE" && (
        <Banner tone="slate">
          Aboneliğiniz iptal edildi. {formatDate(subscription.currentPeriodEnd)} tarihine kadar kullanmaya devam
          edebilirsiniz; sonra yeni bir paket seçebilirsiniz.
        </Banner>
      )}
      {(canUpgrade || canBuyCredits) && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-teal-100 bg-teal-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {canUpgrade && canBuyCredits
              ? "Daha fazla krediye mi ihtiyacınız var? Paketinizi yükseltin ya da tek seferlik ek kredi alın."
              : canUpgrade
                ? "Daha fazla krediye mi ihtiyacınız var? Paketinizi hemen yükseltebilirsiniz."
                : "Aylık krediniz yetmiyorsa tek seferlik ek kredi alabilirsiniz."}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            {canUpgrade && (
              <button
                type="button"
                onClick={() => onNavigate?.("paketler")}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-4 text-sm font-semibold text-white hover:from-teal-800 hover:to-teal-700"
              >
                <ArrowUpCircle size={16} aria-hidden="true" /> Paketi yükselt
              </button>
            )}
            {canBuyCredits && (
              <Link
                href="/hesabim/ek-kredi"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <PlusCircle size={16} aria-hidden="true" /> Ek kredi al
              </Link>
            )}
          </div>
        </div>
      )}
      {!paid && (
        <p className="mt-5 text-sm text-slate-500">
          Bu paket Raporin ekibi tarafından tanımlandı. Aşağıdan ücretli bir paket seçerseniz yeni paketiniz hemen
          başlar.
        </p>
      )}

      {error && (
        <div className="mt-5">
          <Alert>{error}</Alert>
        </div>
      )}

      {canManage && subscription.status === "ACTIVE" && !subscription.cancelAtPeriodEnd && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          {confirmCancel ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">Aboneliği iptal etmek istiyor musunuz?</p>
              <p className="mt-1 text-sm text-red-700">
                Sonraki ödeme alınmaz. Paketiniz {formatDate(subscription.currentPeriodEnd)} tarihine kadar kullanılabilir.
              </p>
              <fieldset className="mt-4">
                <legend className="text-sm font-medium text-slate-700">Ayrılma nedeniniz nedir? (isteğe bağlı)</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CANCEL_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setCancelReason(cancelReason === reason ? "" : reason)}
                      aria-pressed={cancelReason === reason}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        cancelReason === reason
                          ? "border-red-400 bg-white text-red-700"
                          : "border-red-200 bg-red-50 text-red-600 hover:bg-white"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={cancel}
                  disabled={cancelling}
                  className="inline-flex min-h-10 items-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelling ? "İptal ediliyor…" : "Evet, iptal et"}
                </button>
                <SecondaryButton onClick={() => setConfirmCancel(false)} disabled={cancelling}>
                  Vazgeç
                </SecondaryButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SecondaryButton onClick={onCardUpdate}>
                <CreditCard size={16} aria-hidden="true" /> Ödeme kartını değiştir
              </SecondaryButton>
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="text-sm font-semibold text-slate-400 hover:text-red-600"
              >
                Aboneliği iptal et
              </button>
            </div>
          )}
        </div>
      )}
    </AccountCard>
  );
}
