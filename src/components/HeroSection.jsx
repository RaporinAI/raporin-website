"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChartNoAxesColumnIncreasing, CheckCircle2, Link2, PlayCircle, Plus, ShieldCheck, Sparkles, Store, TriangleAlert, XCircle } from "lucide-react";
import styles from "./HeroSection.module.css";
import HeroDemo, { DEMO_SCENES } from "./HeroDemo";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [pickedScene, setScene] = useState(null);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);
  const stageRef = useRef(null);
  // Hareket azaltma tercihinde, kullanıcı bir adım seçene kadar son (sonuç) sahnesi sabit gösterilir.
  const scene = pickedScene ?? (reduceMotion ? DEMO_SCENES.length - 1 : 0);
  const activeScene = DEMO_SCENES[scene];

  // Demo yalnızca ekranda görünürken döner.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setPlaying(entry.isIntersecting);
      if (entry.isIntersecting) setRun((value) => value + 1);
    }, { threshold: 0.25 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || reduceMotion) return undefined;
    const timer = setTimeout(() => setScene((scene + 1) % DEMO_SCENES.length), activeScene.duration);
    return () => clearTimeout(timer);
  }, [playing, reduceMotion, scene, run, activeScene.duration]);

  const showScene = (index) => {
    setScene(index);
    setRun((value) => value + 1);
  };

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

            <div className={styles.actions}>
              <Link href="/kayit" className={styles.primary}>
                Ücretsiz başla
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <a href="#nasil-calisir" className={styles.secondary}>
                <PlayCircle aria-hidden="true" size={22} />
                Nasıl çalıştığını gör
              </a>
            </div>
            <div className={styles.socialProof}>
              <div className={styles.pharmacyIcons} aria-hidden="true">
                <span><Store size={23} /></span>
                <span><Store size={23} /></span>
                <span><Store size={23} /></span>
              </div>
              <div className={styles.proofText}>
                <p><strong>1.000+</strong> <span>eczane</span></p>
                <p>Reçete ve rapor kontrolünde RaporinAI kullanıyor.</p>
              </div>
              <BadgeCheck aria-hidden="true" className={styles.proofBadge} size={25} />
            </div>
          </div>

          <div ref={stageRef} className={styles.stage}>
            <Plus aria-hidden="true" className={styles.cross} size={65} strokeWidth={5} />
            <Plus aria-hidden="true" className={`${styles.cross} ${styles.crossSmall}`} size={43} strokeWidth={5} />
            <div aria-hidden="true" className={styles.annotation}>
              Eczanenizin <br />yapay zeka asistanı.
              <svg viewBox="0 0 40 48" fill="none"><path d="M11 3C32 19 27 28 13 39m0 0 2-12m-2 12 13-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <div className={styles.device}>
              <div className={styles.frame}>
                <span aria-hidden="true" className={styles.camera} />
                <div className={styles.screen}>
                  <HeroDemo scene={scene} run={run} />
                </div>
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
              <h2>{activeScene.title}</h2>
              <p>{activeScene.description}</p>
            </div>
            <div role="group" aria-label="Nasıl çalışır adımları" className={styles.tabs}>
              {DEMO_SCENES.map((item, index) => (
                <button key={item.id} type="button" aria-pressed={index === scene} onClick={() => showScene(index)} className={styles.tab}>
                  <span aria-hidden="true" className={styles.tabNumber}>{index + 1}</span>{item.label}
                  {index === scene && playing && !reduceMotion && (
                    <span key={run} aria-hidden="true" className={styles.tabProgress} style={{ animationDuration: `${item.duration}ms` }} />
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
        <div aria-hidden="true" className={styles.signature}>TEKNOLOJİYLE DAHA GÜÇLÜ ECZANELER</div>
      </div>

    </section>
  );
}
