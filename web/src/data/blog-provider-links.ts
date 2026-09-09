import type {
  SilverstoneBlogPost,
  SilverstoneBlogRankedCard,
  SilverstoneBlogSection,
  SilverstoneBlogSource,
} from "~/data/blog-posts";

/**
 * Ranked-shortlist provider links, recovered from the article's own research.
 *
 * A ranked shortlist names providers, and each card can carry a `website` the
 * page turns into a "Visit …" button and the ItemList schema turns into an
 * Organization `url`. The publishing automation does not emit that field: the
 * 34 cards live today were filled by hand, and every shortlist written from
 * now on arrives without it, so the cards render as unlinked names and the
 * schema degrades to bare strings.
 *
 * The URL is not missing from the article, though — only from the card. The
 * `search_led_general_ai` stream resolves each named organisation through a
 * provider registry and records the result on `researchSources` as
 * `registryProvider: true` plus an `organisationName` and the `url` it
 * verified. This module matches a card to that record and hands back the URL
 * the automation already checked, so a shortlist links correctly whether or
 * not the card itself was ever filled in.
 *
 * It only ever *supplies* a link. A card that carries its own `website` keeps
 * it untouched, which is what keeps a hand-corrected value (see the note on
 * Elevate AI in the ranked-card data) authoritative over the registry.
 *
 * Research sources themselves stay unrendered, per the article contract —
 * this reads them, it does not publish them.
 */

/**
 * Comparison key for an organisation name or a domain: lowercase, letters and
 * digits only. It survives the differences that actually occur between the two
 * — "Silverstone AI" against `silverstone-ai.com`, emphasis markdown around a
 * card name, `www.` and punctuation — without the aggressive suffix-stripping
 * that would let two different firms collide.
 */
function providerKey(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "");
}

/** The registrable label of a hostname: `www.adaptavist.com` → `adaptavist`. */
function domainKey(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    const label = hostname.replace(/^www\./i, "").split(".")[0];
    return label ? providerKey(label) : null;
  } catch {
    return null;
  }
}

function usableSourceUrl(source: SilverstoneBlogSource): string | null {
  const url = source.url.trim();
  return url.startsWith("https://") ? url : null;
}

/**
 * Silverstone appears in its own shortlists, and a third-party provider
 * registry has no reason to hold an entry for the site publishing the article
 * — which is exactly why the five hand-filled Silverstone cards are the only
 * ones the registry cannot account for. Its own address is not research, so it
 * is stated here.
 */
const FIRST_PARTY_PROVIDER = {
  name: "Silverstone AI",
  url: "https://silverstone-ai.com",
} as const;

/**
 * Build the name → verified-URL index for one article.
 *
 * Only registry-resolved sources contribute. An ordinary citation is an
 * article *about* a company as often as it is the company, so matching those
 * on title would happily link a provider to whichever publication last wrote
 * about it. `organisationName` is the automation stating which organisation it
 * verified, and the domain is a second key for the same record.
 */
export function buildProviderLinkIndex(
  sources: readonly SilverstoneBlogSource[],
): Map<string, string> {
  const index = new Map<string, string>();
  index.set(providerKey(FIRST_PARTY_PROVIDER.name), FIRST_PARTY_PROVIDER.url);
  const firstPartyDomain = domainKey(FIRST_PARTY_PROVIDER.url);
  if (firstPartyDomain) {
    index.set(firstPartyDomain, FIRST_PARTY_PROVIDER.url);
  }

  for (const source of sources) {
    const organisation = source.organisationName?.trim();
    if (!(source.registryProvider === true && organisation)) {
      continue;
    }
    const url = usableSourceUrl(source);
    if (!url) {
      continue;
    }
    // First writer wins: sources are in the order the automation verified
    // them, and a later duplicate is the same organisation cited again.
    for (const key of [providerKey(organisation), domainKey(url)]) {
      if (key && !index.has(key)) {
        index.set(key, url);
      }
    }
  }

  return index;
}

/** The verified site for `name`, or null when the article never resolved it. */
export function resolveProviderWebsite(
  name: string,
  index: ReadonlyMap<string, string>,
): string | null {
  return index.get(providerKey(name)) ?? null;
}

function resolveCard(
  card: SilverstoneBlogRankedCard,
  index: ReadonlyMap<string, string>,
): SilverstoneBlogRankedCard {
  if (card.website?.trim()) {
    return card;
  }
  const website = resolveProviderWebsite(card.name, index);
  return website ? { ...card, website } : card;
}

function resolveSection(
  section: SilverstoneBlogSection,
  index: ReadonlyMap<string, string>,
): SilverstoneBlogSection {
  const rankedCards = section.rankedCards?.map((card) => resolveCard(card, index));
  const subsections = section.subsections?.map((subsection) =>
    resolveSection(subsection, index),
  );

  const cardsChanged =
    rankedCards?.some((card, position) => card !== section.rankedCards?.[position]) ===
    true;
  const subsectionsChanged =
    subsections?.some(
      (subsection, position) => subsection !== section.subsections?.[position],
    ) === true;

  if (!cardsChanged && !subsectionsChanged) {
    return section;
  }

  return {
    ...section,
    ...(rankedCards ? { rankedCards } : {}),
    ...(subsections ? { subsections } : {}),
  };
}

/*
 * One resolved copy per post object. `ArticlePage` and the schema builder both
 * ask for it, and prerendering walks every post, so the identity cache keeps
 * that to a single pass per article and lets `===` checks downstream stay
 * meaningful.
 */
const resolved = new WeakMap<SilverstoneBlogPost, SilverstoneBlogPost>();

/**
 * The post with every ranked card's `website` filled in from its own verified
 * research, where the card did not already carry one. Returns the original
 * object when nothing needed filling, so posts without a shortlist — which is
 * most of them — cost one walk and no allocation.
 */
export function withResolvedProviderLinks(
  post: SilverstoneBlogPost,
): SilverstoneBlogPost {
  const cached = resolved.get(post);
  if (cached) {
    return cached;
  }

  const index = buildProviderLinkIndex(post.researchSources);
  let next = post;

  {
    const articleBody = post.articleBody.map((section) =>
      resolveSection(section, index),
    );
    if (
      articleBody.some((section, position) => section !== post.articleBody[position])
    ) {
      next = { ...post, articleBody };
    }
  }

  resolved.set(post, next);
  return next;
}
