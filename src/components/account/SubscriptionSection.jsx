"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, FileText, Loader2, Pencil } from "lucide-react";
import AccountCard from "./AccountCard";
import { Alert } from "../auth/FormControls";
import PlanCards, { BillingToggle } from "../pricing/PlanCards";
import CurrentPlanCard from "../billing/CurrentPlanCard";
import CardUpdateDialog from "../billing/CardUpdateDialog";
import PaymentHistory from "../billing/PaymentHistory";
import CreditUsageCard from "../billing/CreditUsageCard";
import BillingInfoForm, { BillingSummary, initialBillingForm } from "../billing/BillingInfoForm";
import { billingApi, PERIOD_LABEL } from "../../lib/billing/billingApi";
import { formatTL0, loadCatalog, STATIC_CATALOG } from "../../lib/billing/catalog";
import { trackPurchase } from "../../lib/analytics";

const RESULT_MESSAGES = {
  SUBSCRIPTION: {
    basarili: { tone: "success", text: "Ödemeniz alındı, paketiniz başladı. Kredileriniz hesabınıza yüklendi." },
    beklemede: { tone: "info", text: "Ödemeniz doğrulanıyor. Bu işlem birkaç dakika sürebilir." },
    basarisiz: { tone: "error", text: "Ödeme tamamlanamadı. Kartınızdan çekim yapılmadı; tekrar deneyebilirsiniz." },
  },
  CARD_UPDATE: {
    basarili: { tone: "success", text: "Ödeme kartınız güncellendi." },
    beklemede: { tone: "info", text: "Kart güncellemesi doğrulanıyor." },
    basarisiz: { tone: "error", text: "Kart güncellenemedi. Lütfen tekrar deneyin." },
  },
  UPGRADE: {
    basarili: {
      tone: "success",
      text: (data) =>
        `Paketiniz yükseltildi.${data?.credits > 0 ? ` Bu ayın kredi farkı (${data.credits} kredi) hesabınıza eklendi.` : ""} Sonraki yenileme yeni paketin fiyatından yapılır.`,
    },
    beklemede: { tone: "info", text: "Ödemeniz alındı, paketiniz yükseltiliyor. Bu işlem birkaç saniye sürebilir." },
    basarisiz: { tone: "error", text: "Yükseltme tamamlanamadı. Kartınızdan çekim yapıldıysa iade edilir." },
  },
  PERIOD_CHANGE: {
    basarili: {
      tone: "success",
      text: "Yıllık paketiniz başladı. Aylık aboneliğiniz sona erdi; kalan kredileriniz kullanılmaya devam ediyor.",
    },
    beklemede: { tone: "info", text: "Ödemeniz doğrulanıyor. Bu işlem birkaç dakika sürebilir." },
    basarisiz: { tone: "error", text: "Ödeme tamamlanamadı. Kartınızdan çekim yapılmadı; tekrar deneyebilirsiniz." },
  },
  CREDIT_PACK: {
    basarili: {
      tone: "success",
      text: (data) => `${data?.credits ?? "Ek"} kredi hesabınıza yüklendi. Aylık krediniz bitince otomatik kullanılır.`,
    },
    beklemede: { tone: "info", text: "Ödemeniz doğrulanıyor. Krediler birkaç saniye içinde yüklenecek." },
    basarisiz: { tone: "error", text: "Ödeme tamamlanamadı. Kartınızdan çekim yapılmadı; tekrar deneyebilirsiniz." },
  },
};

/**
 * iyzico dönüşü: backend kullanıcıyı /hesabim?odeme=basarili|beklemede|basarisiz&islem={id}#paket
 * adresine yönlendirir. Sonuç backend'den doğrulanır; beklemedeyse birkaç kez yeniden sorulur.
 */
