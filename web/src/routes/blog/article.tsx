import { Link, useParams, type MetaFunction } from "react-router";

import { getBlogPostBySlug } from "~/data/blog-posts";
import { getPublicEnvironment } from "~/lib/environment";
import { buildCanonicalUrl } from "~/seo/canonical";
import { ArticlePage } from "~/routes/templates/article-page";

const BLOG_CANONICAL_ORIGIN = "https://silverstone-ai.com";
// Uniform across all 34 generated hero images; blog-posts.test.ts fails if a
// post ever ships a hero at a different size, which would make these og:image
// dimension hints lie to social crawlers.
export const BLOG_HERO_IMAGE_WIDTH = 1536;
export const BLOG_HERO_IMAGE_HEIGHT = 864;

export const meta: MetaFunction = ({ params }) => {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return [{ title: "Blog article not found | Silverstone AI" }];
  }

  const environment = getPublicEnvironment();
  const canonical = buildCanonicalUrl(BLOG_CANONICAL_ORIGIN, `/blog/${post.slug}`);
  // Production is indexable by default (launch policy: every route indexes
  // unless explicitly withheld); staging always carries its blanket noindex.
  const robots = environment.isStaging ? environment.robotsMeta : "index, follow";
  // Social crawlers require absolute image URLs.
  const heroImageUrl = post.heroImage.startsWith("http")
    ? post.heroImage
    : `${BLOG_CANONICAL_ORIGIN}${post.heroImage}`;
  const modifiedTime =
    post.updatedIsoDate && post.updatedIsoDate !== post.publishedIsoDate
      ? post.updatedIsoDate
      : post.publishedIsoDate;

  return [
    { title: post.metaTitle },
    { name: "description", content: post.metaDescription },
    { name: "robots", content: robots },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "Silverstone AI" },
    { property: "og:locale", content: "en_GB" },
    { property: "og:title", content: post.metaTitle },
    { property: "og:description", content: post.metaDescription },
    { property: "og:url", content: canonical },
    { property: "og:image", content: heroImageUrl },
    // Every generated hero is 1536x864 (asserted in blog-posts.test.ts), so the
    // dimensions are safe to declare. Non-blog routes already ship these via
    // buildRouteMetadata; without them a social crawler has to fetch the image
    // before it can lay the card out, and some renderers fall back to a small
    // summary card instead of the large one twitter:card asks for.
    { property: "og:image:width", content: String(BLOG_HERO_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(BLOG_HERO_IMAGE_HEIGHT) },
    { property: "og:image:alt", content: post.heroImageAlt },
    { property: "article:published_time", content: post.publishedIsoDate },
    { property: "article:modified_time", content: modifiedTime },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.metaTitle },
    { name: "twitter:description", content: post.metaDescription },
    { name: "twitter:image", content: heroImageUrl },
    { name: "twitter:image:alt", content: post.heroImageAlt },
  ];
};

export default function ArticleRoute() {
  const params = useParams();
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-20 text-center">
        <div>
          <p className="ss-eyebrow mb-4 font-mono text-muted-foreground">404</p>
          <h1 className="text-h2">This article is not published.</h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            The insights index links to every live Silverstone article.
          </p>
          <Link className="mt-6 inline-flex text-primary underline" to="/blog">
            Return to insights
          </Link>
        </div>
      </div>
    );
  }

  return <ArticlePage post={post} />;
}
