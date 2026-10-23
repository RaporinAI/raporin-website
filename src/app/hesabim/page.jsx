"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AccountDashboard from "../../components/account/AccountDashboard";

export default function AccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session/me", { cache: "no-store" })
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 401) {
          // Giriş sonrası aynı yere dönülür (ör. fiyatlandırmadan gelen ?paket=…#paket).
          const back = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          router.replace(`/giris?next=${encodeURIComponent(back)}`);
          return;
        }
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        if (cancelled) return;
        // Eski "?paket=" bağlantıları ödeme sayfasına gider. Kayıt/giriş sonrası saklanan seçim ise
        // genel bakışta "Satın almayı tamamla" kartı olarak gösterilir.
        const requested = new URLSearchParams(window.location.search).get("paket");
        if (requested) {
          router.replace(`/hesabim/satin-al?paket=${requested}`);
          return;
        }
        setAccount(data);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/session/logout", { method: "POST" }).catch(() => {});
    router.replace("/");
    router.refresh();
  };

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 pt-20 text-center text-slate-600">
        Hesap bilgileri şu anda alınamadı. Lütfen sayfayı yenileyin.
      </main>
    );
  }

  if (!account) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-label="Yükleniyor" />
      </main>
    );
  }

  return <AccountDashboard account={account} setAccount={setAccount} onLogout={logout} loggingOut={loggingOut} />;
}
