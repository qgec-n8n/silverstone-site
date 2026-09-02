import { plainCurrencyText } from "~/data/currency";
import { PRICING_FAQ } from "~/data/pricing-faq";
import type { FutureRouteRecord } from "~/data/route-schema";
import { industryCopyByRoute } from "~/features/industries-v2/content";
import { serviceCopyByRoute } from "~/features/services-v2/content/copy";

export type OrganizationSchemaInput = {
  name: string;
  url: string;
};

export function buildOrganizationSchema(input: OrganizationSchemaInput) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    name: input.name,
    url: input.url,
  };
}

type SchemaEntry = {
  // An array where a node carries several types at one `@id` — the
  // Organization is also a `ProfessionalService`.
  "@type": string | string[];
  [key: string]: unknown;
};

export const ORGANIZATION_ID = "https://silverstone-ai.com/#organization";

/**
 * Both markets the studio serves, as the schema.org nodes every Service and
 * the Organization assert. The studio is in London; the team includes
 * US-based members and the client base spans both countries.
 */
const AREA_SERVED = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "United Kingdom" },
];

/**
 * The published rate card, in one place: the `OfferCatalog` on /pricing and
 * the Organization's `priceRange` both read from it, so a price change cannot
 * leave the two disagreeing. Figures mirror the visible bands on /pricing.
 */
const PUBLISHED_OFFERS: { name: string; gbp: string; usd: string; unit?: string }[] = [
  { name: "Focused automation pilot", gbp: "3000", usd: "3900" },
  { name: "Simple automation implementation", gbp: "2000", usd: "2500" },
  { name: "Multi-system implementation", gbp: "10000", usd: "12500" },
  { name: "Enterprise implementation", gbp: "50000", usd: "65000" },
  { name: "Essential Support retainer", gbp: "350", usd: "450", unit: "MON" },
  { name: "Premium Support retainer", gbp: "1250", usd: "1600", unit: "MON" },
  { name: "Foundation website", gbp: "1500", usd: "1950" },
  { name: "Professional website", gbp: "2750", usd: "3500" },
  { name: "Growth website", gbp: "4750", usd: "5950" },
  { name: "Enterprise website", gbp: "7500", usd: "9500" },
];

const PUBLISHED_GBP = PUBLISHED_OFFERS.map((offer) => Number(offer.gbp));
const PRICE_RANGE = `£${String(Math.min(...PUBLISHED_GBP))}–£${String(Math.max(...PUBLISHED_GBP))}`;

/**
 * ONS grid reference for the studio postcode. 4 Deacon Street is a
 * multi-postcode block, but every postcode in it — SE17 1GE as the site
 * states it, SE17 1GD as Google's own place record labels the pin — resolves
 * to this one centroid, so the coordinates are unambiguous either way.
 * See the postcode note in `~/features/core-pages/map-panel`.
 */
const STUDIO_GEO = {
  "@type": "GeoCoordinates",
  latitude: 51.492531,
  longitude: -0.097884,
};

/**
 * The organization as an AI answer engine should resolve it: the full name
 * (never bare "Silverstone", which the racing circuit owns in general
 * retrieval), a category anchor in the description, a stable `@id`, and the
 * same address, contact and profile facts on every route rather than only
 * the homepage. Only facts the site itself shows are asserted here.
 */
