"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Image from "next/image";
import Link from "next/link";

const CHECKOUT_PATHS = ["/hesabim/satin-al", "/hesabim/yukselt", "/hesabim/ek-kredi"];

// Form sayfalarında sabit maskot içeriğin üstüne biner.
const HIDE_MASCOT_PATHS = ["/", "/kayit", "/giris", "/giris/masaustu", "/sifremi-unuttum", "/hesabim"];

export default function LayoutWrapper() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");

  // Ödeme sayfaları (paket, yükseltme, ek kredi) dikkat dağıtmayan kendi başlığını kullanır (SaaS checkout düzeni).
  if (isEnglish || CHECKOUT_PATHS.some((path) => pathname.startsWith(path))) return null;

  return (
    <>
      {/* ✅ Navbar tüm sayfalarda görünür */}
      <Navbar />

      {/* Ana sayfanın ürün vitrini ve form sayfaları üzerinde sabit maskot gösterilmez. */}
      {!HIDE_MASCOT_PATHS.includes(pathname) && (
      <div className="fixed right-4 lg:right-8 top-24 z-40 hidden lg:block">
        <Link href="/kayit" className="block cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="animate-float">
            <Image
              src="/raporin-mascot.png"
              alt="RaporinAI Maskot"
              width={112}
              height={112}
              className="w-28 h-28 drop-shadow-2xl"
              loading="lazy"
              sizes="112px"
            />
          </div>
        </Link>
      </div>
      )}
    </>
  );
}
