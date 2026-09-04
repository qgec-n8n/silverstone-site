import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2Icon,
  ClipboardCheck,
  Clock,
  FileText,
  InfoIcon,
  Layers,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlertIcon,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "~/components/icons/lucide";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type {
  SilverstoneBlogBullet,
  SilverstoneBlogCallout,
  SilverstoneBlogChecklist,
  SilverstoneBlogDefinitionList,
  SilverstoneBlogEntityLink,
  SilverstoneBlogGridItem,
  SilverstoneBlogKeyTakeaways,
  SilverstoneBlogMetricPanel,
  SilverstoneBlogPost,
  SilverstoneBlogPromptBlock,
  SilverstoneBlogQuoteCard,
  SilverstoneBlogRankedCard,
  SilverstoneBlogScorecard,
  SilverstoneBlogSection,
  SilverstoneBlogStatBand,
  SilverstoneBlogStep,
  SilverstoneBlogTable,
  SilverstoneBlogTimeline,
  SilverstoneBlogVersusCard,
} from "~/data/blog-posts";
import { getRelatedPosts } from "~/data/blog-related";
import {
  BorderBeam,
  Eyebrow,
  Reveal,
  RichText,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import { ScrollCue } from "~/features/services-v2/components/secondary-hero";
import { RouteExperienceFrame } from "~/routes/templates/route-experience-frame";
import { buildOrganizationNode, ORGANIZATION_ID, serializeJsonLd } from "~/seo/schema";

type ArticlePageProps = {
  post: SilverstoneBlogPost;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Section headings arrive from the automation pipeline as plain strings, so
 * the single gradient accent every other page's headings carry (`*phrase*`
 * emphasis → gradient `em`) is applied here: the closing phrase of the
 * heading is emphasized, skipping leading connective words so the gradient
 * never starts on "and"/"the". Headings that already carry `*emphasis*`
 * markers, or are too short to split, are left untouched.
 */
const EMPHASIS_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "before",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "or",
  "still",
  "the",
  "to",
  "versus",
  "vs",
  "with",
]);

function emphasiseHeading(heading: string): string {
  if (heading.includes("*")) {
    return heading;
  }
  const words = heading.trim().split(/\s+/);
  if (words.length < 3) {
    return heading;
  }
  let start = words.length - (words.length >= 6 ? 3 : 2);
  while (
    start < words.length - 1 &&
    EMPHASIS_STOPWORDS.has((words[start] ?? "").toLowerCase().replace(/[^a-z-]/g, ""))
  ) {
    start += 1;
  }
  const head = words.slice(0, start).join(" ");
  const tail = words.slice(start).join(" ");
  return `${head} *${tail}*`;
}

type SanitizedHref = {
  external: boolean;
  href: string;
  hostname?: string;
};

function isSilverstoneHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return (
    normalized === "silverstone-ai.com" || normalized.endsWith(".silverstone-ai.com")
  );
}

/**
 * Every article carries a byline. The automation stamps `author` on new posts;
 * the back catalogue predates the field, and an unattributed article is a
 * measurable E-E-A-T weakness, so the same organisational byline is rendered
 * for those rather than hiding the line. This is an organisational byline, not
 * a person: the BlogPosting `author` in the JSON-LD below points at the
 * Organization node for exactly that reason, and must keep doing so.
 */
export const DEFAULT_BLOG_AUTHOR = "Silverstone AI News & Media Team";

export function sanitizeHref(href: string): SanitizedHref | null {
  const trimmed = href.trim();

  if (/^\/(?![\\/])/.test(trimmed)) {
    return { external: false, href: trimmed };
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") {
      return null;
    }
    if (isSilverstoneHostname(url.hostname)) {
      return {
        external: false,
        href: `${url.pathname}${url.search}${url.hash}`,
      };
    }
    return {
      external: true,
      href: url.href,
      hostname: url.hostname.replace(/^www\./i, ""),
    };
  } catch {
    return null;
  }
}

function ArticleLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const destination = sanitizeHref(href);

  if (!destination) {
    return null;
  }

  if (destination.external) {
    return (
      <a
        className={
          className
            ? `${className} ss-blog-article__external-link`
            : "ss-blog-article__external-link"
        }
        href={destination.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <span>{children}</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link className={className} to={destination.href}>
      {children}
    </Link>
  );
}

function ArticleRichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const anchorPattern =
    /<a\s+href="([^"]+)">([\s\S]*?)<\/a>|\[([^\]]+)\]\(([^)\s]+)\)/gi;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(text)) !== null) {
    const rawAnchor = match[0];
    const rawHref = match[1] ?? match[4] ?? "";
    const label = match[2] ?? match[3] ?? rawAnchor;
    if (match.index > lastIndex) {
      nodes.push(
        <RichText
          key={`text-${String(key++)}`}
          text={text.slice(lastIndex, match.index)}
        />,
      );
    }

    const href = sanitizeHref(rawHref);
    if (href) {
      nodes.push(
        <ArticleLink href={rawHref} key={`link-${String(key++)}`}>
          <RichText text={label} />
        </ArticleLink>,
      );
    } else {
      nodes.push(<RichText key={`fallback-${String(key++)}`} text={label} />);
    }

    lastIndex = match.index + rawAnchor.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<RichText key={`text-${String(key++)}`} text={text.slice(lastIndex)} />);
  }

  return <>{nodes}</>;
}

const BULLET_ICONS = [Zap, Target, Sparkles, Check] as const;

function ArticlePullQuote({ quote }: { quote?: string | undefined }) {
  const trimmedQuote = quote?.trim();

  if (!trimmedQuote) {
    return null;
  }

  return (
    <blockquote className="ss-blog-article__pullquote">
      <Sparkles aria-hidden="true" />
      <p>
        <ArticleRichText text={trimmedQuote} />
      </p>
    </blockquote>
  );
}

