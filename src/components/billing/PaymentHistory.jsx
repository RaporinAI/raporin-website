"use client";
import { Receipt } from "lucide-react";
import AccountCard from "../account/AccountCard";
import { formatDate } from "../../lib/billing/billingApi";
import { formatTL2 } from "../../lib/billing/catalog";

const STATUS = {
  SUCCESS: { label: "Ödendi", className: "bg-emerald-50 text-emerald-700" },
  FAILED: { label: "Alınamadı", className: "bg-red-50 text-red-700" },
  REFUNDED: { label: "İade edildi", className: "bg-amber-50 text-amber-700" },
};

/** Ödemenin satırda görünen açıklaması: abonelikte dönem, yükseltme/ek kredide açıklama. */
function detail(payment) {
  if (payment.kind === "UPGRADE" || payment.kind === "CREDIT_PACK") {
    return payment.description ?? (payment.kind === "UPGRADE" ? "Paket yükseltme farkı" : "Ek kredi");
  }
  return payment.periodStart ? `${formatDate(payment.periodStart)} – ${formatDate(payment.periodEnd)}` : "-";
}

/**
 * Ödemeler: abonelik (ilk ödeme ve yenilemeler), paket yükseltme farkı ve ek kredi. Ödeme yoksa gösterilmez; {@code showEmpty} ise
 * (Ödeme geçmişi sayfası) boş durum mesajı gösterilir.
 */
export default function PaymentHistory({ payments, showEmpty = false }) {
  if (!payments?.length) {
    if (!showEmpty) return null;
    return (
      <AccountCard icon={Receipt} title="Ödeme geçmişi" subtitle="Tutarlar KDV dahildir. Faturalarınız fatura e-posta adresinize gönderilir.">
        <p className="text-sm text-slate-500">Henüz ödeme yok.</p>
      </AccountCard>
    );
  }
  return (
    <AccountCard icon={Receipt} title="Ödeme geçmişi" subtitle="Tutarlar KDV dahildir. Faturalarınız fatura e-posta adresinize gönderilir.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="pb-3 pr-4">Tarih</th>
              <th className="pb-3 pr-4">Açıklama</th>
              <th className="pb-3 pr-4 text-right">Tutar</th>
              <th className="pb-3 text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => {
              const status = STATUS[payment.status] ?? STATUS.FAILED;
              return (
                <tr key={payment.id}>
                  <td className="py-3 pr-4 text-slate-700">{formatDate(payment.paidAt ?? payment.createdAt)}</td>
                  <td className="py-3 pr-4 text-slate-500">{detail(payment)}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-slate-900">{formatTL2(payment.amount)} ₺</td>
                  <td className="py-3 text-right">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AccountCard>
  );
}
