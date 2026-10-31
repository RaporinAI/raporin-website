"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Alert } from "../auth/FormControls";
import { BillingFields, BillingSummary, hasErrors, toBillingPayload, validateBilling } from "./BillingInfoForm";
import IyzicoCheckoutForm from "./IyzicoCheckoutForm";
import { billingApi } from "../../lib/billing/billingApi";
import { formatTL0, formatTL2 } from "../../lib/billing/catalog";
import { trackAddPaymentInfo, trackBeginCheckout } from "../../lib/analytics";

// Satın alma sayfalarının (paket, yükseltme, ek kredi) ortak parçaları: sayfa iskeleti, adımlar,
// fatura bilgileri + sözleşme onayı adımı ve iyzico ödeme formu adımı.

export const linkButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] hover:from-teal-800 hover:to-teal-700 px-5 text-sm font-semibold text-white";

/**
 * Oturum, eczane, paket durumu ve fatura bilgilerini yükler. Oturum yoksa girişe yönlendirir.
 *
 * @param loadExtra ek veri (ör. yükseltme seçenekleri); { isAdmin } alır, promise döner
 * @returns { status: "loading" | "error" | "ready", account, isAdmin, billing, savedInfo, extra }
 */
export function usePurchaseBootstrap(loadExtra) {
  const router = useRouter();
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meResponse = await fetch("/api/session/me", { cache: "no-store" }).catch(() => null);
      if (cancelled) return;
      if (meResponse?.status === 401) {
        const back = `${window.location.pathname}${window.location.search}`;
        router.replace(`/giris?next=${encodeURIComponent(back)}`);
        return;
      }
      if (!meResponse?.ok) {
        setState({ status: "error" });
        return;
      }
      const account = await meResponse.json();
      const isAdmin = account.profile.roles?.some((role) => role.code === "PHARMACY_ADMIN");
      const [billing, info, extra] = await Promise.all([
        billingApi.me(),
        isAdmin ? billingApi.billingInfo() : Promise.resolve({ ok: true, data: null }),
        loadExtra ? loadExtra({ isAdmin }) : Promise.resolve(null),
      ]);
      if (cancelled) return;
      setState({
        status: "ready",
        account,
        isAdmin,
        billing: billing.ok ? billing.data : null,
        savedInfo: info.ok ? info.data : null,
        extra,
      });
    })();
    return () => {
      cancelled = true;
    };
    // loadExtra sayfa başına sabittir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return state;
}

/** Sayfa iskeleti: üstte geri bağlantısı, logo ve "Güvenli ödeme"; altta destek adresi. */
export function PurchaseLayout({ backHref = "/hesabim#paket", backLabel = "Paketlere dön", children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f2fbf8] via-white to-[#f4fbfd]">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
            <ArrowLeft size={16} aria-hidden="true" /> {backLabel}
          </Link>
          <Link href="/" aria-label="RaporinAI ana sayfa">
            <Image src="/logo.png" alt="RaporinAI" width={200} height={60} className="h-auto w-[130px]" priority />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Lock size={14} aria-hidden="true" /> Güvenli ödeme
          </span>
        </div>
      </header>
      {children}
      <footer className="pb-10 text-center text-xs text-slate-400">
        Sorunuz mu var?{" "}
        <a href="mailto:destek@raporin.com" className="font-medium text-slate-500 hover:text-slate-700">
          destek@raporin.com
        </a>
      </footer>
    </main>
  );
}

export function PurchaseLoading() {
  return (
    <div className="flex justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-label="Yükleniyor" />
    </div>
  );
}

/** İki sütunlu düzen: solda sipariş özeti, sağda adımlar. */
export function PurchaseColumns({ summary, step, children }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-14">
      <aside className="lg:sticky lg:top-10 lg:self-start">{summary}</aside>
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <Steps step={step} />
        </div>
        {children}
      </section>
    </div>
  );
}

