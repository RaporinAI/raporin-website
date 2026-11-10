"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaShieldAlt,
  FaHistory,
  FaUsersCog,
  FaGlobe,
  FaLayerGroup,
  FaPills,
} from "react-icons/fa";
import { RiSparkling2Fill } from "react-icons/ri";
import { Radar } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      Icon: RiSparkling2Fill,
      title: "Güncel SUT ile Akıllı Analiz",
      desc: "Modelimiz güncel SUT dokümanlarıyla eğitilmiştir. Tebliğ güncellemeleri sisteme düzenli olarak yansıtılır; raporlarınız her zaman geçerli kurallara göre değerlendirilir.",
      layout: "featured",
    },
    {
      Icon: Radar,
      title: "Canlı Takip",
      desc: "Eczane programınızdan ya da Medula'dan kaydettiğiniz reçete arka planda kontrol edilir; sorun varsa ekranın kenarında uyarı açılır.",
      layout: "normal",
      live: true,
    },
    {
      Icon: FaGlobe,
      title: "Medula Entegrasyonu",
      desc: "Reçete ve rapor bilgileri doğrudan Medula'dan alınır. Kontrol için gereken her şey uygulamada hazır bekler.",
      layout: "normal",
    },
    {
      Icon: FaLayerGroup,
      title: "Tek Tıkla Toplu Analiz",
      desc: "Seçtiğiniz dönemin tüm raporlu ilaçları tek tıkla analize gider. Analiz arka planda sürerken siz çalışmaya devam edersiniz.",
      layout: "normal",
    },
    {
      Icon: FaPills,
      title: "Reçete–Rapor Doz Kontrolü",
      desc: "Yapay zeka, reçetedeki doz ile rapordaki dozu karşılaştırır ve doz uyumsuzluğunu hemen tespit eder.",
      layout: "normal",
    },
    {
      Icon: FaShieldAlt,
      title: "KVKK Uyumu ve Güvenli Analiz",
      desc: "Hasta TC, ad-soyad ve rapor numarası hiçbir zaman gönderilmez ve saklanmaz; PDF akışında kişisel alanlar bilgisayarınızda maskelenir.",
      layout: "normal",
    },
    {
      Icon: FaHistory,
      title: "Dönem Bazlı Takip ve Geçmiş",
      desc: "Her fatura dönemi ayrı ayrı durur. Geçmiş dönemlere dönüp sonuçları istediğiniz zaman yeniden görüntüleyebilirsiniz.",
      layout: "normal",
    },
    {
      Icon: FaUsersCog,
      title: "Ekip Notları ve Rol Yönetimi",
      desc: "Ekip üyelerine rol ve yetki atayın; rapor kontrolleri üzerine not bırakarak eczane içi iş akışını tek yerden yönetin.",
      layout: "wide",
    },
  ];

  const spanClass = {
    featured: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    normal: "",
    wide: "md:col-span-2 lg:col-span-2",
  };

  return (
    <section id="ozellikler" className="relative py-24 bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      {/* Arka plan dokusu */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6">
        <motion.h2
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Öne Çıkan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
            Özellikler
          </span>
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Dönemin tamamını Medula&apos;dan aktarın, tek tıkla analiz edin; yeni reçeteleri canlı takip kaydettiğiniz an kontrol etsin.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const { Icon } = f;

            if (f.layout === "featured") {
              return (
                <motion.div
                  key={f.title}
                  className={`${spanClass.featured} group relative overflow-hidden rounded-3xl border border-teal-100 shadow-xl shadow-teal-900/10`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/akılli-analiz-arka-plan.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Metin okunabilirliği için yumuşak açılım */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

                  <div className="relative flex h-full flex-col p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12A897] to-[#17C6A3] text-white shadow-lg shadow-teal-900/20 transition-transform duration-300 group-hover:scale-105">
                      <Icon size={34} />
                    </div>
                    <h3 className="mt-7 text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                      {f.title}
                    </h3>
                    <p className="mt-4 text-gray-700 leading-relaxed lg:text-lg max-w-xl">
                      {f.desc}
                    </p>
                    <div className="mt-auto pt-8">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200 backdrop-blur-sm">
                        Yapay Zeka Motoru
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            }

            const isWide = f.layout === "wide";

            return (
              <motion.div
                key={f.title}
                className={`${spanClass[f.layout]} group relative overflow-hidden rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 * i }}
              >
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-teal-100/60 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className={`relative ${isWide ? "flex items-start gap-5" : ""}`}>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:from-[#12A897] group-hover:to-[#17C6A3] group-hover:text-white group-hover:ring-teal-300">
                    <Icon size={22} />
                  </div>
                  <div className={isWide ? "" : "mt-5"}>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      {f.title}
                      {f.live && (
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#17C6A3] opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#17C6A3]" />
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
