"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  trackAssistantAction,
  trackAssistantFeedback,
  trackAssistantMessage,
  trackAssistantOpen,
  trackAssistantUnavailable,
  trackWhatsAppClick,
  trackWhatsAppOpen,
} from "../lib/analytics";
import { openWhatsApp } from "../lib/whatsapp";

// Buton kodları → adres. Sunucudaki src/lib/chat/knowledge.js ACTIONS ile aynı; model yalnızca kod yazar,
// adres burada sabittir. DESTEK WhatsApp kartını açar.
const ACTION_LINKS = {
  PAKETLER: "/hesabim#paketler",
  INDIR: "/hesabim", // uygulama Hesabım > Genel bakış'tan indirilir (giriş gerekir)
  KAYIT: "/kayit",
  HESABIM: "/hesabim",
};

const MAX_CHARS = 500;
const STORAGE_KEY = "raporin_assistant_v1";
const SUPPORT_HINT_AFTER = 4; // bu kadar sorudan sonra altta "Ekibimize yazın" bağlantısı

const TEXT = {
  tr: {
    launcher: "RaporinAI Asistan'a sorun",
    close: "Kapat",
    name: "RaporinAI Asistan",
    status: "Yapay zekâ ile anında cevap",
    greeting: "Merhaba 👋 Ben RaporinAI Asistan. Paketler, kurulum, kredi ya da programın özellikleri hakkında sorunuzu yazın, hemen cevaplayayım.",
    launcherTitle: "AI Asistan",
    launcherSub: "Sorunuzu sorun",
    suggestions: [
      "Ücret ne kadar?",
      "Ücretsiz deneme var mı?",
      "Kendi eczane otomasyonumla uyumlu mu?",
      "Terminal ücreti var mı?",
      "Reçete girince otomatik kontrol eder mi?",
      "Kredi nasıl harcanır?",
    ],
    placeholder: "Sorunuzu yazın…",
    send: "Gönder",
    disclaimer: "Yapay zekâ hata yapabilir. Hasta bilgisi paylaşmayın.",
    whatsappTitle: "WhatsApp'ta destek ekibine yaz",
    supportCard: "Bu konuda destek ekibimiz size yardımcı olabilir.",
    supportButton: "WhatsApp'ta yazın",
    supportHint: "Sorunuzu çözemedik mi?",
    supportHintLink: "Ekibimize yazın",
    helpful: "Faydalı",
    notHelpful: "Faydalı değil",
    thanks: "Teşekkürler!",
    rephrase: "Üzgünüm, tam cevaplayamadım. Sorunuzu biraz farklı sorabilir misiniz? Olmazsa destek ekibimiz yardımcı olur.",
    newChat: "Yeni sohbet",
    whatsappPrefix: "Merhaba, web sitesindeki asistana şunu sordum: ",
    errors: {
      minute: "Çok hızlı yazıyorsunuz. Birkaç saniye bekleyip tekrar deneyin.",
      day: "Bugünkü soru sınırına ulaştınız. Destek ekibimiz WhatsApp'tan yardımcı olabilir.",
      conversation: "Bu sohbet çok uzadı. Yeni sohbet başlatabilir ya da destek ekibimize yazabilirsiniz.",
      global: "Asistan şu an çok yoğun. Destek ekibimiz WhatsApp'tan yardımcı olabilir.",
      disabled: "Asistan şu an kapalı. Destek ekibimiz WhatsApp'tan yardımcı olabilir.",
      unavailable: "Şu an cevap veremiyorum. Biraz sonra tekrar deneyin ya da destek ekibimize yazın.",
    },
    actions: { PAKETLER: "Paketleri gör", INDIR: "Uygulamayı indir", KAYIT: "Ücretsiz kayıt ol", HESABIM: "Hesabıma git" },
  },
  en: {
    launcher: "Ask RaporinAI Assistant",
    close: "Close",
    name: "RaporinAI Assistant",
    status: "Instant answers with AI",
    greeting: "Hi 👋 I'm the RaporinAI Assistant. Ask me about plans, setup, credits or features.",
    launcherTitle: "AI Assistant",
    launcherSub: "Ask a question",
    suggestions: [
      "How much does it cost?",
      "Is there a free trial?",
      "Does it work with my pharmacy software?",
      "Any fee for extra computers?",
      "How are credits used?",
    ],
    placeholder: "Type your question…",
    send: "Send",
    disclaimer: "AI can make mistakes. Do not share patient data.",
    whatsappTitle: "Message our support team on WhatsApp",
    supportCard: "Our support team can help you with this.",
    supportButton: "Message on WhatsApp",
    supportHint: "Didn't solve it?",
    supportHintLink: "Contact our team",
    helpful: "Helpful",
    notHelpful: "Not helpful",
    thanks: "Thanks!",
    rephrase: "Sorry, I couldn't fully answer that. Could you rephrase? Otherwise our support team can help.",
    newChat: "New chat",
    whatsappPrefix: "Hello, I asked the website assistant: ",
    errors: {
      minute: "You're typing too fast. Please wait a few seconds and try again.",
      day: "You've reached today's question limit. Our support team can help on WhatsApp.",
      conversation: "This chat got long. Start a new chat or contact our support team.",
      global: "The assistant is busy right now. Our support team can help on WhatsApp.",
      disabled: "The assistant is offline. Our support team can help on WhatsApp.",
      unavailable: "I can't answer right now. Try again shortly or contact our support team.",
    },
    actions: { PAKETLER: "See plans", INDIR: "Download the app", KAYIT: "Sign up free", HESABIM: "Go to my account" },
  },
};

