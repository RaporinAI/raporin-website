"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Gift } from "lucide-react";
import PlanCards, { BillingToggle, yearlyToggleProps } from "./pricing/PlanCards";
import { BetaOfferStrip } from "./billing/BetaOffer";
import { formatTL, loadCatalogShared, STATIC_CATALOG } from "../lib/billing/catalog";
import { savePendingPurchase } from "../lib/billing/pendingPurchase";
import { hasSessionFlag } from "../lib/auth/sessionFlag";

export default function PricingSection() {
  const [yearly, setYearly] = useState(true);
  // İlk çizim statik paketlerle yapılır; admin panelde yönetilen katalog gelince güncellenir.
  const [catalog, setCatalog] = useState(STATIC_CATALOG);
  useEffect(() => {
    loadCatalogShared().then(setCatalog);
  }, []);

  // Satın alma açıksa: oturumu açık kullanıcı doğrudan ödeme sayfasına gider,
  // diğerleri kayıt sayfasına (oradan girişe de geçilebilir). Seçilen paket kayıt, e-posta
  // doğrulama ve giriş boyunca hatırlanır.
  const action = (plan, price) =>
    catalog.purchaseEnabled && price.purchasable && price.id
      ? {
          label: "Satın al",
          onClick: () => {
            savePendingPurchase(price.id);
            window.location.assign(hasSessionFlag() ? `/hesabim/satin-al?paket=${price.id}` : "/kayit");
          },
        }
      : null;

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

        {catalog.welcomeCredits > 0 && (
          <div className="mx-auto mt-8 flex max-w-3xl items-center gap-4 rounded-2xl border border-teal-100 bg-white/80 px-5 py-4 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Gift size={22} aria-hidden="true" />
            </span>
            <p className="text-sm text-gray-600">
              <strong className="text-base text-slate-900">Kaydolun, {formatTL(catalog.welcomeCredits)} kredi hediye!</strong>{" "}
              Kart bilgisi gerekmez; RaporinAI&apos;yi hemen kendi reçetelerinizle deneyin.
            </p>
          </div>
        )}

        <div className="mt-10">
          <BillingToggle yearly={yearly} onChange={setYearly} {...yearlyToggleProps(catalog.plans)} />
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[15px] font-semibold text-teal-700">
          <Coins size={16} aria-hidden="true" /> 1 kredi = 1 ilaç analizi
        </p>

        {/* Yalnızca giriş yapmış beta üyesine, indirim süresince (katalog eczaneye göre gelir) */}
        <BetaOfferStrip endsAt={catalog.betaOfferEndsAt} className="mx-auto mt-8 max-w-3xl" />

        <PlanCards
          plans={catalog.plans}
          yearly={yearly}
          action={action}
          betaEndsAt={catalog.betaOfferEndsAt}
          className="mt-10 md:grid-cols-3"
        />

        {catalog.creditPack && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
            Aylık krediniz yetmezse paketinizi istediğiniz an yükseltebilir ya da{" "}
            <strong className="font-semibold text-gray-800">ek kredi</strong> alabilirsiniz.
          </p>
        )}

        <div className="mt-12 flex justify-center">
          <motion.a
            href="/kayit"
            whileHover={{ scale: 1.02 }}
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#008C87] to-[#00A58E] px-10 text-lg font-semibold text-white shadow-lg shadow-teal-700/20 transition-colors hover:from-teal-800 hover:to-teal-700"
          >
            {catalog.welcomeCredits > 0 ? `${formatTL(catalog.welcomeCredits)} ücretsiz krediyle başlayın` : "Ücretsiz başla"} <ArrowRight size={20} />
          </motion.a>
        </div>
        <p className="mt-3 text-center text-sm text-gray-600">
          {catalog.welcomeCredits > 0
            ? "Kredi kartı gerekmez · Dakikalar içinde ilk analiz"
            : "Hesap oluşturmak ücretsiz · Kredi kartı gerekmez"}
        </p>
      </div>
    </section>
  );
}
