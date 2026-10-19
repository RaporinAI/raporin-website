"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowRight, Gift, ChartNoAxesColumnIncreasing, CheckCircle2, Link2, Maximize2, PlayCircle, Plus, ShieldCheck, Sparkles, Store, TriangleAlert, X, XCircle } from "lucide-react";
import styles from "./HeroSection.module.css";
import { formatTL } from "../lib/billing/catalog";
import { useWelcomeOffer } from "../lib/billing/useWelcomeOffer";

const screenshots = [
  {
    id: "toplu-analiz",
    src: "/screens/toplu-analiz.png",
    label: "Toplu analiz",
    title: "Reçetelerinizi tek ekrandan kontrol edin",
    description: "Medula’dan aktardığınız reçeteleri birlikte değerlendirin.",
    alt: "RaporinAI toplu reçete analizi ekranı",
  },
  {
    id: "recete-detay",
    src: "/screens/recete-detay.png",
    label: "Reçete detayı",
    title: "Reçete ve rapor detaylarını birlikte inceleyin",
    description: "İlaç, doz ve rapor bilgilerine aynı yerden ulaşın.",
    alt: "RaporinAI reçete detayı ve tekil analiz ekranı",
  },
  {
    id: "analiz-sonuclari",
    src: "/screens/analiz-sonuclari.png",
    label: "Analiz sonucu",
    title: "Kontrol sonuçlarını açıklamalarıyla görün",
    description: "SUT kriterlerine göre tespit edilen uygunsuzlukları inceleyin.",
    alt: "RaporinAI açıklamalı analiz sonuçları ekranı",
  },
];

