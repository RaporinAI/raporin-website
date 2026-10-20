"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleUser, ClipboardCheck, Clock, FileCheck2, FileText, Globe, List, MousePointerClick, Search, ShieldAlert, Square, X, XCircle } from "lucide-react";
import styles from "./HeroDemo.module.css";

// Hero'daki dizüstü ekranında dönen kısa demo. Gerçek masaüstü uygulamasının (public/screens) ekranlarını
// 900×508'lik sabit bir tuval üzerinde yeniden çizer; tuval ekran genişliğine göre ölçeklenir.
// Her sahne yeniden mount edilir, CSS animasyonları baştan oynar. Sahnenin ilk hali bir öncekinin son
// haliyle aynı olduğundan geçişler kesintisiz görünür.
export const DEMO_SCENES = [
  {
    id: "toplu-analiz",
    duration: 7800,
    label: "Toplu analiz",
    title: "Medula’dan gelen tüm raporlu ilaçlar tek tıkla SUT’a göre analiz edilir",
    description: "Her reçete Uygun, Dikkat veya Uygun değil olarak işaretlenir.",
  },
  {
    id: "uygunsuzluk",
    duration: 8600,
    label: "Uygunsuzluk yakalandı",
    title: "Kesinti riski faturalandırmadan önce, gerekçesiyle yakalanır",
    description: "ATOR 20 MG raporunda LDL tetkiki rapordan yaklaşık 13 ay önce yapılmış; SUT 4.2.28.A(3) en fazla 6 ay öngörür.",
  },
];

const CANVAS_WIDTH = 900;

const TOTAL = 487;
const COUNTS = { red: 10, amber: 46, green: 431 };

const ROWS = [
  { date: "11/11/2026", scope: "4A Sigortalı (S.S.K.)", drugs: 4, reported: 1, status: "green" },
  { date: "11/11/2026", scope: "4B Sigortalı (Bağ-Kur)", drugs: 4, reported: 3, status: "green" },
  { date: "11/11/2026", scope: "4A Sigortalı (S.S.K.)", drugs: 4, reported: 2, status: "amber" },
  { date: "11/11/2026", scope: "4A Sigortalı (S.S.K.)", drugs: 1, reported: 1, status: "green" },
  { date: "10/11/2026", scope: "4C Sigortalı (Emekli Sandığı)", drugs: 2, reported: 1, status: "red" },
  { date: "11/11/2026", scope: "4C Sigortalı (Emekli Sandığı)", drugs: 2, reported: 2, status: "green" },
  { date: "09/11/2026", scope: "60/g sigortalılar", drugs: 1, reported: 1, status: "green" },
];
const SELECTED_ROW = 4;

const STATUS_LABEL = { green: "Uygun", amber: "Dikkat", red: "Uygun değil" };

const COMPLETED = [
  { name: "DILATREND 12.5 MG.30 TABLET", status: "green" },
  { name: "LIPITOR 10 MG.30 FILM TB.", status: "green" },
  { name: "CONTRAMAL 20 KAPSUL", status: "amber" },
  { name: "ATOR 20 MG 30 FILM TABLET", status: "red" },
];

const CRITERIA = [
  { code: "4.2.28.A-1-ç", title: "LDL > 70 mg/dL; diabetes mellitus", analysis: "Diyabet tanısı mevcut, LDL 143.36 mg/dL (≥ 70).", ok: true },
  { code: "4.2.28.A-3", title: "Rapor öncesi son 6 ay içinde tetkik", analysis: "Rapor 07.02.2025, LDL ölçümü 14.01.2024: ~13 ay, 6 aylık sınır aşılmış.", ok: false },
  { code: "4.2.28.A-1", title: "LDL ölçüm sayısı istisnası (Diyabet)", analysis: "Diyabette tek LDL ölçümü yeterli.", ok: true },
  { code: "4.2.28.A-4", title: "Uzman hekim raporu", analysis: "Rapor, iç hastalıkları uzmanı tarafından düzenlenmiş.", ok: true },
];

// Toplu analiz sahnesi: önce düğme vurgulanır, imleç CLICK_AT'te tıklar, analiz ANALYSIS_AT'te başlar.
// Bu değerler HeroDemo.module.css'teki cursor0 ve ripple0 zamanlamasıyla eşleşir.
const CLICK_AT = 2.2;
const ANALYSIS_AT = CLICK_AT + 0.5;

const d = (seconds) => ({ "--d": `${seconds}s` });

function Count({ to, from = 0, delay = 0, duration = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(to);
      return undefined;
    }
    let frame;
    const start = performance.now() + delay * 1000;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - start) / (duration * 1000)));
      el.textContent = String(Math.round(from + (to - from) * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, from, delay, duration]);

  return <span ref={ref}>{from}</span>;
}

