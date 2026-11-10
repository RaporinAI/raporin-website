"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  DownloadCloud,
  FileText,
  Globe,
  ListChecks,
  Lock,
  Minus,
  MousePointerClick,
  Pill,
  Radar,
  Save,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import fx from "./fx.module.css";
import s from "./schematic.module.css";

const AMBLEM = "/RaprinAl Amblem.png";
const d = (seconds, extra) => ({ "--d": `${seconds}s`, ...extra });

function Count({ to, delay = 0, duration = 1 }) {
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
      el.textContent = String(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, delay, duration]);
  return <span ref={ref}>0</span>;
}

function Pill2({ tone, children, className = "", style }) {
  return <span className={`${s.pill} ${s[tone]} ${className}`} style={style}><i />{children}</span>;
}

function Skel({ w, dark }) {
  return <span className={`${s.skel} ${dark ? s.skelDark : ""}`} style={{ width: w }} />;
}

/* ================================================================== Toplu dönem kontrolü */

/* 1. Aktarım: Medula'dan RaporinAI'ye reçeteler akar, liste dolar. */
function ImportScene() {
  const PRESS = 0.6;
  const FLOW = 1.0;
  return (
    <div className={s.stage}>
      <div className={`${s.node} ${fx.rise}`} style={{ left: 190, top: 270, ...d(0.1) }}>
        <div className={s.nodeBox}><Globe size={64} strokeWidth={1.6} /></div>
        <p className={s.nodeLabel}>Medula</p>
        <p className={s.nodeSub}>Dönemin reçeteleri</p>
      </div>
      <span className={`${s.track} ${s.trackGrow}`} style={{ left: 370, top: 347, width: 330, ...d(FLOW - 0.2) }} />
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={s.paper} style={{ left: 360, top: 312, "--dist": "330px", ...d(FLOW + i * 0.42) }}><i /><i /><i /><i /></span>
      ))}

      <div className={`${s.card} ${fx.rise}`} style={{ left: 720, top: 110, width: 570, height: 590, ...d(0.2) }}>
        <div className={s.head}>
          <Image src={AMBLEM} alt="" width={42} height={42} sizes="42px" />
          <div className={s.grow}>
            <p className={s.title}>2026 Kasım</p>
            <p className={s.sub}><Count to={342} delay={FLOW + 0.3} duration={3.2} /> reçete aktarıldı</p>
          </div>
          <span className={`${s.btn} ${s.btnPress}`} style={d(PRESS)}><DownloadCloud size={19} /> Medula&apos;dan Aktar</span>
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${s.row} ${fx.rise}`} style={d(FLOW + 1.1 + i * 0.42)}>
            <span className={s.doc}><FileText size={20} /></span>
            <span className={s.rowText}><Skel w={150 + ((i * 37) % 90)} dark /><Skel w={90 + ((i * 23) % 60)} /></span>
            <Pill2 tone="idle">Kontrol bekliyor</Pill2>
          </div>
        ))}
      </div>
    </div>
  );
}

export const periodImport = {
  id: "aktarim",
  title: "Dönemi Medula'dan aktarın",
  desc: "Fatura türünü ve dönemi seçip \"Medula'dan Aktar\" deyin. Dönemin bütün reçeteleri raporlarıyla birlikte RaporinAI'ye gelir.",
  duration: 7000,
  Content: ImportScene,
  captions: [[0.3, 2.6, "Dönemi seçin, tek tuşla aktarın", DownloadCloud], [3.0, 6.8, "Reçeteler raporlarıyla birlikte gelir", FileText]],
};

/* 2. Toplu analiz: düğmeye basılır, satırlar sırayla sonuç alır. */
const ANALYZE_ROWS = [
  ["green", "Uygun"], ["red", "Uygun değil"], ["green", "Uygun"], ["amber", "Dikkat"], ["green", "Uygun"],
];

function AnalyzeScene() {
  const PRESS = 0.7;
  const START = 1.2;
  return (
    <div className={s.stage}>
      <div className={`${s.card} ${fx.rise}`} style={{ left: 290, top: 80, width: 860, height: 650, ...d(0.1) }}>
        <div className={s.head}>
          <Image src={AMBLEM} alt="" width={42} height={42} sizes="42px" />
          <div className={s.grow}>
            <p className={s.title}>2026 Kasım</p>
            <p className={s.sub}><Count to={487} delay={START} duration={3.6} /> / 487 raporlu ilaç analiz edildi</p>
          </div>
          <span className={`${s.btn} ${s.btnPress}`} style={d(PRESS)}><ListChecks size={19} /> Toplu Analiz</span>
        </div>
        <div className={s.chips}>
          <Pill2 tone="green">Uygun <Count to={431} delay={START} duration={3.6} /></Pill2>
          <Pill2 tone="amber">Dikkat <Count to={46} delay={START} duration={3.6} /></Pill2>
          <Pill2 tone="red">Uygun değil <Count to={10} delay={START} duration={3.6} /></Pill2>
        </div>
        <div style={{ position: "relative" }}>
          <span className={s.scan} style={{ top: 0, "--dist": `${72 * 4}px`, "--dur": "3s", ...d(START) }} />
          {ANALYZE_ROWS.map(([tone, label], i) => {
            const at = START + 0.15 + i * 0.6;
            return (
              <div key={i} className={s.row}>
                <span className={s.doc}><FileText size={20} /></span>
                <span className={s.rowText}><Skel w={170 + ((i * 41) % 110)} dark /><Skel w={100 + ((i * 29) % 70)} /></span>
                <span className={s.statusSlot}>
                  <Pill2 tone="idle" className={fx.out} style={d(at)}>Kontrol bekliyor</Pill2>
                  <span className={`${s.pill} ${s.busy} ${fx.blink}`} style={{ "--d": `${at}s`, "--d2": `${at + 0.5}s` }}><span className={s.spin} /> Analiz ediliyor</span>
                  <Pill2 tone={tone} className={fx.pop} style={d(at + 0.5)}>{label}</Pill2>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const periodAnalyze = {
  id: "analiz",
  title: "Tek tıkla toplu analiz",
  desc: "Dönemin bütün raporlu ilaçları güncel SUT'a göre analiz edilir. Analiz arka planda sürer; her reçete Uygun, Dikkat ya da Uygun değil olarak işaretlenir.",
  duration: 7000,
  Content: AnalyzeScene,
  captions: [[0.2, 1.3, "Tek tıkla başlatın", MousePointerClick], [1.6, 4.6, "Raporlu ilaçlar güncel SUT'a göre analiz edilir", Clock], [4.9, 6.8, "Her reçete Uygun, Dikkat ya da Uygun değil", CheckCircle2]],
};

/* 3. Sonuç: uygun olmayan reçete açılır; kriterler ve doz karşılaştırması. */
function ResultScene() {
  const OPEN = 0.9;
  return (
    <div className={s.stage}>
      <div className={`${s.card} ${s.riseFocus}`} style={{ left: 100, top: 330, width: 480, height: 96, "--d": "0.1s", "--d2": "0.5s" }}>
        <div className={s.row} style={{ height: 94, borderBottom: 0 }}>
          <span className={s.doc}><FileText size={20} /></span>
          <span className={s.rowText}><Skel w={170} dark /><Skel w={100} /></span>
          <Pill2 tone="red">Uygun değil</Pill2>
        </div>
      </div>
      <span className={`${s.track} ${s.trackGrow}`} style={{ left: 584, top: 377, width: 80, ...d(OPEN - 0.2) }} />

      <div className={`${s.card} ${fx.rise}`} style={{ left: 668, top: 70, width: 680, height: 670, ...d(OPEN) }}>
        <div className={s.head}>
          <span className={s.doc}><Pill size={20} /></span>
          <div className={s.grow}><p className={s.title}>LIPITOR 20 MG</p><p className={s.sub}>90 film tablet</p></div>
          <Pill2 tone="red">Uygun değil</Pill2>
        </div>
        <div className={s.section}>
          <p className={`${s.label} ${fx.rise}`} style={d(OPEN + 0.5)}>SUT KRİTERLERİ · 3 / 3</p>
          {["Tanı rapora uygun", "LDL değeri ve tarihi uygun", "Uzman hekim raporu"].map((text, i) => (
            <p key={text} className={`${s.check} ${fx.rise}`} style={d(OPEN + 0.75 + i * 0.3)}><CheckCircle2 size={24} className={s.ok} /> {text}</p>
          ))}
        </div>
        <div className={s.section} style={{ paddingTop: 30 }}>
          <p className={`${s.label} ${fx.rise}`} style={d(OPEN + 1.9)}>REÇETE / RAPOR DOZU</p>
          <div className={`${s.doseRow} ${fx.rise}`} style={d(OPEN + 2.1)}>
            <span>Reçete</span>
            <span className={s.barTrack}><span className={`${s.bar} ${s.barRed}`} style={{ width: "100%", ...d(OPEN + 2.3) }} /></span>
            <b>40 mg/gün</b>
          </div>
          <div className={`${s.doseRow} ${fx.rise}`} style={d(OPEN + 2.3)}>
            <span>Rapor</span>
            <span className={s.barTrack}><span className={`${s.bar} ${s.barTeal}`} style={{ width: "50%", ...d(OPEN + 2.5) }} /></span>
            <b>20 mg/gün</b>
          </div>
        </div>
        <div className={`${s.alertBox} ${s.alertPulse}`} style={d(OPEN + 3.4)}><XCircle size={24} /> Reçetedeki doz, rapordaki dozu aşıyor</div>
      </div>
    </div>
  );
}

export const periodResult = {
  id: "sonuc",
  title: "Gerekçeyi ve dozu görün",
  desc: "Reçeteye basın: hangi SUT kriterinin karşılanıp karşılanmadığını ve reçete dozunun rapordaki dozu aşıp aşmadığını gerekçesiyle görün.",
  duration: 7500,
  Content: ResultScene,
  captions: [[0.4, 2.8, "Her kriter, gerekçesiyle", ClipboardCheck], [3.1, 7.3, "Reçete dozu rapordaki dozu aşıyor mu?", Pill]],
};

/* ================================================================== Canlı takip */

/* 1. Reçete kaydedilir, RaporinAI yakalar, kart açılır. */
function SaveScene() {
  const SAVE = 1.0;
  const TRAVEL = 1.35;
  const DETECT = TRAVEL + 0.85;
  const CHECK = DETECT + 0.9;
  const RESULT = CHECK + 1.1;
  return (
    <div className={s.stage}>
      <div className={`${s.window} ${fx.rise}`} style={{ left: 110, top: 150, width: 560, height: 510, ...d(0.1) }}>
        <div className={s.windowBar}><i /><i /><i /><span>Eczane programı ya da Medula</span></div>
        <div className={s.formGrid}>
          {[150, 120, 170, 110].map((w, i) => <span key={i} className={s.formField}><Skel w={70} /><Skel w={w} dark /></span>)}
        </div>
        {[220, 180, 240, 160].map((w, i) => (
          <div key={i} className={s.listLine}><em /><Skel w={w} dark /><span style={{ marginLeft: "auto" }}><Skel w={50} /></span></div>
        ))}
        <span className={`${s.savedNote} ${fx.pop}`} style={d(SAVE + 0.25)}><CheckCircle2 size={18} /> Reçete kaydedildi</span>
        <span className={`${s.saveBtn} ${s.savePress}`} style={d(SAVE)}><Save size={19} /> Kaydet</span>
      </div>

      <span className={`${s.track} ${s.trackGrow}`} style={{ left: 690, top: 404, width: 380, ...d(TRAVEL - 0.3) }} />
      <span className={s.dot} style={{ left: 690, top: 405, "--dist": "380px", ...d(TRAVEL) }} />

      <div className={`${s.bubble} ${fx.pop}`} style={{ left: 1100, top: 340, ...d(0.3) }}>
        <span className={s.bump} style={{ ...d(DETECT), display: "grid", placeItems: "center" }}><Image src={AMBLEM} alt="" width={68} height={68} sizes="68px" /></span>
        <span className={`${s.glow} ${fx.blink}`} style={{ "--d": `${DETECT}s`, "--d2": `${CHECK + 0.2}s` }} />
        {[0, 0.35, 0.7].map((delay) => <span key={delay} className={s.wave} style={d(DETECT + delay)} />)}
        <span className={`${s.bubbleSpin} ${fx.blink}`} style={{ "--d": `${CHECK}s`, "--d2": `${RESULT}s` }} />
        <span className={`${s.bubbleAlert} ${fx.in}`} style={d(RESULT)} />
        <span className={`${s.badge} ${fx.pop}`} style={d(RESULT)}>1</span>
      </div>

      <div className={`${s.detectPill} ${fx.blink}`} style={{ left: 1164, top: 500, "--d": `${DETECT}s`, "--d2": `${RESULT + 0.1}s` }}>
        <span className={fx.out} style={d(CHECK)}><CheckCircle2 size={20} color="#16a34a" /> Yeni reçete algılandı · <b className={s.mono}>3PU8DL7</b></span>
        <span className={fx.in} style={d(CHECK)}><span className={s.spin} style={{ borderColor: "#ccefe6", borderTopColor: "#0f918b" }} /> Kontrol ediliyor · <b className={s.mono}>3PU8DL7</b></span>
      </div>

      <div className={`${s.alertCard} ${fx.popUp}`} style={{ left: 820, top: 80, width: 500, ...d(RESULT + 0.15) }}>
        <div className={s.alertHead}>
          <span className={s.alertIcon}><AlertTriangle size={26} /></span>
          <div className={s.grow}><p className={s.alertTitle}>Dikkat</p><p className={s.sub}><span className={s.mono}>3PU8DL7</span> · az önce kaydedildi</p></div>
          <X size={22} color="#94a3b8" />
        </div>
        <div className={s.alertBody}>
          <b>LIPITOR 20 MG</b>
          <span>LDL değeri raporda yok</span>
        </div>
      </div>
    </div>
  );
}

export const liveSave = {
  id: "canli-kaydet",
  title: "Reçeteyi her zamanki gibi kaydedin",
  desc: "Reçeteyi eczane programınızdan ya da Medula'dan kaydedin. RaporinAI kaydı arka planda yakalar ve analiz eder; sorun varsa ekranın kenarında kart açılır.",
  duration: 8200,
  Content: SaveScene,
  captions: [[0.2, 1.9, "Reçeteyi her zamanki gibi kaydedin", Save], [2.2, 4.2, "RaporinAI kaydı anında algılar ve kontrol eder", Radar], [4.5, 8.0, "Sorun varsa ekranın kenarında kart açılır", BellRing]],
};

/* 2. Kayan pencere: günün listesi → reçetenin ilaçları → ilacın sonucu. */
const TODAY = [["amber", AlertTriangle], ["red", XCircle], ["green", Check], ["green", Check], ["gray", Minus]];
const MEDS = [["green", "FLUDEX SR 1.5 MG", "Uygun"], ["amber", "LIPITOR 20 MG", "Dikkat"], ["green", "ECOPIRIN 100 MG", "Uygun"], ["gray", "PAROL 500 MG", "Raporsuz"]];
const TAG = { green: s.green, amber: s.amber, gray: s.idle };

function PanelScene() {
  const P2 = 1.9;
  const P3 = 3.9;
  return (
    <div className={s.stage}>
      <div className={`${s.mini} ${fx.rise}`} style={{ left: 100, top: 110, width: 370, height: 570, ...d(0.1) }}>
        <div className={s.miniHead}>
          <Image src={AMBLEM} alt="" width={34} height={34} sizes="34px" />
          <div className={s.grow}><p className={s.miniTitle}>Canlı takip</p><span className={s.live}><i /> Takipte</span></div>
        </div>
        {TODAY.map(([tone, Icon], i) => (
          <div key={i} className={`${s.miniRow} ${i === 0 ? s.highlight : ""}`} style={i === 0 ? d(1.3) : undefined}>
            <span className={`${s.badgeDot} ${s[`bg_${tone}`]}`}><Icon size={19} /></span>
            <span className={s.rowText}><span className={s.mono} style={{ fontSize: 15.5 }}>{["3PU8DL7", "1TK9CZ4", "5KP8C1Z", "7MN2Q4X", "9QH3L2M"][i]}</span><Skel w={90 + i * 14} /></span>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        ))}
      </div>
      <span className={`${s.arrow} ${fx.pop}`} style={{ left: 479, top: 369, ...d(P2 - 0.3) }}><ArrowRight size={24} /></span>

      <div className={`${s.mini} ${fx.rise}`} style={{ left: 540, top: 110, width: 370, height: 570, ...d(P2) }}>
        <div className={s.miniHead}>
          <span className={s.grow}><p className={`${s.miniTitle} ${s.mono}`}>3PU8DL7</p><span className={s.sub} style={{ fontSize: 14 }}>4 ilaç · 3 raporlu</span></span>
          <Pill2 tone="amber">Dikkat</Pill2>
        </div>
        {MEDS.map(([tone, name, label], i) => (
          <div key={name} className={`${s.medRow} ${s[`med_${tone}`]} ${i === 1 ? s.riseFocus : fx.rise}`}
            style={{ ...d(P2 + 0.3 + i * 0.15), "--d2": `${P3 - 0.6}s` }}>
            {name}<span className={`${s.tag} ${TAG[tone]}`}>{label}</span>
          </div>
        ))}
      </div>
      <span className={`${s.arrow} ${fx.pop}`} style={{ left: 919, top: 369, ...d(P3 - 0.3) }}><ArrowRight size={24} /></span>

      <div className={`${s.mini} ${fx.rise}`} style={{ left: 980, top: 110, width: 370, height: 570, ...d(P3) }}>
        <div className={s.miniHead}><span className={s.grow}><p className={s.miniTitle}>LIPITOR 20 MG</p><span className={s.sub} style={{ fontSize: 14 }}>Analiz sonucu</span></span></div>
        <div className={`${s.banner} ${fx.pop}`} style={d(P3 + 0.3)}><AlertTriangle size={22} /> Dikkat</div>
        <div className={s.section} style={{ padding: "18px 24px 0", gap: 12 }}>
          <p className={s.label}>SUT KRİTERLERİ · 2 / 3</p>
          {[[true, "Tanı uygun"], [true, "Uzman hekim raporu"], [false, "LDL değeri raporda yok"]].map(([ok, text], i) => (
            <p key={text} className={`${s.check} ${fx.rise}`} style={{ fontSize: 16.5, ...d(P3 + 0.6 + i * 0.25) }}>
              {ok ? <CheckCircle2 size={22} className={s.ok} /> : <XCircle size={22} className={s.fail} />} {text}
            </p>
          ))}
          <p className={s.label} style={{ marginTop: 10 }}>DOZ</p>
          <p className={`${s.check} ${fx.rise}`} style={{ fontSize: 16.5, ...d(P3 + 1.5) }}><CheckCircle2 size={22} className={s.ok} /> Reçete dozu uygun</p>
        </div>
      </div>
    </div>
  );
}

export const livePanel = {
  id: "canli-panel",
  title: "Sonucu kayan pencerede görün",
  desc: "Günün reçeteleri sonuçlarıyla listelenir. Reçeteye basın, ilaçlarını görün; ilaca basın, SUT kriterlerini ve dozu görün.",
  duration: 7500,
  Content: PanelScene,
  captions: [[0.2, 1.7, "Günün reçeteleri, sonuçlarıyla", Radar], [2.0, 3.7, "Reçetenin bütün ilaçları", Pill], [4.0, 7.3, "İlacın SUT kriterleri ve dozu", ClipboardCheck]],
};

/* ================================================================== PDF */

function PdfScene() {
  const MASK = 1.4;
  const TRAVEL = 3.0;
  const RESULT = 4.3;
  const personal = [["Ad Soyad", 130], ["T.C. Kimlik", 110], ["Doktor", 120]];
  return (
    <div className={s.stage}>
      <div className={`${s.pdf} ${fx.rise}`} style={{ left: 130, top: 150, width: 400, height: 470, ...d(0.1) }}>
        <span className={s.pdfTag}>PDF</span>
        <p className={s.title} style={{ fontSize: 20, marginBottom: 14 }}>Rapor</p>
        {personal.map(([label, w], i) => (
          <div key={label} className={s.pdfLine}>
            <span>{label}</span>
            <span className={s.pdfValue}>
              <span className={fx.out} style={d(MASK + 0.3 + i * 0.25)}><Skel w={w} dark /></span>
              <span className={`${s.locked} ${fx.pop}`} style={d(MASK + 0.3 + i * 0.25)}><Lock size={13} /> ••••••</span>
            </span>
          </div>
        ))}
        {[["Tanı", 150], ["Etkin madde", 130], ["Tedavi şeması", 100]].map(([label, w]) => (
          <div key={label} className={s.pdfLine}><span>{label}</span><Skel w={w} dark /></div>
        ))}
        <span className={s.sweep} style={d(MASK)} />
      </div>
      <div className={`${s.shield} ${fx.popUp}`} style={{ left: 150, top: 646, ...d(MASK + 1.2) }}><ShieldCheck size={22} /> Kişisel bilgiler bilgisayarınızda maskelendi</div>

      <span className={`${s.track} ${s.trackGrow}`} style={{ left: 550, top: 384, width: 300, ...d(TRAVEL - 0.3) }} />
      <span className={s.dot} style={{ left: 550, top: 385, "--dist": "300px", ...d(TRAVEL) }} />

      <div className={`${s.card} ${fx.rise}`} style={{ left: 870, top: 150, width: 450, height: 470, ...d(RESULT) }}>
        <div className={s.head}>
          <Image src={AMBLEM} alt="" width={42} height={42} sizes="42px" />
          <div className={s.grow}><p className={s.title}>PLAVIX 75 MG</p><p className={s.sub}>Akıllı Rapor Analizi</p></div>
        </div>
        <div className={s.section}>
          <span className={fx.pop} style={d(RESULT + 0.3)}><Pill2 tone="green">Uygun</Pill2></span>
          <p className={`${s.label} ${fx.rise}`} style={{ marginTop: 8, ...d(RESULT + 0.5) }}>SUT KRİTERLERİ · 3 / 3</p>
          {["Tanı ve işlem belgelenmiş", "Kardiyoloji uzman raporu", "Rapor süresi geçerli"].map((text, i) => (
            <p key={text} className={`${s.check} ${fx.rise}`} style={d(RESULT + 0.7 + i * 0.3)}><CheckCircle2 size={24} className={s.ok} /> {text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export const pdfCheck = {
  id: "pdf",
  title: "PDF raporu yükleyin",
  desc: "Medula'dan indirdiğiniz PDF raporu ve ilacı seçin. Kişisel bilgiler bilgisayarınızda maskelenir; rapor güncel SUT'a göre kriter kriter analiz edilir.",
  duration: 7500,
  Content: PdfScene,
  captions: [[0.3, 2.8, "Kişisel bilgiler bilgisayarınızda maskelenir", Lock], [3.0, 4.4, "Rapor SUT'a göre analiz edilir", Radar], [4.7, 7.3, "Sonuç, kriter kriter", CheckCircle2]],
};
