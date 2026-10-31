"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import Screenshot from "../Screenshot";
import { FaGlobe, FaLayerGroup, FaPills } from "react-icons/fa";

const screenshots = [
  { id: 1, src: "/screens/recete-aktarimi.png", alt: "Prescription Import From the Portal" },
  { id: 2, src: "/screens/toplu-analiz.png", alt: "One-Click Bulk Analysis" },
  { id: 3, src: "/screens/recete-detay.png", alt: "Prescription Detail & Single Analysis" },
  { id: 4, src: "/screens/analiz-sonuclari.png", alt: "Bulk Analysis Results" },
  { id: 5, src: "/screens/detay-2.png", alt: "Criterion-Based Analysis Detail" },
];

export default function HeroSectionEN() {
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const getSlidePosition = (index) => {
    const diff = index - activeIndex;
    const total = screenshots.length;
    const normalizedDiff = ((diff + total) % total);

    if (normalizedDiff === 0) return 'center';
    if (normalizedDiff === 1) return 'right';
    if (normalizedDiff === total - 1) return 'left';
    return 'hidden';
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-[#E8FFFB] via-[#F9FFFD] to-white">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

      {/* LEFT SIDE */}
      <div className="max-w-lg lg:max-w-xl text-center lg:text-left mt-4 lg:mt-0 relative">
        {/* Bayer G4A Recognition */}
        <motion.a
          href="https://g4a.bayer.com.tr/girisimler"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-3 rounded-2xl border border-teal-200 bg-white px-4 py-3 shadow-lg shadow-teal-900/10 transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-xl"
          aria-label="View RaporinAI on the official Bayer G4A website"
        >
          <Image
            src="/bayerG4A.png"
            alt="Bayer G4A"
            width={105}
            height={42}
            className="h-9 w-auto object-contain"
          />
          <span className="h-9 w-px bg-gray-200" aria-hidden="true" />
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
              Official Selection
            </span>
            <span className="mt-1 block text-xs sm:text-sm font-bold text-gray-900">
              Bayer G4A Accelerator 2026 →
            </span>
          </span>
        </motion.a>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0F918B] via-[#12A897] to-[#17C6A3] text-center lg:text-left"
        >
          <span className="block">AI-Powered Medication</span>
          <span className="block">Reimbursement Verification for Pharmacies</span>
        </motion.h1>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed"
        >
          <strong>RaporinAI</strong> is a <strong>cloud-based SaaS platform</strong> powered by AI that takes the prescription and report verification workload off pharmacists. It tells you instantly whether a medication is <strong>eligible for reimbursement</strong>, checks prescriptions against <strong>regulatory rules</strong> in seconds rather than hours, and surfaces problems before a claim is submitted — preventing <strong>claim rejections</strong>. Currently <strong>FREE</strong>.
        </motion.p>

        {/* Key Benefit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-4 sm:mt-5 relative overflow-hidden"
        >
          <div className="relative p-4 sm:p-5 bg-gradient-to-br from-amber-400/30 via-yellow-500/30 to-amber-600/30 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-amber-300/40 backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 bg-yellow-300/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/40 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl sm:text-3xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                  Reduce Insurance Deductions by Up to 95%
                </h3>
                <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
                  Detect erroneous reports in advance with AI-powered analysis and prevent financial losses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
          <motion.a
            href="/en/download"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 10px 30px rgba(16, 185, 129, 0.3)",
                "0 15px 40px rgba(16, 185, 129, 0.5)",
                "0 10px 30px rgba(16, 185, 129, 0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

            <div className="relative flex items-center gap-2.5">
              <span className="text-2xl animate-bounce">🎉</span>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-xs uppercase tracking-wider leading-none">
                  FREE ACCOUNT
                </span>
                <span className="text-white font-semibold text-sm sm:text-base mt-0.5">
                  Try It Now
                </span>
              </div>
              <svg
                className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-full text-[#0F918B] font-medium border border-[#17C6A3]/50 hover:border-[#17C6A3] hover:bg-teal-50/50 transition-all duration-300"
          >
            <span>How It Works</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.a>
        </div>
      </div>

      {/* RIGHT SIDE - 3D CAROUSEL */}
      <div className="relative flex flex-col justify-center items-center w-full lg:w-1/2 mt-6 sm:mt-8 lg:mt-0">
        {/* Feature chips */}
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: <FaGlobe size={12} />, label: "Automatic prescription import" },
            { icon: <FaLayerGroup size={12} />, label: "One-click bulk analysis" },
            { icon: <FaPills size={12} />, label: "Prescription–report dosage check" },
          ].map((chip) => (
            <li
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white/90 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-sm"
            >
              <span className="text-teal-600">{chip.icon}</span>
              {chip.label}
            </li>
          ))}
        </motion.ul>
        {/* Desktop view - 3D Carousel */}
        <div className="hidden lg:block relative w-full h-[350px] xl:h-[400px]">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden perspective-1000">
            {screenshots.map((shot, index) => {
              const position = getSlidePosition(index);
              return (
                <motion.div
                  key={shot.id}
                  initial={false}
                  animate={{
                    x: position === 'center' ? 0 : position === 'left' ? -150 : position === 'right' ? 150 : 0,
                    scale: position === 'center' ? 1 : position === 'hidden' ? 0.5 : 0.7,
                    opacity: position === 'center' ? 1 : position === 'hidden' ? 0 : 0.5,
                    zIndex: position === 'center' ? 20 : position === 'hidden' ? 0 : 10,
                    rotateY: position === 'left' ? 25 : position === 'right' ? -25 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute cursor-pointer rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (position === 'center') {
                      setSelected(shot);
                    } else if (position === 'right') {
                      nextSlide();
                    } else if (position === 'left') {
                      prevSlide();
                    }
                  }}
                >
                  <Screenshot
                    src={shot.src}
                    alt={shot.alt}
                    width={320}
                    height={220}
                    className="object-cover rounded-xl"
                  />
                  {position === 'center' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                      <p className="text-white text-sm font-semibold text-center">{shot.alt}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === activeIndex ? 'bg-[#17C6A3] w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile view */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-3 w-full px-4 scrollbar-hide"
        >
          {screenshots.map((shot, index) => (
            <motion.div
              key={shot.id}
              whileTap={{ scale: 0.97 }}
              className="snap-center shrink-0 w-64 sm:w-72 rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-xl transition-transform duration-300"
              onClick={() => setSelected(shot)}
            >
              <Screenshot
                src={shot.src}
                alt={shot.alt}
                width={280}
                height={190}
                className="w-full object-cover rounded-xl"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

      {/* MODAL */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 sm:p-4">
          <Dialog.Panel className="relative max-w-4xl w-full">
            {selected && (
              <Image
                src={selected.src}
                alt={selected.alt}
                width={1000}
                height={700}
                className="rounded-lg sm:rounded-xl shadow-2xl object-contain"
              />
            )}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl font-light hover:opacity-80 bg-black/30 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
            >
              ✕
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}
