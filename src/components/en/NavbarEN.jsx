"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function NavbarEN() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-[#EAF9F5]/60 shadow-sm">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/en" className="flex items-center gap-2">
          <Image src="/logo.png" alt="RaporinAI" width={200} height={60} priority />
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8 text-gray-700 font-medium">
          <Link href="/en" className="hover:text-[#0F918B]">Home</Link>
          <Link href="/en/about" className="hover:text-[#0F918B]">About</Link>
          <Link href="/en#features" className="hover:text-[#0F918B]">Features</Link>
          <Link href="/en#pricing" className="hover:text-[#0F918B]">Pricing</Link>
          <Link href="/en#contact" className="hover:text-[#0F918B]">Contact</Link>
        </div>

        {/* CTA (desktop) */}
        <div className="hidden lg:block">
          <Link href="/en/download">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200"></div>

              <div className="relative flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 shadow-md border border-white/20">
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="text-xs font-bold text-white tracking-wide">
                    Download App
                  </span>
                  <span className="text-xs font-extrabold text-yellow-100 uppercase tracking-widest drop-shadow-md whitespace-nowrap bg-white/10 px-1.5 py-0.5 rounded-sm">
                    ✨ FREE ACCOUNT
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100 flex flex-col items-center gap-4 py-4">
          <Link href="/en" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/en/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/en#features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/en#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/en#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/en/download" onClick={() => setMenuOpen(false)}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer mt-2"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full blur opacity-20 transition duration-200"></div>
              <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 shadow-md border border-white/20">
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="text-sm font-bold text-white tracking-wide">Download App</span>
                  <span className="text-xs font-extrabold text-yellow-100 uppercase tracking-widest drop-shadow-md whitespace-nowrap bg-white/10 px-1.5 py-0.5 rounded-sm">✨ FREE ACCOUNT</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      )}
    </nav>
  );
}
