import Image from "next/image";
import Link from "next/link";
import NavbarEN from "../../components/en/NavbarEN";
import StructuredDataEN from "../../components/en/StructuredDataEN";

export const metadata = {
  metadataBase: new URL('https://raporin.com'),
  title: {
    // `absolute`, kök layout'un "%s | RaporinAI" şablonunu devre dışı bırakır;
    // aksi hâlde başlık "... Platform | RaporinAI" şeklinde markayı iki kez taşır.
    absolute: "RaporinAI — FREE AI-Powered Pharmacy Report Verification Platform",
    template: "%s | RaporinAI"
  },
  description:
    "RaporinAI is an AI-powered pharmacy report verification platform with insurance portal integration. Import a whole claim period, analyze every reported medicine in one click, and prevent insurance deductions before you submit. Free during beta.",
  keywords: [
    "Pharmacy Report Verification",
    "insurance portal integration",
    "bulk prescription verification",
    "bulk report analysis",
    "prescription dosage check",
    "AI Report Analysis",
    "Pharmacy AI Software",
    "Insurance Report Control",
    "Pharmacy Report",
    "Insurance claim analysis",
    "pharmacy software",
    "AI report analysis",
    "pharmacy automation",
    "report digitization",
    "insurance report management",
    "pharmacy AI solution",
    "RaporinAI",
    "pharmacy report system",
    "Pharmacy AI",
    "AI Pharmacy",
    "Healthcare AI",
    "Insurance Report AI",
    "AI for Pharmacies",
    "pharmacy insurance deduction",
    "pharmacy AI program",
    "insurance report verification software",
    "regulatory compliance verification",
    "pharmacy insurance deduction prevention",
    "insurance deduction analysis",
    "AI for pharmacists"
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
    locale: "en_US",
    url: "https://raporin.com/en",
    title: "RaporinAI — FREE AI-Powered Pharmacy Report Verification Platform",
    description:
      "Import a whole claim period from the insurance portal and analyze every reported medicine in one click. Detect report errors in seconds and prevent insurance deductions.",
    siteName: "RaporinAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RaporinAI - AI-Powered Pharmacy Report Verification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RaporinAI — FREE AI-Powered Pharmacy Report Verification Platform",
    description:
      "Import a whole claim period from the insurance portal and analyze every reported medicine in one click.",
    images: ["/og-image.png"],
    creator: "@raporinai",
  },
  // Yabancı kullanıcı hedeflenmiyor; İngilizce sayfalar erişilebilir kalır ama indekslenmez.
  // Alt sayfalar (/en/about, /en/download) bu ayarı devralır.
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://raporin.com/en',
  },
};

export default function EnLayout({ children }) {
  return (
    <div lang="en">
      {/* English Navbar */}
      <NavbarEN />

      {/* Mascot */}
      <div className="fixed right-4 lg:right-8 top-24 z-40 hidden lg:block">
        <Link href="/en/download" className="block cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="animate-float">
            <Image
              src="/raporin-mascot.png"
              alt="RaporinAI Mascot"
              width={112}
              height={112}
              className="w-28 h-28 drop-shadow-2xl"
              loading="lazy"
              sizes="112px"
            />
          </div>
        </Link>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
