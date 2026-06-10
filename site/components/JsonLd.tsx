import { COPY } from "@/lib/copy";

const SITE_URL = "https://lamsssaaa.github.io/business-sur-mesure";

// Données structurées pour les résultats enrichis Google (FAQ + Service).
export default function JsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COPY.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.r },
    })),
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Ton Business Sur Mesure",
    serviceType: "Orientation entrepreneuriale personnalisée",
    description:
      "50 questions sur ton expérience, tes compétences, ton budget et ton temps — un rapport personnalisé qui recommande LE business à lancer, avec un plan d'action sur 30 jours. Livré en 48 h.",
    url: `${SITE_URL}/`,
    areaServed: ["FR", "CH", "BE", "CA"],
    availableLanguage: "fr",
    provider: { "@type": "Person", name: "Ton Business Sur Mesure", address: { "@type": "PostalAddress", addressLocality: "Genève", addressCountry: "CH" } },
    offers: {
      "@type": "Offer",
      price: "49.90",
      priceCurrency: "CHF",
      url: `${SITE_URL}/mini-test/`,
      availability: "https://schema.org/InStock",
    },
  };

  // Échappement anti-XSS standard pour le JSON-LD (contenu statique, mais on durcit quand même).
  const safe = (o: object) => JSON.stringify(o).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe(service) }} />
    </>
  );
}