function usePaymentResult(onCompleted) {
  const [result, setResult] = useState(null);
  // Parametreler bir kez okunur: geliştirme modunda effect iki kez çalışsa da sonuç kaybolmaz.
  const [request] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("odeme");
    return outcome ? { outcome, checkoutId: params.get("islem") } : null;
  });

  useEffect(() => {
    if (!request) return undefined;
    const { outcome, checkoutId } = request;
    // Adres temizlenir: sayfa yenilenince mesaj tekrar çıkmasın.
    if (new URLSearchParams(window.location.search).has("odeme")) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }

    let cancelled = false;
    const show = (kind, key, detail, data) => {
      if (cancelled) return;
      const message = (RESULT_MESSAGES[kind] ?? RESULT_MESSAGES.SUBSCRIPTION)[key];
      const text = typeof message?.text === "function" ? message.text(data) : message?.text;
      setResult(message ? { ...message, text: detail || text } : null);
    };

    (async () => {
      if (!checkoutId) {
        show("SUBSCRIPTION", outcome);
        return;
      }
      for (let attempt = 0; attempt < 10 && !cancelled; attempt += 1) {
        const status = await billingApi.checkoutStatus(checkoutId);
        if (cancelled) return;
        if (!status.ok) {
          show("SUBSCRIPTION", outcome);
          return;
        }
        const { kind, status: state, errorMessage } = status.data;
        if (state === "COMPLETED") {
          if (kind !== "CARD_UPDATE") trackPurchase(status.data);
          show(kind, "basarili", null, status.data);
          onCompleted();
          return;
        }
        if (state === "FAILED" || state === "EXPIRED") {
          show(kind, "basarisiz", errorMessage);
          return;
        }
        show(kind, "beklemede");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [request, onCompleted]);

  return [result, () => setResult(null)];
}

function ResultBanner({ result, onDismiss }) {
  if (!result) return null;
  if (result.tone === "info") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800" role="status">
        <Loader2 size={18} className="shrink-0 animate-spin" aria-hidden="true" />
        {result.text}
      </div>
    );
  }
  return (
    <div className="relative">
      <Alert tone={result.tone === "success" ? "success" : "error"}>{result.text}</Alert>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-3 top-3 text-xs font-semibold opacity-60 hover:opacity-100"
      >
        Kapat
      </button>
    </div>
  );
}

