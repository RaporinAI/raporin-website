import Image from "next/image";
import Link from "next/link";
import { Layers, ShieldCheck, Sparkles, Users } from "lucide-react";

// Masaüstü uygulamasının giriş ekranıyla (auth-view.fxml) aynı içerik ve görsel dil.
const features = [
  {
    icon: Sparkles,
    title: "Yapay Zeka ile Akıllı Analiz",
    text: "Gelişmiş algoritmalar ile reçeteleri hızlı ve doğru analiz edin.",
  },
  {
    icon: ShieldCheck,
    title: "SUT Uyumlu ve Güvenilir",
    text: "Güncel mevzuata uygun kontroller ve uyarılar ile hatasız süreç yönetin.",
  },
  {
    icon: Layers,
    title: "Toplu Reçete Analizi",
    text: "Çok sayıda reçeteyi tek seferde analiz edin, sonuçları topluca görün.",
  },
  {
    icon: Users,
    title: "Çoklu Kullanıcı Desteği",
    text: "Ekip arkadaşlarınızla roller tanımlayın, iş birliğini güçlendirin.",
  },
];

/**
 * Kayıt, giriş ve şifre sayfalarının ortak iskeleti: tek kart içinde solda marka paneli, sağda form.
 * betaBanner: Navbar'da beta bandı (h-8) gösterilen sayfalarda üst boşluğu o kadar artırır.
 */
export default function AuthShell({ title, subtitle, children, footer, betaBanner = false }) {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-[#f2fbf8] via-white to-[#f4fbfd] px-4 pb-16 ${betaBanner ? "pt-36 sm:pt-40" : "pt-28 sm:pt-32"}`}>
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[20px] border border-[#e6edf1] bg-white shadow-[0_10px_34px_rgba(15,23,42,0.10)] lg:grid-cols-[420px_1fr]">
        <aside className="hidden flex-col border-r border-teal-600/10 bg-gradient-to-br from-[#ecfdf6] via-[#d8f4ef] to-[#e9f7fb] px-11 pt-10 lg:flex">
          <span className="self-start rounded-full bg-white/85 px-3 py-1 text-xs font-bold tracking-wide text-teal-700 shadow-[0_2px_8px_rgba(13,148,136,0.14)]">
            Beta süresince ücretsiz
          </span>

          <p className="mt-6 text-[28px] font-extrabold leading-tight text-slate-900">
            Yapay Zeka ile
            <br />
            Reçete Analizi
          </p>
          <p className="mt-3 max-w-[316px] text-sm leading-relaxed text-[#47606b]">
            SUT uyumlu, hızlı ve güvenilir reçete analizi ile eczane iş akışınızı kolaylaştırın.
          </p>

          <ul className="mt-6 space-y-3.5">
            {features.map(({ icon: Icon, title: featureTitle, text }) => (
              <li key={featureTitle} className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/85 text-teal-600 shadow-[0_2px_8px_rgba(13,148,136,0.14)]">
                  <Icon aria-hidden="true" size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{featureTitle}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-[#5b7280]">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="-mx-11 mt-auto pt-6">
            <Image
              src="/auth-illustration.webp"
              alt=""
              width={840}
              height={570}
              sizes="420px"
              className="h-auto w-full opacity-95"
              priority
            />
          </div>
        </aside>

        <section className="w-full p-6 sm:p-10 lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-xl">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">{footer}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

export function AuthLink({ href, children }) {
  return (
    <Link href={href} className="font-semibold text-teal-700 underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}
