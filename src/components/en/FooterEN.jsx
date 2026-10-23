"use client";
import Link from "next/link";
import Image from "next/image";
import CookieSettingsLink from "../CookieSettingsLink";
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { SiCrunchbase } from "react-icons/si";

export default function FooterEN() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Image src="/logo.png" alt="RaporinAI" width={150} height={60} className="mb-4" />
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Next-generation AI-powered pharmacy report verification platform and pharmacies&apos; digital transformation partner.
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
              <a href="https://www.crunchbase.com/organization/raporinai" target="_blank" rel="noopener noreferrer" aria-label="RaporinAI on Crunchbase" className="w-10 h-10 bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white rounded-full flex items-center justify-center transition-all">
                <SiCrunchbase size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/en/about" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/en#features" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/en#pricing" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/en#contact" className="text-gray-600 hover:text-teal-600 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
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

          {/* Partnerships */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Partnerships</h3>
            <div className="flex items-center gap-4">
              <Image
                src="/acc-ing-26.png"
                alt="ITU Cekirdek Incubation"
                width={160}
                height={64}
                className="w-auto h-14 object-contain"
              />
              <a href="https://g4a.bayer.com.tr/girisimler" target="_blank" rel="noopener noreferrer" aria-label="View RaporinAI on the official Bayer G4A website">
                <Image
                  src="/bayerG4A.png"
                  alt="Bayer G4A Program"
                  width={160}
                  height={64}
                  className="w-auto h-14 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* iyzico ödeme logoları — iyzico üye işyeri başvurusu için zorunlu */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex justify-center">
          <Image
            src="/payment/iyzico-logo-band.svg"
            alt="Pay with iyzico, Mastercard, Visa, American Express, Troy"
            width={429}
            height={32}
            unoptimized
            className="h-6 w-auto sm:h-8"
          />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {currentYear} RaporinAI. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <Link href="/kvkk" className="text-gray-600 hover:text-teal-600 transition-colors">
                Legal &amp; KVKK
              </Link>
              <Link href="/kvkk/kullanim-kosullari-ve-uyelik-sozlesmesi" className="text-gray-600 hover:text-teal-600 transition-colors">
                Terms &amp; Membership Agreement
              </Link>
              <Link href="/kvkk/cerez-politikasi" className="text-gray-600 hover:text-teal-600 transition-colors">
                Cookie Policy
              </Link>
              <CookieSettingsLink label="Cookie Settings" className="no-underline hover:underline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
