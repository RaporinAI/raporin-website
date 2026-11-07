---
name: deploy
description: RaporinAI servisini (backend, AI servisi, admin paneli, web sitesi) AWS'ye deploy eder - önce dev (aws-dev push), sonra prod (aws-dev → aws-prod PR). Kullanıcı "deploy et", "dev'e çıkar", "prod'a al", "yayına al" dediğinde kullan. Masaüstü sürümü için değil.
---

# Deploy: dev → prod

Bu repolarda aynı akış geçerli: `raporin-backend-service`, `raporin-ai-service`, `raporin-admin-panel`, `raporin-website` (yerel klasör `raporin-ai`).
Masaüstü (`raporin-desktop`) sürümü tag ile çıkar; onun için masaüstü reposundaki `CLAUDE.md` dosyasına bak.

Kullanıcı yalnızca dev dediyse prod'a geçme. "Dev sonra prod" dediyse ikisi de onaylıdır; dev doğrulaması başarısız olursa prod'a geçmeden dur.

## 1. Durumu çıkar (sormadan, hızlıca)

```bash
git fetch -q origin
git status --short                                  # commit edilmemiş iş var mı
git log --oneline origin/aws-dev..HEAD              # dev'e gidecek yeni commit'ler
git log --oneline origin/aws-prod..origin/aws-dev   # dev'de olup prod'da olmayanlar
grep -E "ECS_CLUSTER|ECS_SERVICE|CONTAINER_NAME" .github/workflows/deploy-aws-*.yml
```

- `HEAD`, `origin/aws-dev`'in üzerine fast-forward değilse dur ve kullanıcıya sor; zorla push yapma.
- Prod'a gidecek listede kullanıcının bu deploy'da istemediği commit varsa listeyi göster ve onay al.
- **Migration:** `git diff --name-only origin/aws-prod..HEAD | grep 'db/migration/V'` bir şey döndürürse dur. Flyway yok; migration elle uygulanır (önce dev DB, sonra prod DB). Kullanıcıya hangi dosyanın hangi ortamda uygulanacağını söyle; prod DB'ye kendin yazma.
- Ödeme, paket veya kredi kodu değiştiyse backend reposundaki billing dokümanlarının güncellendiğini kontrol et (backend `CLAUDE.md`, "Kurallar").

## 2. Kısa doğrulama

Yalnızca değişikliğe ilişkin testleri çalıştır, tam suite gerekmez:
- Backend: `./mvnw -q -pl raporin-core -am test -Dtest='<İlgiliTest>' -Dsurefire.failIfNoSpecifiedTests=false -Dmaven.compiler.useIncrementalCompilation=false`, sonuç `raporin-core/target/surefire-reports/` altında.
- AI servisi: `./venv/bin/python -m pytest tests -q`.
- Admin paneli / web sitesi: `npm run lint && npm run build`.

## 3. Dev

```bash
git push origin HEAD:aws-dev
gh run list --branch aws-dev --limit 1          # run id'yi al
gh run watch <id> --exit-status --interval 30   # arka planda çalıştır (~8 dk)
```

Workflow ECS servisinin kararlı hâle gelmesini bekler. Bittikten sonra CloudWatch Logs Insights ile son 15 dakikaya bak:
- Backend: `Started RaporinBackendServiceApplication` satırı var mı, `APPLICATION FAILED` yok mu.
- AI servisi: `Starting` satırı ve RabbitMQ consumer hatası (`Failed to start consumer`) yok mu.
- Değişikliğin kendi log etiketi varsa onu da ara.
Log grupları: dev için `/ecs/raporinai/<servis>-dev`, prod için `/ecs/raporinai-prod/<servis>` (servis: backend, ai, admin, website).

## 4. Prod

```bash
gh pr create --base aws-prod --head aws-dev --title "<ne değişti>" --body "<neden, migration var mı, dev'de ne doğrulandı>"
gh pr merge <pr-url> --merge
gh run list --branch aws-prod --limit 1
gh run watch <id> --exit-status --interval 30   # arka planda
```

Ardından dev'deki log kontrolünü prod log grubunda tekrarla. Deploy'dan önce de var olan hataları yeni hata sanma; karşılaştırmak için deploy öncesindeki saatlere de bak.

## 5. Rapor

Kullanıcıya kısaca şunları söyle: commit, PR bağlantısı, iki workflow sonucu, logda ne doğrulandığı, elle yapılması gereken bir şey kaldıysa (migration, ECS ortam değişkeni) ne olduğu.
