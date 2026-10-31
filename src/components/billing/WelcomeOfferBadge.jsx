"use client";
import { Gift } from "lucide-react";
import { formatTL } from "../../lib/billing/catalog";
import { useWelcomeOffer } from "../../lib/billing/useWelcomeOffer";

/**
 * Hoş geldin kredisi rozeti: "150 kredi hediye · Kredi kartı gerekmez". Miktar admin panelden
 * gelir; bilinmiyorsa miktarsız genel metin gösterilir, admin panelde kapalıysa rozet hiç çizilmez.
 */
export default function WelcomeOfferBadge({ className = "" }) {
  const offer = useWelcomeOffer();
  if (offer && offer.credits === 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-bold tracking-wide text-teal-700 shadow-[0_2px_8px_rgba(13,148,136,0.14)] ${className}`}
    >
      <Gift size={14} aria-hidden="true" />
      {offer ? `${formatTL(offer.credits)} kredi hediye` : "Ücretsiz krediyle deneyin"}
      <span className="font-medium text-teal-700/70">· Kredi kartı gerekmez</span>
    </span>
  );
}
