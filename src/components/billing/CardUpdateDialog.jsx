"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Loader2, X } from "lucide-react";
import { Alert } from "../auth/FormControls";
import IyzicoCheckoutForm from "./IyzicoCheckoutForm";
import { billingApi } from "../../lib/billing/billingApi";

/** Abonelik kartını değiştirme: iyzico'nun kart güncelleme formu. Ödeme gecikmişse yeni kartla tekrar denenir. */
export default function CardUpdateDialog({ open, onClose }) {
  // Pencere her açılışta sıfırdan kurulur (yeni form token'ı alınır).
  return open ? <CardUpdateBody onClose={onClose} /> : null;
}

function CardUpdateBody({ onClose }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    billingApi.cardUpdate().then((result) => {
      if (cancelled) return;
      if (result.ok) setContent(result.data.checkoutFormContent);
      else setError(result.message);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Form açıldıktan sonra kapatılırsa iyzico'nun sayfaya eklediği script'ler temizlensin diye sayfa yenilenir.
  const close = () => (content ? window.location.reload() : onClose());

  return (
    <Dialog open onClose={close} className="relative z-[100]">
      <div className="fixed inset-0 bg-slate-900/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <DialogPanel className="flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <DialogTitle className="text-base font-bold text-slate-900">Ödeme kartını güncelle</DialogTitle>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {error && <Alert>{error}</Alert>}
              {!error && !content && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-label="Yükleniyor" />
                </div>
              )}
              {content && <IyzicoCheckoutForm content={content} />}
            </div>
          </DialogPanel>
      </div>
    </Dialog>
  );
}
