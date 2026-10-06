// Statik paket verisi. İleride backend'den gelecek; aynı şekli koruyarak değiştirilebilir.
// Fiyatlar TL, KDV hariç.

export const BETA_DISCOUNT_RATE = 0.5;

export const PRICING_PLANS = [
  {
    id: "standart",
    name: "Standart",
    description: "Raporlu reçetesi ortalama olan eczaneler için",
    monthlyCredits: 600,
    monthly: { price: 450, popular: false },
    yearly: { price: 4500, listPrice: 5400, popular: false },
  },
  {
    id: "profesyonel",
    name: "Profesyonel",
    description: "Raporlu reçetesi yüksek olan eczaneler için",
    monthlyCredits: 1200,
    monthly: { price: 649, popular: true },
    yearly: { price: 6490, listPrice: 7788, popular: false },
  },
  {
    id: "sinirsiz",
    name: "Sınırsız",
    description: "Kredi saymak istemeyen yoğun eczaneler için",
    monthlyCredits: null,
    monthly: { price: 1299, popular: true },
    yearly: { price: 12990, listPrice: 15588, popular: true, betaDiscount: true },
  },
];
