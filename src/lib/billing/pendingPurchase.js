import { useSyncExternalStore } from "react";

// Fiyatlandırmada "Satın al"a basan ama henüz hesabı/oturumu olmayan kullanıcının seçtiği paket.
// Kayıt → e-posta doğrulama (çoğu zaman yeni sekmede) → giriş zinciri boyunca adres parametresi
// kaybolduğu için tarayıcıda saklanır; giriş sonrası Hesabım > Paketim ödeme adımını açar.
const KEY = "raporin.pendingPurchase";
const TTL_MS = 24 * 60 * 60 * 1000;
const CHANGE_EVENT = "raporin:pending-purchase";

const notifyChange = () => window.dispatchEvent(new Event(CHANGE_EVENT));

export function savePendingPurchase(priceId) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ priceId, savedAt: Date.now() }));
    notifyChange();
  } catch {
    // Depolama kapalıysa (gizli mod vb.) akış yine çalışır; sadece paket hatırlanmaz.
  }
}

/** @returns seçilen fiyat id'si veya null (yoksa ya da 24 saatten eskiyse) */
export function readPendingPurchase() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!value?.priceId || Date.now() - value.savedAt > TTL_MS) return null;
    return Number(value.priceId) || null;
  } catch {
    return null;
  }
}

export function clearPendingPurchase() {
  try {
    localStorage.removeItem(KEY);
    notifyChange();
  } catch {
    // yok say
  }
}

function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Sunucuda null, tarayıcıda saklanan fiyat id'si (hydration uyumlu, değişince günceller). */
export function usePendingPurchase() {
  return useSyncExternalStore(subscribe, readPendingPurchase, () => null);
}
