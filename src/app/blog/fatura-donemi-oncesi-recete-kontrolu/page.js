import Link from "next/link";

const URL = "https://raporin.com/blog/fatura-donemi-oncesi-recete-kontrolu";
const TITLE = "Eczanelerde Fatura Dönemi Öncesi Reçete Kontrolü: SGK Kesintisi Riskini Nasıl Azaltabilirsiniz?";
const DESCRIPTION =
    "Fatura dönemi kapanmadan önce reçetelerde rapor geçerliliği, ICD kodu, hekim branşı, doz ve SUT kriterleri nasıl kontrol edilir? SGK kesintisi riskini azaltan pratik kontrol rutini.";
const PUBLISHED_AT = "2026-09-19";

export const metadata = {
    title: "Fatura Dönemi Öncesi Reçete Kontrolü ve SGK Kesintisi",
    description: DESCRIPTION,
    keywords: ["fatura dönemi reçete kontrolü", "SGK kesintisi", "toplu reçete kontrolü", "raporlu ilaç kontrolü", "SUT kriterleri", "medula reçete kontrol"],
    alternates: {
        canonical: URL,
    },
    openGraph: {
        title: "Fatura Dönemi Öncesi Reçete Kontrolü | RaporinAI Blog",
        description: DESCRIPTION,
        url: URL,
        type: "article",
        publishedTime: PUBLISHED_AT,
        images: [{ url: "/blog2.png", width: 1672, height: 941 }],
    },
};

const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED_AT,
    inLanguage: "tr-TR",
    mainEntityOfPage: URL,
    image: "https://raporin.com/blog2.png",
    author: { "@type": "Organization", name: "RaporinAI" },
    publisher: { "@id": "https://raporin.com/#organization" },
};

const h2 = "text-2xl font-bold text-gray-900 mt-12 mb-4";
const h3 = "text-xl font-semibold text-gray-900 mt-8 mb-3";
const list = "list-disc pl-6 space-y-2";
const textLink = "text-teal-700 font-medium underline underline-offset-2 hover:text-teal-900";

