"use client";
import { useEffect, useState } from "react";
import { clearPendingPurchase, usePendingPurchase } from "../../lib/billing/pendingPurchase";
import { loadCatalog } from "../../lib/billing/catalog";

/**
 * Fiyatlandırmada seçilip kayıt/giriş boyunca saklanan paket. Paket satışta değilse ya da
 * kullanıcının zaten ücretli paketi varsa seçim temizlenir.
 *
 * @returns { plan, price, period } | null
 */
export function usePendingSelection(billing) {
  const priceId = usePendingPurchase();
  const [selection, setSelection] = useState(null);
  const subscription = billing?.subscription;
  const hasPaid =
    subscription?.source === "IYZICO" && ["ACTIVE", "PAST_DUE", "SUSPENDED"].includes(subscription.status);

  useEffect(() => {
    if (!priceId) return;
    let cancelled = false;
    loadCatalog().then((catalog) => {
      if (cancelled) return;
      for (const plan of catalog.plans) {
        for (const [period, price] of Object.entries(plan.prices)) {
          if (price.id === priceId && price.purchasable && catalog.purchaseEnabled) {
            setSelection({ plan, price, period });
            return;
          }
        }
      }
      clearPendingPurchase();
    });
    return () => {
      cancelled = true;
    };
  }, [priceId]);

  useEffect(() => {
    if (priceId && hasPaid) clearPendingPurchase();
  }, [priceId, hasPaid]);

  if (!priceId || hasPaid || !selection || selection.price.id !== priceId) return null;
  return selection;
}
