// Statik paket verisi: backend kataloğu alınamazsa gösterilir (satın alma o durumda kapalı). Admin paneldeki
// herkese açık fiyatlarla aynı tutulur.
// Fiyatlar TL, KDV hariç.

export const PRICING_PLANS = [
  {
    id: "standart",
    name: "Standart",
    description: "Raporlu reçetesi ortalama olan eczaneler için",
    monthlyCredits: 600,
    monthly: { price: 450, listPrice: 550, popular: false },
    yearly: { price: 4500, listPrice: 5400, campaignLabel: "2 ay ücretsiz", popular: false },
  },
  {
    id: "profesyonel",
    name: "Profesyonel",
    description: "Raporlu reçetesi yüksek olan eczaneler için",
    monthlyCredits: 1200,
    monthly: { price: 649, listPrice: 849, popular: true },
    yearly: { price: 6490, listPrice: 7788, campaignLabel: "2 ay ücretsiz", popular: true },
  },
  {
    id: "sinirsiz",
    name: "Sınırsız",
    description: "Kredi saymak istemeyen yoğun eczaneler için",
    monthlyCredits: null,
    monthly: { price: 1299, listPrice: 1599, popular: false },
    yearly: { price: 9353, listPrice: 15588, campaignLabel: "Lansmana özel %40 indirim", popular: false },
  },
];
