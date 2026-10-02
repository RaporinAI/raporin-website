"use client";
import { useEffect, useState } from "react";

export const BETA_END = new Date("2026-10-31T23:59:59+03:00").getTime();

// Sunucu ile tarayıcı saati çakışmasın diye ilk render'da değer null; mount sonrası dolar.
function useBetaRemaining() {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, BETA_END - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = Math.floor((remaining ?? 0) / 1000);
  const values = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
  const format = (value) => (remaining === null ? "--" : String(value).padStart(2, "0"));

  return { ended: remaining === 0, values, format };
}

const timerLabel = "Beta döneminin bitmesine kalan süre";

export function BetaCountdown() {
  const { ended, values, format } = useBetaRemaining();
  if (ended) return null;

  return (
    <span role="timer" aria-label={timerLabel} className="inline-flex items-center gap-0.5 tabular-nums">
      {["g", "s", "dk", "sn"].map((unit, i) => (
        <span key={unit} className="rounded-full bg-[#075F55]/10 px-1.5 py-px text-[#075F55]">
          {format(values[i])}{unit}
        </span>
      ))}
    </span>
  );
}

export function BetaCountdownTiles() {
  const { ended, values, format } = useBetaRemaining();
  if (ended) return null;

  return (
    <div role="timer" aria-label={timerLabel} className="flex items-start justify-center gap-1.5 tabular-nums sm:gap-3">
      {["Gün", "Saat", "Dakika", "Saniye"].map((unit, i) => (
        <div key={unit} className="flex items-start gap-1.5 sm:gap-3">
          {i > 0 && <span aria-hidden="true" className="hidden pt-4 text-3xl font-bold text-[#17C6A3]/60 sm:inline">:</span>}
          <div className="flex w-[3.25rem] flex-col items-center rounded-2xl border border-[#17C6A3]/30 bg-white/80 py-3 shadow-sm sm:w-20">
            <span className="text-2xl font-extrabold text-[#075F55] sm:text-3xl">{format(values[i])}</span>
            <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
