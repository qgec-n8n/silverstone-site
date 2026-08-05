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
  "@type": string;
  [key: string]: unknown;
};

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
      // Matches the visible positioning ("UK businesses" sitewide) and the
      // London studio address on /contact; broader Europe/US claims had no
      // visible support and were removed 2026-07-15.
      areaServed: { "@type": "Country", name: "United Kingdom" },
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Ambitious SMEs, scale-ups, established organisations, corporate functions and internal product, operations and engineering teams.",
      },
      provider: {
        "@type": "Organization",
        name: "Silverstone AI",
        url: "https://silverstone-ai.com/",
      },
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
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
  return value
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
    graph.push(
      {
        "@type": "WebSite",
        "@id": "https://silverstone-ai.com/#website",
        name: "Silverstone AI",
        url: "https://silverstone-ai.com/",
        inLanguage: "en-GB",
        publisher: { "@id": "https://silverstone-ai.com/#organization" },
      },
      {
        "@type": "Organization",
        // Stable @id so the WebSite, and any future page-level entity, resolve
        // to one organisation node rather than repeating a detached copy —
        // this is what search engines and AI answer engines reconcile on.
        "@id": "https://silverstone-ai.com/#organization",
        name: "Silverstone AI",
        url: "https://silverstone-ai.com/",
        // The site's own positioning line, as shown on the homepage.
        description:
          "Web, app, content and AI workflow services for UK businesses, designed around clear problems, connected systems and human oversight.",
        logo: {
          "@type": "ImageObject",
          url: "https://silverstone-ai.com/brand/silverstone-logo.png",
        },
        // Official profiles carried over from the legacy site's own
        // Organization schema (src/content/migrated/generated/company/home.ts).
        sameAs: [
          "https://www.instagram.com/silverstone.ai/",
          "https://www.facebook.com/people/Silverstone-AI/61583930930530/",
        ],
        // Studio address as shown on /contact.
        address: {
          "@type": "PostalAddress",
          streetAddress: "4 Deacon Street",
          addressLocality: "London",
          postalCode: "SE17 1GE",
          addressCountry: "GB",
        },
        // Only the contact route the site actually publishes. The legacy
        // manifest also carries a phone number, but /contact does not show one,
        // and structured data must not assert more than the page does.
        email: "info@silverstone-ai.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "info@silverstone-ai.com",
          areaServed: "GB",
          availableLanguage: "en-GB",
        },
        // Matches the sitewide "UK businesses" positioning already asserted by
        // every Service node.
        areaServed: { "@type": "Country", name: "United Kingdom" },
      },
    );
  }

  graph.push(buildPageSchema(route));

  if (route.path === "/pricing" && route.schemaTypes.includes("FAQPage")) {
    graph.push(buildFaqPageSchema());
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
