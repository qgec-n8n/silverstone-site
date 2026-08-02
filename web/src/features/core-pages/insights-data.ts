/**
 * Insights hub data: the 16-category taxonomy (7 services + 9 industries)
 * and the article-card records that back the searchable/filterable grid.
 *
 * AUTOMATION CONTRACT — the blog-generation automation appends one
 * SilverstoneBlogPost object between the marker comments in
 * `~/data/blog-posts.ts`. The card grid below consumes that data through
 * `BLOG_CARD_ARTICLES`; the placeholder card remains only for the empty-state
 * pre-publication build.
 */

import { BLOG_CARD_ARTICLES } from "~/data/blog-posts";

export type InsightCategoryGroup = "service" | "industry";

export type InsightCategory = {
  group: InsightCategoryGroup;
  href: string;
  id: string;
  label: string;
};

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    id: "web-design-development",
    label: "Web Design & Development",
    group: "service",
    href: "/services/web-design-development",
  },
  {
    id: "app-development",
    label: "App Development",
    group: "service",
    href: "/services/app-development",
  },
  {
    id: "ai-voice-agents",
    label: "AI Voice Agents",
    group: "service",
    href: "/services/ai-voice-agents",
  },
  {
    id: "ai-receptionists",
    label: "AI Receptionists",
    group: "service",
    href: "/services/ai-receptionists",
  },
  {
    id: "ai-automation",
    label: "AI Automation",
    group: "service",
    href: "/services/ai-automation",
  },
  {
    id: "ai-consulting",
    label: "AI & Automation Consulting",
    group: "service",
    href: "/services/ai-consulting",
  },
  {
    id: "content-creation",
    label: "Content Creation",
    group: "service",
    href: "/services/content-creation",
  },
  {
    id: "estate-agents",
    label: "Estate Agents",
    group: "industry",
    href: "/industry/estate-agents",
  },
  {
    id: "hospitality",
    label: "Hospitality",
    group: "industry",
    href: "/industry/hospitality",
  },
  {
    id: "salons-barbers",
    label: "Salons & Barbers",
    group: "industry",
    href: "/industry/salons-barbers",
  },
  {
    id: "trades",
    label: "Trades & Home Services",
    group: "industry",
    href: "/industry/trades",
  },
  {
    id: "ecommerce",
    label: "eCommerce Brands",
    group: "industry",
    href: "/industry/ecommerce",
  },
  {
    id: "physios-chiropractors",
    label: "Physio & Chiropractic",
    group: "industry",
    href: "/industry/physios-chiropractors",
  },
  {
    id: "dentists",
    label: "Dental Practices",
    group: "industry",
    href: "/industry/dentists",
  },
  {
    id: "gyms-fitness-studios",
    label: "Gyms & Fitness Studios",
    group: "industry",
    href: "/industry/gyms-fitness-studios",
  },
  {
    id: "fitness-coaches",
    label: "Fitness Coaches",
    group: "industry",
    href: "/industry/fitness-coaches",
  },
];

export type InsightArticle = {
  categoryId: string;
  href?: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  /**
   * The post's primary and secondary search keywords, used only to widen the
   * free-text search. A reader who types "missed calls" or "no-show" is
   * describing the problem, not quoting the headline, and those phrases live in
   * the keywords rather than in the title or the three summary bullets.
   */
  keywords?: string[];
  publishedIsoDate?: string;
  publishedDate?: string;
  status: "planned" | "published";
  summary: string[];
  title: string;
};

const categoryLabel = (id: string): string =>
  INSIGHT_CATEGORIES.find((category) => category.id === id)?.label ?? id;

const PLACEHOLDER_INSIGHT_ARTICLES: InsightArticle[] = [
  // Placeholder card — the automation's reference record. Every value below
  // is deliberately a placeholder; live posts are appended to blog-posts.ts.
  {
    id: "placeholder-article",
    categoryId: "ai-automation",
    title: "Placeholder article title — replaced by the blog automation",
    summary: [
      "Placeholder summary line one: the first key takeaway goes here",
      "Placeholder summary line two: the second key takeaway goes here",
      "Placeholder summary line three: the third key takeaway goes here",
    ],
    status: "planned",
    href: "/blog/placeholder-article-slug",
    publishedDate: "1 Jan 2026",
    imageSrc: "/brand/blog-card-placeholder.svg",
    imageAlt: "Placeholder cover image for a forthcoming Silverstone AI article.",
  },
];

export const INSIGHT_ARTICLES: InsightArticle[] =
  BLOG_CARD_ARTICLES.length > 0 ? BLOG_CARD_ARTICLES : PLACEHOLDER_INSIGHT_ARTICLES;

export function insightArticleCategoryLabel(article: InsightArticle): string {
  return categoryLabel(article.categoryId);
}
