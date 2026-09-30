import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "../components/StructuredData";
import LayoutWrapper from "../components/LayoutWrapper";
import CookieConsent from "../components/CookieConsent";
import { GTM_ID } from "../lib/analytics";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "../lib/cookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  metadataBase: new URL('https://raporin.com'),
  title: {
    default: "RaporinAI | Yapay Zeka Destekli Eczane Reçete ve Rapor Kontrolü",
    template: "%s | RaporinAI"
  },
  description:
    "RaporinAI: yapay zeka destekli eczane reçete ve rapor kontrol programı. Medula aktarımı, toplu analiz ve SUT kriterlerine göre kontrol. Beta süresince ücretsiz.",
  // Google keywords meta etiketini yok sayar; kısa ve odaklı tutuyoruz.
  keywords: [
    "Eczane Reçete ve Rapor Kontrol Programı",
    "Eczane Rapor Kontrol Programı",
    "Medula rapor kontrol programı",
    "SGK rapor kontrol programı",
    "toplu reçete kontrolü",
    "SUT uyum kontrolü",
    "eczane SGK kesinti önleme",
    "RaporinAI"
  ],
  authors: [{ name: "RaporinAI" }],
  creator: "RaporinAI",
  publisher: "RaporinAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://raporin.com",
    title: "RaporinAI — Yapay Zeka Destekli Eczane Reçete ve Rapor Kontrolü",
    description:
      "Medula aktarımı, PDF ile rapor kontrolü ve toplu reçete analizi. SUT kriterlerine göre açıklamalı sonuçlar; beta süresince ücretsiz.",
    siteName: "RaporinAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RaporinAI - Eczane Reçete ve Rapor Kontrol Programı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RaporinAI — Yapay Zeka Destekli Eczane Reçete ve Rapor Kontrolü",
    description:
      "Medula’dan reçete aktarın, raporlu ilaçları toplu analiz edin ve SUT kriterlerine göre sonuçları inceleyin. Beta süresince ücretsiz.",
    images: ["/og-image.png"],
    creator: "@raporinai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://raporin.com',
  },
  // Doğrulama kodları ortam değişkeninden gelir; tanımlı değilse etiket hiç basılmaz.
  // Şablon değerli bir meta etiketi doğrulamayı bozar (bkz. .env.example).
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
      ? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*
          Google Consent Mode v2 (advanced) — varsayılan olarak tüm rıza sinyalleri "denied".
          Bu script GTM'den önce çalışmalı. Daha önce kaydedilmiş rıza varsa GTM yüklenmeden
          uygulanır; yeni seçimleri CookieConsent bileşeni "consent update" ile iletir.
          Rıza yokken Google etiketleri çerez yazmaz, yalnızca çerezsiz sinyal gönderir.
        */}
        <script
          id="google-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                personalization_storage: 'denied',
                security_storage: 'granted',
                wait_for_update: 500
              });
              gtag('set', 'ads_data_redaction', true);
              gtag('set', 'url_passthrough', true);

              // Kategori eşlemesi src/lib/cookieConsent.js > applyConsentToGtag ile aynı olmalı.
              try {
                var saved = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}'));
                if (saved && saved.version === ${CONSENT_VERSION} && saved.categories) {
                  var c = saved.categories;
                  gtag('consent', 'update', {
                    ad_storage: c.marketing ? 'granted' : 'denied',
                    ad_user_data: c.marketing ? 'granted' : 'denied',
                    ad_personalization: c.marketing ? 'granted' : 'denied',
                    analytics_storage: c.performance ? 'granted' : 'denied',
                    functionality_storage: c.functional ? 'granted' : 'denied',
                    personalization_storage: c.functional ? 'granted' : 'denied',
                    security_storage: 'granted'
                  });
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Google Tag Manager — GA4, Google Ads ve Meta etiketleri GTM panelinden yönetilir */}
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <LayoutWrapper />

        <div>
          {children}
        </div>

        {/* Çerez bandı + çerez yönetim paneli (TR ve EN tüm sayfalarda) */}
        <CookieConsent />
      </body>
    </html>
  );
}
