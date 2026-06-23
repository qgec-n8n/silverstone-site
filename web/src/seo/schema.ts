import type { FutureRouteRecord } from "~/data/route-schema";

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
        name: "Silverstone AI",
        url: "https://silverstone-ai.com/",
      },
      {
        "@type": "Organization",
        name: "Silverstone AI",
        url: "https://silverstone-ai.com/",
      },
    );
  }

  graph.push(buildPageSchema(route), buildBreadcrumbListSchema(route));

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
