import { getPublicEnvironment } from "~/lib/environment";
import { buildCanonicalUrl } from "~/seo/canonical";
import type { FutureRouteRecord } from "~/data/route-schema";

export type MetadataInput = {
  canonicalOrigin: string;
  description: string;
  includeRobots?: boolean;
  path: string;
  title: string;
};

export type MetadataDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: "link"; rel: "canonical"; href: string };

/**
 * One sitewide 1200×630 share image (public/brand/social-card.png). Social
 * crawlers don't resolve relative URLs reliably, so the address is absolute
 * to the production origin on every route.
 */
const SOCIAL_CARD_URL = "https://silverstone-ai.com/brand/social-card.png";
const SOCIAL_CARD_ALT =
  "Silverstone AI — websites, apps and AI workflows for UK businesses";

function getMetadataEnvironment(): { isStaging: boolean; robotsMeta: string } {
  try {
    const environment = getPublicEnvironment();
    return {
      isStaging: environment.isStaging,
      robotsMeta: environment.robotsMeta,
    };
  } catch {
    return {
      isStaging: true,
      robotsMeta: "noindex,nofollow,noarchive",
    };
  }
}

export function buildMetadata(input: MetadataInput): MetadataDescriptor[] {
  const descriptors: MetadataDescriptor[] = [
    { title: input.title },
    { name: "description", content: input.description },
    {
      tagName: "link",
      rel: "canonical",
      href: buildCanonicalUrl(input.canonicalOrigin, input.path),
    },
  ];

  if (input.includeRobots !== false) {
    descriptors.splice(2, 0, {
      name: "robots",
      content: "noindex,nofollow,noarchive",
    });
  }

  return descriptors;
}

export function buildRouteMetadata(route: FutureRouteRecord): MetadataDescriptor[] {
  const environment = getMetadataEnvironment();
  const articleUnderReview =
    route.template === "article" && !route.claimsStatus.startsWith("safe-copy");
  const socialType =
    route.template === "article" && !articleUnderReview ? "article" : "website";
  const title = articleUnderReview
    ? "Guide Under Editorial Review | Silverstone AI"
    : route.title;
  const description = articleUnderReview
    ? "This guide is being updated to align with current evidence, provenance and approval requirements."
    : route.description;
  const indexable =
    route.productionIndexable && !articleUnderReview && route.lifecycle !== "draft";
  // In production the fallback must be an explicit noindex — the
  // environment's robotsMeta is the site default for indexable content
  // ("index,follow"), never a safe value for withheld routes.
  const robots = environment.isStaging
    ? environment.robotsMeta
    : indexable
      ? "index, follow"
      : "noindex,nofollow";
  const descriptors: MetadataDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: route.canonical },
    { property: "og:type", content: socialType },
    { property: "og:site_name", content: "Silverstone AI" },
    { property: "og:locale", content: "en_GB" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: route.canonical },
    { property: "og:image", content: SOCIAL_CARD_URL },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: SOCIAL_CARD_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: SOCIAL_CARD_URL },
    { name: "twitter:image:alt", content: SOCIAL_CARD_ALT },
  ];

  if (!environment.isStaging) {
    descriptors.splice(2, 0, { name: "robots", content: robots });
  }

  return descriptors;
}
