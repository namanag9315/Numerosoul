export const SITE_URL = "https://numerasoul.in";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const services = [
  "Personal numerology reading",
  "Baby name numerology",
  "Vehicle number numerology",
  "Phone number numerology",
  "Business numerology",
  "Lo Shu Grid analysis",
  "Name correction numerology",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function rootJsonLd() {
  const rawPhoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
  const phoneNumber = rawPhoneNumber.replace(/\D/g, "");
  const telephone = /X/i.test(rawPhoneNumber) ? undefined : `+${phoneNumber}`;
  const common = {
    "@id": `${SITE_URL}/#numerosoul`,
    name: "NumeroSoul",
    url: SITE_URL,
    image: absoluteUrl("/og-image.jpg"),
    telephone,
    description:
      "Professional numerology consultations in India for life path, baby names, vehicle numbers, phone numbers, business numerology, and Lo Shu Grid readings.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Badaun",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "State",
      name: "Uttar Pradesh",
    },
    serviceType: services,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        ...common,
        priceRange: "₹₹",
      },
      {
        "@type": "ProfessionalService",
        ...common,
        sameAs: [],
      },
    ],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
