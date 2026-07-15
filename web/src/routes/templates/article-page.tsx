import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import {
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
  Clock,
  FileText,
  Search,
  Sparkles,
  Target,
  Zap,
} from "~/components/icons/lucide";
import type {
  SilverstoneBlogBullet,
  SilverstoneBlogGridItem,
  SilverstoneBlogPost,
  SilverstoneBlogSection,
  SilverstoneBlogTable,
} from "~/data/blog-posts";
import {
  BorderBeam,
  Eyebrow,
  Reveal,
  RichText,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import { ScrollCue } from "~/features/services-v2/components/secondary-hero";
import { RouteExperienceFrame } from "~/routes/templates/route-experience-frame";

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
 * heading is emphasised, skipping leading connective words so the gradient
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

function sanitizeHref(href: string): string | null {
  if (href.startsWith("/")) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.hostname === "silverstone-ai.com") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }

  return null;
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
        <Link key={`link-${String(key++)}`} to={href}>
          <RichText text={label} />
        </Link>,
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

function ArticleGrid({ items }: { items?: SilverstoneBlogGridItem[] | undefined }) {
  const usableItems =
    items?.filter((item) => item.title.trim() && item.body.trim()).slice(0, 6) ?? [];

  if (usableItems.length === 0) {
    return null;
  }

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
          <h4>
            <ArticleRichText text={item.title} />
          </h4>
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
            <th scope="col">Decision point</th>
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

function ArticleSectionEnhancements({
  section,
  includeTable = true,
}: {
  section: SilverstoneBlogSection;
  includeTable?: boolean;
}) {
  return (
    <>
      <ArticlePullQuote quote={section.pullQuote} />
      <ArticleBulletPanel items={section.bullets} />
      <ArticleGrid items={section.grid} />
      {includeTable ? <ArticleComparisonTable table={section.comparisonTable} /> : null}
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

function ArticleSection({
  section,
  sectionIndex,
}: {
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
          data-variant={variant}
          aria-labelledby={headingId}
        >
          <h2 id={headingId}>
            <RichText text={emphasiseHeading(section.heading)} />
          </h2>
          {section.lede ? (
            <p className="ss-blog-article__lede">
              <ArticleRichText text={section.lede} />
            </p>
          ) : null}
          {section.body.map((paragraph, index) => (
            <p
              key={`${section.heading}-${String(index)}`}
              data-lead={!section.lede && index === 0 ? "true" : undefined}
            >
              <ArticleRichText text={paragraph} />
            </p>
          ))}
          <ArticleSectionEnhancements section={section} includeTable={false} />
          {section.subsections?.map((subsection, index) => (
            <div
              className="ss-blog-article__subsection"
              key={`${subsection.heading}-${String(index)}`}
            >
              <h3>
                <RichText text={subsection.heading} />
              </h3>
              {subsection.body.map((paragraph, paragraphIndex) => (
                <p key={`${subsection.heading}-${String(paragraphIndex)}`}>
                  <ArticleRichText text={paragraph} />
                </p>
              ))}
              <ArticleSectionEnhancements section={subsection} />
            </div>
          ))}
        </section>
        <BorderBeam />
      </div>
      {/*
       * The comparison table renders as a sibling of the section rather than
       * inside its card: the section card closes after the icon bullet list /
       * grid, and the table stands as its own card below. Sitting directly in
       * the Reveal grid item (a full-width, page-centred block) lets its desktop
       * breakout (margin-inline-start:50% + translateX(-50%)) centre cleanly on
       * the column instead of the padded section content box.
       */}
      <ArticleComparisonTable table={section.comparisonTable} />
    </Reveal>
  );
}

function BlogJsonLd({ post }: { post: SilverstoneBlogPost }) {
  const baseUrl = "https://silverstone-ai.com";
  const articleUrl = `${baseUrl}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: `${baseUrl}${post.heroImage}`,
    datePublished: post.publishedIsoDate,
    dateModified: post.updatedIsoDate,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "Silverstone AI",
      url: `${baseUrl}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Silverstone AI",
      url: `${baseUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/brand/silverstone-logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
      <article className="ss-blog-article">
        <header
          className="ss-blog-article__hero"
          style={{ backgroundImage: `url(${post.heroImage})` }}
        >
          <div className="ss-blog-article__hero-scrim" />
          <div className="ss-blog-article__hero-inner">
            <div className="ss-blog-article__hero-stage">
              <div className="ss-blog-article__hero-copy">
                <Reveal kind="pill" trigger="mount">
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
                  key={`${section.heading}-${String(index)}`}
                  section={section}
                  sectionIndex={index}
                />
              ))}
            </div>

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
