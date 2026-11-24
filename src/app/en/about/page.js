"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaLightbulb, FaBrain, FaRocket, FaChartLine, FaLinkedin, FaExternalLinkAlt, FaNewspaper } from "react-icons/fa";
import FooterEN from "../../../components/en/FooterEN";

export default function AboutPageEN() {
  const teamMembers = [
    {
      name: "Barış Keskinkılınç",
      role: "Co-Founder & CEO",
      initials: "BK",
      description: "Leads the company’s strategy, operations, and growth.",
      linkedin: "https://www.linkedin.com/in/bar%C4%B1%C5%9F-keskink%C4%B1l%C4%B1n%C3%A7-546a78199/"
    },
    {
      name: "Fırat Ülgay",
      role: "Co-Founder & CTO",
      initials: "FÜ",
      description: "Leads product development, artificial intelligence, and technology.",
      linkedin: "https://www.linkedin.com/in/f%C4%B1rat-%C3%BClgay-735983124/"
    }
  ];

  const pressItems = [
    {
      source: "The Disruptor Magazine",
      title: "Meet the 6 Startups Selected for Bayer’s 2026 G4A Accelerator Program",
      language: "English",
      url: "https://thedisruptormag.com/meet-the-6-startups-selected-for-bayers-2026-g4a-accelerator-program/"
    },
    {
      source: "eGirişim",
      title: "Startups Selected for the 9th Bayer G4A Accelerator Cohort",
      language: "Turkish",
      url: "https://egirisim.com/2026/03/06/bayerin-g4a-girisim-hizlandirma-programinin-9-donemine-secilen-girisimler/"
    },
    {
      source: "Actual Medicine",
      title: "Startups Selected for Bayer’s G4A Accelerator Program Announced",
      language: "Turkish",
      url: "https://www.actualmedicine.com.tr/sayfa.asp?Sayfa=Haber&Detay=513"
    }
  ];


  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      {/* Hero & Team */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8FFFB] via-[#F9FFFD] to-white pt-32 pb-20 px-6 lg:px-20 text-gray-900">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#17C6A3]/15 blur-3xl" />
        <div className="absolute -bottom-44 -left-24 w-[28rem] h-[28rem] rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_#0F918B_1px,_transparent_1px)] bg-[length:24px_24px]" />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex h-full flex-col"
          >
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Our Team</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Meet the founders</h1>
              <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-gray-600">
                Pharmacy expertise and engineering leadership, working as one team.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-1 divide-y divide-teal-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
                  className="group flex min-h-[300px] flex-col items-center px-6 py-10 text-center sm:px-10"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0F918B] to-[#17C6A3] text-xl font-extrabold text-white shadow-md">
                    {member.initials}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                    Founding Team
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900">{member.name}</h3>
                  <p className="mt-1.5 text-sm font-semibold text-teal-700">{member.role}</p>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">{member.description}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 pt-8 text-sm font-semibold text-[#0A66C2] transition-colors hover:text-[#084d92] hover:underline"
                    aria-label={`View ${member.name} on LinkedIn`}
                  >
                    <FaLinkedin size={18} />
                    View LinkedIn Profile
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-teal-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <FaLightbulb size={40} className="text-amber-500" />
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>RaporinAI</strong> was born to solve one of the biggest daily challenges pharmacists face: 
                <strong className="text-teal-600"> financial losses from insurance report verification errors.</strong>
              </p>
              <p>
                Pharmacists who have to manually check dozens of reports every day can face thousands of dollars in 
                insurance deductions due to a small error. Regulatory non-compliance, missing information, incorrect ICD codes... 
                These issues lead to both time waste and significant financial losses.
              </p>
              <p>
                With our <strong>team of pharmacists and software experts</strong>, we developed a permanent solution to this problem. 
                Thanks to AI technology, we analyze reports in seconds and detect potential errors in advance.
              </p>
              <p className="text-teal-700 font-semibold">
                Our goal is simple: Make pharmacists&apos; work easier, prevent financial losses, and lead digital transformation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Technology */}
      <section className="py-16 px-6 lg:px-20 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <FaBrain size={50} className="text-teal-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our AI Technology</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RaporinAI combines insurance portal integration with advanced Optical Character Recognition (OCR) and Natural Language Processing (NLP) technologies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-teal-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaRocket className="text-teal-600" />
                How It Works
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">1</span>
                  <span><strong>Portal Sign-In:</strong> You sign in to the insurance portal with your own credentials, inside the application</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">2</span>
                  <span><strong>Prescription Import:</strong> Pick an invoice type and claim period; that period&apos;s prescriptions are imported</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">3</span>
                  <span><strong>Single or Bulk Analysis:</strong> Check one medicine, or send the whole period to analysis with one click</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">4</span>
                  <span><strong>Regulatory &amp; Dosage Check:</strong> ICD codes, diagnoses, regulatory compliance and prescription-versus-report dosage are verified</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">5</span>
                  <span><strong>Results Report:</strong> Non-compliant medicines are listed with reasons and correction suggestions</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">+</span>
                  <span><strong>PDF Flow:</strong> A single report can also be uploaded as PDF; personal fields are masked on your own computer first</span>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-teal-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaChartLine className="text-teal-600" />
                Our Advantages
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>95% Accuracy Rate:</strong> High precision with advanced AI models</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>Results in Seconds:</strong> 10x faster than manual verification</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>GDPR Compliant:</strong> No personal patient data is stored</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>Continuous Updates:</strong> Regulatory changes are automatically tracked</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnerships & Accelerators */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partnerships & Accelerators</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are proud to be part of leading accelerator programs that support healthcare innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-teal-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
            >
              <Image
                src="/acc-ing-26.png"
                alt="ITU Cekirdek Acceleration Program"
                width={180}
                height={72}
                className="w-auto h-16 object-contain mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ITU Çekirdek</h3>
              <p className="text-gray-600 text-sm">
                Selected for the ITU Çekirdek Acceleration Program, one of Turkey&apos;s top university-backed startup accelerators.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-teal-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
            >
              <Image
                src="/bayerG4A.png"
                alt="Bayer G4A Program"
                width={180}
                height={72}
                className="w-auto h-16 object-contain mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bayer G4A</h3>
              <p className="text-gray-600 text-sm mb-5">
                Selected for Bayer&apos;s 2026 G4A Accelerator Program as one of six startups chosen from 310 applications.
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <a
                  href="https://g4a.bayer.com.tr/girisimler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-teal-700 font-semibold text-sm hover:underline"
                >
                  Official Bayer Profile <FaExternalLinkAlt size={12} />
                </a>
                <a
                  href="https://thedisruptormag.com/meet-the-6-startups-selected-for-bayers-2026-g4a-accelerator-program/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-gray-600 font-semibold text-sm hover:text-teal-700 hover:underline"
                >
                  Read the Announcement <FaExternalLinkAlt size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Press & Recognition */}
      <section className="py-16 px-6 lg:px-20 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <FaNewspaper size={44} className="text-teal-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Press &amp; Recognition</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Independent coverage and announcements featuring RaporinAI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pressItems.map((item, index) => (
              <motion.a
                key={item.source}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:border-teal-300 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-sm font-bold text-teal-700">{item.source}</span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {item.language}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-5 group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 group-hover:text-teal-700">
                  Read article <FaExternalLinkAlt size={12} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the RaporinAI Family
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Reduce insurance deductions, save time, and be part of the digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kayit"
              className="inline-block px-8 py-4 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/en#contact"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

      <FooterEN />
    </main>
  );
}
