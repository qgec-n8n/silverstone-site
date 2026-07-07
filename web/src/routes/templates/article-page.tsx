import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import { Link } from "react-router";

import { CalendarClock, Clock, Sparkles } from "~/components/icons/lucide";
import type { SilverstoneBlogPost, SilverstoneBlogSection } from "~/data/blog-posts";
import {
  Eyebrow,
  Reveal,
  RichText,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import { RouteExperienceFrame } from "~/routes/templates/route-experience-frame";

type ArticlePageProps = {
  post: SilverstoneBlogPost;
};

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
            <RichText text={paragraph} />
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
                <RichText text={paragraph} />
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
            <Reveal kind="pill" trigger="mount">
              <Link className="ss-blog-article__crumb" to="/blog">
                Insights / {post.categoryLabel}
              </Link>
            </Reveal>
            <Reveal kind="section" trigger="mount" delayMs={120}>
              <h1>
                <RichText text={post.title} />
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
        </header>

        <div className="ss-blog-article__body">
          <div className="ss-blog-article__container">
            <Reveal className="ss-blog-article__summary" kind="card">
              <Eyebrow icon={Sparkles}>Executive Summary</Eyebrow>
              <h2>What to take from this article</h2>
              <ul>
                {post.summary.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
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
