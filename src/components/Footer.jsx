"use client";
import Link from "next/link";
import Image from "next/image";
import CookieSettingsLink from "./CookieSettingsLink";
import { solutionPages, solutionSlugs } from "../lib/solutionPages";
import { LEGAL_DOCUMENTS } from "./legal/documents";
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-1">
            <Image src="/logo.png" alt="RaporinAI" width={150} height={60} className="mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Yapay zeka destekli yeni nesil eczane reçete ve rapor kontrol programı, eczanelerin dijital dönüşüm partneri.
            </p>
            <div className="flex gap-3">
              <a href="https://x.com/raporinai?s=11&t=8Lo_CQSYIVbXaj_1yPJAeA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white rounded-full flex items-center justify-center transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="https://www.linkedin.com/company/raporinai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white rounded-full flex items-center justify-center transition-all">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.instagram.com/raporinai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white rounded-full flex items-center justify-center transition-all">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/#ozellikler" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link href="/#fiyatlandirma" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#iletisim" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FaEnvelope className="text-teal-600 mt-1 flex-shrink-0" />
                <a href="mailto:info@raporin.com" className="hover:text-teal-600 transition-colors">
                  info@raporin.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FaBuilding className="text-teal-600 mt-1 flex-shrink-0" />
                <span>KairoLabs Sağlık Teknolojileri Anonim Şirketi</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-teal-600 mt-1 flex-shrink-0" />
                <span>Metropol İstanbul Sitesi, ATAŞEHİR/İSTANBUL</span>
              </li>
            </ul>
          </div>

          {/* İş Birlikleri */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">İş Birlikleri</h3>
            <div className="w-fit">
              <Image
                src="/acc-ing-26.png"
                alt="İTÜ Çekirdek"
                width={250}
                height={100}
                className="w-auto h-20 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Çözümler — anahtar kelime sayfalarına iç bağlantı */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="font-bold text-gray-900 mb-4">Çözümler</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {solutionSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
                >
                  {solutionPages[slug].navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hukuki Metinler — Çözümler bloğuyla aynı ızgara düzeni */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="font-bold text-gray-900 mb-4">Hukuki Metinler</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {LEGAL_DOCUMENTS.map((doc) => (
              <li key={doc.href}>
                <Link
                  href={doc.href}
                  className="text-gray-600 hover:text-teal-600 transition-colors text-sm"
                >
                  {doc.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* iyzico ödeme logoları — iyzico üye işyeri başvurusu için zorunlu */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex justify-center">
          <Image
            src="/payment/iyzico-logo-band.svg"
            alt="iyzico ile Öde, Mastercard, Visa, American Express, Troy"
            width={429}
            height={32}
            unoptimized
            className="h-6 w-auto sm:h-8"
          />
        </div>

        {/* Alt Bölüm */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {currentYear} RaporinAI. Tüm hakları saklıdır.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <Link href="/kvkk" className="text-gray-600 hover:text-teal-600 transition-colors">
                KVKK ve Hukuki Metinler
              </Link>
              <CookieSettingsLink label="Çerez Ayarları" className="no-underline hover:underline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
