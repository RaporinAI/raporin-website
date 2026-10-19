import { readConsent } from "./cookieConsent";
import { buildHashedUserData } from "./userDataHashing";

// Google Tag Manager — GA4, Google Ads ve Meta etiketleri GTM panelinden yönetilir
// (bkz. GTM_KURULUM_REHBERI.md). Rıza durumu Consent Mode ile GTM'e iletilir.
export const GTM_ID = "GTM-M6T35B87";

/** Masaüstü uygulaması indirme tıklamasını GTM'e "file_download" olayı olarak bildirir. */
export function trackDownload(url) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "file_download",
    file_name: url.split("/").pop(),
    link_url: url,
  });
}

function pushEvent(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Başarılı üyelik (backend 201 döndükten sonra) — birincil dönüşüm olayı.
 * GA4'ün önerilen "sign_up" olay adı kullanılır; source kaydın nereden başladığını taşır
 * (ör. masaüstü uygulamasındaki "Kayıt Ol" butonu ?kaynak=desktop ile gelir).
 *
 * Ziyaretçi çerez bandında pazarlama çerezlerine izin verdiyse olayla birlikte hash'lenmiş
 * eşleştirme verisi (user_data / meta_user_data) de gönderilir; izin yoksa hiç eklenmez.
 * Ham e-posta, telefon veya ad dataLayer'a hiçbir durumda yazılmaz (bkz. userDataHashing.js).
 *
 * @param {string|null} source
 * @param {{ email: string, phone: string, fullName: string }} [user]
 */
export async function trackSignUp(source, user) {
  const event = { event: "sign_up", method: "email", signup_source: source || "web" };

  let hashed = null;
  if (user && readConsent()?.marketing) {
    // Hash üretilemezse dönüşüm yine sayılsın; yalnızca eşleştirme verisi eksik kalır.
    hashed = await buildHashedUserData(user).catch(() => null);
  }

  if (!hashed) {
    pushEvent(event);
    return;
  }

  pushEvent({ ...event, ...hashed });
  // GTM veri katmanı değerleri sonraki olaylara taşır; eşleştirme verisi yalnızca bu olaya ait kalsın.
  pushEvent({ user_data: undefined, meta_user_data: undefined });
}

/** Web sitesinden başarılı giriş. */
export function trackLogin() {
  pushEvent({ event: "login", method: "email" });
}

// --- GA4 e-ticaret olayları (iyzico ödeme akışı) ---
// Tutarlar KDV dahil, TRY. Önceki e-ticaret nesnesi GA4 önerisi gereği her olaydan önce temizlenir.
const CURRENCY = "TRY";
// iyzico formu açılırken ürün checkoutId ile saklanır; ödeme dönüşündeki purchase aynı ürünü raporlar.
const PENDING_ITEMS_KEY = "raporin_checkout_items";
const REPORTED_PURCHASES_KEY = "raporin_reported_purchases";

function pushEcommerce(event, ecommerce) {
  pushEvent({ ecommerce: null });
  pushEvent({ event, ecommerce });
}

function readList(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeList(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage kapalıysa tekilleştirme GA4'ün transaction_id kontrolüne kalır.
  }
}

const toValue = (amount) => Math.round(Number(amount) * 100) / 100;

/**
 * @typedef {{ id: string, name: string, category: string }} CheckoutItem
 * id ör. "profesyonel_YEARLY" veya "credit_pack_500"; category: SUBSCRIPTION | UPGRADE | PERIOD_CHANGE | CREDIT_PACK
 */
function ecommerceOf(item, amount) {
  const value = toValue(amount);
  return {
    currency: CURRENCY,
    value,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: value, quantity: 1 }],
  };
}

/** Ödeme sayfası (fatura bilgileri adımı) bir ürünle açıldığında. */
export function trackBeginCheckout(item, amount) {
  if (typeof window === "undefined") return;
  pushEcommerce("begin_checkout", ecommerceOf(item, amount));
}

/** Fatura bilgileri onaylanıp iyzico kart formu açıldığında. */
export function trackAddPaymentInfo(item, amount, checkoutId) {
  if (typeof window === "undefined") return;
  pushEcommerce("add_payment_info", { ...ecommerceOf(item, amount), payment_type: "iyzico" });
  if (checkoutId != null) {
    const pending = readList(PENDING_ITEMS_KEY, {});
    const recent = Object.entries({ ...pending, [checkoutId]: item }).slice(-10);
    writeList(PENDING_ITEMS_KEY, Object.fromEntries(recent));
  }
}

/**
 * Backend ödemeyi COMPLETED olarak doğruladıktan sonra çağrılır (kart güncelleme hariç). Aynı işlem
 * (checkoutId) bu tarayıcıda ikinci kez raporlanmaz; GA4 ayrıca transaction_id ile de tekilleştirir.
 *
 * @param {{ checkoutId: number, kind: string, description?: string, amount: number, credits?: number }} checkout
 */
export function trackPurchase(checkout) {
  if (typeof window === "undefined" || checkout.amount == null) return;

  const transactionId = String(checkout.checkoutId);
  const reported = readList(REPORTED_PURCHASES_KEY, []);
  if (reported.includes(transactionId)) return;

  const pending = readList(PENDING_ITEMS_KEY, {});
  const item = pending[transactionId] ?? {
    id: checkout.kind,
    name: checkout.description || checkout.kind,
    category: checkout.kind,
  };
  pushEcommerce("purchase", {
    transaction_id: transactionId,
    ...ecommerceOf(item, checkout.amount),
    ...(checkout.credits ? { credits: checkout.credits } : {}),
  });

  delete pending[transactionId];
  writeList(PENDING_ITEMS_KEY, pending);
  writeList(REPORTED_PURCHASES_KEY, [...reported, transactionId].slice(-20));
}