export function buildOrganizationNode(): SchemaEntry {
  return {
    // One multi-typed node rather than a second `#localbusiness` entity:
    // `ProfessionalService` is a `LocalBusiness`, and both types hang off the
    // same `@id`, so the local-pack facts below (address, geo, map) describe
    // the organisation consumers already resolve rather than forking it into
    // a second entity they then have to reconcile.
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: "Silverstone AI",
    url: "https://silverstone-ai.com/",
    description:
      "Silverstone AI is a London-based AI automation agency that designs and builds AI receptionists, AI voice agents, workflow automation, websites and apps for small and mid-sized businesses in the United States and the United Kingdom.",
    // schema.org's purpose-built field for separating an entity from
    // similarly-named ones, which is this site's core retrieval problem:
    // unqualified "Silverstone" resolves to the motor-racing circuit in
    // Northamptonshire almost everywhere, so the node says plainly what this
    // entity is not.
    disambiguatingDescription:
      "An AI automation agency in London, unrelated to Silverstone Circuit, the motor-racing venue in Northamptonshire.",
    logo: {
      "@type": "ImageObject",
      url: "https://silverstone-ai.com/brand/silverstone-logo.png",
    },
    // `LocalBusiness` results expect an image alongside the logo.
    image: "https://silverstone-ai.com/brand/silverstone-logo.png",
    // Official profiles the site links to itself, and the only ones that
    // could be confirmed to exist (checked 2026-09-02). Searched and NOT
    // found: a LinkedIn company page, Crunchbase, a Companies House
    // registration under this name, and a YouTube channel. Clutch and
    // Trustpilot could not be checked either way behind their bot blocks.
    // Add to this list only from a link the owner supplies — a guessed slug
    // that 404s is worse for entity resolution than a short list.
    sameAs: [
      "https://www.instagram.com/silverstone.ai/",
      "https://www.facebook.com/people/Silverstone-AI/61583930930530/",
      "https://aiagentsdirectory.com/agent/silverstone-ai",
    ],
    // Studio address as shown on /contact.
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 Deacon Street",
      addressLocality: "London",
      postalCode: "SE17 1GE",
      addressCountry: "GB",
    },
    geo: STUDIO_GEO,
    // The same "Open in Google Maps" target /contact links, so the local
    // entity and the visible page point at one place.
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=4%20Deacon%20Street%2C%20London%20SE17%201GE%2C%20United%20Kingdom",
    // Both currencies /pricing publishes, and the span of its visible bands.
    currenciesAccepted: "GBP, USD",
    priceRange: PRICE_RANGE,
    // Only the contact route the site actually publishes: no phone number is
    // shown on /contact, so none is asserted here.
    //
    // `openingHoursSpecification` is deliberately absent for the same reason.
    // The site states "replies come across US and UK business hours" and
    // "24-hour team coverage", neither of which pins the days and clock times
    // the property requires, and a guessed 09:00-17:00 London window would
    // contradict the coverage claim. Both gaps need owner-supplied facts.
    email: "info@silverstone-ai.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@silverstone-ai.com",
      areaServed: ["US", "GB"],
      availableLanguage: ["en-US", "en-GB"],
    },
    areaServed: AREA_SERVED,
    knowsAbout: [
      "AI receptionists",
      "AI voice agents",
      "Workflow automation",
      "AI automation consulting",
      "Web design and development",
      "App development",
      "Content systems",
    ],
  };
}

function buildPageSchema(route: FutureRouteRecord): SchemaEntry {
  const articleUnderReview =
    route.template === "article" && !route.claimsStatus.startsWith("safe-copy");

  if (route.path === "/") {
    return {
      "@type": "WebPage",
      name: route.title,
      description: route.description,
      url: route.canonical,
    };
  }

  if (route.schemaTypes.includes("AboutPage")) {
    return {
      "@type": "AboutPage",
      name: route.title,
      description: route.description,
      url: route.canonical,
    };
  }

  if (route.schemaTypes.includes("ContactPage")) {
    return {
      "@type": "ContactPage",
      name: route.title,
      description: route.description,
      url: route.canonical,
    };
  }

  if (route.template === "article" && !articleUnderReview) {
    return {
      "@type": "Article",
      headline: route.h1,
      name: route.title,
      description: route.description,
      url: route.canonical,
      mainEntityOfPage: route.canonical,
      ...(route.publishedAt ? { datePublished: route.publishedAt } : {}),
      ...(route.modifiedAt ? { dateModified: route.modifiedAt } : {}),
    };
  }

  if (route.schemaTypes.includes("Service")) {
    return {
      "@type": "Service",
      name: route.h1,
      description: route.description,
      url: route.canonical,
      serviceType: route.h1,
      // Matches the visible positioning: clients in the US and UK, served
      // from the London studio with US-based team coverage.
      areaServed: AREA_SERVED,
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Small and mid-sized businesses, scale-ups, established organizations, corporate functions and internal product, operations and engineering teams in the United States and the United Kingdom.",
      },
      provider: { "@id": ORGANIZATION_ID },
    };
  }

  if (route.schemaTypes.includes("CollectionPage")) {
    return {
      "@type": "CollectionPage",
      name: route.title,
      description: route.description,
      url: route.canonical,
    };
  }

  return {
    "@type": "WebPage",
    name: route.title,
    description: route.description,
    url: route.canonical,
  };
}

/**
 * /pricing only. Built from the exact strings the visible accordion renders
 * (`~/data/pricing-faq`), because Google requires the structured data and the
 * on-page answer to match — and because those answers are always present in the
 * prerendered HTML, the accordion collapses them with CSS rather than
 * unmounting them.
 *
 * Emitted into the route's single existing `@graph`, never as a second
 * `<script type="application/ld+json">`: one JSON-LD block per document is
 * asserted in `tests/e2e/route-parity.spec.ts`.
 */
