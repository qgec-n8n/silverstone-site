import type { CSSProperties, PointerEvent } from "react";
import { Link } from "react-router";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import { ArrowUpRight, Clock } from "~/components/icons/lucide";
import { BorderBeam } from "~/components/ui/border-beam";
import { FocusCards } from "~/components/ui/focus-cards";
import {
  CURRENT_FEATURED_INSIGHTS,
  type FeaturedInsightSelection,
} from "~/data/featured-insights";
import type { SilverstoneBlogPost } from "~/data/blog-posts";

const editionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
      duration: 0.62,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: [0.16, 1, 0.3, 1] },
  },
};

const primaryPointerDefaults = {
  "--feature-pointer-x": "50%",
  "--feature-pointer-y": "42%",
  "--feature-image-x": "0px",
  "--feature-image-y": "0px",
} as CSSProperties;

function articleDateTime(post: SilverstoneBlogPost): string {
  return post.publishedIsoDate.split("T")[0] ?? post.publishedIsoDate;
}

function ArticleMeta({ post }: { post: SilverstoneBlogPost }) {
  return (
    <span className="ss-featured-card__meta">
      <Clock aria-hidden="true" />
      <time dateTime={articleDateTime(post)}>{post.displayDate}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readTime}</span>
    </span>
  );
}

function movePrimaryLight(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
    return;
  }

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

  event.currentTarget.style.setProperty("--feature-pointer-x", `${String(x * 100)}%`);
  event.currentTarget.style.setProperty("--feature-pointer-y", `${String(y * 100)}%`);
  event.currentTarget.style.setProperty(
    "--feature-image-x",
    `${String((0.5 - x) * 9)}px`,
  );
  event.currentTarget.style.setProperty(
    "--feature-image-y",
    `${String((0.5 - y) * 7)}px`,
  );
}

function resetPrimaryLight(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--feature-pointer-x", "50%");
  event.currentTarget.style.setProperty("--feature-pointer-y", "42%");
  event.currentTarget.style.setProperty("--feature-image-x", "0px");
  event.currentTarget.style.setProperty("--feature-image-y", "0px");
}

function PrimaryInsight({
  post,
  reducedMotion,
}: {
  post: SilverstoneBlogPost;
  reducedMotion: boolean;
}) {
  const titleId = `featured-insight-${post.slug}`;

  return (
    <m.article
      aria-labelledby={titleId}
      className="ss-featured-primary"
      variants={cardVariants}
    >
      <Link
        className="ss-featured-primary__link"
        onPointerLeave={resetPrimaryLight}
        onPointerMove={movePrimaryLight}
        prefetch="intent"
        style={primaryPointerDefaults}
        to={`/blog/${post.slug}`}
      >
        <div className="ss-featured-primary__media">
          <img
            alt={post.heroImageAlt}
            decoding="async"
            fetchPriority="high"
            height="864"
            loading="eager"
            src={post.heroImage}
            width="1536"
          />
        </div>
        <span className="ss-featured-primary__illumination" aria-hidden="true" />
        <div className="ss-featured-primary__content">
          <div className="ss-featured-primary__topline">
            <span className="ss-featured-card__category">{post.categoryLabel}</span>
            <span className="ss-featured-primary__rank">Primary signal</span>
          </div>
          <ArticleMeta post={post} />
          <h3 id={titleId}>{post.title}</h3>
          <p>{post.subtitle}</p>
          <span className="ss-featured-card__action">
            Read the intelligence
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
        {reducedMotion ? null : (
          <BorderBeam
            borderWidth={1}
            colorFrom="#26ddff"
            colorTo="#9b7bff"
            duration={11}
            size={150}
            style={{ opacity: 0.78 }}
          />
        )}
      </Link>
    </m.article>
  );
}

function SupportingInsight({ post }: { post: SilverstoneBlogPost }) {
  const titleId = `featured-insight-${post.slug}`;

  return (
    <m.article
      aria-labelledby={titleId}
      className="ss-featured-support"
      variants={cardVariants}
    >
      <Link
        className="ss-featured-support__link"
        prefetch="intent"
        to={`/blog/${post.slug}`}
      >
        <div className="ss-featured-support__media">
          <img
            alt={post.heroImageAlt}
            decoding="async"
            height="864"
            loading="lazy"
            src={post.heroImage}
            width="1536"
          />
          <span className="ss-featured-card__category">{post.categoryLabel}</span>
        </div>
        <div className="ss-featured-support__content">
          <ArticleMeta post={post} />
          <h3 id={titleId}>{post.title}</h3>
          {post.summary[0] ? <p>{post.summary[0]}</p> : null}
          <span className="ss-featured-card__action">
            Read article
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </m.article>
  );
}

export function FeaturedInsights({
  selection = CURRENT_FEATURED_INSIGHTS,
}: {
  selection?: FeaturedInsightSelection;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const { edition, primary, supporting } = selection;

  if (!primary) {
    return null;
  }

  const editionKey =
    edition?.id ?? selection.articles.map((post) => post.slug).join(":");

  return (
    <section
      aria-labelledby="featured-insights-title"
      className="ss-srv2-section ss-featured-insights"
    >
      <div className="ss-srv2__container">
        <m.div
          className="ss-featured-insights__intro"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          transition={{ duration: reducedMotion ? 0 : 0.56, ease: "easeOut" }}
          viewport={{ amount: 0.45, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="ss-featured-insights__eyebrow">
              <span aria-hidden="true" />
              Featured intelligence
            </p>
            <h2 id="featured-insights-title">
              This week’s <em>selected signals</em>
            </h2>
          </div>
          <div className="ss-featured-insights__dispatch">
            <p>
              Curated from Silverstone Intelligence: practical guidance for the systems,
              sites and technology decisions in front of UK operators now.
            </p>
            <span className="ss-featured-insights__edition">
              <span>Current dispatch</span>
              {edition?.label ?? "Latest published intelligence"}
            </span>
          </div>
        </m.div>

        <AnimatePresence mode="wait">
          <m.div
            className="ss-featured-insights__grid"
            initial={reducedMotion ? false : "hidden"}
            key={editionKey}
            variants={editionVariants}
            viewport={{ amount: 0.01, once: true }}
            {...(reducedMotion
              ? {}
              : ({ exit: "exit", whileInView: "visible" } as const))}
          >
            <PrimaryInsight post={primary} reducedMotion={reducedMotion} />
            {supporting.length > 0 ? (
              <FocusCards className="ss-featured-insights__supporting">
                {supporting.map((post) => (
                  <SupportingInsight key={post.slug} post={post} />
                ))}
              </FocusCards>
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