function Pill({ status, className = "", style }) {
  return <span className={`${styles.pill} ${styles[status]} ${className}`} style={style}>{STATUS_LABEL[status]}</span>;
}

function Spinner() {
  return <span className={styles.spinner} />;
}

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}><Image src="/logo.png" alt="" width={120} height={25} sizes="120px" loading="eager" /></div>
      <p className={styles.menuLabel}>MENÜ</p>
      <ul className={styles.menu}>
        <li><Globe size={12} /> Medula</li>
        <li className={styles.menuActive}><List size={12} /> Reçete Kontrol</li>
        <li><FileText size={12} /> PDF Rapor Kontrol</li>
        <li><FileCheck2 size={12} /> PDF Rapor Sonuçları</li>
      </ul>
      <div className={styles.user}><CircleUser size={16} /> Test Kullanıcı</div>
    </aside>
  );
}

function Summary({ scene }) {
  const live = scene === 0;
  return (
    <div className={styles.card}>
      <span className={styles.calendar}><CalendarDays size={16} /></span>
      <div>
        <p className={styles.period}>2026 Kasım · A Grubu</p>
        <p className={styles.periodMeta}>273 reçete · 765 ilaç · 487 raporlu ilaç</p>
        <p className={styles.updated}>Son güncelleme: 02 Ara 2026 23:12</p>
      </div>
      <div className={styles.progress}>
        <p>
          {live ? <Count to={TOTAL} delay={ANALYSIS_AT} duration={3.6} /> : TOTAL} / {TOTAL} raporlu ilaç analiz edildi · %
          {live ? <Count to={100} delay={ANALYSIS_AT} duration={3.6} /> : 100}
        </p>
        <span className={styles.track}>
          <span className={`${styles.bar} ${live ? styles.fill : styles.full}`} style={d(ANALYSIS_AT)} />
        </span>
      </div>
      <span className={`${styles.runButton} ${live ? styles.spotlight : ""}`} style={d(CLICK_AT)}>Toplu Analiz</span>
    </div>
  );
}

function Chips({ scene }) {
  const value = (key) => (scene === 0 ? <Count to={COUNTS[key]} delay={ANALYSIS_AT} duration={3.6} /> : COUNTS[key]);
  return (
    <div className={styles.chips}>
      <span className={styles.chipAll}>Tümü {TOTAL}</span>
      <span className={`${styles.chipRed} ${scene === 1 ? styles.chipAlert : ""}`}>Uygun değil {value("red")}</span>
      <span className={styles.chipAmber}>Dikkat {value("amber")}</span>
      <span className={styles.chipGreen}>Uygun {value("green")}</span>
    </div>
  );
}

function StatusCell({ row, index, scene }) {
  if (scene === 1) return <Pill status={row.status} />;
  const start = ANALYSIS_AT + 0.1 + index * 0.42;
  return (
    <span className={styles.statusStack}>
      <span className={`${styles.pill} ${styles.idle} ${styles.out}`} style={d(start)}>Kontrol Edilmedi</span>
      <span className={`${styles.pill} ${styles.busy} ${styles.blink}`} style={{ "--d": `${start}s`, "--d2": `${start + 0.45}s` }}>Analiz ediliyor</span>
      <Pill status={row.status} className={`${styles.pop} ${row.status === "red" ? styles.flash : ""}`} style={d(start + 0.45)} />
    </span>
  );
}

function Table({ scene }) {
  return (
    <div className={styles.table}>
      <div className={styles.thead}>
        <span />
        <span>Reçete No</span>
        <span>Tarih</span>
        <span>Kapsam</span>
        <span>İlaç Sayısı</span>
        <span>Durum</span>
        <span>Not</span>
        <span>Karekod</span>
        <span>İlaç Alım</span>
      </div>
      {ROWS.map((row, index) => {
        const selected = scene === 1 && index === SELECTED_ROW;
        return (
          <div key={index} className={`${styles.row} ${selected ? styles.selected : ""}`} style={d(0.25)}>
            {selected ? <ChevronLeft size={10} /> : <ChevronRight size={10} />}
            <span className={styles.masked} style={{ width: 38 + ((index * 7) % 12) }} />
            <span>{row.date}</span>
            <span>{row.scope}</span>
            <span>{row.drugs} <em>({row.reported} raporlu)</em></span>
            <StatusCell row={row} index={index} scene={scene} />
            <span className={styles.muted}>—</span>
            <span className={styles.karekod}><CheckCircle2 size={10} /> Okundu</span>
            <span>{row.date}</span>
          </div>
        );
      })}
      <div className={styles.pager}>
        <span><ChevronLeft size={10} /></span>
        <span><ChevronRight size={10} /></span>
        1 - 50 / 273
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle }) {
  return (
    <div className={styles.panelHeader}>
      <Image src="/RaprinAl Amblem.png" alt="" width={26} height={26} sizes="26px" loading="eager" className={styles.panelIcon} />
      <div>
        <p className={styles.panelTitle}>{title}</p>
        <p className={styles.panelSubtitle}>{subtitle}</p>
      </div>
      <X size={12} className={styles.panelClose} />
    </div>
  );
}

