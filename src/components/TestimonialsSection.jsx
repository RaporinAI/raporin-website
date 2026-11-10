"use client";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function TestimonialsSection() {
  /**
   * Eczacılardan gelen gerçek geri bildirimler.
   *
   * Eczane veya kişi adı yayımlanmaz. Yorum sahibi izin verirse
   * `author` alanına maskelenmiş baş harf ("Ecz. B.K."), `city` alanına
   * şehir yazılabilir; boş bırakılan alanlar kartta hiç görünmez.
   */
  const testimonials = [
    {
      headline: "Toplu reçete analizi gün sonunda işimizi gerçekten kolaylaştırıyor.",
      comment:
        "Önceden tek tek kontrol ettiğimiz reçeteleri artık toplu şekilde analiz edebiliyoruz. Özellikle raporlu reçetelerin yoğun olduğu günlerde gözden kaçabilecek detayları daha hızlı fark etmemizi sağlıyor.",
      author: "Ecz. A.Y.",
      city: "",
      rating: 5,
    },
    {
      headline: "Sadece uygun ya da uygun değil demesi değil, nedenini açıklaması benim için önemli.",
      comment:
        "RaporinAI'ın en sevdiğim tarafı detaylı SUT değerlendirmesi sunması. Hangi kriterin sağlandığını, hangi noktada dikkat edilmesi gerektiğini görebilmek kontrol sürecini çok daha anlaşılır hale getiriyor.",
      author: "Ecz. B.K.",
      city: "",
      rating: 5,
    },
    {
      headline: "Yoğunlukta en büyük faydası atlanabilecek noktaları göstermesi ve ilaç dozlarına kadar analiz etmesi.",
      comment:
        "Günde çok sayıda reçete kontrol ederken aynı dikkati sürekli korumak zor olabiliyor. RaporinAI reçete, rapor ve SUT koşullarını birlikte değerlendirerek özellikle dikkat etmem gereken alanları öne çıkarıyor.",
      author: "Ecz. D.M.",
      city: "",
      rating: 5,
    },
  ];

  const stats = [
    { number: "1000+", label: "Aktif Eczane" },
    { number: "%98", label: "Doğruluk Oranı" },
    { number: "250K+", label: "Kontrol Edilen Reçete" },
    { number: "4.9/5", label: "Kullanıcı Memnuniyeti" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Eczacılar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
              Ne Diyor?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            RaporinAI kullanan eczacıların deneyimlerini ve başarı hikayelerini keşfedin.
          </p>
        </motion.div>

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-teal-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Eczacı yorumları — tek yorum öne çıkan blok, çoğaldıkça grid'e yayılır */}
        {testimonials.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8">
            {testimonials.map((testimonial, index) => {
              const isFeatured = testimonials.length === 1;
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative w-full overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
                  isFeatured ? "max-w-3xl p-9 sm:p-10" : "max-w-md lg:max-w-[380px] p-7"
                }`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-teal-50 to-emerald-50 blur-3xl" />
                <div className="pointer-events-none absolute right-5 top-5 opacity-10">
                  <FaQuoteLeft size={52} className="text-teal-600" />
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400" size={16} />
                    ))}
                  </div>

                  {testimonial.headline ? (
                    <>
                      <p
                        className={`font-semibold text-gray-900 leading-snug ${
                          isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}
                      >
                        &ldquo;{testimonial.headline}&rdquo;
                      </p>
                      <p
                        className={`mt-3 text-gray-600 leading-relaxed ${
                          isFeatured ? "text-lg" : "text-sm"
                        }`}
                      >
                        {testimonial.comment}
                      </p>
                    </>
                  ) : (
                    <p
                      className={`text-gray-700 leading-relaxed ${
                        isFeatured ? "text-lg sm:text-xl" : ""
                      }`}
                    >
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-3 border-t border-teal-50 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-md">
                      <FaQuoteLeft size={14} />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {testimonial.author || "Eczacı"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.city
                          ? `${testimonial.city} · Doğrulanmış kullanıcı`
                          : "Doğrulanmış kullanıcı"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}

        {/* Alt CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Siz de Başarı Hikayenizi Yazın
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Binlerce eczacının güvendiği RaporinAI ile SGK kesintilerinizi azaltın ve zamandan tasarruf edin.
            </p>
            <a
              href="/kayit"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105"
            >
              Ücretsiz Deneyin
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
