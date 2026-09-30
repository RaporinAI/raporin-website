export const metadata = {
  // absolute: kök layout'un "%s | RaporinAI" şablonunu devre dışı bırakır;
  // başlık zaten marka adıyla başladığı için son ek markayı iki kez taşırdı.
  title: {
    absolute: "RaporinAI İndir — Eczane Rapor Kontrol Programı (Windows)",
  },
  description:
    "RaporinAI masaüstü uygulamasını Windows bilgisayarınıza ücretsiz indirin. Medula'dan aktardığınız reçeteleri ve raporları SUT kurallarına göre analiz edin, SGK kesintilerini fatura teslim etmeden önce önleyin.",
  alternates: {
    canonical: "https://raporin.com/indir",
  },
  openGraph: {
    title: "RaporinAI İndir — Eczane Rapor Kontrol Programı (Windows)",
    description:
      "RaporinAI masaüstü uygulamasını Windows'a ücretsiz indirin. Medula entegrasyonu ile toplu reçete ve rapor analizi.",
    url: "https://raporin.com/indir",
    type: "website",
  },
};

export default function DownloadLayout({ children }) {
  return children;
}
