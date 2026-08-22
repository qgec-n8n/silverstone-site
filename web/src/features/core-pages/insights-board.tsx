/**
 * Insights hub search + category filter + article grid. Client-side only —
 * filters by the 17-category taxonomy (7 services, 10 industries, plus
 * editorial topics) and a free-text query matched against title and summary
 * bullets.
 *
 * The grid pages in blocks of twelve (four rows of three on the desktop
 * three-column layout) behind a "Show more articles" button. Paging is a
 * *presentation* concern only: every matching card stays mounted with its
 * real `<a href>` and is hidden with CSS beyond the visible count, so the
 * prerendered HTML for /blog still carries one crawlable link to every
 * published post. Slicing the array instead would drop the hub from ~75
 * outbound links to twelve, and this hub is the primary internal link into
 * the article set.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { ArrowUpRight, ChevronDown, Clock, Search } from "~/components/icons/lucide";
import { CardHoverEffect } from "~/components/ui/card-hover-effect";

import {
  INSIGHT_ARTICLES,
  INSIGHT_CATEGORIES,
  insightArticleCategoryLabel,
  type InsightArticle,
} from "./insights-data";

type FilterId = "all" | (string & {});

/** Four rows of three on the >=68rem three-column grid. */
const PAGE_SIZE = 12;

/**
 * The search box and the category pills answer the same question, so they read
 * the same fields. Matching only title and summary meant typing a category name
 * — "dentists", "consulting", "voice agents" — returned nothing unless the words
 * happened to appear in a headline, even while a pill for that exact category
 * sat next to the box. The category label and the post's own keywords are part
 * of the haystack for that reason.
 */
function normaliseForSearch(value: string): string {
  // "AI & Automation Consulting" is the label on the pill, but nobody types the
  // ampersand, so both sides of the comparison spell it out.
  return value.toLowerCase().replace(/&/g, " and ").replace(/\s+/g, " ").trim();
}

function articleHaystack(article: InsightArticle): string {
  return normaliseForSearch(
    [
      article.title,
      ...article.summary,
      insightArticleCategoryLabel(article),
      ...(article.keywords ?? []),
    ].join(" "),
  );
}

function matchesQuery(article: InsightArticle, query: string): boolean {
  if (!query) {
    return true;
  }

  return articleHaystack(article).includes(query);
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
  /* Paging is keyed to the active search + filter rather than reset from an
     effect: a new query is a new result set, so it starts at page one without
     a second render pass writing state back. */
  const [paging, setPaging] = useState({ key: "", visible: PAGE_SIZE });

  const normalizedQuery = normaliseForSearch(query);
  const filtered = useMemo(
    () =>
      INSIGHT_ARTICLES.filter(
        (article) =>
          (activeFilter === "all" || article.categoryId === activeFilter) &&
          matchesQuery(article, normalizedQuery),
      ).sort(compareArticlesByRecency),
    [activeFilter, normalizedQuery],
  );

  const pagingKey = `${activeFilter}::${normalizedQuery}`;
  const visibleCount =
    paging.key === pagingKey ? Math.min(paging.visible, filtered.length) : PAGE_SIZE;
  const remaining = Math.max(0, filtered.length - visibleCount);

  const serviceCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "service");
  const industryCategories = INSIGHT_CATEGORIES.filter((c) => c.group === "industry");
  // A pill with nothing behind it is a dead end, so topic pills only appear once
  // that topic has published articles. The editorial programme fills these in
  // over time and the row grows with it rather than shipping empty on day one.
  const topicCategories = INSIGHT_CATEGORIES.filter(
    (c) =>
      c.group === "topic" &&
      INSIGHT_ARTICLES.some((article) => article.categoryId === c.id),
  );

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
          {topicCategories.length > 0 ? (
            <>
              <span className="ss-insight-filters__group-label">Topics</span>
              {topicCategories.map((category) => (
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
            </>
          ) : null}
        </div>
      </div>

      <p className="ss-insight-board__count" role="status" aria-live="polite">
        {remaining > 0 ? `Showing ${String(visibleCount)} of ` : ""}
        {filtered.length} {filtered.length === 1 ? "topic" : "topics"}
        {activeFilter !== "all"
          ? ` in ${INSIGHT_CATEGORIES.find((c) => c.id === activeFilter)?.label ?? ""}`
          : ""}
        {normalizedQuery ? ` matching “${query.trim()}”` : ""}
      </p>

      {filtered.length > 0 ? (
        <>
          <CardHoverEffect
            className="ss-insight-grid"
            itemClassName="ss-insight-grid__item"
            items={filtered.map((article, index) => ({
              id: article.id,
              content: <ArticleCard article={article} />,
              /* Beyond the current page the card is still mounted and still
                 crawlable — CSS takes it out of flow, the tab order and the
                 accessibility tree. */
              hidden: index >= visibleCount,
            }))}
            layoutId="insight-card-hover-surface"
          />
          {remaining > 0 ? (
            <div className="ss-insight-board__more">
              <button
                type="button"
                className="ss-insight-board__more-button"
                onClick={() => {
                  setPaging({ key: pagingKey, visible: visibleCount + PAGE_SIZE });
                }}
              >
                Show more articles
                <span className="ss-insight-board__more-count">
                  {Math.min(PAGE_SIZE, remaining)} more
                </span>
                <ChevronDown aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </>
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
