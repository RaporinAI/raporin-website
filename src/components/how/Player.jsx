"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import fx from "./fx.module.css";

// Canlandırma oynatıcısı. Sahne 1440×810'luk bir tuvalde gerçek uygulama ekranını çizer; oynatıcı
// sahnedeki hedefleri (data-t) ölçer, imleci ve kamerayı (yakınlaşma/kaydırma) bu hedeflere göre üretir.
// Böylece düğmenin yeri değişse de imleç ve kamera doğru yere gider.
export const CANVAS_W = 1440;
export const CANVAS_H = 810;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Hedefin tuvaldeki yeri. Animasyon dönüşümleri yok sayılır; data-scale taşıyan kaplar hesaba katılır. */
function measure(canvas, name) {
  const el = canvas.querySelector(`[data-t="${name}"]`);
  if (!el) return null;
  let x = 0;
  let y = 0;
  let w = el.offsetWidth;
  let h = el.offsetHeight;
  let e = el;
  while (e && e !== canvas) {
    x += e.offsetLeft;
    y += e.offsetTop;
    const parent = e.offsetParent;
    const s = parent?.dataset?.scale ? Number(parent.dataset.scale) : 1;
    if (s !== 1) {
      x *= s; y *= s; w *= s; h *= s;
    }
    e = parent;
  }
  return { x, y, w, h };
}

/** "hedef" ya da "hedef@ax,ay" (0-1 arası çapa) ya da {x, y}. */
function point(canvas, at) {
  if (at && typeof at === "object" && at.at) {
    const p = point(canvas, at.at);
    return { x: p.x + (at.dx || 0), y: p.y + (at.dy || 0) };
  }
  if (typeof at !== "string") return at;
  const [name, anchor] = at.split("@");
  const [ax, ay] = anchor ? anchor.split(",").map(Number) : [0.5, 0.5];
  const r = measure(canvas, name);
  if (!r) return { x: CANVAS_W / 2, y: CANVAS_H / 2 };
  return { x: r.x + r.w * ax, y: r.y + r.h * ay };
}

/** Kamera: "all" ya da { at, w } (hedef merkezli, w genişliğinde bölge). */
function cameraTransform(canvas, view) {
  if (view === "all" || !view) return "translate(0px, 0px) scale(1)";
  const w = Math.min(CANVAS_W, view.w);
  const h = (w * CANVAS_H) / CANVAS_W;
  const c = point(canvas, view.at);
  const cx = c.x + (view.dx || 0);
  const cy = c.y + (view.dy || 0);
  const rx = Math.max(0, Math.min(CANVAS_W - w, cx - w / 2));
  const ry = Math.max(0, Math.min(CANVAS_H - h, cy - h / 2));
  const s = CANVAS_W / w;
  return `translate(${(-rx * s).toFixed(1)}px, ${(-ry * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
}

function keyframes(name, duration, entries, valueOf) {
  const frames = entries.map(([t, v]) => `${Math.min(100, (t / duration) * 100).toFixed(2)}% { transform: ${valueOf(v)}; }`);
  return `@keyframes ${name} { ${frames.join(" ")} }`;
}

function SceneCanvas({ scene }) {
  const canvasRef = useRef(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [plan, setPlan] = useState(null);
  const { Content } = scene;
  const duration = scene.duration / 1000;

  useIsoLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const camera = scene.camera?.length ? scene.camera : [[0, "all"]];
    const cursor = scene.cursor || [];
    const css = [
      keyframes(`cam${uid}`, duration, [[0, camera[0][1]], ...camera, [duration, camera[camera.length - 1][1]]],
        (v) => cameraTransform(canvas, v)),
    ];
    if (cursor.length) {
      css.push(keyframes(`cur${uid}`, duration, [[0, cursor[0][1]], ...cursor, [duration, cursor[cursor.length - 1][1]]],
        (v) => {
          const p = point(canvas, v);
          return `translate(${(p.x - 3).toFixed(1)}px, ${(p.y - 2).toFixed(1)}px)`;
        }));
    }
    const clicks = (scene.clicks || []).map(([t, at]) => ({ t, ...point(canvas, at) }));
    setPlan({ css: css.join("\n"), clicks });
  }, [scene, uid, duration]);

  const ease = "cubic-bezier(.65, 0, .35, 1)";
  return (
    <div ref={canvasRef} className={fx.canvas}>
      {plan && <style>{plan.css}</style>}
      <div className={fx.camera} style={plan ? { animation: `cam${uid} ${duration}s ${ease} both` } : undefined}>
        <Content />
        {plan?.clicks.map((c, i) => (
          <span key={i} className={fx.ripple} style={{ left: c.x, top: c.y, "--d": `${c.t}s` }} />
        ))}
        {plan && scene.cursor?.length > 0 && (
          <span className={fx.cursor} style={{ animation: `cur${uid} ${duration}s ${ease} both` }}>
            <svg viewBox="0 0 16 20" width="22" height="28" aria-hidden="true">
              <path d="M1 1v15l4-3.6 2.7 6 2.6-1.2-2.6-5.8H13z" fill="#0f172a" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      {(scene.captions || []).map(([t, t2, text, Icon]) => (
        <div key={text} className={fx.caption} style={{ "--d": `${t}s`, "--d2": `${t2}s` }}>
          {Icon && <Icon size={26} />} {text}
        </div>
      ))}
    </div>
  );
}

export default function Player({ scene, run }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const update = () => el.style.setProperty("--scale", String(el.clientWidth / CANVAS_W));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={fx.root} aria-hidden="true">
      <SceneCanvas key={`${run}-${scene.id}`} scene={scene} />
    </div>
  );
}
