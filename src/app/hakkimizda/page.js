"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaLightbulb, FaBrain, FaUsers, FaRocket, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Eczacı Ekibi",
      role: "Saha Deneyimi & Danışmanlık",
      icon: <FaUsers size={40} className="text-teal-600" />,
      description: "20+ yıllık eczacılık deneyimi ile gerçek ihtiyaçları anlıyoruz"
    },
    {
      name: "Yazılım Ekibi",
      role: "Teknoloji & Geliştirme",
      icon: <FaBrain size={40} className="text-teal-600" />,
      description: "Yapay zeka ve yazılım teknolojileri uzmanları"
    },
    {
      name: "Veri Güvenliği",
      role: "KVKK & Güvenlik",
      icon: <FaShieldAlt size={40} className="text-teal-600" />,
      description: "Kişisel verilerin korunması ve siber güvenlik uzmanları"
    }
  ];

  const milestones = [
    { year: "2023", title: "Proje Başlangıcı", desc: "Eczacıların SGK kesinti sorunlarını çözmek için yola çıktık" },
    { year: "2024", title: "Pilot Uygulamalar", desc: "İlk eczanelerle test süreçlerini başarıyla tamamladık" },
    { year: "2025", title: "Genel Kullanım", desc: "Tüm eczanelere açık, güvenli ve hızlı platform" }
  ];

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-white via-[#F9FFFD] to-[#E8FFFB]">
      {/* Hero Section */}
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-0"
          >
            <Image src="/logo.png" alt="RaporinAI" width={200} height={80} className="mx-auto mb-4" />
            <h1 className="sr-only">Hakkımızda</h1>
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl font-bold italic tracking-tight leading-relaxed text-teal-800 text-balance">
              Eczacılığın geleceğini yapay zekâyla bugünden inşa ediyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="pb-8 sm:pb-10 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-teal-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <FaLightbulb size={40} className="text-amber-500" />
              <h2 className="text-3xl font-bold text-gray-900">Hikayemiz</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>RaporinAI</strong>, eczacıların reçete ve rapor kontrolünde harcadığı zamanı azaltmak ve hata riskini daha erken görünür hale getirmek için geliştirildi.
              </p>
              <p>
                Eczanelerde her gün çok sayıda reçete ve rapor, güncel SUT kurallarına göre kontrol ediliyor. Bu süreç manuel ilerlediğinde hem zaman kaybına hem de gözden kaçan uyumsuzluklara neden olabiliyor.
              </p>
              <p>
                RaporinAI, yapay zekâ destekli analiz altyapısıyla reçete ve raporları saniyeler içinde inceler; olası uyumsuzlukları tespit eder ve neyin, neden dikkat gerektirdiğini açık şekilde gösterir.
              </p>
              <p>
                Biz yalnızca kontrol sürecini hızlandıran bir yazılım geliştirmiyoruz. Eczacıların operasyonel yükünü azaltan, karar süreçlerini destekleyen ve eczacılıkta dijital dönüşümü ileri taşıyan bir teknoloji altyapısı oluşturuyoruz.
              </p>
              <p className="text-teal-700 font-semibold">
                Amacımız, eczacıların zamanını değil, eczacılığa ayırmasını sağlamak.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teknolojimiz */}
      <section className="py-8 sm:py-10 px-6 lg:px-20 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex justify-center mb-4">
              <FaBrain size={50} className="text-teal-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Yapay Zeka Teknolojimiz</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RaporinAI, Medula entegrasyonu, optik karakter tanıma (OCR) ve doğal dil işleme (NLP) teknolojilerini bir arada kullanır.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaRocket className="text-teal-600" />
                Nasıl Çalışır?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">1</span>
                  <span><strong>Medula Girişi:</strong> Uygulama içindeki Medula ekranından kendi bilgilerinizle giriş yaparsınız</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">2</span>
                  <span><strong>Reçete Aktarımı:</strong> Fatura türü ve dönem seçilir; o dönemin reçeteleri Medula&apos;dan aktarılır</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">3</span>
                  <span><strong>Tekil veya Toplu Analiz:</strong> Tek bir ilacı kontrol edin ya da tek tıkla dönemin tamamını analize gönderin</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">4</span>
                  <span><strong>SUT ve Doz Kontrolü:</strong> ICD kodları, tanılar, SUT uyumu ve reçete–rapor doz uyumu kontrol edilir</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">5</span>
                  <span><strong>Sonuç Raporu:</strong> Uygun olmayan ilaçlar, gerekçeleri ve düzeltme önerileriyle listelenir</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">+</span>
                  <span><strong>PDF Akışı:</strong> Elinizdeki tekil bir raporu PDF olarak yükleyip kontrol etmek de mümkündür; kişisel alanlar bilgisayarınızda maskelenir</span>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaChartLine className="text-teal-600" />
                Avantajlarımız
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>%98 Doğruluk Oranı:</strong> Gelişmiş AI modelleri ile yüksek hassasiyet</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>Saniyeler İçinde Sonuç:</strong> Manuel kontrole göre 10 kat daha hızlı</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>KVKK Uyumlu:</strong> Hiçbir kişisel hasta verisi kaydedilmez</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-teal-600 text-xl">✓</span>
                  <span><strong>Sürekli Güncelleme:</strong> SUT değişiklikleri otomatik takip edilir</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="py-8 sm:py-10 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Eczacılık, yazılım ve veri güvenliği alanlarında uzman, multidisipliner bir ekibiz.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-8 sm:pb-10 px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siz de RaporinAI Ailesine Katılın
          </h2>
          <p className="text-lg mb-6 opacity-90">
            SGK kesintilerini azaltın, zamandan tasarruf edin ve dijital dönüşümün bir parçası olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/indir"
              className="inline-block px-8 py-4 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
            >
              Hemen Başlayın
            </Link>
            <Link
              href="/#iletisim"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Bize Ulaşın
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
