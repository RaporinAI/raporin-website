# RaporinAI web sitesi — Claude çalışma rehberi

raporin.com: tanıtım ve SEO sayfaları, blog, kayıt ve giriş, hesabım (masaüstü indirme burada), paket satın alma.
GitHub reposu `RaporinAI/raporin-website`; yerel klasör adı `raporin-ai`.
**Tüm sistemin haritası, akışlar, loglar ve ortak kurallar:** `raporin-backend-service/CLAUDE.md` (yerelde `../raporin-backend-service/CLAUDE.md`). Önce onu oku.

## Yapı
- Next.js 16 (App Router), React 19, JavaScript.
- `src/app/…`: sayfalar (ör. `hesabim`, `kayit`, `giris`, SEO sayfaları, `blog`, `en`).
- `src/lib/auth/`: oturum ve backend kimlik çağrıları; `src/lib/billing/`: paket ve ödeme çağrıları.
- `src/lib/download.js`: masaüstü sürümü (`DESKTOP_VERSION`) ve indirme bağlantısı; Hesabım > Genel bakış ve Ekip bölümü bunu okur (ayrı indirme sayfası yok; eski `/indir` adresi `/hesabim`'e yönlenir). **Her masaüstü sürümünde** MSI R2'ye yüklendikten sonra güncellenir ve site dev → prod deploy edilir (masaüstü `CLAUDE.md`, "Sürüm yayınlama").
- `src/lib/pricingPlans.js`: katalog boş gelirse gösterilen statik fiyat yedeği; fiyatlar değişince bunu da güncelle.
- SEO ve pazarlama: `SEO-GUIDE.md`, `GEO-GUIDE.md`, `GTM_KURULUM_REHBERI.md`, `src/app/sitemap.js`, `robots.js`, `llms.txt`.

## Web asistanı (sağ alttaki "RaporinAI Asistan")
- Arayüz `src/components/AssistantChat.jsx` (sağda, ön planda); sol alttaki küçük `WhatsAppButton.jsx` telefonda gizli. WhatsApp kartı yalnızca asistan çözemeyince çıkar: `[[DESTEK]]` kodu, iki kez 👎, limit/hata, 4. sorudan sonra alttaki bağlantı.
- Sunucu: `src/app/api/chat/route.js` → Bedrock Mantle (Frankfurt, `google.gemma-4-26b-a4b`, yedek `gemma-4-31b`, yalnızca `/openai/v1` yolu). Prompt, notlar, model ve anahtar tarayıcıya gitmez; cevap düz metin akışıdır.
- Bilgi: `src/lib/chat/knowledge.js` (kurallar + sitedeki ürün bilgisi ve SSS + canlı katalog + notlar). Notlar admin panel **Web Asistanı** ekranından gelir (backend `/internal/web-assistant/knowledge`, `/api` dışında, `X-Internal-Token`, 60 sn önbellek); ulaşılamazsa `FALLBACK_NOTES`. Kurallar yalnızca kodda.
- Sınırlar `src/lib/chat/limits.js` (bellekte; IP başına dk 6 / gün 40, mesaj 500 karakter, son 8 mesaj, sohbet 20 soru) + paneldeki günlük toplam sınır ve aç/kapa.
- Ortam: `WEB_ASSISTANT_MANTLE_API_KEY`, `WEB_ASSISTANT_INTERNAL_TOKEN` (backend'deki ile aynı), isteğe bağlı `WEB_ASSISTANT_MODEL`, `WEB_ASSISTANT_FALLBACK_MODEL`, `WEB_ASSISTANT_ENABLED=false` (`.env.example`). ECS'te ikisi de task definition `secrets` alanında: Mantle anahtarı AI servisinin secret'ındaki `BEDROCK_MANTLE_API_KEY`, token backend secret'ındaki `WEB_ASSISTANT_INTERNAL_TOKEN` (backend workflow'u GitHub `aws-dev`/`aws-prod` secret'ından yazar; backend her deploy'da secret'ı baştan yazdığı için anahtar workflow'da kalmalı, yoksa web sitesi task'ı açılmaz). Önce backend deploy'u (secret senkronu), sonra web sitesi.
- Loglar (kişisel veri maskeli, IP yerine günlük özet): `[CHAT]`, `[CHAT_LIMIT]`, `[CHAT_ERROR]`, `[CHAT_MODEL_FAILED]`, `[CHAT_KNOWLEDGE_FAILED]`, `[CHAT_FEEDBACK]`. GTM olayları: `assistant_*`, `whatsapp_*` (`source` ile).
- Deneme listesi: `node scripts/chatbot-eval.mjs [site adresi]` (gerçek WhatsApp soruları + kötüye kullanım denemeleri); prompt ya da model değişince çalıştırıp cevapları oku.

## Çalıştırma ve kontrol
- Yerel: backend reposunda `scripts/local-stack.sh up` (web sitesi port 3001).
- Değişiklik sonrası: `npm run lint` ve `npm run build`.

## Deploy
Backend ile aynı: `aws-dev` push → dev (`website-dev`), `aws-dev` → `aws-prod` PR'ı → prod (`prod-website`). `/deploy` skill'ini kullan.
Loglar: `/ecs/raporinai/website-dev`, `/ecs/raporinai-prod/website`.

## Kurallar
- Ödeme, paket, kredi ve hoş geldin kredisiyle ilgili değişikliklerde backend reposundaki billing dokümanları da güncellenir (backend `CLAUDE.md`, "Kurallar").
