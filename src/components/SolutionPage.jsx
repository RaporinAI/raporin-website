import Image from "next/image";
import Link from "next/link";
import { solutionPages } from "../lib/solutionPages";
import Footer from "./Footer";
import ProductSchema from "./ProductSchema";

const BASE_URL = "https://raporin.com";

export function buildSolutionMetadata(page) {
  const url = `${BASE_URL}/${page.slug}`;
  return {
    title: { absolute: `${page.title} | RaporinAI` },
    description: page.description,
    alternates: { canonical: url, languages: {} },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | RaporinAI`,
      description: page.description,
      images: ["/og-image.png"],
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "RaporinAI",
      locale: "tr_TR",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: page.h1 }],
    },
  };
}

function StructuredData({ page }) {
  const url = `${BASE_URL}/${page.slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: page.h1, item: url },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}

export default function SolutionPage({ page }) {
  const related = page.related.map((slug) => solutionPages[slug]).filter(Boolean);

  return (
    <>
      <StructuredData page={page} />
      {page.productSchema && <ProductSchema description={page.lead} />}

      <main className="bg-white pt-28 pb-20">
        <article className="mx-auto max-w-3xl px-6">

          {/* Breadcrumb */}
          <nav aria-label="Sayfa yolu" className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0F918B]">Ana Sayfa</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">{page.h1}</span>
          </nav>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-balance">
            {page.h1}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">{page.lead}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-lg shadow-teal-900/5">
            <Image
              src={page.screenshot.src}
              alt={page.screenshot.alt}
              width={1200}
              height={750}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
            />
          </div>

          <div className="mt-10 space-y-4 leading-relaxed text-gray-700">
            {page.intro.map((p) => <p key={p}>{p}</p>)}
          </div>

          {page.sections.map((section) => (
            <section key={section.h2} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{section.h2}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-gray-700">
                {section.body.map((p) => <p key={p}>{p}</p>)}
              </div>

              {section.list && (
                <ul className="mt-6 space-y-3">
                  {section.list.map((item) => (
                    <li key={item.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* CTA */}
          <div className="mt-14 rounded-2xl border border-teal-100 bg-gradient-to-br from-[#F4FDFB] to-white p-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              Ücretsiz hesap oluşturun
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
              Windows masaüstü uygulamasını indirin, Medula&apos;ya bağlanın ve dönemin
              tamamını tek tıkla analiz edin.
            </p>
            <Link
              href="/kayit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#17C6A3] to-[#0F918B] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Ücretsiz başlayın
            </Link>
          </div>

          {/* SSS */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sıkça Sorulan Sorular</h2>
            <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100">
              {page.faq.map((item) => (
                <div key={item.q} className="py-5">
                  <dt className="font-semibold text-gray-900">{item.q}</dt>
                  <dd className="mt-2 leading-relaxed text-gray-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* İlgili sayfalar */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-lg font-bold text-gray-900">İlgili sayfalar</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${item.slug}`}
                      className="block h-full rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-teal-200 hover:text-[#0F918B]"
                    >
                      {item.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
