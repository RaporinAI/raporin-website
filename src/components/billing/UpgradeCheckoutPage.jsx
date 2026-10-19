"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { initialBillingForm } from "./BillingInfoForm";
import {
  AmountRows,
  BillingStep,
  linkButton,
  Notice,
  PaymentStep,
  PaymentTrust,
  PurchaseColumns,
  PurchaseLayout,
  PurchaseLoading,
  usePurchaseBootstrap,
} from "./PurchaseShell";
import { billingApi, formatDate, LEGAL_VERSION, PERIOD_LABEL } from "../../lib/billing/billingApi";
import { formatTL, formatTL0 } from "../../lib/billing/catalog";

const creditsLabel = (option) =>
  option.unlimited ? "Sınırsız analiz" : `Her ay ${formatTL(option.monthlyCredits)} analiz kredisi`;

/** Sol sütun: mevcut paketten yeni pakete geçişin özeti ve bugünkü tutar. */
function UpgradeSummary({ option, subscription, available }) {
  const periodChange = option.kind === "PERIOD_CHANGE";
  const periodWord = PERIOD_LABEL[subscription.billingPeriod];
  const yearly = subscription.billingPeriod === "YEARLY";
  // Tüm tutarlar KDV dahil ve tam lira; çarpım ekranda birebir tutar.
  const monthlyHint = `${option.planName} aylık ${formatTL0(option.targetMonthlyGross)} ₺ − ${subscription.planName} aylık ${formatTL0(option.currentMonthlyGross)} ₺${yearly ? " (yıllık fiyatın aylık karşılığı)" : ""}, KDV dahil`;
  const rows = periodChange
    ? [
        { label: `${option.planName} · Yıllık paket`, hint: "KDV dahil", value: `${formatTL0(option.chargeGross)} ₺` },
        { label: "Bugün ödenecek", value: `${formatTL0(option.chargeGross)} ₺`, strong: true },
      ]
    : [
        option.remainingMonths > 1
          ? {
              label: `Aylık fark ${formatTL0(option.monthlyDiffGross)} ₺ × kalan ${option.remainingLabel}`,
              hint: monthlyHint,
              value: `${formatTL0(option.chargeGross)} ₺`,
            }
          : { label: "Bu ayın paket farkı", hint: monthlyHint, value: `${formatTL0(option.chargeGross)} ₺` },
        { label: "Bugün ödenecek (KDV dahil)", value: `${formatTL0(option.chargeGross)} ₺`, strong: true },
      ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {periodChange ? `Yıllık ${option.planName} paketine geçin` : `${option.planName} paketine yükseltin`}
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">{formatTL0(option.chargeGross)} ₺</span>
          <span className="text-sm text-slate-500">bugün, KDV dahil</span>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
            {subscription.planName} · {PERIOD_LABEL[subscription.billingPeriod]}
          </span>
          <ArrowRight size={16} className="text-slate-400" aria-hidden="true" />
          <span className="rounded-lg bg-teal-50 px-2.5 py-1 font-semibold text-teal-800">
            {option.planName} · {PERIOD_LABEL[option.billingPeriod]}
          </span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
            {creditsLabel(option)}
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
            Yeni paketiniz ödemeyle birlikte hemen geçerli
          </li>
          {!periodChange && (
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
              Yenileme tarihiniz değişmez ({formatDate(option.renewalAt)})
            </li>
          )}
          {periodChange && available > 0 && (
            <li className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
              Aylık paketinizden kalan {formatTL(available)} kredi kullanılmaya devam eder
            </li>
          )}
        </ul>
      </div>

      <div className="space-y-3">
        <AmountRows rows={rows} />
      </div>

      {!periodChange && option.creditsNow > 0 && (
        <div className="rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-teal-900">
          <p className="font-semibold">+{formatTL(option.creditsNow)} kredi hemen hesabınıza eklenir</p>
          <p className="mt-1 text-teal-800">
            Bu ayki kredi hakkınız {formatTL(subscription.monthlyCredits)}&apos;den {formatTL(option.monthlyCredits)} krediye
            çıkar. Eklenen kredi bu ayın sonuna kadar geçerlidir; sonraki aylarda her ay {formatTL(option.monthlyCredits)}{" "}
            kredi yüklenir.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-500">
        {periodChange
          ? `Aylık aboneliğiniz bugün sona erer ve bir daha ücret alınmaz. Yıllık paketiniz bugün başlar; sonraki ödeme ${formatDate(option.renewalAt)} tarihinde ${formatTL0(option.periodGrossPrice)} ₺ (KDV dahil) olarak alınır.`
          : `${subscription.planName} paketinizin ${formatDate(option.renewalAt)} tarihine kadarki bedeli zaten ödendi; bugün yalnızca aradaki fark alınır. Sonraki ödeme: ${formatDate(option.renewalAt)} tarihinde ${option.planName} ${periodWord.toLocaleLowerCase("tr")} fiyatıyla ${formatTL0(option.periodGrossPrice)} ₺ (KDV dahil), kayıtlı kartınızdan.${option.unlimited ? " Bundan sonra analiz sınırsızdır." : ""}`}
      </p>

      <PaymentTrust />
    </div>
  );
}

/** Paket seçilmeden açıldıysa: yükseltilebilecek paketler. */
function OptionChooser({ options }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-2xl font-bold text-slate-900">Paketinizi yükseltin</h1>
      <p className="mt-1 text-sm text-slate-500">
        Yeni paketiniz hemen geçerli olur. Aynı periyotta yükseltmede mevcut paketinizi zaten ödediğiniz için bugün yalnızca
        döneminizin kalan süresi için iki paket arasındaki farkı ödersiniz.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <div key={option.planPriceId} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">
                {option.planName} · {PERIOD_LABEL[option.billingPeriod]}
              </p>
              {option.kind === "PERIOD_CHANGE" && (
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">Yıllığa geç</span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{creditsLabel(option)}</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">
              {formatTL0(option.chargeGross)} ₺ <span className="text-sm font-normal text-slate-500">bugün</span>
            </p>
            <p className="text-xs text-slate-500">
              {option.kind === "PERIOD_CHANGE"
                ? "Yıllık ücret, KDV dahil"
                : `${option.remainingMonths > 1 ? `Kalan ${option.remainingLabel} için paket farkı` : "Bu ayın paket farkı"}, KDV dahil${option.creditsNow > 0 ? ` · bu aya +${formatTL(option.creditsNow)} kredi` : ""}`}
            </p>
            <div className="mt-5 flex-1" />
            {option.purchasable ? (
              <Link href={`/hesabim/yukselt?paket=${option.planPriceId}`} className={linkButton}>
                Bu pakete geç
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-400">
                Yakında
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Paket yükseltme (/hesabim/yukselt?paket={fiyatId}). Seçenekler ve tutarlar backend'de hesaplanır
 * (GET /api/billing/upgrade/options). Aynı periyotta yükseltmede tek seferlik fark ödemesi, aylıktan
 * yıllığa geçişte yeni abonelik formu açılır.
 */
export default function UpgradeCheckoutPage() {
  const state = usePurchaseBootstrap(({ isAdmin }) =>
    isAdmin ? billingApi.upgradeOptions() : Promise.resolve({ ok: true, data: null })
  );
  const [priceId] = useState(() =>
    typeof window === "undefined" ? null : Number(new URLSearchParams(window.location.search).get("paket")) || null
  );
  const [payment, setPayment] = useState(null);

  const back = (
    <Link href="/hesabim#paket" className={linkButton}>
      Paketime git
    </Link>
  );

  let body;
  if (state.status === "loading") {
    body = <PurchaseLoading />;
  } else if (state.status === "error" || (state.extra && !state.extra.ok)) {
    body = <Notice title="Bilgiler alınamadı">{state.extra?.message ?? "Sayfayı yenileyip tekrar deneyin."}</Notice>;
  } else if (!state.isAdmin) {
    body = (
      <Notice title="Yükseltme yetkiniz yok" action={back}>
        Paket yükseltme işlemini eczanenizin yöneticisi yapabilir.
      </Notice>
    );
  } else {
    const { billing, account, savedInfo } = state;
    const options = state.extra.data;
    const option = options.options.find((o) => o.planPriceId === priceId);
    const subscription = billing?.subscription;

    if (!options.available || !subscription) {
      body = (
        <Notice title="Yükseltme şu an yapılamıyor" action={back}>
          {options.unavailableReason ?? "Paketiniz yükseltmeye uygun değil."}
        </Notice>
      );
    } else if (!option) {
      body = <OptionChooser options={options.options} />;
    } else if (!option.purchasable) {
      body = (
        <Notice title="Bu paket henüz satışta değil" action={back}>
          Seçtiğiniz pakete şu an geçilemiyor. Lütfen başka bir paket seçin.
        </Notice>
      );
    } else {
      const periodChange = option.kind === "PERIOD_CHANGE";
      body = (
        <PurchaseColumns
          summary={<UpgradeSummary option={option} subscription={subscription} available={billing.credits.available} />}
          step={payment ? 1 : 0}
        >
          {payment ? (
            <PaymentStep
              content={payment.content}
              billing={payment.billing}
              note={
                periodChange
                  ? "Kartınız iyzico'nun güvenli formunda alınır. Yıllık abonelik için formdaki “kartımı sakla” onayı gereklidir; yenilemeler bu karttan çekilir."
                  : "Fark ödemesi tek seferliktir ve iyzico'nun güvenli formunda alınır. Aboneliğinizin yenilemeleri kayıtlı kartınızdan devam eder."
              }
            />
          ) : (
            <BillingStep
              key={option.planPriceId}
              item={{
                id: `${option.kind.toLowerCase()}_${option.planPriceId}`,
                name: periodChange ? `${option.planName} · Yıllık` : `${option.planName} yükseltme`,
                category: option.kind,
              }}
              gross={option.chargeGross}
              savedInfo={savedInfo}
              initial={initialBillingForm(savedInfo, account.profile, account.pharmacy)}
              startCheckout={() => billingApi.upgradeCheckout(option.planPriceId, LEGAL_VERSION)}
              onReady={(data, billingForm) => setPayment({ content: data.checkoutFormContent, billing: billingForm })}
            />
          )}
        </PurchaseColumns>
      );
    }
  }

  return (
    <PurchaseLayout backHref="/hesabim#paketler" backLabel="Paketlere dön">
      {body}
      {state.status === "ready" && state.extra?.data?.available && !payment && (
        <p className="mx-auto -mt-4 mb-6 flex max-w-6xl items-center gap-2 px-4 text-xs text-slate-400 sm:px-6">
          <Sparkles size={14} aria-hidden="true" /> Paket düşürmek isterseniz aboneliğinizi iptal edip dönem sonunda yeni
          paketinizi seçebilirsiniz.
        </p>
      )}
    </PurchaseLayout>
  );
}
