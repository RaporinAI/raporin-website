import { product, SITE_URL } from "../../lib/productFacts";
import { solutionPages } from "../../lib/solutionPages";

export const dynamic = "force-static";

// İsteğe bağlı keşif dosyasıdır; görünür ürün içeriğinin yerine geçmez.
export function GET() {
  const text = [
    `# ${product.name}`,
    "",
    `> ${product.description}`,
    "",
    "## Ürün bilgileri",
    "",
    ...product.facts.map(({ label, value }) => `- ${label}: ${value}`),
    "",
    product.limitation,
    "",
    "## Çözümler",
    "",
    ...Object.values(solutionPages).map((page) => `- [${page.navLabel}](${SITE_URL}/${page.slug}): ${page.description}`),
    "",
    "## Resmi bağlantılar",
    "",
    `- [Ücretsiz hesap oluşturun](${SITE_URL}/kayit): Windows uygulaması giriş yaptıktan sonra Hesabım > Genel bakış bölümünden indirilir`,
    `- [RaporinAI hakkında](${SITE_URL}/hakkimizda)`,
    `- [Haberler ve duyurular](${SITE_URL}/referanslar)`,
    `- [Sıkça sorulan sorular](${SITE_URL}/#sss)`,
    `- [KVKK ve hukuki metinler](${SITE_URL}/kvkk)`,
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
