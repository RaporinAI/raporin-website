import { WHATSAPP_NUMBER } from "./contact";

/**
 * WhatsApp bağlantısı (yalnızca tarayıcıda). Masaüstünde doğrudan WhatsApp Web, mobilde wa.me (uygulamayı açar).
 * wa.me masaüstünde önce ara bir "Sohbete devam et" sayfası gösterdiği için ayrılıyor.
 */
export function whatsAppUrl(message) {
  const text = encodeURIComponent(message ?? "");
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return isMobile
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

export function openWhatsApp(message) {
  window.open(whatsAppUrl(message), "_blank", "noopener,noreferrer");
}
