import type { InsightArticle } from "~/features/core-pages/insights-data";

export type SilverstoneBlogLink = {
  href: string;
  label: string;
};

export type SilverstoneBlogFaq = {
  answer: string;
  question: string;
};

export type SilverstoneBlogSection = {
  body: string[];
  heading: string;
  subsections?: SilverstoneBlogSection[];
};

export type SilverstoneBlogSource = {
  date?: string;
  relevance?: string;
  summary?: string;
  title: string;
  url: string;
};

export type SilverstoneBlogPost = {
  articleBody: SilverstoneBlogSection[];
  categoryId: string;
  categoryKey: string;
  categoryLabel: string;
  categoryOrder: number;
  ctaPrimary: SilverstoneBlogLink;
  ctaSecondary: SilverstoneBlogLink;
  displayDate: string;
  faqs: SilverstoneBlogFaq[];
  heroImage: string;
  heroImageAlt: string;
  imagePrompt: string;
  internalLinks: SilverstoneBlogLink[];
  metaDescription: string;
  metaTitle: string;
  primaryKeyword: string;
  publishedIsoDate: string;
  readTime: string;
  researchSources: SilverstoneBlogSource[];
  secondaryKeywords: string[];
  slug: string;
  status: "draft" | "published";
  subtitle: string;
  summary: string[];
  title: string;
  updatedIsoDate: string;
};

export const BLOG_POSTS: SilverstoneBlogPost[] = [
  // N8N_BLOG_POSTS_START
  // N8N_BLOG_POSTS_END
];

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter(
  (post) => post.status === "published",
);

export function getBlogPostBySlug(slug: string | undefined) {
  if (!slug) {
    return undefined;
  }

  return PUBLISHED_BLOG_POSTS.find((post) => post.slug === slug);
}

export const BLOG_CARD_ARTICLES: InsightArticle[] = PUBLISHED_BLOG_POSTS.map(
  (post) => ({
    id: post.slug,
    categoryId: post.categoryId,
    href: `/blog/${post.slug}`,
    imageAlt: post.heroImageAlt,
    imageSrc: post.heroImage,
    publishedDate: post.displayDate,
    status: "published",
    summary: post.summary,
    title: post.title,
  }),
);
