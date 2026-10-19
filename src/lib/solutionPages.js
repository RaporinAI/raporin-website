// Anahtar kelime odaklı çözüm sayfalarının tek içerik kaynağı.
// Her sayfa ürünün FARKLI bir kullanım anını anlatır; aynı metnin
// kelime değiştirilmiş kopyaları değildir (Google bunu "kapı sayfası" sayar).
// Sitemap ve footer bu listeden beslenir.

export const solutionPages = {
  "eczane-rapor-kontrol-programi": {
    slug: "eczane-rapor-kontrol-programi",
    navLabel: "Eczane Rapor Kontrol Programı",
    title: "Yapay Zeka Destekli Eczane Rapor Kontrol Programı",
    productSchema: true,
    updatedAt: "2026-09-11",
    description:
      "RaporinAI ile eczanede yapay zeka destekli rapor kontrolü: Medula aktarımı, PDF analizi ve SUT kriterlerine göre açıklamalı sonuçlar.",
    h1: "Eczane Rapor Kontrol Programı",
    lead:
      "Raporlu bir ilacın SGK tarafından karşılanması için yalnızca raporun var olması yetmez. Rapor süresi, teşhis kodu, raporu düzenleyen hekimin branşı ve SUT'un o ilaç için aradığı kriterlerin tamamının tutması gerekir. RaporinAI bu denetimi sizin yerinize yapar.",
    screenshot: { src: "/screens/analiz-sonuclari.png", alt: "RaporinAI rapor analiz sonuçları ekranı" },
    intro: [
      "Bir raporu elle kontrol etmek, tek başına birkaç dakika sürer. Rapor tarihine bakarsınız, teşhis kodunu SUT'taki ilgili maddeyle karşılaştırırsınız, raporu yazan hekimin o ilacı yazmaya yetkili branşta olup olmadığını kontrol edersiniz, gerekiyorsa tahlil değerlerine bakarsınız. Bir fatura döneminde yüzlerce raporlu ilaç varsa bu işi tek tek yapmak pratikte mümkün değildir.",
      "Sonuç, eczanenin fark etmeden hatalı reçete teslim etmesi ve kesintiyi aylar sonra öğrenmesidir. O noktada düzeltme şansı çoğunlukla kalmamıştır.",
    ],
    sections: [
      {
        h2: "Rapor kontrol programı neleri denetler?",
        body: [
          "RaporinAI, bir raporu tek bir kural üzerinden değil, o ilaç için SUT'ta tanımlı kriterlerin tamamı üzerinden değerlendirir ve hangi kriterin neden tutmadığını açıkça söyler.",
        ],
        list: [
          {
            title: "Rapor süresi ve geçerlilik",
            body: "Raporun düzenlenme tarihi, süresi ve reçete tarihinde hâlâ geçerli olup olmadığı. Süresi dolmuş ya da reçete tarihini kapsamayan raporlar işaretlenir.",
          },
          {
            title: "Teşhis ve ICD-10 uyumu",
            body: "Rapordaki teşhis kodunun, ilacın SUT'ta ödendiği endikasyonla örtüşüp örtüşmediği. Doğru ilaç, yanlış teşhisle raporlanmışsa kesinti kaçınılmazdır.",
          },
          {
            title: "Branş yetkisi",
            body: "Raporu düzenleyen hekimin uzmanlık alanının, o ilaç için SUT'un aradığı branş şartını karşılayıp karşılamadığı.",
          },
          {
            title: "Tahlil ve kriter şartları",
            body: "Bazı ilaçlar için SUT belirli laboratuvar değerleri ya da ek koşullar arar. Bu kriterler rapor üzerinde aranır ve eksikse bildirilir.",
          },
          {
            title: "Reçete–rapor doz karşılaştırması",
            body: "Reçetede yazılan miktarın, raporda tanımlı doza ve SUT'un izin verdiği sınırlara uyup uymadığı.",
          },
        ],
      },
      {
        h2: "Analiz sonucu ne veriyor?",
        body: [
          "Analiz bittiğinde yalnızca \"uygun\" ya da \"uygun değil\" bilgisi almazsınız. Sonuç, SUT kriterleri bazında ayrıştırılır: hangi kriter kontrol edildi, hangisi karşılandı, hangisi karşılanmadı ve gerekçesi ne.",
          "Bu ayrım önemlidir, çünkü uygunsuz çıkan bir raporda çoğu zaman yapılacak bir şey vardır — hastadan raporu yenilemesini istemek, doğru branştan rapor talep etmek ya da reçeteyi düzeltmek gibi. Kesinti geldikten sonra bu seçeneklerin hiçbiri kalmaz.",
        ],
      },
      {
        h2: "Elinizde sadece PDF varsa",
        body: [
          "Medula'ya bağlanmadan, elinizdeki bir rapor PDF'ini yükleyerek de tekil kontrol yapabilirsiniz. Hastanın ve hekimin kişisel bilgileri, dosya bilgisayarınızdan çıkmadan önce otomatik olarak maskelenir.",
        ],
      },
    ],
    faq: [
      {
        q: "Rapor kontrol programı SGK kesintisini tamamen önler mi?",
        a: "Program, SUT kriterleri üzerinden tespit edilebilen uygunsuzlukları fatura teslim edilmeden önce gösterir. Böylece düzeltilebilir hataları düzeltme şansı bulursunuz. Kesinti kararı her durumda SGK'ya aittir.",
      },
      {
        q: "Süresi dolmuş raporları da gösteriyor mu?",
        a: "Evet. Rapor süresi kontrol edilen kriterlerden biridir; süresi dolmuş ya da reçete tarihini kapsamayan raporlar uygunsuz olarak işaretlenir.",
      },
      {
        q: "SUT değişikliklerini takip etmem gerekiyor mu?",
        a: "Hayır. Analiz güncel SUT kuralları üzerinden yapılır, kural güncellemeleri uygulama tarafında yönetilir.",
      },
      {
        q: "Program ücretli mi?",
        a: "RaporinAI aylık veya yıllık abonelik paketleriyle kullanılır; paketler eczanenin reçete yoğunluğuna göre farklı aylık kredi içerir. Hesap oluşturmak ücretsizdir ve kredi kartı gerektirmez.",
      },
    ],
    related: ["recete-kontrol-programi", "sut-kontrol-programi", "toplu-recete-kontrolu"],
  },

  "recete-kontrol-programi": {
    slug: "recete-kontrol-programi",
    navLabel: "Reçete Kontrol Programı",
    title: "Yapay Zeka Destekli Eczane Reçete Kontrol Programı",
    productSchema: true,
    updatedAt: "2026-09-11",
    description:
      "RaporinAI, yapay zeka destekli eczane reçete kontrol programıdır. Medula reçetelerinde SUT kriterlerini ve reçete–rapor doz uyumunu analiz edin.",
    h1: "Reçete Kontrol Programı",
    lead:
      "Bir reçetedeki hatayı fark etmek için en iyi an, hasta hâlâ eczanedeyken. RaporinAI tek bir reçeteyi saniyeler içinde analiz eder; düzeltilebilir bir sorun varsa hasta gitmeden görürsünüz.",
    screenshot: { src: "/screens/recete-detay.png", alt: "RaporinAI reçete detayı ve tekil analiz ekranı" },
    intro: [
      "Reçete kontrolü ile rapor kontrolü aynı şey değildir. Rapor kontrolü dönem sonunda, toplu ve geriye dönük yapılır. Reçete kontrolü ise anlık bir karardır: hasta tezgâhta beklerken, bu reçeteyi karşılamak güvenli mi?",
      "Bu anda yapılan kontrolün değeri yüksektir, çünkü hata bulunursa hâlâ çözüm üretilebilir. Hasta hekime geri yönlendirilebilir, eksik rapor talep edilebilir, miktar düzeltilebilir. Reçete karşılandıktan ve hasta ayrıldıktan sonra bu seçeneklerin hiçbiri yoktur.",
    ],
    sections: [
      {
        h2: "Tek reçete, saniyeler içinde sonuç",
        body: [
          "Medula'dan aktardığınız reçetelerden birinin detayına girip içindeki tek bir ilacı analize alabilirsiniz. Tüm dönemi taramanıza gerek yoktur; o an elinizdeki reçeteye odaklanırsınız.",
          "Analiz, ilacın raporla ilişkisini ve SUT'un o ilaç için aradığı koşulları birlikte değerlendirir. Sonuç kriter bazında sunulur, yani sorunun tam olarak nerede olduğunu görürsünüz.",
        ],
      },
      {
        h2: "Reçete ile rapor arasındaki farkı yakalar",
        body: [
          "Pratikte en sık karşılaşılan sorunlardan biri, reçetedeki miktarın rapordaki dozla uyuşmamasıdır. Rapor doğru, teşhis doğru, hekim yetkili — ama yazılan kutu sayısı raporun izin verdiği dozu aşıyor.",
          "Bu tür uyumsuzluklar gözle kolayca kaçar, çünkü iki ayrı belgeyi yan yana koyup hesap yapmayı gerektirir. RaporinAI bu karşılaştırmayı otomatik yapar ve aşım varsa miktarıyla birlikte gösterir.",
        ],
      },
      {
        h2: "Dönem sonunu beklemeyin",
        body: [
          "Reçete kontrolü ile toplu kontrol birbirinin alternatifi değil, tamamlayıcısıdır. Günlük akışta tereddüt ettiğiniz reçeteleri anında kontrol edersiniz; dönem sonunda ise kalan her şeyi tek tıkla taratırsınız.",
        ],
      },
    ],
    faq: [
      {
        q: "Reçete kontrolü ne kadar sürüyor?",
        a: "Tek bir ilacın analizi saniyeler içinde tamamlanır. Hasta tezgâhta beklerken kontrol etmek için tasarlanmıştır.",
      },
      {
        q: "Her reçeteyi tek tek kontrol etmem mi gerekiyor?",
        a: "Hayır. Tekil kontrol, tereddüt ettiğiniz reçeteler için pratik bir yoldur. Dönemin tamamını tek tıkla toplu analize almak da mümkündür.",
      },
      {
        q: "Raporsuz reçeteler için de kullanılabilir mi?",
        a: "Analiz, ilacın SUT'ta tanımlı koşulları üzerinden yapılır. Raporlu ilaçlarda rapor–reçete uyumu da ayrıca değerlendirilir.",
      },
    ],
    related: ["eczane-rapor-kontrol-programi", "toplu-recete-kontrolu", "medula-rapor-kontrol"],
  },

  "medula-rapor-kontrol": {
    slug: "medula-rapor-kontrol",
    navLabel: "Medula Rapor Kontrol",
    title: "Medula Rapor Kontrol — Entegre Reçete Aktarımı",
    description:
      "Medula'daki reçeteleri tek tıkla aktarıp analiz edin. Medula şifreniz sunucularımıza gönderilmez; giriş uygulama içindeki tarayıcıdan sizin tarafınızdan yapılır.",
    h1: "Medula Rapor Kontrol",
    lead:
      "RaporinAI, Medula'daki reçetelerinizi uygulamaya aktarır ve analizi bu veri üzerinden yapar. Elle veri girmeniz, ekran görüntüsü almanız ya da rapor indirmeniz gerekmez.",
    screenshot: { src: "/screens/recete-aktarimi.png", alt: "Medula'dan RaporinAI'ye reçete aktarımı ekranı" },
    intro: [
      "Rapor kontrol araçlarının çoğunda en büyük sürtünme veri girişidir. Kontrol edilecek her rapor için bilgilerin elle girilmesi ya da dosya yüklenmesi gerekir; bu da aracı günlük akışta kullanılamaz hâle getirir.",
      "RaporinAI bu adımı ortadan kaldırır. Uygulama içindeki Medula ekranından giriş yapar, fatura türünü ve dönemi seçersiniz; o döneme ait reçeteler analiz edilmek üzere aktarılır.",
    ],
    sections: [
      {
        h2: "Medula şifreniz bizde durmaz",
        body: [
          "Giriş işlemini uygulama içindeki tarayıcıdan siz yaparsınız — tıpkı Medula'yı normal tarayıcınızda açtığınızdaki gibi. Kolaylık olsun diye otomatik girişi açmayı tercih ederseniz bilgileriniz şifrelenerek yalnızca kendi bilgisayarınızda saklanır, hiçbir koşulda dışarı çıkmaz.",
        ],
      },
      {
        h2: "Dönem seçin, aktarın, analize başlayın",
        body: [
          "Aktarım fatura dönemi bazındadır. Fatura türünü ve dönemi seçersiniz, o kapsamdaki reçeteler listelenir. Buradan sonra iki yol vardır: tek bir reçetenin detayına girip o ilacı analiz etmek, ya da dönemdeki tüm raporlu ilaçları tek tıkla toplu analize almak.",
        ],
      },
      {
        h2: "Medula'ya bağlanmadan da kullanılabilir",
        body: [
          "Entegrasyonu kullanmak zorunda değilsiniz. Elinizdeki bir rapor PDF'ini yükleyerek tekil kontrol yapabilirsiniz;",
        ],
      },
    ],
    faq: [
      {
        q: "Otomatik giriş özelliği güvenli mi?",
        a: "Otomatik girişi açarsanız bilgileriniz şifrelenerek yalnızca kendi bilgisayarınızda saklanır. Sunucularımıza aktarılmaz.",
      },
      {
        q: "Eczane otomasyon programımı değiştirmem gerekir mi?",
        a: "Hayır. RaporinAI mevcut eczane programınızdan bağımsız çalışır;",
      },
      {
        q: "Hangi dönemleri aktarabilirim?",
        a: "Fatura türünü ve dönemi seçerek o kapsamdaki reçeteleri aktarabilirsiniz.",
      },
    ],
    related: ["toplu-recete-kontrolu", "eczane-rapor-kontrol-programi", "recete-kontrol-programi"],
  },

  "sut-kontrol-programi": {
    slug: "sut-kontrol-programi",
    navLabel: "SUT Kontrol Programı",
    title: "SUT Kontrol Programı — Güncel SUT Kurallarına Göre Analiz",
    description:
      "Reçete ve raporlarınızı güncel Sağlık Uygulama Tebliği kurallarına göre denetleyin. SUT değişikliklerini takip etme yükünü programa bırakın.",
    h1: "SUT Kontrol Programı",
    lead:
      "Sağlık Uygulama Tebliği, SGK'nın hangi ilacı hangi koşullarda ödediğini belirleyen metindir ve düzenli olarak değişir. RaporinAI analizlerini güncel SUT kuralları üzerinden yapar; değişiklikleri takip etme yükü sizde kalmaz.",
    screenshot: { src: "/screens/sonuc.png", alt: "SUT kriterleri bazında analiz sonucu ekranı" },
    intro: [
      "SUT'un pratikteki zorluğu hacminde değil, değişkenliğinde. Bir ilacın ödeme koşulu değiştiğinde bunu fark etmeyen eczane, aylarca aynı hatayı tekrarlayabilir. Kesinti geldiğinde ise geriye dönük düzeltme şansı yoktur.",
      "İkinci zorluk, kuralların tek bir yerde toplanmamış olması. Bir ilacın ödenebilmesi için gereken koşullar; ilaca özel maddede, genel hükümlerde ve ekli listelerde dağınık hâlde bulunabilir.",
    ],
    sections: [
      {
        h2: "Kriter bazlı analiz ne demek?",
        body: [
          "RaporinAI bir ilacı değerlendirirken tek bir sonuç üretmez. SUT'un o ilaç için aradığı koşulları ayrı ayrı ele alır ve her birinin karşılanıp karşılanmadığını gösterir.",
          "Böylece \"uygun değil\" cevabıyla baş başa kalmazsınız. Hangi koşulun neden tutmadığını görür, düzeltilebilir bir durumsa müdahale edersiniz.",
        ],
      },
      {
        h2: "Güncel kalma sorumluluğu programda",
        body: [
          "SUT kuralları değiştiğinde analiz mantığı da güncellenir. Sizin tebliğ değişikliklerini takip etmeniz, listeleri karşılaştırmanız ya da programda bir güncelleme yapmanız gerekmez.",
          "Bu, özellikle nadiren karşılaştığınız ilaçlarda fark yaratır — yılda birkaç kez gördüğünüz bir ilacın koşulunu ezberden bilmek beklenemez.",
        ],
      },
      {
        h2: "Nerede kullanılır?",
        body: [
          "SUT kontrolü ayrı bir modül değil, her analizin temelidir. Tek bir reçeteyi kontrol ederken de, dönemin tamamını toplu analize alırken de değerlendirme aynı kural setine göre yapılır.",
        ],
      },
    ],
    faq: [
      {
        q: "SUT değiştiğinde programı güncellemem gerekiyor mu?",
        a: "Hayır. Analiz güncel kurallar üzerinden yapılır; kural güncellemeleri uygulama tarafında yönetilir.",
      },
      {
        q: "Analiz sonucunda hangi SUT maddesine dayanıldığını görebilir miyim?",
        a: "Sonuçlar kriter bazında sunulur; hangi koşulun değerlendirildiği ve neden karşılanmadığı belirtilir.",
      },
      {
        q: "SUT kontrolü ile rapor kontrolü aynı şey mi?",
        a: "Rapor kontrolü, SUT kurallarının raporlu ilaçlara uygulanmasıdır. SUT ise bu kuralların kaynağıdır ve reçete kontrolünde de aynı kural seti kullanılır.",
      },
    ],
    related: ["eczane-rapor-kontrol-programi", "recete-kontrol-programi", "toplu-recete-kontrolu"],
  },

  "toplu-recete-kontrolu": {
    slug: "toplu-recete-kontrolu",
    navLabel: "Toplu Reçete Kontrolü",
    title: "Toplu Reçete Kontrolü — Dönemin Tamamını Tek Tıkla Analiz",
    description:
      "Fatura dönemindeki tüm raporlu ilaçları tek tıkla sıraya alın, arka planda analiz edilsin. Bittiğinde uygun olmayanları tek filtreyle listeleyin.",
    h1: "Toplu Reçete Kontrolü",
    lead:
      "Fatura teslimine günler kala yüzlerce reçeteyi tek tek açmak gerçekçi değil. RaporinAI dönemdeki tüm raporlu ilaçları tek tıkla sıraya alır, arka planda sırayla analiz eder ve size yalnızca sorunlu olanları gösterir.",
    screenshot: { src: "/screens/toplu-analiz.png", alt: "Fatura dönemindeki reçetelerin toplu analiz ekranı" },
    intro: [
      "Toplu kontrol, RaporinAI'nin diğer araçlardan en belirgin ayrıldığı nokta. Tek tek kontrol eden bir araç, dönem sonundaki asıl yükü çözmez — çünkü sorun bir raporu kontrol etmenin zorluğu değil, kontrol edilmesi gereken rapor sayısıdır.",
      "Dönemi aktardıktan sonra tek tıkla tüm raporlu ilaçları analize alırsınız. Analiz arka planda ilerlerken uygulamayı kullanmaya devam edebilirsiniz.",
    ],
    sections: [
      {
        h2: "Aynı işi iki kez yapmaz",
        body: [
          "Daha önce analiz edilmiş rapor–ilaç eşleşmeleri tekrar analiz edilmez. Dönem içinde birden çok kez toplu analiz çalıştırsanız da yalnızca yeni eklenenler işlenir.",
          "Pratikte bu, dönem boyunca düzenli aralıklarla kontrol yapabilmeniz demektir. Her şeyi son güne bırakmak zorunda kalmazsınız.",
        ],
      },
      {
        h2: "Sonuçta yalnızca sorunlulara bakarsınız",
        body: [
          "Analiz bittiğinde tek bir filtreyle uygun olmayan ilaçları listelersiniz. Yüzlerce sonucu gözden geçirmeniz gerekmez; doğrudan müdahale edilmesi gereken kalemlere gidersiniz.",
          "Her sonucun altında hangi SUT kriterinin karşılanmadığı yazar, yani ne yapmanız gerektiğini de görürsünüz.",
        ],
      },
      {
        h2: "Ekip olarak çalışıyorsanız",
        body: [
          "Çoklu kullanıcı ve rol yönetimi desteklenir. Ekip üyeleri kontrol edilen kalemler üzerine not bırakabilir; böylece aynı reçeteye iki kişinin bakması ya da bir kalemin gözden kaçması önlenir.",
        ],
      },
    ],
    faq: [
      {
        q: "Toplu analiz ne kadar sürüyor?",
        a: "Süre dönemdeki raporlu ilaç sayısına bağlıdır. Analiz arka planda sırayla ilerler; beklemeniz gerekmez, uygulamayı kullanmaya devam edebilirsiniz.",
      },
      {
        q: "Aynı dönemi birden çok kez analiz edebilir miyim?",
        a: "Evet. Daha önce analiz edilmiş rapor–ilaç eşleşmeleri tekrar işlenmez, yalnızca yeni eklenenler analiz edilir.",
      },
      {
        q: "Tüm sonuçları tek tek incelemem mi gerekiyor?",
        a: "Hayır. Analiz bittiğinde tek filtreyle yalnızca uygun olmayan ilaçları listeleyebilirsiniz.",
      },
      {
        q: "Analiz sırasında bilgisayarı açık tutmam gerekir mi?",
        a: "Analiz uygulama üzerinden yürütülür; işlem devam ederken uygulamayı kullanmaya devam edebilirsiniz.",
      },
    ],
    related: ["medula-rapor-kontrol", "eczane-rapor-kontrol-programi", "recete-kontrol-programi"],
  },
};

export const solutionSlugs = Object.keys(solutionPages);