function BulkPanel({ live }) {
  return (
    <div className={styles.panelBody}>
      <PanelHeader title="Toplu Analiz" subtitle="RaporinAI Toplu Analiz Paneli" />
      <div className={styles.notice}>
        <span className={`${styles.layer} ${live ? styles.out : styles.hidden}`} style={d(ANALYSIS_AT + 3.6)}>
          <b><CheckCircle2 size={11} /> Toplu analiz devam ediyor.</b>
          <small>İşlem arka planda devam eder.</small>
        </span>
        <span className={`${styles.layer} ${live ? styles.in : ""}`} style={d(ANALYSIS_AT + 3.6)}>
          <b><CheckCircle2 size={11} /> Toplu analiz tamamlandı.</b>
          <small>{TOTAL} raporlu ilaç SUT kriterlerine göre kontrol edildi.</small>
        </span>
      </div>
      <div className={styles.panelProgress}>
        <span>{live ? <Count to={TOTAL} delay={ANALYSIS_AT} duration={3.6} /> : TOTAL} / {TOTAL} tamamlandı</span>
        <span className={styles.percent}>%{live ? <Count to={100} delay={ANALYSIS_AT} duration={3.6} /> : 100}</span>
      </div>
      <span className={styles.track}>
        <span className={`${styles.bar} ${live ? styles.fill : styles.full}`} style={d(ANALYSIS_AT)} />
      </span>
      <p className={styles.panelLabel}>Şu an analiz ediliyor</p>
      <div className={styles.drugCard}>
        <span className={styles.drugMeta}>Reçete No <span className={styles.masked} /></span>
        <b>EMPAFEL 10 MG FILM KAPLI TABLET</b>
        <span className={styles.drugMeta}>Barkod: 8699540030763</span>
        <Spinner />
      </div>
      <p className={styles.panelLabel}>Tamamlananlar</p>
      {COMPLETED.map((item, index) => (
        <div key={item.name} className={`${styles.drugCard} ${live ? styles.rise : ""}`} style={d(ANALYSIS_AT + 0.5 + index * 0.75)}>
          <span className={styles.drugMeta}>Reçete No <span className={styles.masked} /></span>
          <b>{item.name}</b>
          <Pill status={item.status} className={styles.drugPill} />
        </div>
      ))}
      <div className={styles.panelActions}>
        <span><Clock size={10} /> Arka Planda Devam Et</span>
        <span className={styles.stop}><Square size={9} /> İşlemi Durdur</span>
      </div>
    </div>
  );
}