export function Steps({ step }) {
  const items = ["Fatura bilgileri", "Ödeme"];
  return (
    <ol className="flex items-center gap-3 text-sm">
      {items.map((label, index) => (
        <li key={label} className="flex items-center gap-3">
          <span className={`flex items-center gap-2 font-semibold ${index <= step ? "text-slate-900" : "text-slate-400"}`}>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                index <= step ? "bg-[#00A58E] text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {index < step ? <Check size={14} /> : index + 1}
            </span>
            {label}
          </span>
          {index < items.length - 1 && <span className="h-px w-8 bg-slate-200" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

/** Ödeme güvenliği notu ve iyzico logoları (sipariş özetinin altı). */
export function PaymentTrust() {
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <ShieldCheck size={18} className="shrink-0 text-[#00A58E]" aria-hidden="true" />
        Ödemeler iyzico altyapısıyla alınır; kart bilgileriniz Raporin sunucularına ulaşmaz.
      </div>
      <Image src="/payment/iyzico-logo-band.svg" alt="iyzico ile öde · Mastercard · Visa · Troy" width={260} height={26} />
    </>
  );
}

/**
 * 1. adım: fatura bilgileri ve sözleşme onayı. Fatura bilgisi değiştiyse önce kaydedilir, sonra
 * {@code startCheckout} çağrılır ({ ok, data: { checkoutFormContent }, message } döner).
 */
/** item: GA4 e-ticaret ürünü ({@link trackBeginCheckout}); gross: KDV dahil ödenecek tutar. */
export function BillingStep({ item, gross, initial, savedInfo, startCheckout, onReady, disabled = false }) {
  const [form, setForm] = useState(initial);
  const checkoutTracked = useRef(false);

  useEffect(() => {
    // Sayfa başına bir kez; geliştirme modunda effect iki kez çalışsa da tekrar gönderilmez.
    if (checkoutTracked.current || !item) return;
    checkoutTracked.current = true;
    trackBeginCheckout(item, gross);
  }, [item, gross]);
  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validateBilling(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setError("Lütfen işaretli alanları kontrol edin.");
      const first = Object.keys(nextErrors).find((key) => nextErrors[key]);
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    if (!accepted) {
      setError("Devam etmek için Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni onaylayın.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = toBillingPayload(form);
    const changed = !savedInfo || JSON.stringify(payload) !== JSON.stringify(toBillingPayload(initial));
    if (changed) {
      const saved = await billingApi.saveBillingInfo(payload);
      if (!saved.ok) {
        setSubmitting(false);
        if (saved.fieldErrors) setErrors(saved.fieldErrors);
        setError(saved.message);
        return;
      }
    }
    const result = await startCheckout();
    setSubmitting(false);
    if (result.ok) {
      if (item) trackAddPaymentInfo(item, gross, result.data.checkoutId);
      onReady(result.data, form);
    } else setError(result.message);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fatura bilgileri</h1>
        <p className="mt-1 text-sm text-slate-500">
          Faturanız bu bilgilerle düzenlenir. Bilgiler eczane kaydınızdan getirildi; kontrol edip eksikleri tamamlayın.
        </p>
      </div>

      <BillingFields form={form} errors={errors} onChange={onChange} idPrefix="co" />

      <div className="space-y-4 border-t border-slate-200 pt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              if (e.target.checked) setError(null);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span>
            <Link href="/kvkk/on-bilgilendirme-formu" target="_blank" className="font-medium text-teal-700 underline-offset-2 hover:underline">
              Ön Bilgilendirme Formu
            </Link>{" "}
            ve{" "}
            <Link href="/kvkk/mesafeli-satis-sozlesmesi" target="_blank" className="font-medium text-teal-700 underline-offset-2 hover:underline">
              Mesafeli Satış Sözleşmesi
            </Link>
            &apos;ni okudum ve onaylıyorum.
          </span>
        </label>

        {error && <Alert>{error}</Alert>}

        <button
          type="submit"
          disabled={submitting || disabled}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] hover:from-teal-800 hover:to-teal-700 px-6 text-base font-semibold text-white shadow-lg shadow-teal-700/15 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Lock size={17} aria-hidden="true" />}
          Ödemeye geç · {Number.isInteger(Number(gross)) ? formatTL0(gross) : formatTL2(gross)} ₺
        </button>
        <p className="text-center text-xs text-slate-400">
          Bir sonraki adımda kart bilgilerinizi iyzico&apos;nun güvenli formuna gireceksiniz.
        </p>
      </div>
    </form>
  );
}

/** 2. adım: iyzico ödeme formu. */
export function PaymentStep({ content, billing, note }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kart bilgileri</h1>
        <p className="mt-1 text-sm text-slate-500">{note}</p>
      </div>
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <BillingSummary form={billing} />
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="shrink-0 text-sm font-semibold text-teal-700 hover:underline"
        >
          Düzenle
        </button>
      </div>
      <IyzicoCheckoutForm content={content} />
    </div>
  );
}

export function Notice({ title, children, action }) {
  return (
    <div className="mx-auto max-w-md rounded-[20px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <CreditCard size={22} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-lg font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{children}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Tutar satırları: [{ label, hint?, value, strong?, tone? }]; hint etiketin altında küçük açıklamadır. */
export function AmountRows({ rows }) {
  return (
    <dl className="space-y-3 text-sm">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex justify-between gap-4 ${row.strong ? "border-t border-slate-200 pt-3 text-base" : ""}`}
        >
          <dt className={row.strong ? "font-semibold text-slate-900" : row.tone === "teal" ? "text-teal-700" : "text-slate-500"}>
            {row.label}
            {row.hint && <span className="mt-0.5 block text-xs font-normal text-slate-400">{row.hint}</span>}
          </dt>
          <dd className={`shrink-0 whitespace-nowrap text-right ${row.strong ? "font-bold text-slate-900" : row.tone === "teal" ? "font-medium text-teal-700" : "text-slate-900"}`}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