function ArticleKeyTakeaways({
  block,
}: {
  block?: SilverstoneBlogKeyTakeaways | undefined;
}) {
  const items =
    block?.items
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 7) ?? [];

  if (items.length === 0) {
    return null;
  }
  const title = block?.title?.trim();
  const displayedTitle = title?.length ? title : undefined;

  return (
    <aside className="ss-blog-article__takeaways" aria-label="Key takeaways">
      <div className="ss-blog-article__takeaways-head">
        <CheckCircle2Icon aria-hidden="true" />
        <strong>{displayedTitle ?? "Key takeaways"}</strong>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${String(index)}`}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {/*
             * The numeral and the copy are the two tracks of a two-column grid,
             * so the copy has to arrive as exactly ONE child. ArticleRichText
             * returns a fragment and RichText returns a bare array, which means
             * every bold span, chip, highlight, link and plain-text run would
             * otherwise become its own grid item: an item like
             * "**Self-pay** should usually move fastest." laid the bold half in
             * column two and dropped the rest onto a second row inside the
             * numeral column, stretching that column to the width of the
             * runover. Any item whose markup does not span the whole line hit
             * it, which is why the takeaways card looked broken so often.
             */}
            <div className="ss-blog-article__takeaways-copy">
              <ArticleRichText text={item} />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ArticleStatBand({ band }: { band?: SilverstoneBlogStatBand | undefined }) {
  const items =
    band?.items.filter((item) => item.label.trim() && item.value.trim()).slice(0, 4) ??
    [];

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="ss-blog-article__wide-block ss-blog-article__stat-band ss-blog-article__neon-border">
      {band?.title?.trim() ? (
        <strong className="ss-blog-article__stat-band-title">
          <TrendingUp aria-hidden="true" />
          {band.title.trim()}
        </strong>
      ) : null}
      <dl>
        {items.map((item, index) => (
          <div
            data-tone={item.tone ?? "benchmark"}
            key={`${item.label}-${String(index)}`}
          >
            <dd>
              <ArticleRichText text={item.value.trim()} />
            </dd>
            <dt>{item.label.trim()}</dt>
            {item.detail?.trim() ? (
              <p>
                <ArticleRichText text={item.detail.trim()} />
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </aside>
  );
}

function ArticleVersusCard({
  card,
  headingLevel,
}: {
  card?: SilverstoneBlogVersusCard | undefined;
  headingLevel: 3 | 4;
}) {
  if (
    !card?.left.title.trim() ||
    !card.left.body.trim() ||
    !card.right.title.trim() ||
    !card.right.body.trim()
  ) {
    return null;
  }

  const Heading = headingLevel === 3 ? "h3" : "h4";
  const sides = [
    { key: "left", side: card.left, tone: "consider" },
    { key: "right", side: card.right, tone: "prefer" },
  ] as const;

  return (
    <div className="ss-blog-article__versus">
      {card.eyebrow?.trim() ? (
        <span className="ss-blog-article__versus-eyebrow">
          <Layers aria-hidden="true" />
          {card.eyebrow.trim()}
        </span>
      ) : null}
      <div className="ss-blog-article__versus-grid">
        {sides.map(({ key, side, tone }) => (
          <article data-tone={tone} key={key}>
            {side.label?.trim() ? <span>{side.label.trim()}</span> : null}
            <Heading>
              <ArticleRichText text={side.title.trim()} />
            </Heading>
            <p>
              <ArticleRichText text={side.body.trim()} />
            </p>
            {side.points?.some((point) => point.trim()) ? (
              <ul>
                {side.points
                  .filter((point) => point.trim())
                  .slice(0, 4)
                  .map((point, index) => (
                    // Same two-column grid, same one-child rule.
                    <li key={`${point}-${String(index)}`}>
                      <Check aria-hidden="true" />
                      <div className="ss-blog-article__versus-point">
                        <ArticleRichText text={point.trim()} />
                      </div>
                    </li>
                  ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
      {card.verdict?.trim() ? (
        <p className="ss-blog-article__versus-verdict">
          <strong>Verdict</strong>
          <ArticleRichText text={card.verdict.trim()} />
        </p>
      ) : null}
    </div>
  );
}

function ArticleDefinitions({
  list,
}: {
  list?: SilverstoneBlogDefinitionList | undefined;
}) {
  const items =
    list?.items
      .filter((item) => item.term.trim() && item.definition.trim())
      .slice(0, 8) ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ss-blog-article__definitions">
      {list?.title?.trim() ? (
        <strong className="ss-blog-article__definitions-title">
          <FileText aria-hidden="true" />
          {list.title.trim()}
        </strong>
      ) : null}
      <dl>
        {items.map((item, index) => (
          <div key={`${item.term}-${String(index)}`}>
            {/* Same two-column grid, same one-child rule as the takeaways card. */}
            <dt>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="ss-blog-article__definitions-term">
                <ArticleRichText text={item.term.trim()} />
              </div>
            </dt>
            <dd>
              <ArticleRichText text={item.definition.trim()} />
              {item.note?.trim() ? (
                <small>
                  <ArticleRichText text={item.note.trim()} />
                </small>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ArticleTimeline({
  headingLevel,
  timeline,
}: {
  headingLevel: 3 | 4;
  timeline?: SilverstoneBlogTimeline | undefined;
}) {
  const items =
    timeline?.items
      .filter((item) => item.title.trim() && item.body.trim())
      .slice(0, 8) ?? [];

  if (items.length === 0) {
    return null;
  }

  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <div className="ss-blog-article__timeline">
      {timeline?.title?.trim() ? (
        <strong className="ss-blog-article__timeline-title">
          <Workflow aria-hidden="true" />
          {timeline.title.trim()}
        </strong>
      ) : null}
      <ol>
        {items.map((item, index) => (
          <li key={`${item.title}-${String(index)}`}>
            <span className="ss-blog-article__timeline-node" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {item.label?.trim() ? <span>{item.label.trim()}</span> : null}
              <Heading>
                <ArticleRichText text={item.title.trim()} />
              </Heading>
              <p>
                <ArticleRichText text={item.body.trim()} />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArticleQuoteCard({ card }: { card?: SilverstoneBlogQuoteCard | undefined }) {
  if (!card?.quote.trim() || !card.attribution.trim()) {
    return null;
  }

  const attributionUrl = card.url?.trim();
  const attribution =
    attributionUrl && sanitizeHref(attributionUrl) ? (
      <ArticleLink href={attributionUrl}>{card.attribution.trim()}</ArticleLink>
    ) : (
      card.attribution.trim()
    );

  return (
    <figure className="ss-blog-article__quote-card">
      <Sparkles aria-hidden="true" />
      <blockquote>
        <ArticleRichText text={card.quote.trim()} />
      </blockquote>
      <figcaption>
        <strong>{attribution}</strong>
        {card.role?.trim() ? <span>{card.role.trim()}</span> : null}
      </figcaption>
    </figure>
  );
}

function ArticleEntityLinks({
  links,
}: {
  links?: SilverstoneBlogEntityLink[] | undefined;
}) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav className="ss-blog-article__entities" aria-label="Referenced entities">
      {links.map((link) => (
        <ArticleLink
          className="ss-blog-article__entity-button"
          href={link.url}
          key={`${link.name}-${link.url}`}
        >
          <span>
            {link.kind ? <small>{link.kind}</small> : null}
            {link.name}
          </span>
        </ArticleLink>
      ))}
    </nav>
  );
}

function resolveArticleEntityLinks(
  sections: readonly SilverstoneBlogSection[],
): Map<SilverstoneBlogSection, SilverstoneBlogEntityLink[]> {
  const resolved = new Map<SilverstoneBlogSection, SilverstoneBlogEntityLink[]>();
  const articleCounts = new Map<string, number>();

  const walk = (entries: readonly SilverstoneBlogSection[]) => {
    for (const section of entries) {
      const localNames = new Set<string>();
      const usable: SilverstoneBlogEntityLink[] = [];
      for (const entity of section.entityLinks ?? []) {
        const name = entity.name.trim();
        const key = name.toLocaleLowerCase("en-GB");
        if (
          usable.length >= 4 ||
          !name ||
          !sanitizeHref(entity.url) ||
          localNames.has(key) ||
          (articleCounts.get(key) ?? 0) >= 2
        ) {
          continue;
        }
        localNames.add(key);
        articleCounts.set(key, (articleCounts.get(key) ?? 0) + 1);
        usable.push({ ...entity, name });
      }
      if (usable.length > 0) {
        resolved.set(section, usable);
      }
      walk(section.subsections ?? []);
    }
  };

  walk(sections);
  return resolved;
}

function ArticleBulletPanel({
  items,
}: {
  items?: SilverstoneBlogBullet[] | undefined;
}) {
  const usableItems =
    items?.filter((item) => item.label.trim() && item.body.trim()).slice(0, 6) ?? [];

  if (usableItems.length === 0) {
    return null;
  }

  return (
    <ul className="ss-blog-article__bullet-list" aria-label="Article signals">
      {usableItems.map((item, index) => {
        const Icon = BULLET_ICONS[index % BULLET_ICONS.length] ?? Sparkles;

        return (
          <li
            key={`${item.label}-${String(index)}`}
            className="ss-blog-article__bullet-item"
          >
            <span className="ss-blog-article__bullet-icon">
              <Icon aria-hidden="true" />
            </span>
            <span>
              <strong>
                <ArticleRichText text={item.label} />
              </strong>
              <span>
                <ArticleRichText text={item.body} />
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Card titles sit one level below whatever heading introduced the block, so the
 * level follows the caller: `h3` under a section's `h2`, `h4` under a
 * subsection's `h3`. Hard-coding `h4` skipped a level on every article whose
 * grid hangs off a section heading (31 of 34).
 */
function ArticleGrid({
  headingLevel,
  items,
}: {
  headingLevel: 3 | 4;
  items?: SilverstoneBlogGridItem[] | undefined;
}) {
  const usableItems =
    items?.filter((item) => item.title.trim() && item.body.trim()).slice(0, 6) ?? [];

  if (usableItems.length === 0) {
    return null;
  }

  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <div className="ss-blog-article__grid" aria-label="Article grid">
      {usableItems.map((item, index) => (
        <div
          className="ss-blog-article__grid-item"
          key={`${item.title}-${String(index)}`}
        >
          <span>
            {item.label?.trim()
              ? item.label.trim()
              : `Signal ${String(index + 1).padStart(2, "0")}`}
          </span>
          <Heading>
            <ArticleRichText text={item.title} />
          </Heading>
          <p>
            <ArticleRichText text={item.body} />
          </p>
        </div>
      ))}
    </div>
  );
}

function ArticleComparisonTable({
  table,
}: {
  table?: SilverstoneBlogTable | undefined;
}) {
  const columns = table?.columns.map((column) => column.trim()).filter(Boolean) ?? [];
  const rows =
    table?.rows
      .map((row) => ({
        cells: row.cells.map((cell) => cell.trim()),
        label: row.label.trim(),
      }))
      .filter(
        (row) =>
          row.label &&
          row.cells.length >= columns.length &&
          columns.every((_, index) => Boolean(row.cells[index])),
      ) ?? [];

  if (columns.length < 2 || rows.length === 0) {
    return null;
  }

  const columnCount = columns.length + 1;
  const tableMinWidth = `${String(Math.min(76, Math.max(54, columnCount * 13.5)))}rem`;

  return (
    <div
      className="ss-blog-article__table-wrap ss-blog-article__neon-border"
      style={{ "--blog-table-min-width": tableMinWidth } as CSSProperties}
    >
      <table className="ss-blog-article__table">
        <thead>
          <tr>
            <th scope="col">
              {table?.rowHeader?.trim().length
                ? table.rowHeader.trim()
                : "Decision point"}
            </th>
            {columns.map((column) => (
              <th key={column} scope="col">
                <ArticleRichText text={column} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">
                <ArticleRichText text={row.label} />
              </th>
              {columns.map((column, index) => (
                <td key={`${row.label}-${column}`} data-label={column}>
                  <ArticleRichText text={row.cells[index] ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*
 * Search-led presentation blocks.
 *
 * Each renderer returns null when its block is absent, so a post written before
 * these existed renders exactly the DOM it always did. Only the search-led
 * stream populates them, and it picks which to emit from the article's
 * presentation family — that is what stops a ranking article and a prompt guide
 * from looking identical.
 */

/*
 * Declared Partial deliberately: the tone arrives from automation-written data,
 * so an unrecognised value must fall back to a usable icon rather than render
 * `undefined` as a component. The type mirrors that runtime reality.
 */
const CALLOUT_ICONS: Partial<Record<SilverstoneBlogCallout["tone"], LucideIcon>> = {
  answer: InfoIcon,
  assumption: Layers,
  caution: TriangleAlertIcon,
  evidence: ShieldCheck,
  recommendation: CheckCircle2Icon,
};

function ArticleCallout({ callout }: { callout?: SilverstoneBlogCallout | undefined }) {
  const body = callout?.body.map((entry) => entry.trim()).filter(Boolean) ?? [];

  if (!callout || body.length === 0) {
    return null;
  }

  const Icon = CALLOUT_ICONS[callout.tone] ?? InfoIcon;

  return (
    <aside className="ss-blog-article__callout" data-tone={callout.tone}>
      <span className="ss-blog-article__callout-icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="ss-blog-article__callout-copy">
        {callout.label?.trim() ? (
          <span className="ss-blog-article__callout-label">{callout.label.trim()}</span>
        ) : null}
        {callout.title?.trim() ? (
          <strong>
            <ArticleRichText text={callout.title.trim()} />
          </strong>
        ) : null}
        {body.map((entry, index) => (
          <p key={`callout-${String(index)}`}>
            <ArticleRichText text={entry} />
          </p>
        ))}
      </div>
    </aside>
  );
}

function ArticleMetricPanel({
  panel,
}: {
  panel?: SilverstoneBlogMetricPanel | undefined;
}) {
  const items =
    panel?.items.filter((item) => item.label.trim() && item.value.trim()).slice(0, 6) ??
    [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ss-blog-article__metrics">
      {panel?.title?.trim() ? (
        <span className="ss-blog-article__metrics-title">
          <TrendingUp aria-hidden="true" />
          {panel.title.trim()}
        </span>
      ) : null}
      <dl>
        {items.map((item, index) => {
          const value = item.value.trim();
          const valueLength = Array.from(value).length;
          /*
           * These tiers drive grid spans as well as type size ("wide" spans 2
           * columns, "full" spans the row — see core-pages.css), so the
           * boundaries cannot be retuned to solve a type-fitting problem:
           * moving one value between tiers repacks the auto-fit grid and
           * changes its siblings' widths. Long values are fitted in CSS
           * instead, via the `wide` clamp inside the <= 40rem block.
           */
          const valueSize =
            valueLength > 36 ? "full" : valueLength > 18 ? "wide" : "standard";

          return (
            <div data-value-size={valueSize} key={`${item.label}-${String(index)}`}>
              <dt>{item.label.trim()}</dt>
              <dd>
                <ArticleRichText text={value} />
              </dd>
              {item.note?.trim() ? <p>{item.note.trim()}</p> : null}
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/**
 * Ranked provider cards. Rendered as an <ol> so the ranking is conveyed to
 * assistive technology and not only by the visible badge.
 */
function ArticleRankedCards({
  cards,
  headingLevel,
}: {
  cards?: SilverstoneBlogRankedCard[] | undefined;
  headingLevel: 3 | 4;
}) {
  const usable =
    cards
      ?.filter((card) => card.name.trim() && card.summary.trim())
      // The search-led stream composes shortlists of 8 to 12 named providers and
      // its quality gates enforce that band, so the ceiling here has to match it.
      // At 8 the last two entries were dropped on the page while the prose above
      // still referred to them; the band was widened to 8-12 when ranked
      // shortlists became the cited reference asset, and this ceiling moved with
      // it. Changing one without the other silently truncates the list again.
      .slice(0, 12)
      .sort((left, right) => left.rank - right.rank) ?? [];

  if (usable.length === 0) {
    return null;
  }

  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <ol className="ss-blog-article__ranked" aria-label="Ranked providers">
      {usable.map((card, index) => {
        const website = card.website?.trim() ? sanitizeHref(card.website.trim()) : null;

        return (
          <li
            className="ss-blog-article__ranked-card"
            data-lead={index === 0 ? "true" : undefined}
            key={`${card.name}-${String(card.rank)}`}
          >
            <div className="ss-blog-article__ranked-head">
              <span className="ss-blog-article__ranked-rank" aria-hidden="true">
                {String(card.rank).padStart(2, "0")}
              </span>
              <Heading>
                <ArticleRichText text={card.name} />
              </Heading>
              {card.score?.trim() ? (
                <span className="ss-blog-article__ranked-score">
                  {card.score.trim()}
                </span>
              ) : null}
            </div>
            <p>
              <ArticleRichText text={card.summary} />
            </p>
            {card.strengths && card.strengths.length > 0 ? (
              <ul>
                {card.strengths
                  .filter((entry) => entry.trim())
                  .slice(0, 5)
                  .map((entry, entryIndex) => (
                    <li key={`strength-${String(entryIndex)}`}>
                      <Check aria-hidden="true" />
                      <span>
                        <ArticleRichText text={entry} />
                      </span>
                    </li>
                  ))}
              </ul>
            ) : null}
            {card.bestFor?.trim() ? (
              <p className="ss-blog-article__ranked-fit">
                <span>Best for</span>
                <ArticleRichText text={card.bestFor.trim()} />
              </p>
            ) : null}
            {card.limitations?.trim() ? (
              <p className="ss-blog-article__ranked-limit">
                <span>Limitations</span>
                <ArticleRichText text={card.limitations.trim()} />
              </p>
            ) : null}
            {website && card.website ? (
              <ArticleLink
                className="ss-blog-article__entity-button ss-blog-article__ranked-website"
                href={card.website}
              >
                Visit {website.hostname ?? "site"}
              </ArticleLink>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function ArticleScorecard({
  scorecard,
}: {
  scorecard?: SilverstoneBlogScorecard | undefined;
}) {
  const options =
    scorecard?.options.map((option) => option.trim()).filter(Boolean) ?? [];
  const rows =
    scorecard?.rows
      .map((row) => ({
        cells: row.cells.map((cell) => cell.trim()),
        criterion: row.criterion.trim(),
        weight: row.weight?.trim() ?? "",
      }))
      .filter(
        (row) =>
          row.criterion &&
          row.cells.length >= options.length &&
          options.every((_, index) => Boolean(row.cells[index])),
      ) ?? [];

  if (options.length < 2 || rows.length === 0) {
    return null;
  }

  const showWeight = rows.some((row) => row.weight);
  const totals = scorecard?.totals?.map((total) => total.trim()) ?? [];
  const showTotals = totals.length >= options.length;
  const columnCount = options.length + (showWeight ? 2 : 1);
  const tableMinWidth = `${String(Math.min(76, Math.max(52, columnCount * 13)))}rem`;

  return (
    <div
      className="ss-blog-article__table-wrap ss-blog-article__neon-border"
      style={{ "--blog-table-min-width": tableMinWidth } as CSSProperties}
    >
      <table className="ss-blog-article__table ss-blog-article__table--scorecard">
        <thead>
          <tr>
            <th scope="col">Criterion</th>
            {showWeight ? <th scope="col">Weight</th> : null}
            {options.map((option) => (
              <th key={option} scope="col">
                <ArticleRichText text={option} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.criterion}>
              <th scope="row">
                <ArticleRichText text={row.criterion} />
              </th>
              {showWeight ? <td data-label="Weight">{row.weight || "—"}</td> : null}
              {options.map((option, index) => (
                <td key={`${row.criterion}-${option}`} data-label={option}>
                  <ArticleRichText text={row.cells[index] ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {showTotals ? (
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              {/* Weights do not total; the spacer is hidden once rows stack. */}
              {showWeight ? (
                <td aria-hidden="true" className="ss-blog-article__table-spacer" />
              ) : null}
              {options.map((option, index) => (
                <td key={`total-${option}`} data-label={option}>
                  {totals[index] ?? ""}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

function ArticlePromptBlocks({
  blocks,
}: {
  blocks?: SilverstoneBlogPromptBlock[] | undefined;
}) {
  const usable =
    blocks?.filter((block) => block.label.trim() && block.prompt.trim()).slice(0, 4) ??
    [];

  if (usable.length === 0) {
    return null;
  }

  return (
    <div className="ss-blog-article__prompts">
      {usable.map((block, index) => (
        <figure
          className="ss-blog-article__prompt"
          data-tone={block.tone ?? "improved"}
          key={`${block.label}-${String(index)}`}
        >
          <figcaption>
            <MessageSquare aria-hidden="true" />
            <span>{block.label.trim()}</span>
          </figcaption>
          {/* Prompts must stay copyable verbatim, so the text is not rich-parsed. */}
          <pre>
            <code>{block.prompt.trim()}</code>
          </pre>
          {block.explanation?.trim() ? (
            <p>
              <ArticleRichText text={block.explanation.trim()} />
            </p>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

function ArticleChecklist({
  checklist,
}: {
  checklist?: SilverstoneBlogChecklist | undefined;
}) {
  const items = checklist?.items.filter((item) => item.label.trim()).slice(0, 12) ?? [];

  if (items.length === 0) {
    return null;
  }

  const ListTag = checklist?.ordered ? "ol" : "ul";
  const checklistTitle = checklist?.title?.trim() ?? "";

  return (
    <div className="ss-blog-article__checklist">
      <span className="ss-blog-article__checklist-title">
        <ClipboardCheck aria-hidden="true" />
        {checklistTitle === "" ? "Checklist" : checklistTitle}
      </span>
      <ListTag>
        {items.map((item, index) => (
          <li key={`${item.label}-${String(index)}`}>
            <span className="ss-blog-article__checklist-mark" aria-hidden="true">
              {checklist?.ordered ? String(index + 1).padStart(2, "0") : <Check />}
            </span>
            <span>
              <strong>
                <ArticleRichText text={item.label.trim()} />
              </strong>
              {item.detail?.trim() ? (
                <span>
                  <ArticleRichText text={item.detail.trim()} />
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ListTag>
    </div>
  );
}

function ArticleSteps({
  headingLevel,
  steps,
}: {
  headingLevel: 3 | 4;
  steps?: SilverstoneBlogStep[] | undefined;
}) {
  const usable =
    steps?.filter((step) => step.title.trim() && step.body.trim()).slice(0, 8) ?? [];

  if (usable.length === 0) {
    return null;
  }

  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <ol className="ss-blog-article__steps" aria-label="Sequence">
      {usable.map((step, index) => (
        <li key={`${step.title}-${String(index)}`}>
          <span className="ss-blog-article__steps-index" aria-hidden="true">
            <Workflow />
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {step.label?.trim() ? (
              <span className="ss-blog-article__steps-label">{step.label.trim()}</span>
            ) : null}
            <Heading>
              <ArticleRichText text={step.title} />
            </Heading>
            <p>
              <ArticleRichText text={step.body} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * The direct-answer callout renders above the body so a cost, definition or
 * troubleshooting article can lead with its answer. Every other tone is a
 * commentary on what was just said and renders below.
 */
function ArticleLeadCallout({ section }: { section: SilverstoneBlogSection }) {
  if (section.callout?.tone !== "answer") {
    return null;
  }
  return <ArticleCallout callout={section.callout} />;
}

function ArticleSectionEnhancements({
  entityLinks,
  headingLevel,
  section,
  includeTables = true,
}: {
  entityLinks?: SilverstoneBlogEntityLink[] | undefined;
  headingLevel: 3 | 4;
  section: SilverstoneBlogSection;
  /** Every table is hoisted out of the card by `ArticleSection` — subsection
   * tables included. A subsection has no card of its own, but it renders
   * *inside* the section's card, so its 70rem breakout resolves against that
   * same 62rem box and hangs 4rem past each edge just as the scorecard did. */
  includeTables?: boolean;
}) {
  return (
    <>
      <ArticleKeyTakeaways block={section.keyTakeaways} />
      <ArticleMetricPanel panel={section.metricPanel} />
      <ArticlePullQuote quote={section.pullQuote} />
      <ArticleQuoteCard card={section.quoteCard} />
      <ArticleBulletPanel items={section.bullets} />
      <ArticleRankedCards cards={section.rankedCards} headingLevel={headingLevel} />
      {includeTables ? <ArticleScorecard scorecard={section.scorecard} /> : null}
      <ArticlePromptBlocks blocks={section.promptBlocks} />
      <ArticleSteps headingLevel={headingLevel} steps={section.steps} />
      <ArticleTimeline headingLevel={headingLevel} timeline={section.timeline} />
      <ArticleVersusCard card={section.versusCard} headingLevel={headingLevel} />
      <ArticleDefinitions list={section.definitions} />
      <ArticleGrid headingLevel={headingLevel} items={section.grid} />
      <ArticleChecklist checklist={section.checklist} />
      {section.callout?.tone === "answer" ? null : (
        <ArticleCallout callout={section.callout} />
      )}
      {includeTables ? (
        <ArticleComparisonTable table={section.comparisonTable} />
      ) : null}
      <ArticleEntityLinks links={entityLinks} />
    </>
  );
}

function ArticleHeroTitle({ post }: { post: SilverstoneBlogPost }) {
  const title = post.title;
  const keywordWords = post.primaryKeyword
    .replace(/\bUK\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const candidates = [
    keywordWords.join(" "),
    keywordWords.slice(0, 3).join(" "),
    keywordWords.slice(0, 2).join(" "),
    keywordWords[0] ?? "",
    post.categoryLabel,
  ].filter((candidate) => candidate.length > 4);

  for (const candidate of candidates) {
    const expression = new RegExp(escapeRegExp(candidate), "i");
    const match = expression.exec(title);
    if (!match) {
      continue;
    }

    const start = match.index;
    const end = start + match[0].length;
    return (
      <>
        {title.slice(0, start)}
        <em>{title.slice(start, end)}</em>
        {title.slice(end)}
      </>
    );
  }

  return <RichText text={title} />;
}

function ArticleFactStrip({
  post,
  unlockRef,
}: {
  post: SilverstoneBlogPost;
  unlockRef: RefObject<HTMLDivElement | null>;
}) {
  const facts = [
    { icon: Clock, label: post.readTime },
    { icon: FileText, label: post.categoryLabel },
    { icon: CalendarClock, label: post.displayDate },
    { icon: Sparkles, label: post.primaryKeyword },
  ];

  return (
    <div ref={unlockRef} className="ss-hv2-trust-shell ss-blog-article__facts">
      <ul className="ss-hv2-trust" aria-label="Article facts">
        {facts.map(({ icon: Icon, label }) => (
          <li className="ss-hv2-trust__item" key={label}>
            <Icon className="size-5" aria-hidden="true" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type BodyBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

const BULLET_LINE = /^\s*[-*•‣▪◦]\s+(.*\S)\s*$/;
const ORDERED_LINE = /^\s*\d{1,2}[.)]\s+(.*\S)\s*$/;

/**
 * Turn a section's body strings into rendered blocks. A body entry (or a line
 * within one) that begins with a markdown bullet marker becomes a <ul>, one
 * that begins with "1." / "1)" becomes a numbered <ol>, and everything else is
 * a paragraph. Consecutive list items merge into a single list, so a list the
 * model writes across separate body entries still renders as one list.
 */
function parseBodyBlocks(body: readonly string[]): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  const pushItem = (kind: "ul" | "ol", text: string) => {
    const last = blocks.at(-1);
    if (last?.kind === kind) {
      last.items.push(text);
    } else {
      blocks.push({ kind, items: [text] });
    }
  };

  for (const entry of body) {
    const lines = entry
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const bulletText = BULLET_LINE.exec(line)?.[1];
      const orderedText = ORDERED_LINE.exec(line)?.[1];
      if (bulletText) {
        pushItem("ul", bulletText);
      } else if (orderedText) {
        pushItem("ol", orderedText);
      } else {
        blocks.push({ kind: "p", text: line });
      }
    }
  }

  return blocks;
}

function ArticleBody({
  body,
  firstIsLead = false,
}: {
  body: readonly string[];
  firstIsLead?: boolean;
}) {
  const blocks = parseBodyBlocks(body);
  const firstParagraphIndex = blocks.findIndex((block) => block.kind === "p");

  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "ul") {
          return (
            <ul
              className="ss-blog-article__list ss-blog-article__list--bullet"
              key={`ul-${String(index)}`}
            >
              {block.items.map((item, itemIndex) => (
                <li
                  className="ss-blog-article__list-item"
                  key={`uli-${String(index)}-${String(itemIndex)}`}
                >
                  <span className="ss-blog-article__list-marker" aria-hidden="true" />
                  <span className="ss-blog-article__list-text">
                    <ArticleRichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "ol") {
          return (
            <ol
              className="ss-blog-article__list ss-blog-article__list--number"
              key={`ol-${String(index)}`}
            >
              {block.items.map((item, itemIndex) => (
                <li
                  className="ss-blog-article__list-item"
                  key={`oli-${String(index)}-${String(itemIndex)}`}
                >
                  <span className="ss-blog-article__list-count" aria-hidden="true">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="ss-blog-article__list-text">
                    <ArticleRichText text={item} />
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        const isLead = firstIsLead && index === firstParagraphIndex;
        return (
          <p key={`p-${String(index)}`} data-lead={isLead ? "true" : undefined}>
            <ArticleRichText text={block.text} />
          </p>
        );
      })}
    </>
  );
}

function ArticleSection({
  entityLinksBySection,
  section,
  sectionIndex,
}: {
  entityLinksBySection: Map<SilverstoneBlogSection, SilverstoneBlogEntityLink[]>;
  section: SilverstoneBlogSection;
  sectionIndex: number;
}) {
  const headingId = `article-section-${String(sectionIndex)}`;
  const variant = section.variant ?? (sectionIndex % 3 === 0 ? "signal" : undefined);
  const isIntroduction = section.heading.trim().toLowerCase() === "introduction";

  return (
    <Reveal amount="some" kind="section">
      <div className="ss-blog-article__section-frame ss-srv2-beam-border">
        <section
          className="ss-blog-article__section"
          data-intro={isIntroduction ? "true" : undefined}
          data-lead-style={section.leadStyle}
          data-variant={variant}
          aria-labelledby={headingId}
        >
          {section.sectionNumber?.trim() ? (
            <div className="ss-blog-article__section-heading">
              <span>{section.sectionNumber.trim()}</span>
              <h2 id={headingId}>
                <RichText text={emphasiseHeading(section.heading)} />
              </h2>
            </div>
          ) : (
            <h2 id={headingId}>
              <RichText text={emphasiseHeading(section.heading)} />
            </h2>
          )}
          {section.lede ? (
            <p className="ss-blog-article__lede">
              <ArticleRichText text={section.lede} />
            </p>
          ) : null}
          <ArticleLeadCallout section={section} />
          <ArticleBody body={section.body} firstIsLead={!section.lede} />
          <ArticleSectionEnhancements
            entityLinks={entityLinksBySection.get(section)}
            headingLevel={3}
            section={section}
            includeTables={false}
          />
          {section.subsections?.map((subsection, index) => (
            <div
              className="ss-blog-article__subsection"
              data-lead-style={subsection.leadStyle}
              key={`${subsection.heading}-${String(index)}`}
            >
              {subsection.sectionNumber?.trim() ? (
                <div className="ss-blog-article__section-heading ss-blog-article__section-heading--subsection">
                  <span>{subsection.sectionNumber.trim()}</span>
                  <h3>
                    <RichText text={subsection.heading} />
                  </h3>
                </div>
              ) : (
                <h3>
                  <RichText text={subsection.heading} />
                </h3>
              )}
              <ArticleLeadCallout section={subsection} />
              <ArticleBody
                body={subsection.body}
                firstIsLead={Boolean(subsection.leadStyle)}
              />
              <ArticleSectionEnhancements
                entityLinks={entityLinksBySection.get(subsection)}
                headingLevel={4}
                section={subsection}
                includeTables={false}
              />
            </div>
          ))}
        </section>
        <BorderBeam />
      </div>
      {/*
       * Both tables render as siblings of the section rather than inside its
       * card: the section card closes after the icon bullet list / grid, and
       * each table stands as its own card below. Sitting directly in the
       * Reveal grid item (a full-width, page-centered block) lets their desktop
       * breakout (margin-inline-start:50% + translateX(-50%)) center cleanly on
       * the column instead of the padded section content box. Inside the card
       * that same breakout resolves against the 62rem content box and the
       * 70rem table hangs 4rem past each edge — which is exactly what the
       * scorecard did while it rendered in place.
       *
       * Order matches the order they were authored in: the section's own
       * scorecard first (it scores the routes), then its comparison matrix,
       * then the same pair for each subsection in reading order.
       */}
      <ArticleScorecard scorecard={section.scorecard} />
      <ArticleComparisonTable table={section.comparisonTable} />
      <ArticleStatBand band={section.statBand} />
      {section.subsections?.map((subsection, index) => (
        <Fragment key={`tables-${subsection.heading}-${String(index)}`}>
          <ArticleScorecard scorecard={subsection.scorecard} />
          <ArticleComparisonTable table={subsection.comparisonTable} />
          <ArticleStatBand band={subsection.statBand} />
        </Fragment>
      ))}
    </Reveal>
  );
}

function BlogJsonLd({ post }: { post: SilverstoneBlogPost }) {
  const baseUrl = "https://silverstone-ai.com";
  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  // Social/schema crawlers require absolute image URLs; hero images are
  // normally site-relative but an automation-written post could already
  // carry an absolute URL.
  const heroImageUrl = post.heroImage.startsWith("http")
    ? post.heroImage
    : `${baseUrl}${post.heroImage}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription,
        image: heroImageUrl,
        datePublished: post.publishedIsoDate,
        dateModified: post.updatedIsoDate,
        mainEntityOfPage: articleUrl,
        // Both point at the one Organization node below by @id rather than
        // repeating a thinner copy: an answer engine resolving this article
        // gets the studio's full entity (address, profiles, both markets
        // served) from the same document.
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
      },
      buildOrganizationNode(),
      // Mirrors the visible Home → Blog → article trail in the hero and the
      // BreadcrumbList pattern used by every other page template
      // (~/seo/schema.ts) — names and URLs must stay canonical.
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    // serializeJsonLd, not JSON.stringify: every other template already uses it,
    // and this is the one page whose schema is built from automation-written
    // copy. A title or metaDescription containing "</script>" would otherwise
    // close this tag early and put model output into the document as markup.
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}

