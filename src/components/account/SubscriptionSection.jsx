"use client";
import { useState } from "react";
import { CalendarClock, Check, Infinity as InfinityIcon, Package, Sparkles } from "lucide-react";
import AccountCard from "./AccountCard";
import { BETA_END } from "../BetaCountdown";
import { BETA_DISCOUNT_RATE, PRICING_PLANS } from "../../lib/pricingPlans";
import PlanCards, { BillingToggle } from "../pricing/PlanCards";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Istanbul",
});
const MEMBER_DISCOUNT_LABEL = { yearly: "SİZE ÖZEL", monthly: "SİZE ÖZEL, YILLIKTA" };

// Satın alma açılana kadar tüm kullanıcılar beta paketinde. İleride paket bilgisi backend'den gelecek.
export const CURRENT_PLAN = { name: "Beta", endsAt: BETA_END };

export function betaDaysLeft() {
  return Math.max(0, Math.ceil((CURRENT_PLAN.endsAt - Date.now()) / 86_400_000));
}

const unlimitedPlan = PRICING_PLANS.find((plan) => plan.yearly.betaDiscount);

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e6edf1] bg-white p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
        <Icon size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

/** Paketim: mevcut paket (şimdilik herkes beta), beta üyesi indirimi ve beta sonrası paketler. */
export default function SubscriptionSection() {
  const daysLeft = betaDaysLeft();
  const [yearly, setYearly] = useState(true);

  return (
    <div className="space-y-6">
      <AccountCard icon={Package} title="Paketim" subtitle="Mevcut paketiniz ve kullanım hakkınız">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">{CURRENT_PLAN.name}</span>
          <span className="text-sm text-slate-500">Beta süresince tüm özellikler ücretsiz</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Fact icon={InfinityIcon} label="Kredi" value="Sınırsız" />
          <Fact icon={Check} label="Ücret" value="Ücretsiz" />
          <Fact
            icon={CalendarClock}
            label="Beta bitişi"
            value={`${dateFormatter.format(new Date(CURRENT_PLAN.endsAt))}${daysLeft > 0 ? ` · ${daysLeft} gün kaldı` : ""}`}
          />
        </div>

        <p className="mt-5 flex items-center gap-2 rounded-xl bg-[#FFF6CC] px-4 py-3 text-sm font-semibold text-[#5A3E00]">
          <Sparkles size={16} className="shrink-0" aria-hidden="true" />
          Beta üyesi olarak ücretli dönemde {unlimitedPlan.name} yıllık pakette %{BETA_DISCOUNT_RATE * 100} indirim hakkınız var.
        </p>
      </AccountCard>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Beta sonrası paketler</h2>
            <p className="mt-0.5 text-sm text-slate-500">Satın alma beta bittiğinde açılacak.</p>
          </div>
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </div>
        <PlanCards yearly={yearly} compact discountLabel={MEMBER_DISCOUNT_LABEL} className="mt-8 xl:grid-cols-3" />
      </section>
    </div>
  );
}