const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F918B]";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [selected, setSelected] = useState(null);
  const activeShot = screenshots[activeIndex];
  const offer = useWelcomeOffer();

  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.eyebrow}>
              <Store aria-hidden="true" size={16} /> ECZANELER İÇİN
            </div>
            <h1 id="hero-title" className={styles.title}>
              Reçete ve Rapor Kontrolünde
              <span>Yapay Zekâ Desteği</span>
            </h1>
            <p className={styles.description}>
              <strong>Yapay zekâ ile reçete ve rapor kontrolünü saniyelere indirin.</strong>{" "}
              RaporinAI, reçetelerinizi güncel SUT kurallarına göre otomatik analiz eder;
              doz ve rapor uyumsuzluklarını tespit eder, nedenini açıkça gösterir.
              Kesinti risklerini faturalandırmadan önce fark edin.
            </p>

            <ul className={styles.benefits}>
              <li><span className={styles.benefitIcon}><Link2 aria-hidden="true" size={19} /></span>Medula entegrasyonu</li>
              <li><span className={styles.benefitIcon}><ChartNoAxesColumnIncreasing aria-hidden="true" size={19} /></span>Toplu analiz</li>
              <li><span className={styles.benefitIcon}><ShieldCheck aria-hidden="true" size={19} /></span>Doz kontrolü</li>
            </ul>

            {offer?.credits > 0 ? (
              // Tek odak: hoş geldin hediyesi + kayıt düğmesi bir arada. Miktar admin panelden gelir; kredi kapalıysa
              // ya da bilinmiyorsa yalnızca düğme çizilir.
              <div className={styles.offer}>
                <span className={styles.offerIcon}>
                  <Gift aria-hidden="true" size={24} />
                </span>
                <div className={styles.offerText}>
                  <p className={styles.offerLabel}>Hoş geldin hediyesi</p>
                  <p className={styles.offerAmount}>
                    <span>{formatTL(offer.credits)} kredi</span> ücretsiz
                  </p>
                  <p className={styles.offerNote}>Kredi kartı gerekmez</p>
                </div>
                <Link href="/kayit" className={`${styles.primary} ${styles.offerButton}`}>
                  Ücretsiz kayıt ol
                  <ArrowRight aria-hidden="true" size={19} />
                </Link>
              </div>
            ) : (
              <div className={styles.actions}>
                <Link href="/kayit" className={styles.primary}>
                  Ücretsiz başla
                  <ArrowRight aria-hidden="true" size={19} />
                </Link>
              </div>
            )}
            <div className={styles.meta}>
              <a href="#nasil-calisir" className={styles.watch}>
                <PlayCircle aria-hidden="true" size={20} />
                Nasıl çalıştığını gör
              </a>
              <span className={styles.metaDivider} aria-hidden="true" />
              <div className={styles.proof}>
                <span className={styles.pharmacyIcons} aria-hidden="true">
                  <span><Store size={19} /></span>
                  <span><Store size={19} /></span>
                  <span><Store size={19} /></span>
                </span>
                <p>
                  <strong>1.000+</strong> eczane
                  <span>RaporinAI kullanıyor</span>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.stage}>
            <Plus aria-hidden="true" className={styles.cross} size={65} strokeWidth={5} />
            <Plus aria-hidden="true" className={`${styles.cross} ${styles.crossSmall}`} size={43} strokeWidth={5} />
            <div aria-hidden="true" className={styles.annotation}>
              Eczanenizin <br />yapay zeka asistanı.
              <svg viewBox="0 0 40 48" fill="none"><path d="M11 3C32 19 27 28 13 39m0 0 2-12m-2 12 13-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <div className={styles.device}>
              <div className={styles.frame}>
                <span aria-hidden="true" className={styles.camera} />
                <button type="button" onClick={() => setSelected(activeShot)} aria-label={`${activeShot.label} ekranını büyüt`} className={styles.screen}>
                  <Image key={activeShot.id} src={activeShot.src} alt={activeShot.alt} fill sizes="(min-width: 1536px) 740px, (min-width: 1024px) 51vw, (min-width: 768px) 720px, calc(100vw - 56px)" preload={activeIndex === 1} className="object-contain" />
                  <span className={styles.zoom}><Maximize2 aria-hidden="true" size={13} /> Büyüt</span>
                </button>
              </div>
              <div aria-hidden="true" className={styles.base} />
            </div>

            <div className={styles.result}>
              <div className={styles.resultHeading}>
                <span><Sparkles aria-hidden="true" size={17} /> Açıklamalı analiz</span>
                <small>SUT kriterlerine göre</small>
              </div>
              <ul className={styles.resultGrid} aria-label="Analizde gösterilen sonuç türleri">
                <li className={styles.status}><CheckCircle2 aria-hidden="true" size={19} /> Uygun</li>
                <li className={styles.status}><TriangleAlert aria-hidden="true" size={19} /> Dikkat edilmeli</li>
                <li className={styles.status}><XCircle aria-hidden="true" size={19} /> Uygun değil</li>
              </ul>
            </div>

            <div className="sr-only" aria-live="polite" aria-atomic="true">
              <h2>{activeShot.title}</h2>
              <p>{activeShot.description}</p>
            </div>
            <div role="group" aria-label="Uygulama ekranları" className={styles.tabs}>
              {screenshots.map((shot, index) => (
                <button key={shot.id} type="button" aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} className={styles.tab}>
                  <span aria-hidden="true" className={styles.tabDot} />{shot.label}
                </button>
              ))}
            </div>

          </div>
        </div>
        <div aria-hidden="true" className={styles.signature}>TEKNOLOJİYLE DAHA GÜÇLÜ ECZANELER</div>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-[100]">
        <div className="fixed inset-0 bg-gray-950/75 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-3 sm:p-6">
          <DialogPanel className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-teal-100 px-4 py-3">
              <DialogTitle className="text-sm font-semibold text-gray-900 sm:text-base">{selected?.title}</DialogTitle>
              <button type="button" onClick={() => setSelected(null)} aria-label="Önizlemeyi kapat" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-teal-50 ${focusStyle}`}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            {selected && <Image src={selected.src} alt={selected.alt} width={2880} height={1624} sizes="(min-width: 1200px) 1152px, 100vw" className="max-h-[75dvh] w-full object-contain" />}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