function buildFaqPageSchema(): SchemaEntry {
  return {
    "@type": "FAQPage",
    mainEntity: PRICING_FAQ.map((item) => ({
      "@type": "Question",
      name: plainCurrencyText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        // Currency pairs reduce to "£3,000 / $3,900" — the exact text a
        // crawler reads from the rendered accordion (both sides are in the
        // DOM, divided by a slash; only one is displayed to a browser).
        text: plainCurrencyText(item.answer),
      },
    })),
  };
}

/**
 * /pricing only: the published starting prices as Offer nodes in both
 * currencies, so the figures a crawler reads in the page text are also
 * available as data. Values mirror src/data/currency.ts and the visible
 * pricing content; an Offer here is a published starting band, never a
 * quote.
 */
function buildOfferCatalogSchema(): SchemaEntry {
  const offers = PUBLISHED_OFFERS;
  const priceSpec = (price: string, currency: "GBP" | "USD", unit?: string) => ({
    "@type": "UnitPriceSpecification",
    price,
    priceCurrency: currency,
    ...(unit ? { unitCode: unit } : {}),
    valueAddedTaxIncluded: false,
  });
  return {
    "@type": "OfferCatalog",
    name: "Silverstone AI published pricing",
    url: "https://silverstone-ai.com/pricing",
    itemListElement: offers.map((offer) => ({
      "@type": "Offer",
      name: `${offer.name} (from)`,
      url: "https://silverstone-ai.com/pricing",
      areaServed: AREA_SERVED,
      seller: { "@id": ORGANIZATION_ID },
      priceSpecification: [
        priceSpec(offer.gbp, "GBP", offer.unit),
        priceSpec(offer.usd, "USD", offer.unit),
      ],
    })),
  };
}

/**
 * The visible string for a copy value. Service and industry FAQ answers are
 * authored with the same lightweight emphasis markup `RichText` renders
 * (`**bold**`, `*em*`, `` `code` ``), which must be unwrapped here so the
 * marked-up answer matches the rendered text exactly, as Google requires.
 */
function plainText(value: string): string {
  return plainCurrencyText(value)
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1")
    .replaceAll(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1")
    .replaceAll(/`([^`]+)`/g, "$1");
}

function buildQuestionList(items: readonly { q: string; a: string }[]): SchemaEntry {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: plainText(item.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: plainText(item.a),
      },
    })),
  };
}

/**
 * FAQPage for the seven service and ten industry routes, built from the same
 * copy registries their compositions render (`serviceCopyByRoute` /
 * `industryCopyByRoute`) so the structured data and the visible accordion can
 * never drift apart.
 *
 * Eligible only because `FaqPanel` keeps every answer in the prerendered HTML
 * (collapsed by CSS, never unmounted) — Google requires the marked-up answer to
 * be present on the page. Returns null for routes without approved FAQ copy.
 *
 * Legacy `content/migrated/generated/industries/*` also carries FAQPage blocks,
 * but those hold the pre-v2 questions and are deliberately not used here.
 */
function buildRouteFaqSchema(route: FutureRouteRecord): SchemaEntry | null {
  const service = Object.hasOwn(serviceCopyByRoute, route.path)
    ? serviceCopyByRoute[route.path as keyof typeof serviceCopyByRoute]
    : null;
  if (service) {
    return buildQuestionList(service.faqs.items);
  }

  const industry = Object.hasOwn(industryCopyByRoute, route.path)
    ? industryCopyByRoute[route.path as keyof typeof industryCopyByRoute]
    : null;
  if (industry) {
    return buildQuestionList(industry.faqs.items);
  }

  return null;
}

export function buildBreadcrumbListSchema(route: FutureRouteRecord): SchemaEntry {
  return {
    "@type": "BreadcrumbList",
    itemListElement: route.breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item:
        breadcrumb.path === "/"
          ? "https://silverstone-ai.com/"
          : `https://silverstone-ai.com${breadcrumb.path}`,
    })),
  };
}

export function buildRouteSchemaGraph(route: FutureRouteRecord): {
  "@context": "https://schema.org";
  "@graph": SchemaEntry[];
} {
  const graph: SchemaEntry[] = [];

  if (route.path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": "https://silverstone-ai.com/#website",
      name: "Silverstone AI",
      url: "https://silverstone-ai.com/",
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
    });
  }
  // The Organization node travels with every route, not just the homepage:
  // an answer engine that lands on a service or industry page must be able to
  // resolve the entity from that document alone.
  graph.push(buildOrganizationNode());

  graph.push(buildPageSchema(route));

  if (route.path === "/pricing" && route.schemaTypes.includes("FAQPage")) {
    graph.push(buildFaqPageSchema());
    graph.push(buildOfferCatalogSchema());
  } else {
    const routeFaq = buildRouteFaqSchema(route);
    if (routeFaq) {
      graph.push(routeFaq);
    }
  }

  graph.push(buildBreadcrumbListSchema(route));

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
