import { PRICING_PLANS } from "./pricingPlans";

export const SITE_URL = "https://raporin.com";

// SoftwareApplication ve llms.txt için kamuya açık ürün bilgileri.
export const product = {
  name: "RaporinAI",
  description: "RaporinAI, Türkiye’deki eczaneler için yapay zeka destekli bir reçete ve rapor kontrol programıdır. Medula’dan reçete aktarımı, PDF ile tekil rapor kontrolü, toplu analiz ve reçete–rapor doz karşılaştırması sunar; SUT kriterlerine göre değerlendirme sonuçlarını gösterir.",
  limitation: "RaporinAI eczacının kontrol sürecini destekler. Analiz sonuçları eczacı tarafından değerlendirilmelidir; SGK ödeme onayı veya kesintisizlik garantisi vermez.",
  facts: [
    { label: "Kimler için?", value: "Türkiye’deki eczacılar ve eczane ekipleri" },
    { label: "Platform", value: "Windows masaüstü uygulaması" },
    { label: "Veri aktarımı", value: "Medula’dan reçete aktarımı veya PDF rapor yükleme" },
    { label: "Kontrol kapsamı", value: "SUT kriterleri, rapor koşulları ve reçete–rapor doz uyumu" },
    { label: "Çalışma biçimi", value: "Tekil ilaç analizi ve fatura dönemindeki raporlu ilaçların toplu analizi" },
    { label: "Ücret", value: "Aylık veya yıllık abonelik paketleri; hesap oluşturmak ücretsizdir ve kredi kartı gerekmez." },
  ],
  features: [
    "Medula’dan reçete aktarımı",
    "PDF ile tekil rapor kontrolü",
    "Fatura dönemindeki raporlu ilaçların toplu analizi",
    "Reçete–rapor doz karşılaştırması",
    "SUT kriterlerine göre açıklamalı analiz sonuçları",
  ],
};

export const softwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: product.name,
  url: SITE_URL,
  description: product.description,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Eczane reçete ve rapor kontrol programı",
  operatingSystem: "Windows",
  inLanguage: "tr-TR",
  audience: { "@type": "Audience", audienceType: "Eczacılar ve eczane ekipleri" },
  publisher: { "@id": `${SITE_URL}/#organization` },
  downloadUrl: `${SITE_URL}/indir`,
  screenshot: `${SITE_URL}/screens/toplu-analiz.png`,
  featureList: product.features,
  offers: monthlyOffers(),
};

/**
 * Aylık paket fiyat aralığı (KDV hariç, sitede gösterildiği gibi). Fiyatlar admin panelden
 * değiştirildiğinde pricingPlans.js de güncellenmeli; şemadaki fiyat sayfadakiyle çelişmemeli.
 */
function monthlyOffers() {
  const prices = PRICING_PLANS.map((plan) => plan.monthly.price);
  return {
    "@type": "AggregateOffer",
    priceCurrency: "TRY",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "TRY",
      price: Math.min(...prices),
      unitCode: "MON",
      valueAddedTaxIncluded: false,
    },
    description: "Aylık ve yıllık abonelik paketleri (KDV hariç). Hesap oluşturmak ücretsizdir.",
    url: `${SITE_URL}/#fiyatlandirma`,
  };
}
