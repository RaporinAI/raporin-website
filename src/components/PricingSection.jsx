"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BETA_END } from "./BetaCountdown";
import PlanCards, { BillingToggle } from "./pricing/PlanCards";

const betaEndLabel = new Date(BETA_END).toLocaleDateString("tr-TR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Istanbul",
});

const BETA_STEPS = [
  { title: "Ücretsiz kayıt olun", text: `Son gün: ${betaEndLabel}` },
  { title: "Beta boyunca ücretsiz kullanın", text: "Tüm özellikler açık" },
  { title: "Sonra %50 indirim", text: "Sınırsız yıllıkta, beta üyelerine" },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(true);

  return (
    <section
      id="fiyatlandirma"
      className="py-24 bg-gradient-to-b from-white via-[#F8FFFD] to-[#E9FFFB]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#17C6A3] to-[#0F918B]">
            Fiyatlandırma
          </h2>
          <p className="mt-3 text-gray-600">Eczanenizin reçete yoğunluğuna uygun paketi seçin.</p>
        </div>

        <ol className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
          {BETA_STEPS.map((step, i) => {
            const last = i === BETA_STEPS.length - 1;
            return (
              <li
                key={step.title}
                className={`flex items-start gap-3 rounded-2xl border-2 p-4 ${
                  last ? "border-[#FFD84D] bg-[#FFF6CC]" : "border-[#17C6A3]/30 bg-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    last ? "bg-[#FFD84D] text-[#5A3E00]" : "bg-[#17C6A3] text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-bold text-gray-900">{step.title}</span>
                  <span className="block text-sm text-gray-600">{step.text}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </div>

        <PlanCards yearly={yearly} className="mt-12 md:grid-cols-3" />

        <div className="mt-12 flex justify-center">
          <motion.a
            href="/kayit"
            whileHover={{ scale: 1.02 }}
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-10 text-lg font-semibold text-white shadow-lg shadow-teal-700/20 transition-colors hover:from-teal-800 hover:to-teal-700"
          >
            Beta&apos;ya ücretsiz katıl <ArrowRight size={20} />
          </motion.a>
        </div>
        <p className="mt-3 text-center text-sm text-gray-600">
          Kredi kartı gerekmez · Son gün: {betaEndLabel}
        </p>
      </div>
    </section>
  );
}
