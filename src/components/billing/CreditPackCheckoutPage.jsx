"use client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
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
import { billingApi, LEGAL_VERSION } from "../../lib/billing/billingApi";
import { formatTL, formatTL0 } from "../../lib/billing/catalog";

const unitFormat = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

/** Sol sütun: miktar seçimi ve tutar. Ödeme adımına geçince miktar kilitlenir. */
function CreditPackSummary({ offer, quantity, onQuantity, locked, available }) {
  const quote = offer.options.find((o) => o.quantity === quantity);
  const cheapest = offer.options.reduce((min, o) => Math.min(min, o.unitNetPrice), Infinity);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Ek kredi alın</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">{formatTL0(quote.grossAmount)} ₺</span>
          <span className="text-sm text-slate-500">{formatTL(quantity)} kredi, KDV dahil</span>
        </p>
      </div>

      <fieldset disabled={locked} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Kredi miktarı</legend>
        <p className="text-sm font-semibold text-slate-900">Kaç kredi?</p>
        <p className="mt-0.5 text-xs text-slate-500">
          1 kredi = 1 ilaç analizi. Çok alana kredi başı fiyat düşer.
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {offer.options.map((o) => {
            const selected = o.quantity === quantity;
            const discounted = o.unitNetPrice < offer.options[0].unitNetPrice;
            return (
              <button
                key={o.quantity}
                type="button"
                onClick={() => onQuantity(o.quantity)}
                aria-pressed={selected}
                className={`relative rounded-xl border px-1 py-2.5 text-center transition-colors disabled:cursor-not-allowed ${
                  selected
                    ? "border-[#00A58E] bg-teal-50 text-teal-800 ring-1 ring-[#00A58E]"
                    : "border-slate-200 text-slate-700 hover:border-teal-300 disabled:opacity-60"
                }`}
              >
                <span className="block text-sm font-bold">{formatTL(o.quantity)}</span>
                <span className="block text-[11px] text-slate-500">{unitFormat.format(o.unitNetPrice)} ₺</span>
                {discounted && o.unitNetPrice === cheapest && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FFD84D] px-1.5 text-[10px] font-bold text-[#5A3E00]">
                    En uygun
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Fiyatlar kredi başı, KDV hariç.</p>
      </fieldset>

      <div className="space-y-3">
        <AmountRows
          rows={[
            {
              label: `${formatTL(quantity)} kredi`,
              hint: `Kredi başı ${unitFormat.format(quote.unitNetPrice)} ₺ + KDV (%${formatTL(offer.vatRate)})`,
              value: `${formatTL0(quote.grossAmount)} ₺`,
            },
            { label: "Bugün ödenecek (KDV dahil)", value: `${formatTL0(quote.grossAmount)} ₺`, strong: true },
          ]}
        />
        <ul className="space-y-2 pt-2 text-xs text-slate-500">
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
            Krediler ödemeyle birlikte hemen yüklenir
            {available > 0 ? ` (şu an ${formatTL(available)} krediniz var, ödemeden sonra ${formatTL(available + quantity)}).` : "."}
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
            Önce paketinizin aylık kredisi, o bitince ek kredi kullanılır. Ek kredi {offer.validityMonths} ay geçerlidir;
            paketiniz yenilense de silinmez.
          </li>
          <li className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 text-[#17C6A3]" aria-hidden="true" />
            Tek seferlik ödemedir; abonelik değildir, tekrar ücret alınmaz.
          </li>
        </ul>
      </div>

      <PaymentTrust />
    </div>
  );
}

/**
 * Ek kredi satın alma (/hesabim/ek-kredi?miktar=300). Miktar 100–1000 arası, 100'er artar; fiyatlar
 * admin panelde belirlenen kademelerden backend'de hesaplanır (GET /api/billing/credit-packs).
 */
export default function CreditPackCheckoutPage() {
  const state = usePurchaseBootstrap(({ isAdmin }) =>
    isAdmin ? billingApi.creditPacks() : Promise.resolve({ ok: true, data: null })
  );
  const [requested] = useState(() =>
    typeof window === "undefined" ? null : Number(new URLSearchParams(window.location.search).get("miktar")) || null
  );
  const [quantity, setQuantity] = useState(null);
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
      <Notice title="Satın alma yetkiniz yok" action={back}>
        Ek kredi satın alma işlemini eczanenizin yöneticisi yapabilir.
      </Notice>
    );
  } else {
    const offer = state.extra.data;
    const { billing, account, savedInfo } = state;
    if (!offer.available || offer.options.length === 0) {
      body = (
        <Notice title="Ek kredi şu an alınamıyor" action={back}>
          {offer.unavailableReason ?? "Ek kredi satışı şu anda kapalı."}
        </Notice>
      );
    } else {
      const fallback = offer.options.some((o) => o.quantity === requested) ? requested : offer.options[0].quantity;
      const selected = quantity ?? fallback;
      const quote = offer.options.find((o) => o.quantity === selected);
      body = (
        <PurchaseColumns
          summary={
            <CreditPackSummary
              offer={offer}
              quantity={selected}
              onQuantity={setQuantity}
              locked={Boolean(payment)}
              available={billing?.credits?.available ?? 0}
            />
          }
          step={payment ? 1 : 0}
        >
          {payment ? (
            <PaymentStep
              content={payment.content}
              billing={payment.billing}
              note="Tek seferlik ödemedir; kartınız iyzico'nun güvenli formunda alınır ve saklanmaz."
            />
          ) : (
            <BillingStep
              item={{ id: `credit_pack_${selected}`, name: `${selected} ek kredi`, category: "CREDIT_PACK" }}
              gross={quote.grossAmount}
              savedInfo={savedInfo}
              initial={initialBillingForm(savedInfo, account.profile, account.pharmacy)}
              startCheckout={() => billingApi.creditPackCheckout(selected, LEGAL_VERSION)}
              onReady={(data, billingForm) => setPayment({ content: data.checkoutFormContent, billing: billingForm })}
            />
          )}
        </PurchaseColumns>
      );
    }
  }

  return (
    <PurchaseLayout backHref="/hesabim#paket" backLabel="Paketime dön">
      {body}
    </PurchaseLayout>
  );
}

