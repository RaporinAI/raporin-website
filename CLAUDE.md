# RaporinAI web sitesi — Claude çalışma rehberi

raporin.com: tanıtım ve SEO sayfaları, blog, kayıt ve giriş, hesabım, paket satın alma, masaüstü indirme.
GitHub reposu `RaporinAI/raporin-website`; yerel klasör adı `raporin-ai`.
**Tüm sistemin haritası, akışlar, loglar ve ortak kurallar:** `raporin-backend-service/CLAUDE.md` (yerelde `../raporin-backend-service/CLAUDE.md`). Önce onu oku.

## Yapı
- Next.js 16 (App Router), React 19, JavaScript.
- `src/app/…`: sayfalar (ör. `hesabim`, `kayit`, `giris`, `indir`, SEO sayfaları, `blog`, `en`).
- `src/lib/auth/`: oturum ve backend kimlik çağrıları; `src/lib/billing/`: paket ve ödeme çağrıları.
- `src/lib/download.js`: masaüstü sürümü (`DESKTOP_VERSION`) ve indirme bağlantısı; tüm indirme sayfaları ve hesap ekranları bunu okur. **Her masaüstü sürümünde** MSI R2'ye yüklendikten sonra güncellenir ve site dev → prod deploy edilir (masaüstü `CLAUDE.md`, "Sürüm yayınlama").
- `src/lib/pricingPlans.js`: katalog boş gelirse gösterilen statik fiyat yedeği; fiyatlar değişince bunu da güncelle.
- SEO ve pazarlama: `SEO-GUIDE.md`, `GEO-GUIDE.md`, `GTM_KURULUM_REHBERI.md`, `src/app/sitemap.js`, `robots.js`, `llms.txt`.

## Çalıştırma ve kontrol
- Yerel: backend reposunda `scripts/local-stack.sh up` (web sitesi port 3001).
- Değişiklik sonrası: `npm run lint` ve `npm run build`.

## Deploy
Backend ile aynı: `aws-dev` push → dev (`website-dev`), `aws-dev` → `aws-prod` PR'ı → prod (`prod-website`). `/deploy` skill'ini kullan.
Loglar: `/ecs/raporinai/website-dev`, `/ecs/raporinai-prod/website`.

## Kurallar
- Ödeme, paket, kredi ve hoş geldin kredisiyle ilgili değişikliklerde backend reposundaki billing dokümanları da güncellenir (backend `CLAUDE.md`, "Kurallar").
