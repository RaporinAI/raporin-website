// FAQPage schema belongs only on the page where the FAQ is actually visible.
export default function FaqSchemaEN() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does RaporinAI work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You sign in to the insurance portal from inside the application, choose an invoice type and claim period, and import that period's prescriptions into RaporinAI. From there you can analyze a single medicine in a prescription's detail view, or start a one-click bulk analysis of every reported medicine in the period. Results are presented criterion by criterion."
        }
      },
      {
        "@type": "Question",
        "name": "What is bulk report analysis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every reported medicine in the imported claim period is queued with a single click and analyzed in the background. Report-medicine pairs that were already analyzed are skipped, and when it finishes a single filter lists everything that is not compliant."
        }
      },
      {
        "@type": "Question",
        "name": "Do I have to share my insurance portal password?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. You sign in to the portal yourself through a browser embedded in the app; your credentials are never sent to our servers. If you enable auto-login, they are encrypted and stored only on your own computer."
        }
      },
      {
        "@type": "Question",
        "name": "Is RaporinAI secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all your data is stored encrypted and processed in a GDPR-compliant manner. Your data is never shared with third parties."
        }
      },
      {
        "@type": "Question",
        "name": "How does pricing work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RaporinAI is offered as monthly or yearly plans sized to your pharmacy's prescription volume. Creating an account is free and no credit card is required; you can buy or cancel your plan anytime from your account."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
