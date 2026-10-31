"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MonitorSmartphone } from "lucide-react";
import AuthShell, { AuthLink } from "../../../components/auth/AuthShell";
import { Alert } from "../../../components/auth/FormControls";
import { trackLogin } from "../../../lib/analytics";

// Masaüstü uygulamasındaki "Web'de düzenle" butonları buraya gelir:
//   /giris/masaustu?bolum=eczane#code=<tek kullanımlık kod>
// Kod # kısmında taşınır: tarayıcı bunu sunucuya, loglara ve Referer başlığına göndermez.
const SECTIONS = ["genel", "paket", "kredi", "paketler", "kisisel", "guvenlik", "eczane", "ekip"];
// Hesabım dışında açılan sayfalar (masaüstündeki "Paketi yükselt" ve "Ek kredi al" düğmeleri) ve beta indirimi
// bandındaki "İndirimli paketimi seç" (Hesabım indirimli pakete kaydırır)
const PAGES = { yukselt: "/hesabim/yukselt", "ek-kredi": "/hesabim/ek-kredi", "beta-indirimi": "/hesabim#beta-indirimi" };

function readHandoff() {
  const code = new URLSearchParams(window.location.hash.slice(1)).get("code");
  const section = new URLSearchParams(window.location.search).get("bolum");
  const target = PAGES[section] ?? `/hesabim#${SECTIONS.includes(section) ? section : "genel"}`;
  return { code, target };
}

/** Kodu oturuma çevirir; sonuç { ok: true } ya da { ok: false, message }. */
async function exchangeCode(code) {
  if (!code) return { ok: false, message: "Bağlantı eksik. Lütfen masaüstü uygulamasından tekrar deneyin." };
  try {
    const response = await fetch("/api/session/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (response.ok) return { ok: true };
    const body = await response.json().catch(() => null);
    return { ok: false, message: body?.message || "Giriş yapılamadı." };
  } catch {
    return { ok: false, message: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." };
  }
}

export default function DesktopHandoffPage() {
  const router = useRouter();
  const [error, setError] = useState(null); // { message, target }
  // React geliştirme modunda effect iki kez çalışır; kod tek kullanımlık olduğu için yalnızca bir kez gönderilir.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const { code, target } = readHandoff();
    // Kodu hemen adres çubuğundan ve tarayıcı geçmişinden sil.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    exchangeCode(code).then((result) => {
      if (!result.ok) {
        setError({ message: result.message, target });
        return;
      }
      trackLogin();
      router.replace(target);
      router.refresh();
    });
  }, [router]);

  if (!error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
        <p className="text-slate-600" role="status">Hesabınıza bağlanılıyor…</p>
      </main>
    );
  }

  return (
    <AuthShell title="Otomatik giriş yapılamadı" footer={<>Hesabınız yok mu? <AuthLink href="/kayit">Ücretsiz kayıt olun</AuthLink></>}>
      <div className="space-y-5">
        <Alert>{error.message}</Alert>
        <p className="flex items-start gap-3 text-sm text-slate-600">
          <MonitorSmartphone size={20} className="mt-0.5 shrink-0 text-teal-600" aria-hidden="true" />
          Masaüstü uygulamasındaki butona tekrar basabilir ya da e-posta adresiniz ve şifrenizle giriş yapabilirsiniz.
        </p>
        <a
          href={`/giris?next=${encodeURIComponent(error.target)}`}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-6 py-3 font-semibold text-white shadow-lg shadow-teal-700/10 hover:from-teal-800 hover:to-teal-700"
        >
          Şifreyle giriş yap
        </a>
      </div>
    </AuthShell>
  );
}
