"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell, { AuthLink } from "../../components/auth/AuthShell";
import { Alert, Field, PasswordInput, SubmitButton, TextInput } from "../../components/auth/FormControls";
import ResendVerification from "../../components/auth/ResendVerification";
import { hasSessionFlag } from "../../lib/auth/sessionFlag";
import { trackLogin } from "../../lib/analytics";
import { usePendingPurchase } from "../../lib/billing/pendingPurchase";
import SelectedPlanNotice from "../../components/billing/SelectedPlanNotice";

const EMAIL_NOT_VERIFIED = "AUTH_008";

/** ?next= yalnızca site içi bir yola izin verir (açık yönlendirme olmasın). */
function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  // Paket seçilip gelindiyse de önce Hesabım açılır; seçilen paket orada "Satın almayı tamamla" kartıyla durur.
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/hesabim";
}

export default function LoginPage() {
  const router = useRouter();
  const pendingPurchase = usePendingPurchase();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // { code, message }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hasSessionFlag()) router.replace(nextPath());
  }, [router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError({ message: "E-posta (veya kullanıcı adı) ve şifrenizi girin." });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (response.ok) {
        trackLogin();
        router.replace(nextPath());
        router.refresh();
        return;
      }
      const body = await response.json().catch(() => null);
      setError({ code: body?.errorCode, message: body?.message || "Giriş yapılamadı." });
    } catch {
      setError({ message: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin." });
    } finally {
      setSubmitting(false);
    }
  };

  const identifierIsEmail = username.includes("@");

  return (
    <AuthShell
      title="Giriş yapın"
      subtitle={
        pendingPurchase
          ? "Giriş yaptıktan sonra seçtiğiniz paketi hesabınızdan satın alabilirsiniz."
          : "Hesabınıza giriş yaparak üyelik bilgilerinizi görün ve uygulamayı indirin."
      }
      footer={<>Hesabınız yok mu? <AuthLink href="/kayit">Ücretsiz kayıt olun</AuthLink></>}
    >
      <SelectedPlanNotice />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && (
          <Alert>
            <p>{error.message}</p>
            {error.code === EMAIL_NOT_VERIFIED && (
              <div className="mt-2">
                {identifierIsEmail ? (
                  <ResendVerification email={username.trim()} />
                ) : (
                  <p className="text-slate-500">Aktivasyon linkini tekrar almak için e-posta adresinizle giriş yapmayı deneyin.</p>
                )}
              </div>
            )}
          </Alert>
        )}
        <Field id="username" label="E-posta veya kullanıcı adı">
          <TextInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            autoFocus
          />
        </Field>
        <div>
          <Field id="password" label="Şifre">
            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          <div className="mt-2 text-right">
            <AuthLink href="/sifremi-unuttum">Şifremi unuttum</AuthLink>
          </div>
        </div>
        <SubmitButton loading={submitting}>Giriş yap</SubmitButton>
      </form>
    </AuthShell>
  );
}