function AnalysisPanel() {
  return (
    <div className={`${styles.panelBody} ${styles.rise}`} style={d(0.35)}>
      <span className={styles.back}><ChevronLeft size={9} /> Reçete <span className={styles.masked} /></span>
      <PanelHeader title="Akıllı Rapor Analizi" subtitle="RaporinAI Rapor Analiz Paneli" />
      <div className={styles.analysis}>
        <div className={`${styles.verdict} ${styles.pop}`} style={d(0.65)}><XCircle size={13} /> UYGUN DEĞİL</div>
        <p className={`${styles.drugName} ${styles.rise}`} style={d(0.8)}>ATOR 20 MG 30 FILM TABLET</p>
        <div className={`${styles.aiSummary} ${styles.rise}`} style={d(0.95)}>
          <p className={styles.sectionLabel}>AI DEĞERLENDİRME ÖZETİ</p>
          <p className={styles.summaryText}>
            Diyabet tanısı ve LDL 143.36 mg/dL kriterleri karşılanıyor. Ancak SUT 4.2.28.A(3) gereği tetkik rapordan
            önceki son 6 ay içinde yapılmalı; LDL ölçümü rapordan ~13 ay önce. İlaç başlangıç kriterleri yönünden uygunsuz.
          </p>
        </div>
        <div className={`${styles.sutHead} ${styles.rise}`} style={d(1.25)}>
          <p className={styles.sectionLabel}><ClipboardCheck size={9} /> SUT KRİTERLERİ</p>
          <span>3 / 4</span>
        </div>
        <span className={styles.sutTrack}>
          <span className={`${styles.sutFill} ${styles.fillFast}`} style={d(1.4)} />
        </span>
        {CRITERIA.map((item, index) => (
          <div
            key={item.code}
            className={`${styles.criterion} ${item.ok ? "" : styles.criterionFail} ${styles.rise}`}
            style={d(1.6 + index * 0.4)}
          >
            <p className={styles.criterionTitle}>
              <span className={styles.criterionNo}>{index + 1}</span>
              <b>{item.code}:</b> {item.title}
              {item.ok ? <CheckCircle2 size={10} className={styles.ok} /> : <XCircle size={10} className={styles.fail} />}
            </p>
            <p className={styles.criterionAnalysis}><b>Rapor Analizi:</b> {item.analysis}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Uygunsuzluğu eczacıya tek bakışta anlatan vurgu: geçerli tetkik aralığı (son 6 ay) ile gerçek ölçüm tarihi.
function Callout() {
  return (
    <>
      <div className={`${styles.spotDim} ${styles.in}`} style={d(3.5)} />
      <div className={`${styles.callout} ${styles.rise}`} style={d(3.7)}>
        <div className={styles.calloutHead}>
          <span className={styles.calloutIcon}><ShieldAlert size={16} /></span>
          <div>
            <b>Kesinti riski yakalandı</b>
            <small>ATOR 20 MG 30 FILM TABLET · SUT 4.2.28.A(3)</small>
          </div>
        </div>
        <div className={styles.compare}>
          <div className={`${styles.stat} ${styles.statBad} ${styles.pop}`} style={d(4.2)}>
            <strong><Count to={13} delay={4.3} duration={0.9} /> ay</strong>
            <span>LDL tetkiki rapordan önce</span>
          </div>
          <span className={`${styles.versus} ${styles.in}`} style={d(5)}>&gt;</span>
          <div className={`${styles.stat} ${styles.statOk} ${styles.pop}`} style={d(5.1)}>
            <strong>6 ay</strong>
            <span>SUT’un izin verdiği en fazla süre</span>
          </div>
        </div>
        <p className={`${styles.calloutFoot} ${styles.rise}`} style={d(5.8)}>
          <CheckCircle2 size={11} /> Faturalandırmadan önce fark edildi, reçete düzeltilebilir.
        </p>
      </div>
      <span className={`${styles.connector} ${styles.in}`} style={d(4)} />
    </>
  );
}

function Cursor({ scene }) {
  return (
    <>
      <span className={`${styles.cursor} ${styles[`cursor${scene}`]}`}>
        <svg viewBox="0 0 16 20" width="16" height="20"><path d="M1 1v15l4-3.6 2.7 6 2.6-1.2-2.6-5.8H13z" fill="#0f172a" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
      </span>
      <span className={`${styles.ripple} ${styles[`ripple${scene}`]}`} />
    </>
  );
}

export default function HeroDemo({ scene, run }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const update = () => el.style.setProperty("--scale", String(el.clientWidth / CANVAS_WIDTH));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div key={`${run}-${scene}`} className={`${styles.canvas} ${scene === 0 ? styles.sceneIn : ""}`}>
        <div className={styles.titlebar}>
          <span className={styles.lights}><i /><i /><i /></span>
          RaporinAI Desktop v1.1.20 - Test Kullanıcı - Eczane
        </div>
        <Sidebar />
        <main className={styles.main}>
          <p className={styles.pageTitle}>Reçete Kontrol</p>
          <Summary scene={scene} />
          <Chips scene={scene} />
          <div className={styles.filters}>
            <span>A Grubu</span>
            <span><CalendarDays size={9} /> 2026 / Kasım</span>
            <span className={styles.search}><Search size={9} /> İlaç/barkod ara</span>
          </div>
          <Table scene={scene} />
        </main>
        <div className={`${styles.panel} ${scene === 0 ? styles.slideIn : ""}`} style={d(CLICK_AT + 0.1)}>
          {scene === 0 ? <BulkPanel live /> : (
            <>
              <div className={`${styles.panelLayer} ${styles.out}`} style={d(0.2)}><BulkPanel live={false} /></div>
              <AnalysisPanel />
            </>
          )}
        </div>
        {scene === 0 && (
          <div className={styles.hint}>
            <b><MousePointerClick size={12} /> Tek tıkla toplu analiz</b>
            <small>{TOTAL} raporlu ilaç SUT’a göre kontrol edilir</small>
          </div>
        )}
        {scene === 1 && <Callout />}
        <Cursor scene={scene} />
      </div>
    </div>
  );
}
