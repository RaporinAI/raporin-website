"use client";
import { AlertTriangle, ArrowRight, CheckCircle2, Download, Monitor, Package } from "lucide-react";
import { DESKTOP_VERSION, DOWNLOAD_URL } from "../../lib/download";
import { trackDownload } from "../../lib/analytics";
import { CURRENT_PLAN, betaDaysLeft } from "./SubscriptionSection";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

function Summary({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#e6edf1] bg-white p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

/** Genel bakış: indirme, yapılacaklar (eksik bilgiler) ve hesap özeti. */
export default function OverviewSection({ profile, pharmacy, todos, onNavigate }) {
  const firstName = (profile.displayName || profile.username || "").split(/\s+/)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Merhaba{firstName ? `, ${firstName}` : ""}</h1>
        <p className="mt-1 text-sm text-slate-500">Hesabınızı ve eczane bilgilerinizi buradan yönetebilirsiniz.</p>
      </div>

      <section className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#076E6B] via-[#008C87] to-[#00A58E] p-6 text-white shadow-xl shadow-teal-900/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Monitor size={22} aria-hidden="true" /> Masaüstü uygulaması
            </h2>
            <p className="mt-2 max-w-md text-sm text-teal-50">
              Kurulumdan sonra bu hesabın e-posta adresi ve şifresiyle giriş yapın.
            </p>
            <p className="mt-1 text-xs text-teal-100">Windows 10 / 11 · Sürüm {DESKTOP_VERSION}</p>
          </div>
          <a
            href={DOWNLOAD_URL}
            onClick={() => trackDownload(DOWNLOAD_URL)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-700 shadow-lg transition-colors hover:bg-teal-50"
          >
            <Download size={18} aria-hidden="true" /> Uygulamayı indir
          </a>
        </div>
      </section>

      <button
        type="button"
        onClick={() => onNavigate("paket")}
        className="group flex w-full items-center gap-4 rounded-[20px] border border-[#e6edf1] bg-white p-5 text-left shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-teal-200"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <Package size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 font-bold text-slate-900">
            Paketiniz:
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">{CURRENT_PLAN.name}</span>
          </span>
          <span className="mt-0.5 block text-sm text-slate-500">
            Sınırsız kredi, ücretsiz{betaDaysLeft() > 0 ? ` · Beta bitişine ${betaDaysLeft()} gün` : ""}
          </span>
        </span>
        <span className="hidden text-sm font-semibold text-teal-700 sm:inline">Paket detayları</span>
        <ArrowRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" aria-hidden="true" />
      </button>

      <section className="rounded-[20px] border border-[#e6edf1] bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h2 className="font-bold text-slate-900">Yapılacaklar</h2>
        {todos.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 size={18} aria-hidden="true" /> Hesap ve eczane bilgileriniz eksiksiz.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {todos.map((todo) => (
              <li key={todo.text}>
                <button
                  type="button"
                  onClick={() => onNavigate(todo.section)}
                  className="group flex w-full items-center gap-3 py-3 text-left text-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <AlertTriangle size={16} aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-slate-700">{todo.text}</span>
                  <ArrowRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="E-posta" value={profile.email} />
        <Summary label="Eczane" value={pharmacy?.name} />
        <Summary label="Ünvan" value={profile.titleDisplay} />
        <Summary label="Üyelik tarihi" value={profile.createdAt && dateFormatter.format(new Date(profile.createdAt))} />
      </section>
    </div>
  );
}