export default function BlogPost() {
    return (
        <main className="pt-32 pb-20 bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <article className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full">
                            Rehber
                        </span>
                        <span className="text-gray-500 text-sm">19 Eylül 2026</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {TITLE}
                    </h1>

                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                            💊
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900">RaporinAI Ekibi</p>
                            <p className="text-xs text-gray-500">Eczacılık & Teknoloji Editörleri</p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                    <p className="text-xl text-gray-600">
                        Eczanelerde yoğun bir fatura döneminin sonunda yüzlerce reçetenin tek tek yeniden kontrol edilmesi oldukça zor olabilir.
                    </p>
                    <p>
                        Ancak küçük görünen bir rapor, doz veya SUT uyumsuzluğu; reçete SGK&apos;ya teslim edildikten sonra eczane için kesinti riski oluşturabilir.
                    </p>
                    <p>
                        Bu nedenle reçetelerin yalnızca hastaya ilaç verildiği anda değil, <strong>fatura dönemi kapatılmadan önce de sistematik olarak kontrol edilmesi</strong> önemlidir.
                    </p>
                    <p>Peki fatura dönemini kapatmadan önce hangi noktalar kontrol edilmeli?</p>

                    <h2 className={h2}>Reçete kontrolü neden yalnızca işlem sırasında yapılmamalı?</h2>
                    <p>Günlük eczane operasyonunda reçete karşılama süreci çoğu zaman oldukça hızlı ilerler.</p>
                    <p>
                        Hasta bekler, telefon çalar, ürün bulunmaya çalışılır, reçete Medula&apos;ya işlenir ve aynı anda birçok işlem yürütülür.
                    </p>
                    <p>
                        Bu yoğunluk içerisinde özellikle raporlu reçetelerde gözden kaçabilecek küçük bir detay, reçetenin daha sonra sorunlu hale gelmesine neden olabilir.
                    </p>
                    <p>Örneğin;</p>
                    <ul className={list}>
                        <li>İlacın rapordaki teşhis ile uyumlu olmaması,</li>
                        <li>SUT&apos;un aradığı özel koşullardan birinin karşılanmaması,</li>
                        <li>Rapor süresinin reçete tarihini kapsamaması,</li>
                        <li>Raporu düzenleyen uzmanlık alanının ilgili ilaç için uygun olmaması,</li>
                        <li>Reçete ile rapordaki doz bilgilerinin uyuşmaması,</li>
                        <li>İlaca özel kullanım koşullarından birinin eksik olması</li>
                    </ul>
                    <p>gibi durumların reçete teslim edilmeden önce fark edilmesi önemlidir.</p>
                    <p>
                        Sorun faturalandırmadan önce fark edildiğinde bazı durumlarda reçetenin veya raporun kontrol edilmesi ve gerekli düzeltmelerin yapılması mümkün olabilir.
                    </p>
                    <p>Kesinti sonrasında ise müdahale alanı çok daha sınırlıdır.</p>

                    <h2 className={h2}>Fatura dönemi öncesinde reçeteler nasıl kontrol edilir?</h2>
                    <p>
                        Klasik yöntemde eczacı veya eczane çalışanı Medula üzerinden reçeteleri tek tek açarak gerekli kontrolleri yapar.
                    </p>
                    <p>Özellikle çok sayıda reçete bulunan eczanelerde bu yöntem önemli miktarda zaman gerektirir.</p>
                    <p>Her raporlu ilaç için farklı noktaların incelenmesi gerekebilir:</p>

                    <h3 className={h3}>1. Rapor geçerlilik süresi</h3>
                    <p>Raporun reçete tarihinde geçerli olup olmadığı kontrol edilmelidir.</p>
                    <p>Raporun bulunması tek başına yeterli değildir; ilgili tarihte geçerli olması gerekir.</p>

                    <h3 className={h3}>2. Tanı ve ICD kodları</h3>
                    <p>İlacın karşılanabilmesi için SUT&apos;un belirlediği tanı veya ICD kriterleri bulunabilir.</p>
                    <p>Raporda yer alan tanıların bu kriterlerle uyumlu olması gerekir.</p>

                    <h3 className={h3}>3. Doktor branşı</h3>
                    <p>
                        Bazı ilaçlarda raporu düzenleyen veya reçeteyi yazan hekimin belirli bir uzmanlık alanına sahip olması gerekebilir.
                    </p>
                    <p>
                        Bu nedenle yalnızca raporun içeriği değil, raporu düzenleyen hekim bilgileri de değerlendirilmelidir.
                    </p>

                    <h3 className={h3}>4. Doz uyumluluğu</h3>
                    <p>
                        Raporda belirtilen kullanım dozu ile reçetedeki kullanım şeklinin birbiriyle uyumlu olması önemlidir.
                    </p>
                    <p>Özellikle uzun süreli tedavilerde doz farklılıkları gözden kaçabilir.</p>

                    <h3 className={h3}>5. İlaca özel SUT kriterleri</h3>
                    <p>Bazı ilaçların geri ödeme koşulları çok daha detaylı olabilir.</p>
                    <p>
                        Önceki tedaviler, kullanım süreleri, laboratuvar değerleri, hastanın yaşı veya farklı klinik kriterler geri ödeme koşullarının bir parçası olabilir.
                    </p>
                    <p>Bu nedenle her raporlu ilacın aynı kontrol listesiyle değerlendirilmesi yeterli değildir.</p>

                    <h2 className={h2}>Asıl problem: Yüzlerce reçeteyi tek tek kontrol etmek</h2>
                    <p>
                        Teoride bütün reçeteleri fatura döneminden önce yeniden kontrol etmek en güvenli yöntemlerden biridir.
                    </p>
                    <p>Pratikte ise yüzlerce reçeteyi tek tek açmak ciddi bir operasyon yükü oluşturur.</p>
                    <p>
                        Bir reçetenin kontrolü yalnızca birkaç dakika sürse bile bu süre ay boyunca yüzlerce reçeteye uygulandığında saatlerce ek çalışma anlamına gelebilir.
                    </p>
                    <p>Üstelik manuel kontrolde başka bir sorun daha vardır:</p>
                    <p>
                        <strong>Kontrol eden kişinin hangi kriteri araması gerektiğini bilmesi gerekir.</strong>
                    </p>
                    <p>
                        SUT kuralları ilaca göre değişebildiği için özellikle nadir karşılaşılan ilaçlarda tüm kriterleri ezbere bilmek mümkün değildir.
                    </p>
                    <p>Bu noktada reçete kontrolünün otomatikleştirilmesi önemli hale gelir.</p>

                    <h2 className={h2}>Toplu reçete kontrolü nedir?</h2>
                    <p>
                        <Link href="/toplu-recete-kontrolu" className={textLink}>Toplu reçete kontrolü</Link>, eczanenin belirlediği fatura dönemindeki reçeteleri tek tek açmak yerine sistem üzerinden toplu olarak analiz edebilmesini sağlar.
                    </p>
                    <p>
                        RaporinAI&apos;da eczacı, uygulama içerisinden Medula&apos;ya giriş yaptıktan sonra kontrol etmek istediği dönemi seçebilir.
                    </p>
                    <p>İlgili dönemdeki reçeteler Medula&apos;dan alınarak analiz için listelenir.</p>
                    <p>Ardından reçeteler tek tek veya toplu şekilde kontrol edilebilir.</p>
                    <p>
                        Böylece amaç bütün reçeteleri yeniden manuel olarak incelemek yerine, <strong>özellikle dikkat edilmesi gereken reçeteleri ön plana çıkarmaktır.</strong>
                    </p>

                    <h2 className={h2}>RaporinAI reçetelerde neleri kontrol eder?</h2>
                    <p>
                        RaporinAI, raporlu ilaçları güncel <Link href="/sut-kontrol-programi" className={textLink}>SUT kriterleri</Link> açısından değerlendirir.
                    </p>
                    <p>Analiz sırasında ilaca göre değişmekle birlikte;</p>
                    <ul className={list}>
                        <li>Rapor geçerliliği,</li>
                        <li>Tanılar ve ICD kodları,</li>
                        <li>Hekim branşı,</li>
                        <li>Reçete–rapor doz uyumu,</li>
                        <li>İlaca özel SUT koşulları</li>
                    </ul>
                    <p>gibi kriterler kontrol edilebilir.</p>
                    <p>Analizin sonunda yalnızca “uygun” veya “uygun değil” sonucu verilmez.</p>
                    <p>
                        Problem tespit edilen bir reçetede <strong>hangi kriterin neden karşılanmadığı</strong> da gösterilir.
                    </p>
                    <p>
                        Böylece eczacı bütün reçeteleri aynı detay seviyesinde incelemek yerine dikkat gerektiren reçetelere odaklanabilir.
                    </p>

                    <h2 className={h2}>Fatura dönemi kapanmadan önce uygulanabilecek kontrol rutini</h2>
                    <p>
                        Eczaneler için pratik bir yaklaşım, fatura döneminin sonunda kısa bir kontrol süreci oluşturmaktır.
                    </p>
                    <p>Örneğin:</p>
                    <ol className="list-decimal pl-6 space-y-4">
                        <li>
                            <strong>Dönemi seçin</strong>
                            <p className="mt-1">Kontrol etmek istediğiniz reçete dönemini belirleyin.</p>
                        </li>
                        <li>
                            <strong>Reçeteleri aktarın</strong>
                            <p className="mt-1">Medula üzerindeki ilgili dönem reçetelerini listeleyin.</p>
                        </li>
                        <li>
                            <strong>Toplu analiz gerçekleştirin</strong>
                            <p className="mt-1">Reçeteleri SUT ve rapor kriterlerine göre toplu olarak kontrol edin.</p>
                        </li>
                        <li>
                            <strong>Dikkat gerektiren reçetelere odaklanın</strong>
                            <p className="mt-1">
                                Sistem tarafından uyumsuzluk veya olası problem tespit edilen reçeteleri detaylı inceleyin.
                            </p>
                        </li>
                        <li>
                            <strong>Faturalandırmadan önce son kontrolü yapın</strong>
                            <p className="mt-1">
                                Düzeltilebilecek bir durum bulunuyorsa reçete teslim edilmeden önce gerekli işlemleri değerlendirin.
                            </p>
                        </li>
                    </ol>
                    <p>
                        Bu yaklaşımın amacı eczacının kontrolünü ortadan kaldırmak değil, yüzlerce reçete içerisinden <strong>insan kontrolünün gerçekten gerekli olduğu noktaları daha hızlı bulmasına yardımcı olmaktır.</strong>
                    </p>

                    <h2 className={h2}>Yapay zeka eczacının yerini mi alıyor?</h2>
                    <p>Hayır.</p>
                    <p>Özellikle sağlık ve geri ödeme süreçlerinde nihai değerlendirme önemlidir.</p>
                    <p>
                        Yapay zekanın buradaki rolü eczacının yerine karar vermekten çok, çok sayıda reçete içerisindeki olası uyumsuzlukları hızlı şekilde tespit ederek eczacının dikkatini ilgili noktaya yönlendirmektir.
                    </p>
                    <p>Başka bir ifadeyle sistem:</p>
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                        <strong>“Bu reçetelerin hepsini tekrar kontrol et.”</strong>
                    </blockquote>
                    <p>demek yerine:</p>
                    <blockquote className="border-l-4 border-teal-500 pl-4 italic text-teal-800">
                        <strong>“Özellikle bu reçetelere bakmanız gerekebilir ve nedeni şu.”</strong>
                    </blockquote>
                    <p>yaklaşımını sağlar.</p>

                    <h2 className={h2}>Reçete kontrolünde amaç kesinti geldikten sonra değil, önce harekete geçmek</h2>
                    <p>SGK reçete ve rapor kontrollerinde en kritik noktalardan biri zamanlamadır.</p>
                    <p>
                        Olası bir hata reçete teslim edilmeden önce fark edildiğinde kontrol veya düzeltme imkânı bulunabilir.
                    </p>
                    <p>
                        Aynı problem aylar sonra kesinti olarak ortaya çıktığında ise seçenekler çok daha sınırlı olabilir.
                    </p>
                    <p>
                        Bu nedenle modern reçete kontrolünün amacı yalnızca geçmişte yapılan hataları görmek değil, <strong>potansiyel sorunları faturalandırmadan önce yakalamaktır.</strong>
                    </p>
                    <p>
                        RaporinAI, <Link href="/medula-rapor-kontrol" className={textLink}>Medula entegrasyonu</Link> ve toplu reçete analizi ile eczanelerin bu kontrol sürecini daha hızlı ve sistematik şekilde gerçekleştirmesine yardımcı olur.
                    </p>

                    <div className="bg-teal-50 border-l-4 border-teal-500 p-6 !mt-10 rounded-r-lg">
                        <h3 className="text-lg font-bold text-teal-800 mb-2">RaporinAI ile tanışın</h3>
                        <p className="text-teal-700 mb-3 text-base">
                            RaporinAI ile Medula&apos;daki reçetelerinizi tek tek veya toplu olarak analiz edebilir, raporlu ilaçları SUT kriterlerine göre kontrol edebilirsiniz.
                        </p>
                        <p className="text-teal-700 mb-3 text-base">Hesap oluşturmak ücretsizdir; eczanenize uygun paketi hesabınızdan seçebilirsiniz.</p>
                        <p className="text-teal-800 font-semibold mb-4 text-base">
                            RaporinAI&apos;ı indirin, Medula&apos;ya bağlanın ve fatura döneminizi kapatmadan önce reçetelerinizi kontrol edin.
                        </p>
                        <Link href="/kayit" className="inline-block bg-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition-colors">
                            Ücretsiz Başlayın
                        </Link>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <Link href="/blog" className="text-teal-600 font-medium hover:underline flex items-center gap-2">
                        ← Tüm Yazılar
                    </Link>
                </div>
            </article>
        </main>
    );
}
