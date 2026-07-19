/**
 * Insights hub search + category filter + article grid. Client-side only
 * (16 records, no pagination needed) — filters by the 16-category taxonomy
 * (7 services, 9 industries) and a free-text query matched against title and
 * summary bullets.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { ArrowUpRight, Clock, Search } from "~/components/icons/lucide";
import { CardHoverEffect } from "~/components/ui/card-hover-effect";

import {
  INSIGHT_ARTICLES,
  INSIGHT_CATEGORIES,
  insightArticleCategoryLabel,
  type InsightArticle,
} from "./insights-data";

type FilterId = "all" | (string & {});

function matchesQuery(article: InsightArticle, query: string): boolean {
  if (!query) {
    return true;
  }
  const haystack = `${article.title} ${article.summary.join(" ")}`.toLowerCase();
  return haystack.includes(query);
}

function articlePublishedTime(article: InsightArticle): number {
  const dateValue = article.publishedIsoDate ?? article.publishedDate;
  const timestamp = dateValue ? Date.parse(dateValue) : Number.NaN;

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function compareArticlesByRecency(a: InsightArticle, b: InsightArticle): number {
  const dateDifference = articlePublishedTime(b) - articlePublishedTime(a);

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return a.title.localeCompare(b.title);
}

function ArticleCard({ article }: { article: InsightArticle }) {
  const categoryLabel = insightArticleCategoryLabel(article);
  const articleHref = article.href;
  const published = article.status === "published" && Boolean(articleHref);

  const body = (
    <>
      <div className="ss-insight-card__media">
        <img
          src={article.imageSrc}
          alt={article.imageAlt}
          width="640"
          height="420"
          loading="lazy"
          decoding="async"
        />
        <span className="ss-insight-card__category">{categoryLabel}</span>
      </div>
      <div className="ss-insight-card__body">
        <span className="ss-insight-card__status" data-status={article.status}>
          <Clock aria-hidden="true" />
          {published ? article.publishedDate : "In development"}
        </span>
        <h3 className="ss-insight-card__title">{article.title}</h3>
        <ul className="ss-insight-card__summary">
          {article.summary.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <span
          className="ss-insight-card__cta"
          data-active={published ? "true" : undefined}
        >
          {published ? (
            <>
              Read the article <ArrowUpRight aria-hidden="true" />
            </>
          ) : (
            "Publishing soon"
          )}
        </span>
      </div>
    </>
  );

  // Article cards never play an entrance — filtering, searching and deep
  // links all re-render the grid, and a card that fades in on every
  // keystroke reads as flicker, not choreography. They are simply present.
  return published && articleHref ? (
    <Link
      className="ss-insight-card"
      data-insight-id={article.id}
      data-status={article.status}
      prefetch="intent"
      to={articleHref}
    >
      {body}
    </Link>
  ) : (
    <article
      aria-disabled="true"
      className="ss-insight-card"
      data-insight-id={article.id}
      data-status={article.status}
    >
      {body}
    </article>
  );
}

export function InsightsBoard() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      INSIGHT_ARTICLES.filter(
        (article) =>
          (activeFilter === "all" || article.categoryId === activeFilter) &&
          matchesQuery(article, normalizedQuery),
      ).sort(compareArticlesByRecency),
    [activeFilter, normalizedQuery],
  );

  const serviceCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "service");
  const industryCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "industry");

  return (
    <div className="ss-insight-board" data-deep-link-anchor="self" id="insights-search">
      {/* No entrance reveal here: the search and filters are working
          controls and are simply present with the article grid. */}
      <div className="ss-insight-board__controls">
        <label className="ss-insight-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search Insights by title or topic</span>
          <input
            type="search"
            placeholder="Search by subject or question…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div
          className="ss-insight-filters"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            className="ss-insight-filters__pill"
            data-active={activeFilter === "all" ? "true" : undefined}
            onClick={() => setActiveFilter("all")}
          >
            All topics
          </button>
          <span className="ss-insight-filters__group-label">Services</span>
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="ss-insight-filters__pill"
              data-active={activeFilter === category.id ? "true" : undefined}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
          <span className="ss-insight-filters__group-label">Industries</span>
          {industryCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="ss-insight-filters__pill"
              data-active={activeFilter === category.id ? "true" : undefined}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <p className="ss-insight-board__count" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
        {activeFilter !== "all"
          ? ` in ${INSIGHT_CATEGORIES.find((c) => c.id === activeFilter)?.label ?? ""}`
          : ""}
        {normalizedQuery ? ` matching “${query.trim()}”` : ""}
      </p>

      {filtered.length > 0 ? (
        <CardHoverEffect
          className="ss-insight-grid"
          itemClassName="ss-insight-grid__item"
          items={filtered.map((article) => ({
            id: article.id,
            content: <ArticleCard article={article} />,
          }))}
          layoutId="insight-card-hover-surface"
        />
      ) : (
        <div className="ss-insight-board__empty">
          <p>
            No topics match that search yet. Try another term, or clear the category
            filter.
          </p>
        </div>
      )}
    </div>
  );
}
