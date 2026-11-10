"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, ChevronDown, ChevronRight, FileText, Pause, Play, Radar, RotateCcw } from "lucide-react";
import Player from "./how/Player";
import { livePanel, liveSave, pdfCheck, periodAnalyze, periodImport, periodResult } from "./how/schematicScenes";

// Özellikler bölümündeki "Nasıl çalıştığını izle" bağlantısı bu olayla belirli bir kullanım şeklini açar.
export const HOW_IT_WORKS_EVENT = "raporin:how-it-works";

const MODES = [
  {
    id: "donem",
    Icon: CalendarRange,
    label: "Toplu dönem kontrolü",
    tagline: "Medula'dan aktarın, tek tıkla analiz edin",
    scenes: [periodImport, periodAnalyze, periodResult],
  },
  {
    id: "canli",
    Icon: Radar,
    label: "Canlı takip",
    tagline: "Reçeteyi kaydettiğiniz an kontrol",
    scenes: [liveSave, livePanel],
  },
  {
    id: "pdf",
    Icon: FileText,
    label: "PDF ile tekil kontrol",
    tagline: "Elinizdeki tek raporu hemen kontrol edin",
    scenes: [pdfCheck],
  },
];

export default function HowItWorks() {
  const [mode, setMode] = useState(0);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef(null);
  const current = MODES[mode];
  const scene = current.scenes[step];
  const animating = playing && inView && !reduceMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Bölüm ekrana girince sahne baştan oynar; ekrandan çıkınca ilerleme durur.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) setRun((r) => r + 1);
      visible = entry.isIntersecting;
      setInView(entry.isIntersecting);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Seçili kullanım şeklinin adımları sırayla oynar, bitince aynı şeklin başına döner. Başka bir şekle
  // kendiliğinden geçilmez: eczacı neyi izlediğini kaybetmesin.
  useEffect(() => {
    if (!animating) return undefined;
    const timer = setTimeout(() => {
      setStep((step + 1) % current.scenes.length);
      setRun((r) => r + 1);
    }, scene.duration);
    return () => clearTimeout(timer);
  }, [animating, step, run, scene.duration, current.scenes.length]);

  const show = useCallback((modeIndex, stepIndex = 0) => {
    setMode(modeIndex);
    setStep(stepIndex);
    setRun((r) => r + 1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const onRequest = (event) => {
      const index = MODES.findIndex((m) => m.id === event.detail);
      if (index >= 0) show(index);
    };
    window.addEventListener(HOW_IT_WORKS_EVENT, onRequest);
    return () => window.removeEventListener(HOW_IT_WORKS_EVENT, onRequest);
  }, [show]);

  return (
    <section ref={sectionRef} id="nasil-calisir" className="relative overflow-hidden py-24 bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 -left-24 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Nasıl{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17C6A3] to-[#0F918B]">Çalışır?</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            RaporinAI&apos;yi üç şekilde kullanabilirsiniz. İhtiyacınıza göre birini ya da hepsini birlikte kullanın.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Kullanım şekilleri ve adımları: solda, kenar menüsü gibi */}
          <nav className="lg:col-span-4 xl:col-span-3 space-y-2" aria-label="Kullanım şekli">
            {MODES.map((m, index) => {
              const active = index === mode;
              return (
                <div
                  key={m.id}
                  className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    active
                      ? "border-teal-300 shadow-[0_18px_40px_-22px_rgba(15,145,139,0.5)]"
                      : "border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => show(index)}
                    aria-expanded={active}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
                  >
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-colors ${
                        active ? "bg-gradient-to-br from-[#17C6A3] to-[#0F918B] text-white" : "bg-teal-50 text-teal-700 ring-1 ring-teal-100 group-hover:bg-teal-100"
                      }`}
                    >
                      <m.Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold ${active ? "text-gray-900" : "text-gray-800"}`}>{m.label}</span>
                      <span className="block truncate text-xs text-gray-500">{m.tagline}</span>
                    </span>
                    {active ? (
                      <ChevronDown size={18} className="flex-none text-teal-600" />
                    ) : (
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-slate-200 transition group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:ring-teal-200">
                        <ChevronRight size={16} />
                      </span>
                    )}
                  </button>

                  {active && (
                    <ol className="relative mx-4 mb-3 ml-[33px] border-l border-teal-100 pl-4">
                      {m.scenes.map((item, i) => {
                        const on = i === step;
                        return (
                          <li key={item.id} className="relative">
                            <span className={`absolute -left-[21.5px] top-3 h-2.5 w-2.5 rounded-full ring-4 ring-white ${on ? "bg-[#17C6A3]" : "bg-teal-100"}`} />
                            <button type="button" onClick={() => show(index, i)} aria-current={on ? "step" : undefined} className="w-full py-2 text-left">
                              <span className={`block text-sm ${on ? "font-semibold text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>{item.title}</span>
                              <span className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
                                <span className="overflow-hidden text-xs leading-relaxed text-gray-500">{item.desc}</span>
                              </span>
                              {on && (
                                <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-teal-50">
                                  <span
                                    key={`${run}-${mode}-${step}`}
                                    className="block h-full origin-left bg-gradient-to-r from-[#17C6A3] to-[#0F918B]"
                                    style={{ animation: `how-progress ${scene.duration}ms linear both`, animationPlayState: animating ? "running" : "paused" }}
                                  />
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Canlandırma */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="relative rounded-2xl bg-gradient-to-br from-teal-100 via-white to-emerald-100 p-2 sm:p-3 shadow-2xl shadow-teal-900/15 ring-1 ring-teal-100">
              <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-slate-200/70" style={{ aspectRatio: "1440 / 810" }}>
                <Player scene={scene} run={run} />
              </div>
              <div className="mt-3 flex items-center gap-3 px-1">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-teal-700 ring-1 ring-teal-200 transition hover:bg-teal-50"
                  aria-label={playing ? "Canlandırmayı duraklat" : "Canlandırmayı oynat"}
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => show(mode, step)}
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-teal-700 ring-1 ring-teal-200 transition hover:bg-teal-50"
                  aria-label="Bu adımı baştan oynat"
                >
                  <RotateCcw size={14} />
                </button>
                <p className="text-sm text-gray-600 truncate">
                  <span className="font-semibold text-gray-900">{current.label}</span> · {step + 1}/{current.scenes.length} · {scene.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes how-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </section>
  );
}
