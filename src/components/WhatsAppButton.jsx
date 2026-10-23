"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { trackWhatsAppClick, trackWhatsAppOpen } from "../lib/analytics";

// Şirket WhatsApp hattı (Chatwoot'a bağlı). Ülke koduyla, yalnızca rakam: 90XXXXXXXXXX.
export const WHATSAPP_NUMBER = "905304711322";

const TEXT = {
  tr: {
    label: "WhatsApp ile destek alın",
    close: "Kapat",
    name: "RaporinAI Destek",
    status: "Genellikle birkaç dakika içinde yanıt verir",
    greeting: "Merhaba 👋\nRaporinAI'a hoş geldiniz. Size nasıl yardımcı olabiliriz?",
    placeholder: "Mesajınızı yazın…",
    send: "WhatsApp'ta gönder",
    hint: "Gönder'e bastığınızda WhatsApp açılır.",
  },
  en: {
    label: "Chat with us on WhatsApp",
    close: "Close",
    name: "RaporinAI Support",
    status: "Typically replies within a few minutes",
    greeting: "Hi there 👋\nWelcome to RaporinAI. How can we help you?",
    placeholder: "Type your message…",
    send: "Send on WhatsApp",
    hint: "WhatsApp opens when you press send.",
  },
};

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

/**
 * Masaüstünde doğrudan WhatsApp Web, mobilde wa.me (uygulamayı açar).
 * wa.me masaüstünde önce ara bir "Sohbete devam et" sayfası gösterdiği için ayrılıyor.
 */
function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return isMobile
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

/** Sağ altta sabit WhatsApp butonu; tıklanınca WhatsApp görünümlü karşılama penceresi açılır. */
export default function WhatsAppButton() {
  const pathname = usePathname() || "/";
  const t = pathname.startsWith("/en") ? TEXT.en : TEXT.tr;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    if (!open) trackWhatsAppOpen(pathname);
    setOpen((v) => !v);
  };

  const send = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    trackWhatsAppClick(pathname);
    window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-label={t.label}
            className="w-[calc(100vw-2rem)] max-w-sm origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25"
          >
            {/* Üst bar — WhatsApp sohbet başlığı */}
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
              <div className="relative shrink-0">
                <Image
                  src="/raporin-mascot.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full bg-white object-contain p-0.5"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="truncate text-xs text-white/80">{t.status}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="rounded-full p-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Sohbet alanı — karşılama balonu */}
            <div className="bg-[#ECE5DD] px-4 py-5">
              <div className="relative max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
                <p className="whitespace-pre-line leading-relaxed">{t.greeting}</p>
                <p className="mt-1 text-right text-[11px] text-gray-400">{t.name}</p>
              </div>
            </div>

            {/* Mesaj yazma alanı */}
            <form onSubmit={send} className="flex items-end gap-2 border-t border-gray-100 bg-[#F0F0F0] px-3 py-3">
              <textarea
                ref={inputRef}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) send(e);
                }}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-full border-0 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label={t.send}
                title={t.send}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:bg-[#1ebe5b] disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
            <p className="bg-[#F0F0F0] px-4 pb-2 text-center text-[11px] text-gray-500">{t.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? t.close : t.label}
        aria-expanded={open}
        title={t.label}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping motion-reduce:hidden" aria-hidden="true" />
        )}
        {open ? (
          <svg className="relative h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <WhatsAppIcon className="relative h-8 w-8" />
        )}
      </button>
    </div>
  );
}
