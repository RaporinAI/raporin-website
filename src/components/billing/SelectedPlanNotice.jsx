"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, X } from "lucide-react";
import { clearPendingPurchase, usePendingPurchase } from "../../lib/billing/pendingPurchase";
import { loadCatalog, formatTL } from "../../lib/billing/catalog";
import { PERIOD_LABEL } from "../../lib/billing/billingApi";

/**
 * Kayıt/giriş sayfasında fiyatlandırmada seçilen paketi gösterir: kullanıcı neyi satın almak
 * üzere olduğunu görür, değiştirebilir veya vazgeçebilir.
 */
export default function SelectedPlanNotice() {
  const priceId = usePendingPurchase();
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (!priceId) return;
    let cancelled = false;
    loadCatalog().then((catalog) => {
      if (cancelled) return;
      for (const plan of catalog.plans) {
        for (const [period, price] of Object.entries(plan.prices)) {
          if (price.id === priceId) {
            setSelection({ plan, price, period });
            return;
          }
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [priceId]);

  if (!priceId || !selection || selection.price.id !== priceId) return null;
  const { plan, price, period } = selection;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-600">
        <Package size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="text-xs font-medium text-teal-700">Seçtiğiniz paket</p>
        <p className="font-semibold text-slate-900">
          {plan.name} · {PERIOD_LABEL[period]}
        </p>
        <p className="text-slate-500">
          {formatTL(price.netPrice)} ₺ +KDV /{period === "YEARLY" ? "yıl" : "ay"}
          {price.campaignLabel ? ` · ${price.campaignLabel}` : ""}
        </p>
        <Link href="/#fiyatlandirma" className="mt-1 inline-block text-xs font-semibold text-teal-700 hover:underline">
          Paketi değiştir
        </Link>
      </div>
      <button
        type="button"
        onClick={clearPendingPurchase}
        className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600"
        aria-label="Paket seçimini kaldır"
        title="Paket seçimini kaldır"
      >
        <X size={16} />
      </button>
    </div>
  );
}