/** @param info kayıtlı fatura bilgisi; henüz girilmediyse null (boş durum ve "Fatura bilgisi ekle") */
function BillingInfoCard({ info, profile, pharmacy, onSaved }) {
  const [editing, setEditing] = useState(false);
  return (
    <AccountCard icon={FileText} title="Fatura bilgileri" subtitle="Faturalarınız bu bilgilerle düzenlenir">
      {!info && !editing ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Henüz fatura bilgisi eklemediniz. Paket satın alırken de girebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
          >
            <Pencil size={14} aria-hidden="true" /> Fatura bilgisi ekle
          </button>
        </div>
      ) : editing ? (
        <BillingInfoForm
          initial={initialBillingForm(info, profile, pharmacy)}
          onSaved={(saved) => {
            onSaved(saved);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <BillingSummary form={initialBillingForm(info, profile, pharmacy)} />
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
          >
            <Pencil size={14} aria-hidden="true" /> Düzenle
          </button>
        </div>
      )}
    </AccountCard>
  );
}

/**
 * Hesabım > Paketim. Alt sayfalara bölünür (kenar menüsünde Paketim'in altında):
 *
 * - paket: Genel durum. Mevcut paket kartı; paketi olmayan (yeni, hoş geldin kredisi, kredisi bitmiş) kullanıcıya
 *   asıl işi paket seçmek olduğu için paketler de burada açık gelir.
 * - kredi: Kredi kullanımı (gün gün grafik ve kredi hareketleri).
 * - paketler: Paketler ve fiyatlar (paketi olan kullanıcı için; olmayan Genel durum'da görür).
 * - fatura: Fatura bilgileri (yalnızca eczane yöneticisi).
 * - odemeler: Ödeme geçmişi (ücretli paketi olan).
 *
 * @param billing       GET /api/billing/me (Hesabım panosunda yüklenir; null: yükleniyor)
 * @param reloadBilling paket/kredi bilgisini yeniden yükler
 */
export default function SubscriptionSection({ view, onNavigate, profile, pharmacy, isAdmin, billing, billingError, reloadBilling }) {
  const [catalog, setCatalog] = useState(null);
  const [yearly, setYearly] = useState(true);
  const [cardUpdateOpen, setCardUpdateOpen] = useState(false);
  // Fatura bilgisi: undefined = yükleniyor, null = henüz girilmemiş (backend 204), { error } = alınamadı.
  const [info, setInfo] = useState(undefined);
  const [payments, setPayments] = useState(null);

  const loadExtras = useCallback(() => {
    if (isAdmin) billingApi.billingInfo().then((r) => setInfo(r.ok ? (r.data ?? null) : { error: r.message }));
    billingApi.payments().then((r) => setPayments(r.ok ? (r.data?.content ?? []) : []));
  }, [isAdmin]);

  const refresh = useCallback(() => {
    reloadBilling();
    loadExtras();
  }, [reloadBilling, loadExtras]);

  const [result, dismissResult] = usePaymentResult(refresh);

  useEffect(() => {
    loadCatalog().then(setCatalog);
    loadExtras();
  }, [loadExtras]);

  // Ücretli abonelikte yükseltilebilecek fiyatlar ve bugünkü farkları (fiyat id → seçenek)
  const [upgrade, setUpgrade] = useState({ options: new Map(), reason: null });
  const upgradeOptions = upgrade.options;
  const upgradeBlockReason = upgrade.reason;
  const canUpgrade = Boolean(isAdmin && billing?.actions?.canUpgrade);
  const upgradeKey = `${canUpgrade}-${billing?.subscription?.planPriceId}-${billing?.subscription?.currentPeriodEnd}`;
  useEffect(() => {
    if (!canUpgrade) {
      setUpgrade({ options: new Map(), reason: null });
      return;
    }
    let cancelled = false;
    billingApi.upgradeOptions().then((r) => {
      if (cancelled || !r.ok) return;
      setUpgrade({
        options: new Map((r.data.options ?? []).map((o) => [o.planPriceId, o])),
        reason: r.data.available ? null : r.data.unavailableReason,
      });
    });
    return () => {
      cancelled = true;
    };
    // upgradeKey paket/dönem değişince seçenekleri yeniler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeKey]);

  const plans = catalog?.plans ?? STATIC_CATALOG.plans;
  const purchaseOpen = Boolean(catalog?.purchaseEnabled && catalog?.fromBackend);
  const subscription = billing?.subscription;
  const hasPaidSubscription =
    subscription?.source === "IYZICO" && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status);
  // Ücretli ya da RaporinAI ekibinin atadığı, kullanımda olan paket
  const hasLiveSubscription = Boolean(subscription && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status));

  const action = (plan, price) => {
    if (!purchaseOpen) return null;
    if (subscription?.planPriceId === price.id && hasPaidSubscription) {
      return { label: "Mevcut paketiniz", disabled: true };
    }
    if (hasPaidSubscription) {
      // Ücretli abonelikte yalnızca üst paketlere geçilebilir (yükseltme); tutar backend'de hesaplanır.
      const option = upgradeOptions.get(price.id);
      if (!option) return null;
      if (!option.purchasable) return { label: "Yakında", disabled: true };
      const periodChange = option.kind === "PERIOD_CHANGE";
      return {
        label: periodChange ? "Yıllığa geç" : "Bu pakete yükselt",
        href: `/hesabim/yukselt?paket=${price.id}`,
        upgrade: {
          title: periodChange ? "Yıllığa geçiş" : "Yükseltme farkı",
          // Aylıktan yıllığa geçişte tutar kartta değil ödeme sayfasında gösterilir.
          amount: periodChange ? null : `${formatTL0(option.chargeGross)} ₺`,
          detail: periodChange
            ? "Yıllık paket bugün başlar, aylık aboneliğiniz kapanır. Kalan kredileriniz korunur."
            : option.remainingMonths > 1
              ? `Aylık +${formatTL0(option.monthlyDiffGross)} ₺ × kalan ${option.remainingLabel}`
              : `Bu ayın farkı (aylık +${formatTL0(option.monthlyDiffGross)} ₺)`,
          credits: !periodChange && option.creditsNow > 0 ? `+${formatTL0(option.creditsNow)} kredi bu ay hemen eklenir` : null,
        },
      };
    }
    if (!isAdmin) return { label: "Satın al", disabled: true, note: "Satın alma işlemini eczane yöneticisi yapabilir" };
    if (!price.purchasable) return { label: "Yakında", disabled: true };
    return { label: "Satın al", href: `/hesabim/satin-al?paket=${price.id}` };
  };

  let packagesNote = "Satın alma yakında açılacak.";
  if (purchaseOpen) {
    packagesNote = !hasPaidSubscription
      ? "Fiyatlar KDV hariçtir. Abonelik otomatik yenilenir, istediğiniz zaman iptal edebilirsiniz."
      : upgradeOptions.size > 0
        ? "Üst bir pakete hemen geçebilirsiniz. Mevcut paketinizi zaten ödediğiniz için yalnızca aradaki farkı ödersiniz; her paketin altında bugün ödeyeceğiniz tutar yazıyor."
        : upgradeBlockReason ??
          "Paket değiştirmek için mevcut aboneliğinizi iptal edin; dönem sonunda yeni paketi seçebilirsiniz.";
  }

  const loading = (
    <div className="flex justify-center rounded-[20px] border border-[#e6edf1] bg-white py-16">
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-label="Yükleniyor" />
    </div>
  );

  const packagesSection = (
    <section id="paketler-listesi" className="scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{hasLiveSubscription ? "Paketler ve fiyatlar" : "Paketler"}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{packagesNote}</p>
        </div>
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </div>
      <PlanCards plans={plans} yearly={yearly} compact action={action} className="mt-8 xl:grid-cols-3" />
    </section>
  );

  let content;
  if (!billing && view !== "paketler") {
    content = billingError ? null : loading;
  } else if (view === "kredi") {
    content = (
      <CreditUsageCard
        unlimited={Boolean(billing.credits?.unlimited)}
        refreshKey={`${billing.credits?.available}-${billing.credits?.consumedThisMonth}`}
      />
    );
  } else if (view === "paketler") {
    content = packagesSection;
  } else if (view === "fatura") {
    content =
      info === undefined ? (
        loading
      ) : info?.error ? (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">{info.error}</p>
      ) : (
        <BillingInfoCard info={info} profile={profile} pharmacy={pharmacy} onSaved={setInfo} />
      );
  } else if (view === "odemeler") {
    content = payments ? <PaymentHistory payments={payments} showEmpty /> : loading;
  } else {
    content = (
      <>
        <CurrentPlanCard
          billing={billing}
          isAdmin={isAdmin}
          onCardUpdate={() => setCardUpdateOpen(true)}
          onChanged={refresh}
          onNavigate={onNavigate}
        />
        {/* Paketi olmayan kullanıcının asıl işi paket seçmek: paketler hemen altında */}
        {!hasLiveSubscription && packagesSection}
        {hasLiveSubscription && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 px-1">
            <button type="button" onClick={() => onNavigate("kredi")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline">
              Kredi kullanımını gör <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onNavigate("paketler")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline">
              Paketleri ve fiyatları gör <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <ResultBanner result={result} onDismiss={dismissResult} />
      {billingError && <Alert>{billingError}</Alert>}
      {content}
      <CardUpdateDialog open={cardUpdateOpen} onClose={() => setCardUpdateOpen(false)} />
    </div>
  );
}
