import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

// Ana sayfada menünün hemen altında, uçtan uca uzanan ve kaydırınca menüye yapışık kalan lansman indirimi bandı; renkleri fiyat kartlarındaki
// "Lansmana özel" rozetiyle aynı.
export default function LaunchBanner() {
  return (
    <Link
      href="/#fiyatlandirma"
      className="group sticky top-20 z-40 -mt-8 block border-y border-[#FF6B3D]/25 bg-gradient-to-r from-[#FFF4EE] via-white to-[#FFE4E6] transition hover:from-[#FFEDE3] hover:to-[#FFDDE1]"
    >
      <div className="mx-auto flex max-w-[1536px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2.5 text-center sm:px-6 lg:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF6B3D] to-[#E8344E] px-3 py-1 text-[11px] font-extrabold tracking-[.12em] text-white uppercase shadow-sm shadow-[#FF6B3D]/30">
          <Rocket aria-hidden="true" size={13} /> Lansmana özel
        </span>
        <span className="text-sm text-[#9A2B1E]">
          Sınırsız pakette <strong className="font-extrabold text-[#E8344E]">%40 indirim</strong> fırsatını kaçırmayın
        </span>
        {/* Mobilde bant yapışık kaldığı için kısa tutulur; bandın tamamı zaten fiyatlandırmaya götürür. */}
        <span className="hidden items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-[#C2410C] ring-1 ring-[#FF6B3D]/25 transition sm:inline-flex group-hover:bg-[#FF6B3D] group-hover:text-white group-hover:ring-[#FF6B3D]">
          Paketleri incele
          <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
