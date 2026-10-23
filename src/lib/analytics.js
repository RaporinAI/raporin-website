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

/** Sağ alttaki WhatsApp karşılama penceresinin açılması. */
export function trackWhatsAppOpen(pagePath) {
  pushEvent({ event: "whatsapp_open", page_path: pagePath });
}

/** WhatsApp penceresinden mesaj gönderimi (WhatsApp'a yönlendirme); page_path hangi sayfadan yazıldığını taşır. */
export function trackWhatsAppClick(pagePath) {
  pushEvent({ event: "whatsapp_click", page_path: pagePath });
}

/** Web sitesinden başarılı giriş. */
export function trackLogin() {
  pushEvent({ event: "login", method: "email" });
}