function InsightsReturn({ categoryLabel }: { categoryLabel: string }) {
  return (
    <Link
      aria-label="Back to the Insights search and filters"
      className="ss-blog-article__return"
      to="/blog#insights-search"
    >
      <span className="ss-blog-article__return-icon" aria-hidden="true">
        <ArrowLeft />
      </span>
      <span className="ss-blog-article__return-copy">
        <span>Insights / {categoryLabel}</span>
        <strong>Back to Insights search</strong>
      </span>
      <span className="ss-blog-article__return-search" aria-hidden="true">
        <Search />
        <span>Open search &amp; filters</span>
      </span>
    </Link>
  );
}

function FloatingInsightsReturn({ visible }: { visible: boolean }) {
  return (
    <Link
      aria-label="Back to the Insights search and filters"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      className="ss-blog-article__floating-return"
      data-visible={visible ? "true" : "false"}
      to="/blog#insights-search"
    >
      <span className="ss-blog-article__floating-return-glyph" aria-hidden="true">
        <ArrowLeft />
      </span>
      <span className="ss-blog-article__floating-return-copy" aria-hidden="true">
        <span>Return to</span>
        <strong>All Insights</strong>
      </span>
    </Link>
  );
}

export function ArticlePage({ post }: ArticlePageProps) {
  const factStripRef = useRef<HTMLDivElement>(null);
  const [floatingReturnVisible, setFloatingReturnVisible] = useState(false);
  const relatedPosts = getRelatedPosts(post);
  const entityLinksBySection = resolveArticleEntityLinks(post.articleBody);

  useEffect(() => {
    const factStrip = factStripRef.current;
    if (!factStrip || typeof IntersectionObserver === "undefined") {
      return;
    }

    // The observed zone is everything below the viewport midline, extended
    // far past the fold: while the fact/trust strip intersects it, the strip
    // is still below the midline (the hero with its own return pill is on or
    // near screen) so the control hides; once the strip climbs past the
    // midline it leaves the zone and the control shows. Extending the zone
    // downward means any midline crossing — including instant anchor jumps
    // that teleport the strip from one side of the viewport to the other —
    // always changes the intersection state, so the callback can never be
    // skipped and the control can never be stranded in the wrong state.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) {
          return;
        }
        setFloatingReturnVisible(!entry.isIntersecting);
      },
      { rootMargin: "-50% 0px 100000px 0px", threshold: 0 },
    );
    observer.observe(factStrip);
    return () => observer.disconnect();
  }, []);

  return (
    <RouteExperienceFrame skipIntro>
      <BlogJsonLd post={post} />
      <FloatingInsightsReturn visible={floatingReturnVisible} />
      {/*
       * `data-family` lets the search-led families carry distinct accent
       * treatments without a second page shell. Absent on service-and-industry
       * posts, which therefore keep the default styling exactly.
       */}
      <article className="ss-blog-article" data-family={post.presentation?.family}>
        <header
          className="ss-blog-article__hero"
          style={{ backgroundImage: `url(${post.heroImage})` }}
        >
          <div className="ss-blog-article__hero-scrim" />
          <div className="ss-blog-article__hero-inner">
            <div className="ss-blog-article__hero-stage">
              <div className="ss-blog-article__hero-copy">
                <Reveal kind="pill" trigger="mount">
                  <Breadcrumb className="ss-blog-article__breadcrumbs">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="ss-blog-article__breadcrumb-current">
                          {post.title}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </Reveal>
                <Reveal kind="pill" trigger="mount" delayMs={60}>
                  <InsightsReturn categoryLabel={post.categoryLabel} />
                </Reveal>
                <Reveal kind="section" trigger="mount" delayMs={120}>
                  <h1 data-long={post.title.length > 64 ? "true" : undefined}>
                    <ArticleHeroTitle post={post} />
                  </h1>
                </Reveal>
                <Reveal kind="section" trigger="mount" delayMs={220}>
                  <p className="ss-blog-article__subtitle">
                    <RichText text={post.subtitle} />
                  </p>
                </Reveal>
                <Reveal
                  className="ss-blog-article__meta"
                  kind="section"
                  trigger="mount"
                  delayMs={320}
                >
                  <span>
                    <Users aria-hidden="true" />
                    <span className="ss-blog-article__byline">
                      {post.author ?? DEFAULT_BLOG_AUTHOR}
                    </span>
                  </span>
                  <span>
                    <CalendarClock aria-hidden="true" />
                    <time dateTime={post.publishedIsoDate}>{post.displayDate}</time>
                  </span>
                  <span>
                    <Clock aria-hidden="true" />
                    {post.readTime}
                  </span>
                </Reveal>
                <Reveal
                  className="ss-blog-article__actions"
                  kind="cta"
                  trigger="mount"
                  delayMs={420}
                >
                  <ServiceButton href={post.ctaPrimary.href} variant="primary">
                    {post.ctaPrimary.label}
                  </ServiceButton>
                  <ServiceButton
                    href={post.ctaSecondary.href}
                    variant="ghost"
                    withArrow={false}
                  >
                    {post.ctaSecondary.label}
                  </ServiceButton>
                </Reveal>
              </div>
            </div>
            <ScrollCue />
          </div>
        </header>

        <div className="ss-blog-article__body">
          <ArticleFactStrip post={post} unlockRef={factStripRef} />
          <div className="ss-blog-article__container">
            <Reveal
              className="ss-blog-article__summary ss-blog-article__neon-border"
              kind="card"
            >
              <Eyebrow icon={Sparkles}>Executive Summary</Eyebrow>
              <h2>
                What to take from <em>this article</em>
              </h2>
              <ul>
                {post.summary.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" />
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="ss-blog-article__content">
              {post.articleBody.map((section, index) => (
                <ArticleSection
                  entityLinksBySection={entityLinksBySection}
                  key={`${section.heading}-${String(index)}`}
                  section={section}
                  sectionIndex={index}
                />
              ))}
            </div>

            {relatedPosts.length > 0 ? (
              <Reveal
                className="ss-blog-article__related ss-srv2-beam-border"
                kind="section"
              >
                <Eyebrow icon={FileText}>Related reading</Eyebrow>
                <h2>
                  More on <em>this topic</em>
                </h2>
                <div>
                  {relatedPosts.map((related) => (
                    <Link key={related.slug} to={`/blog/${related.slug}`}>
                      <span>{related.title}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <BorderBeam />
              </Reveal>
            ) : null}

            {post.internalLinks.length > 0 ? (
              <Reveal
                className="ss-blog-article__related ss-srv2-beam-border"
                kind="section"
              >
                <Eyebrow icon={FileText}>Route onwards</Eyebrow>
                <h2>
                  Continue <em>Exploring</em>
                </h2>
                <div>
                  {post.internalLinks.map((link) => (
                    <Link key={`${link.href}-${link.label}`} to={link.href}>
                      <span>{link.label}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <BorderBeam />
              </Reveal>
            ) : null}

            <Reveal
              className="ss-blog-article__cta-card ss-srv2-beam-border"
              kind="cta"
            >
              <span>Ready to turn this into an operating system?</span>
              <h2>
                Build the next <em>Silverstone system</em> around your real workflow.
              </h2>
              <p>
                Bring the problem, the current stack and the commercial outcome. We will
                map the practical route from idea to deployed AI system.
              </p>
              <ServiceButton href="/book#booking-calendar" variant="primary">
                Book a discovery call
              </ServiceButton>
              <BorderBeam />
            </Reveal>
          </div>
        </div>
      </article>
    </RouteExperienceFrame>
  );
}
