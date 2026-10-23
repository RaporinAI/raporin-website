"use client";
import { useEffect, useState } from "react";
import { loadCatalogShared } from "./catalog";

/**
 * Yeni eczanelere verilen hoş geldin kredisi, admin panelde kaydedilen değerlerle (`/api/pricing`).
 * Miktar sitede hiçbir yerde sabit yazılmaz.
 *
 * @returns {{ credits: number, days: number } | null} yüklenirken ya da alınamazsa null (çağıran miktarsız genel
 *          metni gösterir); `credits === 0` = admin panelde kapalı (kredi vaat eden metin gösterilmez)
 */
export function useWelcomeOffer() {
  const [offer, setOffer] = useState(null);
  useEffect(() => {
    let alive = true;
    loadCatalogShared().then((catalog) => {
      if (alive && Number.isInteger(catalog.welcomeCredits)) {
        setOffer({ credits: catalog.welcomeCredits, days: catalog.welcomeCreditDays });
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  return offer;
}
