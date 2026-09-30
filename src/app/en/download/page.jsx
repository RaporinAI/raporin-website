"use client";

import Image from "next/image";
import { trackDownload } from "../../../lib/analytics";

const DOWNLOAD_URL = "https://downloads.raporin.com/RaporinAI-1.1.25.msi";

export default function DownloadPageEN() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-[#F8FBFF] via-white to-[#E8FFFB]">
      <div className="absolute top-32 left-10 w-72 h-72 bg-[#17C6A3]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-16 right-10 w-96 h-96 bg-[#0F918B]/20 rounded-full blur-3xl animate-pulse" />

      <div className="bg-gradient-to-br from-[#E6FFFA] via-[#F4FFFE] to-[#CCF5FF] p-10 rounded-3xl shadow-lg text-center max-w-3xl mx-auto border border-[#D6F8F2]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Raporin AI Logo"
            width={80}
            height={80}
            className="drop-shadow-sm"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-[#0F918B]">
            Download the App
          </h1>
          <span className="inline-block bg-gradient-to-r from-orange-400 to-amber-400 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-md transform hover:scale-105 transition-transform cursor-default tracking-widest border border-white/50">
            ✨ COMPLETELY FREE NOW
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-10 leading-relaxed">
          Download the RaporinAI desktop application to securely analyze your insurance reports.
          All analyses are performed securely on your device.
        </p>

        {/* Download Button */}
        <a
          href={DOWNLOAD_URL}
          onClick={() => trackDownload(DOWNLOAD_URL)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#17C6A3] to-[#0F918B] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
        >
          <span className="text-xl">💻</span>
          <span className="text-lg">Download Now</span>
        </a>

        {/* Footer note */}
        <p className="mt-10 text-sm text-gray-500">
          After installation is complete, log in to your account
          to access all features of RaporinAI.
        </p>
      </div>
    </main>
  );
}
