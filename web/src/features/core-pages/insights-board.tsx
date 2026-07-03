/**
 * Insights hub search + category filter + article grid. Client-side only
 * (16 records, no pagination needed) — filters by the 16-category taxonomy
 * (7 services, 9 industries) and a free-text query matched against title and
 * summary bullets.
 */
import { useMemo, useState } from "react";

import { ArrowUpRight, Clock, Search } from "~/components/icons/lucide";
import { Reveal } from "~/features/services-v2/components/primitives";

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

function ArticleCard({ article, index }: { article: InsightArticle; index: number }) {
  const categoryLabel = insightArticleCategoryLabel(article);
  const published = article.status === "published" && article.href;

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
        <span className="ss-insight-card__cta" data-active={published ? "true" : undefined}>
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

  return (
    <Reveal kind="card" delayMs={Math.min(index, 6) * 90}>
      {published ? (
        <a className="ss-insight-card" href={article.href} data-status={article.status}>
          {body}
        </a>
      ) : (
        <article className="ss-insight-card" data-status={article.status} aria-disabled="true">
          {body}
        </article>
      )}
    </Reveal>
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
      ),
    [activeFilter, normalizedQuery],
  );

  const serviceCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "service");
  const industryCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "industry");

  return (
    <div className="ss-insight-board">
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

        <div className="ss-insight-filters" role="group" aria-label="Filter by category">
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
        <div className="ss-insight-grid">
          {filtered.map((article, index) => (
            <ArticleCard article={article} index={index} key={article.id} />
          ))}
        </div>
      ) : (
        <div className="ss-insight-board__empty">
          <p>No topics match that search yet. Try another term, or clear the category filter.</p>
        </div>
      )}
    </div>
  );
}
