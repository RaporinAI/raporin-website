"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Tag, X } from "lucide-react";
import { initialBillingForm } from "./BillingInfoForm";
import {
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
import { formatTL, formatTL2, loadCatalog } from "../../lib/billing/catalog";
import { formatOfferEnd } from "../../lib/billing/betaOffer";
import { readPendingPurchase } from "../../lib/billing/pendingPurchase";
import { welcomeState } from "../../lib/billing/welcome";
import {
  captureDiscountCodeFromUrl,
  forgetDiscountCode,
  normalizeDiscountCode,
  readDiscountCode,
  rememberDiscountCode,
} from "../../lib/billing/discountCode";

function findSelection(plans, priceId) {
  for (const plan of plans) {
    for (const [period, price] of Object.entries(plan.prices)) {
      if (price.id === priceId) return { plan, price, period };
    }
  }
  return null;
}

function addPeriod(period) {
  const date = new Date();
  if (period === "YEARLY") date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
  return date;
}

const totals = (price, discount) => {
  const vatRate = price.vatRate ?? 20;
  if (discount) return { vatRate, gross: discount.gross, vat: discount.vat, net: discount.net };
  const gross = price.grossPrice ?? price.netPrice * (1 + vatRate / 100);
  return { vatRate, gross, vat: gross - price.netPrice, net: price.netPrice };
};

/**
 * İndirim kodu alanı. Kod backend'de seçilen pakete göre denenir; geçerliyse sipariş özeti indirimli
 * tutarlarla güncellenir. İş ortağı bağlantısından gelen (?kod=) ya da daha önce girilen kod kendiliğinden denenir.
 */
function DiscountCodeField({ priceId, discount, onChange, locked }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const autoTried = useRef(false);

  const apply = async (raw, { silent = false } = {}) => {
    const value = normalizeDiscountCode(raw);
    if (!value) {
      setError("İndirim kodunu girin.");
      return;
    }
    setChecking(true);
    setError(null);
    const result = await billingApi.previewDiscount(value, priceId);
    setChecking(false);
    if (result.ok) {
      rememberDiscountCode(value);
      onChange(result.data);
    } else {
      setCode(value);
      setError(result.message);
      if (silent && result.code === "BIL_026") forgetDiscountCode();
    }
  };

  useEffect(() => {
    if (autoTried.current || discount) return;
    autoTried.current = true;
    const initial = captureDiscountCodeFromUrl() || readDiscountCode();
    // Kayıtlı kodu sayfa açılırken bir kez dener.
    if (initial) apply(initial, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (discount) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <Tag size={16} className="mt-0.5 shrink-0 text-teal-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-teal-900">{discount.code} uygulandı</p>
            <p className="text-xs text-teal-800">{discount.label}</p>
          </div>
        </div>
        {!locked && (
          <button
            type="button"
            onClick={() => {
              forgetDiscountCode();
              onChange(null);
              setCode("");
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-800 hover:text-teal-950"
          >
            <X size={14} aria-hidden="true" /> Kaldır
          </button>
        )}
      </div>
    );
  }
  if (locked) return null;
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <label htmlFor="discount-code" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Tag size={16} className="text-teal-600" aria-hidden="true" />
        İndirim kodu
      </label>
      <p className="text-xs text-slate-500">İndirim kodunuz varsa bu alana girebilirsiniz.</p>
      <div className="flex gap-2">
        <input
          id="discount-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toLocaleUpperCase("tr-TR"));
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply(code);
            }
          }}
          placeholder="Kodunuzu girin"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase tracking-wide text-slate-900 outline-none placeholder:normal-case placeholder:tracking-normal focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <button
          type="button"
          onClick={() => apply(code)}
          disabled={checking}
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {checking ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : "Uygula"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Sol sütun: sipariş özeti. */
function OrderSummary({ selection, welcome, betaEndsAt, discount, onDiscountChange, locked }) {
  const { plan, price, period } = selection;
  const { vatRate, gross, vat, net } = totals(price, discount);
  const credits = price.credits ?? plan.credits;
  const yearly = period === "YEARLY";
  const benefits = [
    credits ? `Her ay ${formatTL(credits)} reçete kredisi` : "Sınırsız analiz",
    ...plan.features,
    "Ekibinizle ortak kullanım",
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500">{plan.name} paketine abone olun</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">{formatTL2(gross)} ₺</span>
          <span className="text-sm text-slate-500">/ {yearly ? "yıl" : "ay"}, KDV dahil</span>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {plan.name} · {PERIOD_LABEL[period]}
            </p>
            <p className="text-sm text-slate-500">{plan.description}</p>
          </div>
          {price.campaignLabel && (
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${
                price.highlight ? "bg-[#FFD84D] text-[#5A3E00]" : "bg-teal-50 text-teal-700"
              }`}
            >
              {price.campaignLabel}
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <DiscountCodeField priceId={price.id} discount={discount} onChange={onDiscountChange} locked={locked} />

      <dl className="space-y-3 text-sm">
        {discount ? (
          <>
            <div className="flex justify-between">
              <dt className="text-slate-500">Paket bedeli</dt>
              <dd className="text-slate-900">{formatTL2(discount.baseNet)} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-teal-700">İndirim ({discount.code})</dt>
              <dd className="font-medium text-teal-700">−{formatTL2(discount.discountNet)} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Ara toplam</dt>
              <dd className="text-slate-900">{formatTL2(net)} ₺</dd>
            </div>
          </>
        ) : price.listPrice != null && price.listPrice > price.netPrice ? (
          <>
            <div className="flex justify-between">
              <dt className="text-slate-500">Liste fiyatı</dt>
              <dd className="text-slate-900">{formatTL2(price.listPrice)} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-teal-700">İndirim{price.campaignLabel ? ` (${price.campaignLabel})` : ""}</dt>
              <dd className="font-medium text-teal-700">−{formatTL2(price.listPrice - price.netPrice)} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Ara toplam</dt>
              <dd className="text-slate-900">{formatTL2(price.netPrice)} ₺</dd>
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <dt className="text-slate-500">Paket bedeli</dt>
            <dd className="text-slate-900">{formatTL2(price.netPrice)} ₺</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-slate-500">KDV (%{formatTL(vatRate)})</dt>
          <dd className="text-slate-900">{formatTL2(vat)} ₺</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Bugün ödenecek</dt>
          <dd className="font-bold text-slate-900">{formatTL2(gross)} ₺</dd>
        </div>
        <p className="text-xs text-slate-500">
          Sonraki ödeme {formatDate(addPeriod(period))} tarihinde aynı karttan otomatik alınır
          {discount ? `; yenilemeler de indirimli fiyattan (${formatTL2(gross)} ₺) çekilir` : ""}. Dönem bitmeden
          iptal ederseniz tekrar ücret alınmaz.
        </p>
        {price.highlight && betaEndsAt && (
          <p className="rounded-xl bg-[#FFF8D6] px-3 py-2 text-xs font-medium text-[#5A3E00]">
            Size özel %50 indirimli fiyat {formatOfferEnd(betaEndsAt)}&apos;a kadar alınabilir.
          </p>
        )}
        {welcome?.active && (
          <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-800">
            Paketiniz bugün başlar. Kalan {formatTL(welcome.remaining)} hoş geldin krediniz silinmez,{" "}
            {formatDate(welcome.expiresAt)} tarihine kadar kullanabilirsiniz.
          </p>
        )}
      </dl>

      <PaymentTrust />
    </div>
  );
}

/**
 * Paket satın alma sayfası (/hesabim/satin-al?paket={fiyatId}). Stripe Checkout düzeni: solda sipariş
 * özeti, sağda fatura bilgileri; onaydan sonra sağ sütunda iyzico formu açılır. Ödeme bitince iyzico
 * kullanıcıyı backend üzerinden Hesabım > Paketim'e döndürür.
 */
export default function CheckoutPage() {
  const state = usePurchaseBootstrap(() => loadCatalog());
  const [priceId] = useState(() => {
    if (typeof window === "undefined") return null;
    return Number(new URLSearchParams(window.location.search).get("paket")) || readPendingPurchase();
  });
  const [payment, setPayment] = useState(null); // { content, billing }
  const [discount, setDiscount] = useState(null); // indirim kodu önizlemesi (backend)

  let body;
  if (state.status === "loading") {
    body = <PurchaseLoading />;
  } else if (state.status === "error") {
    body = <Notice title="Bilgiler alınamadı">Sayfayı yenileyip tekrar deneyin.</Notice>;
  } else {
    const { extra: catalog, billing, isAdmin, account, savedInfo } = state;
    const selection = priceId ? findSelection(catalog.plans, priceId) : null;
    const subscription = billing?.subscription;
    const hasPaid =
      subscription?.source === "IYZICO" && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status);
    const back = (
      <Link href="/hesabim#paket" className={linkButton}>
        Paketime git
      </Link>
    );

    if (!catalog.purchaseEnabled || !catalog.fromBackend) {
      body = <Notice title="Satın alma yakında açılacak" action={back}>Paketler şu an satışa kapalı.</Notice>;
    } else if (!selection || !selection.price.purchasable) {
      body = (
        <Notice title="Paket bulunamadı" action={back}>
          Seçtiğiniz paket artık satışta değil. Güncel paketlerden birini seçin.
        </Notice>
      );
    } else if (!isAdmin) {
      body = (
        <Notice title="Satın alma yetkiniz yok" action={back}>
          Paket satın alma işlemini eczanenizin yöneticisi yapabilir.
        </Notice>
      );
    } else if (hasPaid) {
      body = (
        <Notice
          title="Devam eden bir aboneliğiniz var"
          action={
            <Link href={`/hesabim/yukselt?paket=${selection.price.id}`} className={linkButton}>
              Yükseltme seçeneklerini gör
            </Link>
          }
        >
          {subscription.planName} paketiniz {formatDate(subscription.currentPeriodEnd)} tarihine kadar geçerli. Daha üst
          bir pakete geçmek için yükseltme yapabilirsiniz; mevcut paketinizi zaten ödediğiniz için bugün yalnızca kalan süre için aradaki farkı ödersiniz.
        </Notice>
      );
    } else {
      body = (
        <PurchaseColumns
          summary={
            <OrderSummary
              selection={selection}
              welcome={welcomeState(billing)}
              betaEndsAt={catalog.betaOfferEndsAt}
              discount={discount?.planPriceId === selection.price.id ? discount : null}
              onDiscountChange={setDiscount}
              locked={payment !== null}
            />
          }
          step={payment ? 1 : 0}
        >
          {payment ? (
            <PaymentStep
              content={payment.content}
              billing={payment.billing}
              note="Kartınız iyzico'nun güvenli formunda alınır. Abonelik için formdaki “kartımı sakla” onayı gereklidir; yenilemeler bu karttan çekilir."
            />
          ) : (
            <BillingStep
              key={selection.price.id}
              item={{
                id: `${selection.plan.key}_${selection.period}`,
                name: `${selection.plan.name} · ${PERIOD_LABEL[selection.period]}`,
                category: "SUBSCRIPTION",
              }}
              gross={totals(selection.price, discount).gross}
              savedInfo={savedInfo}
              initial={initialBillingForm(savedInfo, account.profile, account.pharmacy)}
              startCheckout={() => billingApi.checkout(selection.price.id, LEGAL_VERSION, discount?.code)}
              onReady={(data, billingForm) => setPayment({ content: data.checkoutFormContent, billing: billingForm })}
            />
          )}
        </PurchaseColumns>
      );
    }
  }

  return <PurchaseLayout>{body}</PurchaseLayout>;
}