/** Akış sürerken ve bittiğinde: [[KOD]] işaretlerini metinden ayırır, yarım kalan "[[…" kuyruğunu gizler. */
function parseAnswer(raw) {
  const codes = [];
  let text = raw.replace(/\[\[([A-Z]+)\]\]/g, (_, code) => {
    if ((code in ACTION_LINKS || code === "DESTEK") && !codes.includes(code)) codes.push(code);
    return "";
  });
  text = text
    .replace(/\[\[?[A-Z]*\]?$/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1") // kalın yazı işaretleri
    .replace(/^[ \t]*[*-][ \t]+/gm, "• ") // madde işaretleri
    .replace(/\n{3,}/g, "\n\n");
  return { text: text.trim(), codes };
}

function readStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.slice(-30) : [];
  } catch {
    return [];
  }
}

function writeStored(messages) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.pending).slice(-30)));
  } catch {
    // depolama kapalıysa sohbet yalnızca bu sayfada kalır
  }
}

const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const SparklesIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2zm0-12a2 2 0 0 1 2 2a2 2 0 0 1 2-2a2 2 0 0 1-2-2a2 2 0 0 1-2 2zM9 18a6 6 0 0 1 6-6a6 6 0 0 1-6-6a6 6 0 0 1-6 6a6 6 0 0 1 6 6z" />
  </svg>
);

const WhatsAppGlyph = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z" />
  </svg>
);

/**
 * Sağ altta yapay zekâ asistanı. İlk destek buradan verilir; WhatsApp yalnızca asistan çözemediğinde
 * (DESTEK kodu, iki kez 👎, limit/hata) ya da uzun sohbetin altında küçük bir bağlantıyla öne çıkar.
 */
