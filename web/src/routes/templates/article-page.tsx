import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import type { ReactNode } from "react";
import { Link } from "react-router";

import {
  CalendarClock,
  Check,
  Clock,
  FileText,
  Sparkles,
} from "~/components/icons/lucide";
import type { SilverstoneBlogPost, SilverstoneBlogSection } from "~/data/blog-posts";
import {
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
  const anchorPattern = /<a\s+href="([^"]+)">([\s\S]*?)<\/a>/gi;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(text)) !== null) {
    const [rawAnchor, rawHref, label] = match;
    if (match.index > lastIndex) {
      nodes.push(
        <RichText
          key={`text-${String(key++)}`}
          text={text.slice(lastIndex, match.index)}
        />,
      );
    }

    const href = sanitizeHref(rawHref ?? "");
    if (href) {
      nodes.push(
        <Link key={`link-${String(key++)}`} to={href}>
          <RichText text={label ?? ""} />
        </Link>,
      );
    } else {
      nodes.push(
        <RichText key={`fallback-${String(key++)}`} text={label ?? rawAnchor} />,
      );
    }

    lastIndex = match.index + rawAnchor.length;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <RichText key={`text-${String(key++)}`} text={text.slice(lastIndex)} />,
    );
  }

  return <>{nodes}</>;
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

function ArticleFactStrip({ post }: { post: SilverstoneBlogPost }) {
  const facts = [
    { icon: Clock, label: post.readTime },
    { icon: FileText, label: post.categoryLabel },
    { icon: CalendarClock, label: post.displayDate },
    { icon: Sparkles, label: post.primaryKeyword },
  ];

  return (
    <div className="ss-hv2-trust-shell ss-blog-article__facts">
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

  return (
    <Reveal amount="some" kind="section">
      <section className="ss-blog-article__section" aria-labelledby={headingId}>
        <h2 id={headingId}>
          <RichText text={section.heading} />
        </h2>
        {section.body.map((paragraph, index) => (
          <p key={`${section.heading}-${String(index)}`}>
            <ArticleRichText text={paragraph} />
          </p>
        ))}
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
          </div>
        ))}
      </section>
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
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Silverstone AI",
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticlePage({ post }: ArticlePageProps) {
  return (
    <RouteExperienceFrame skipIntro>
      <BlogJsonLd post={post} />
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
                  <Link className="ss-blog-article__crumb" to="/blog">
                    Insights / {post.categoryLabel}
                  </Link>
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
          <ArticleFactStrip post={post} />
          <div className="ss-blog-article__container">
            <Reveal className="ss-blog-article__summary" kind="card">
              <Eyebrow icon={Sparkles}>Executive Summary</Eyebrow>
              <h2>What to take from this article</h2>
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
              <Reveal className="ss-blog-article__related" kind="section">
                <h2>Continue Exploring</h2>
                <div>
                  {post.internalLinks.map((link) => (
                    <Link key={`${link.href}-${link.label}`} to={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <Reveal className="ss-blog-article__cta-card" kind="cta">
              <span>Ready to turn this into an operating system?</span>
              <h2>Build the next Silverstone system around your real workflow.</h2>
              <p>
                Bring the problem, the current stack and the commercial outcome. We will
                map the practical route from idea to deployed AI system.
              </p>
              <ServiceButton href="/book#booking-calendar" variant="primary">
                Book a discovery call
              </ServiceButton>
            </Reveal>
          </div>
        </div>
      </article>
    </RouteExperienceFrame>
  );
}
