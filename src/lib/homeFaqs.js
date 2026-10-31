// Görünür SSS ve JSON-LD aynı içerikten üretilir. İlk cevap ProductSchema'nın açıklamasıdır.
// Sorular kısa tutulur; yalnızca eczacının karar verirken sorduğu konular. Fiyat ve kredi miktarı yazılmaz
// (admin panelden değişir).
export const homeFaqs = [
  {
    category: "Genel",
    questions: [
      {
        q: "RaporinAI nedir ve nasıl çalışır?",
        a: "RaporinAI, eczaneler için yapay zekâ destekli reçete ve rapor kontrol programıdır. Uygulamanın içinden Medula'ya girip dönemin reçetelerini tek tıkla aktarırsınız; ister tek bir ilacı, ister dönemin tamamını analiz edersiniz. Her ilaç için uygun, dikkat edilmeli ya da uygun değil sonucunu nedeniyle birlikte görürsünüz."
      },
      {
        q: "Kurulum zor mu? Hangi bilgisayarda çalışır?",
        a: "Hayır. Windows 10 veya 11 yüklü bilgisayarınıza masaüstü uygulamasını kurup hesabınızla giriş yapmanız yeterli. Teknik bilgi gerekmez; Medula'ya her zamanki gibi girer, dönemi seçip aktarırsınız."
      },
      {
        q: "Eczanedeki çalışanlarım da kullanabilir mi?",
        a: "Evet, üstelik ücretsiz. Hesabım > Ekip bölümünden çalışanlarınıza ayrı kullanıcı açabilirsiniz; uygulamayı eczanedeki istediğiniz kadar bilgisayara kurup herkes kendi hesabıyla giriş yapar. Tüm ekip eczanenizin paketini ve kredisini ortak kullanır."
      }
    ]
  },
  {
    category: "Analiz",
    questions: [
      {
        q: "Analizde neler kontrol ediliyor?",
        a: "Rapor ve reçete güncel SUT kurallarına göre değerlendirilir: tanı kodlarının uyumu, ilacın SUT kısıtlamaları ve reçetedeki dozun rapordaki dozu aşıp aşmadığı. Uyumsuzluk varsa nedeni açıkça gösterilir. SUT güncellemeleri RaporinAI ekibi tarafından takip edilir; sizin bir şey yapmanız gerekmez."
      }
    ]
  },
  {
    category: "Güvenlik",
    questions: [
      {
        q: "Medula şifremi sizinle paylaşmam gerekiyor mu?",
        a: "Hayır. Medula'ya uygulamanın içindeki güvenli tarayıcıdan kendi bilgilerinizle girersiniz; şifreniz sunucularımıza gönderilmez. Otomatik girişi açarsanız bilgileriniz şifrelenerek yalnızca kendi bilgisayarınızda saklanır."
      },
      {
        q: "Hasta bilgileri güvende mi?",
        a: "Evet. RaporinAI KVKK'ya uygun çalışır. Hasta ve doktorun kimlik bilgileri (TC kimlik numarası, ad soyad vb.) sunucularımıza gönderilmez; analiz yalnızca tanı kodu, etkin madde ve doz gibi anonim klinik bilgilerle yapılır."
      }
    ]
  },
  {
    category: "Paket ve Kredi",
    questions: [
      {
        q: "Ücretsiz deneyebilir miyim?",
        a: "Evet. Kayıt olan her eczaneye kredi kartı istemeden hoş geldin kredisi tanımlanır. Bu krediyle kendi reçetelerinizi analiz ederek RaporinAI'yi deneyebilirsiniz; otomatik ücret alınmaz."
      },
      {
        q: "Kredi nedir, ne zaman harcanır?",
        a: "Başarıyla tamamlanan her ilaç analizi 1 kredi harcar. Medula'dan reçete aktarmak ücretsizdir. Analiz başarısız olursa krediniz iade edilir; daha önce analiz edilmiş aynı rapor ve ilaç için tekrar kredi harcanmaz."
      },
      {
        q: "Kredim biterse ne olur?",
        a: "Yeni analiz başlatılamaz ama aktardığınız reçeteler ve sonuçlarınız silinmez. Hesabım'dan paket seçebilir, paketinizi yükseltebilir ya da ek kredi alabilirsiniz; krediniz hemen yüklenir."
      },
      {
        q: "Aboneliğimi iptal edebilir miyim?",
        a: "Evet, taahhüt yok. Hesabım > Paketim'den istediğiniz an iptal edebilirsiniz. Paketinizi dönem sonuna kadar kullanmaya devam edersiniz, sonrasında ücret alınmaz."
      }
    ]
  }
];