export default function AssistantChat() {
  const pathname = usePathname() || "/";
  const lang = pathname.startsWith("/en") ? "en" : "tr";
  const t = TEXT[lang];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [downCount, setDownCount] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMessages(readStored());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const update = (fn) =>
    setMessages((prev) => {
      const next = fn(prev);
      writeStored(next);
      return next;
    });

  const toggle = () => {
    if (!open) trackAssistantOpen(pathname);
    setOpen((v) => !v);
  };

  const lastQuestion = () => [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const toWhatsApp = (source) => {
    const q = lastQuestion();
    trackWhatsAppOpen(pathname, source);
    trackWhatsAppClick(pathname, source);
    openWhatsApp(q ? `${t.whatsappPrefix}"${q}"` : "");
  };

  const ask = async (question, { suggested = false } = {}) => {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const history = [...messages.filter((m) => !m.local && !m.error), { role: "user", content: text }];
    const turn = history.filter((m) => m.role === "user").length;
    trackAssistantMessage(pathname, { suggested, turn });
    const id = `${Date.now()}`;
    update((prev) => [...prev, { role: "user", content: text }, { id, role: "assistant", content: "", pending: true }]);

    const setAnswer = (patch) => update((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const code = t.errors[body.code] ? body.code : "unavailable";
        trackAssistantUnavailable(pathname, code);
        setAnswer({ content: t.errors[code], pending: false, error: true, support: code !== "minute" });
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        setAnswer({ content: raw });
      }
      if (!parseAnswer(raw).text) {
        trackAssistantUnavailable(pathname, "unavailable");
        setAnswer({ content: t.errors.unavailable, pending: false, error: true, support: true });
        return;
      }
      setAnswer({ content: raw, pending: false });
    } catch {
      trackAssistantUnavailable(pathname, "unavailable");
      setAnswer({ content: t.errors.unavailable, pending: false, error: true, support: true });
    } finally {
      setBusy(false);
    }
  };

  const feedback = (message, rating) => {
    if (message.rated) return;
    trackAssistantFeedback(pathname, rating);
    const index = messages.indexOf(message);
    const question = [...messages.slice(0, index)].reverse().find((m) => m.role === "user")?.content ?? "";
    fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, page: pathname, question, answer: parseAnswer(message.content).text }),
    }).catch(() => {});
    if (rating === "up") {
      update((prev) => prev.map((m) => (m === message ? { ...m, rated: "up" } : m)));
      return;
    }
    const count = downCount + 1;
    setDownCount(count);
    update((prev) => [
      ...prev.map((m) => (m === message ? { ...m, rated: "down" } : m)),
      { role: "assistant", local: true, content: t.rephrase, support: count >= 2 },
    ]);
  };

  const reset = () => {
    setDownCount(0);
    update(() => []);
    inputRef.current?.focus();
  };

  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-label={t.name}
            className="flex h-[min(620px,calc(100dvh-10.5rem))] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xl shadow-black/20"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#17C6A3] to-[#0F918B] px-4 py-3 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0F918B]">
                <SparklesIcon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="truncate text-xs text-white/80">{t.status}</p>
              </div>
              {userTurns > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t.newChat}
                  title={t.newChat}
                  className="rounded-full p-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.66 5.66L4 15.5M4 20v-4.5h4.5" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => toWhatsApp("assistant_header")}
                aria-label={t.whatsappTitle}
                title={t.whatsappTitle}
                className="rounded-full p-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <WhatsAppGlyph className="h-5 w-5" />
              </button>
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

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4" aria-live="polite">
              <Bubble>{t.greeting}</Bubble>
              {userTurns === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s, { suggested: true })}
                      className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-[#0F918B] transition-colors hover:bg-teal-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => {
                if (m.role === "user") {
                  return (
                    <div key={i} className="flex justify-end">
                      <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-sm bg-[#0F918B] px-3 py-2 text-sm text-white">
                        {m.content}
                      </p>
                    </div>
                  );
                }
                const { text, codes } = m.error || m.local ? { text: m.content, codes: [] } : parseAnswer(m.content);
                const showSupport = m.support || codes.includes("DESTEK");
                const links = codes.filter((c) => c in ACTION_LINKS);
                return (
                  <div key={m.id ?? i} className="space-y-2">
                    <Bubble>
                      {text || (m.pending ? <TypingDots /> : "")}
                      {m.pending && text && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-gray-400 align-middle" />}
                    </Bubble>
                    {!m.pending && links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {links.map((code) => (
                          <Link
                            key={code}
                            href={ACTION_LINKS[code]}
                            onClick={() => trackAssistantAction(pathname, code)}
                            className="rounded-full bg-[#0F918B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B7A75]"
                          >
                            {t.actions[code]}
                          </Link>
                        ))}
                      </div>
                    )}
                    {!m.pending && showSupport && (
                      <div className="rounded-xl border border-green-200 bg-white p-3 text-sm text-gray-700">
                        <p>{t.supportCard}</p>
                        <button
                          type="button"
                          onClick={() => toWhatsApp("assistant_card")}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5b]"
                        >
                          <WhatsAppGlyph className="h-4 w-4" />
                          {t.supportButton}
                        </button>
                      </div>
                    )}
                    {!m.pending && !m.error && !m.local && text && (
                      <div className="flex items-center gap-1 pl-1 text-xs text-gray-400">
                        {m.rated ? (
                          m.rated === "up" && <span>{t.thanks}</span>
                        ) : (
                          <>
                            <button type="button" onClick={() => feedback(m, "up")} aria-label={t.helpful} title={t.helpful} className="rounded p-1 hover:bg-gray-200 hover:text-gray-600">
                              👍
                            </button>
                            <button type="button" onClick={() => feedback(m, "down")} aria-label={t.notHelpful} title={t.notHelpful} className="rounded p-1 hover:bg-gray-200 hover:text-gray-600">
                              👎
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {userTurns >= SUPPORT_HINT_AFTER && !busy && (
                <p className="pt-1 text-center text-xs text-gray-500">
                  {t.supportHint}{" "}
                  <button type="button" onClick={() => toWhatsApp("assistant_hint")} className="font-semibold text-[#0F918B] underline-offset-2 hover:underline">
                    {t.supportHintLink}
                  </button>
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-gray-100 bg-white px-3 pb-2 pt-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-gray-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-[#0F918B]/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label={t.send}
                  title={t.send}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#0F918B] text-white transition-opacity hover:bg-[#0B7A75] disabled:opacity-40"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1.5 flex justify-between gap-2 px-1 text-[11px] text-gray-400">
                <span>{t.disclaimer}</span>
                {input.length > MAX_CHARS - 100 && <span>{input.length}/{MAX_CHARS}</span>}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!open && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#17C6A3] to-[#0F918B] blur-lg animate-[assistant-halo_2.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-40"
          />
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? t.close : t.launcher}
          aria-expanded={open}
          title={open ? t.close : t.launcher}
          className={`group relative flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#17C6A3] to-[#0F918B] text-white ring-1 ring-white/40 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0F918B]/40 ${
            open
              ? "h-14 w-14 shadow-lg shadow-teal-900/25"
              : "h-14 pl-4 pr-5 sm:py-2.5 animate-[assistant-glow_2.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:shadow-lg"
          }`}
        >
          {open ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <>
              <SparklesIcon className="h-6 w-6 shrink-0 transition-transform group-hover:rotate-12" />
              <span className="text-base font-bold sm:hidden">AI</span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-bold">{t.launcherTitle}</span>
                <span className="block text-xs text-white/85">{t.launcherSub}</span>
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Bubble({ children }) {
  return (
    <div className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm leading-relaxed text-gray-800 shadow-sm">
      {children}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-hidden="true">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
