"use client";

import Link from "next/link";
import { trackDownload } from "../../lib/analytics";
import { useSessionFlag } from "../../lib/auth/useSessionFlag";
import { DESKTOP_VERSION, DOWNLOAD_URL } from "../../lib/download";
import WelcomeOfferBadge from "../../components/billing/WelcomeOfferBadge";
import { formatTL } from "../../lib/billing/catalog";
import { useWelcomeOffer } from "../../lib/billing/useWelcomeOffer";

const primaryButton =
  "mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#17C6A3] to-[#0F918B] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

// İndirme hesap oluşturduktan sonra yapılır. Sunucuda (ve arama motorlarında) giriş
// yapılmamış hali render edilir; oturumu olan ziyaretçi doğrudan indirme butonunu görür.
export default function DownloadPage() {
  const loggedIn = useSessionFlag();
  const offer = useWelcomeOffer();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F8FBFF] via-white to-[#E8FFFB] px-4 py-24">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-[#D6F8F2] bg-white p-10 text-center shadow-lg sm:p-12">

        <span className="inline-block rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 ring-1 ring-amber-200">
          Şimdi tamamen ücretsiz
        </span>

        <h1 className="mt-4 text-3xl font-bold text-[#0F918B] sm:text-4xl">
          RaporinAI&apos;ı İndirin
        </h1>

        <p className="mt-3 text-sm font-medium text-gray-500">
          Eczaneler için yapay zeka destekli reçete ve rapor kontrol programı
        </p>

        {loggedIn ? (
          <>
            <p className="mt-5 leading-relaxed text-gray-600">
              Masaüstü sürümünü indirin ve hesabınızla giriş yaparak reçete ve raporlarınızı analiz edin.
            </p>
            <a href={DOWNLOAD_URL} onClick={() => trackDownload(DOWNLOAD_URL)} className={primaryButton}>
              <span className="text-xl">💻</span>
              Hemen İndir
            </a>
          </>
        ) : (
          <>
            <p className="mt-5 leading-relaxed text-gray-600">
              Önce ücretsiz hesabınızı oluşturun; e-postanızı doğruladıktan sonra masaüstü
              uygulamasını hesabım sayfanızdan indirebilirsiniz
              {offer?.credits === 0 ? (
                "."
              ) : (
                <>
                  .{" "}
                  {offer?.credits > 0 ? (
                    <strong className="text-gray-800">Üstelik {formatTL(offer.credits)} kredi hediye!</strong>
                  ) : (
                    "Ücretsiz krediyle hemen deneyin."
                  )}
                </>
              )}
            </p>
            <WelcomeOfferBadge className="mt-4 border border-teal-100" />
            <Link href="/kayit" className={primaryButton}>
              Ücretsiz hesap oluştur
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Zaten hesabınız var mı?{" "}
              <Link href="/giris?next=/hesabim" className="font-semibold text-teal-700 hover:underline">
                Giriş yapın
              </Link>
            </p>
          </>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Windows 10 / 11 · Sürüm {DESKTOP_VERSION}
          {offer?.credits === 0
            ? " · Kredi kartı gerekmez"
            : ` · ${offer?.credits > 0 ? `${formatTL(offer.credits)} kredi hediye` : "Ücretsiz krediyle deneyin"} · Kredi kartı gerekmez`}
        </p>

        <p className="mt-8 border-t border-gray-100 pt-6 text-sm text-gray-500">
          Kurulum tamamlandıktan sonra hesabınıza giriş yaparak RaporinAI&apos;ın
          tüm özelliklerinden yararlanabilirsiniz.
        </p>
      </div>
    </main>
  );
}
