"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Gift } from "lucide-react";
import PlanCards, { BillingToggle, yearlyToggleProps } from "./pricing/PlanCards";
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
          {/* Kredi ve hoş geldin hediyesi tek, sakin bir bilgi satırında; vurgu paketlerde kalır. */}
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-1.5">
              <Coins size={15} className="text-teal-600" aria-hidden="true" />
              <strong className="font-semibold text-slate-800">1 kredi = 1 ilaç analizi</strong>
            </li>
            {catalog.welcomeCredits > 0 && (
              <>
                <li aria-hidden="true" className="text-gray-300">•</li>
                <li className="flex items-center gap-1.5">
                  <Gift size={15} className="text-teal-600" aria-hidden="true" />
                  Kayıtta <strong className="font-semibold text-slate-800">{formatTL(catalog.welcomeCredits)} kredi hediye</strong>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-10">
          <BillingToggle yearly={yearly} onChange={setYearly} {...yearlyToggleProps(catalog.plans)} />
        </div>

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
