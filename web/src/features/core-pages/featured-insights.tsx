import { Link } from "react-router";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import { ArrowUpRight, Clock } from "~/components/icons/lucide";
import { BorderBeam } from "~/components/ui/border-beam";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import { FlippingCard } from "~/components/ui/flipping-card";
import {
  CURRENT_FEATURED_INSIGHTS,
  type FeaturedInsightSelection,
} from "~/data/featured-insights";
import type { SilverstoneBlogPost } from "~/data/blog-posts";

const editionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.07,
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

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

/**
 * Primary featured card: the article's copy and hero image sit as separate
 * layers on a framed background panel, and the Aceternity 3D Card Effect
 * (CardContainer/CardItem) lifts them off that panel while the whole
 * composition tilts with the pointer.
 *
 * The rank chip carries the rotation: when the card arrived on the dispatch
 * day it reads as a live arrival instead of a standing position.
 */
function PrimaryInsight({
  fresh,
  post,
}: {
  fresh: boolean;
  post: SilverstoneBlogPost;
}) {
  const titleId = `featured-insight-${post.slug}`;

  return (
    <m.article
      aria-labelledby={titleId}
      className="ss-featured-primary"
      data-featured-card="primary"
      variants={cardVariants}
    >
      <CardContainer
        className="ss-featured-primary__stage"
        containerClassName="ss-featured-primary__perspective"
        tiltStrength={6}
      >
        <CardBody className="ss-featured-primary__body">
          <Link
            className="ss-featured-primary__link"
            prefetch="intent"
            to={`/blog/${post.slug}`}
          >
            <CardItem className="ss-featured-primary__topline" translateZ={40}>
              <span className="ss-featured-card__category">{post.categoryLabel}</span>
              <span
                className="ss-featured-primary__rank"
                data-fresh={fresh ? "true" : undefined}
              >
                {fresh ? "New today" : "Primary signal"}
              </span>
              <ArticleMeta post={post} />
            </CardItem>
            <CardItem className="ss-featured-primary__title" translateZ={70}>
              <h3 id={titleId}>{post.title}</h3>
            </CardItem>
            <CardItem className="ss-featured-primary__lead" translateZ={50}>
              <p>{post.subtitle}</p>
            </CardItem>
            <CardItem
              className="ss-featured-primary__media"
              translateZ={90}
              rotateX={5}
              rotateZ={-1.2}
            >
              <img
                alt={post.heroImageAlt}
                decoding="async"
                fetchPriority="high"
                height="864"
                loading="eager"
                src={post.heroImage}
                width="1536"
              />
            </CardItem>
            <CardItem className="ss-featured-primary__footer" translateZ={35}>
              <span className="ss-featured-card__action">
                Read the intelligence
                <ArrowUpRight aria-hidden="true" />
              </span>
            </CardItem>
            <span aria-hidden="true" className="ss-featured-card__inner-rule" />
            <span aria-hidden="true" className="ss-featured-primary__beam">
              <BorderBeam
                colorFrom="#26ddff"
                colorTo="#8b7bff"
                duration={9}
                size={110}
              />
            </span>
          </Link>
        </CardBody>
      </CardContainer>
    </m.article>
  );
}

/**
 * Supporting featured card: a 21st.dev Flipping Card. The front face carries
 * the cover image and title; hovering (or keyboard focus) turns the card to a
 * back face holding the article's subtitle, meta and call to action. The
 * whole card stays one link — the turn is presentation only.
 */
function SupportingInsight({
  position,
  post,
}: {
  position: number;
  post: SilverstoneBlogPost;
}) {
  const titleId = `featured-insight-${post.slug}`;

  return (
    <m.article
      aria-labelledby={titleId}
      className="ss-featured-support"
      data-featured-card="supporting"
      data-featured-position={position}
      variants={cardVariants}
    >
      <Link
        className="ss-featured-support__link"
        prefetch="intent"
        to={`/blog/${post.slug}`}
      >
        <FlippingCard
          frontContent={
            <div className="ss-featured-support__front">
              <div className="ss-featured-support__media">
                <img
                  alt={post.heroImageAlt}
                  decoding="async"
                  height="864"
                  loading="lazy"
                  src={post.heroImage}
                  width="1536"
                />
              </div>
              <span aria-hidden="true" className="ss-featured-support__scrim" />
              <div className="ss-featured-support__content">
                <span className="ss-featured-support__topline">
                  <span className="ss-featured-card__category">
                    {post.categoryLabel}
                  </span>
                  <ArticleMeta post={post} />
                </span>
                <h3 id={titleId}>{post.title}</h3>
              </div>
            </div>
          }
          backContent={
            <div className="ss-featured-support__back">
              <span className="ss-featured-card__category">{post.categoryLabel}</span>
              <p className="ss-featured-support__summary">{post.subtitle}</p>
              <ArticleMeta post={post} />
              <span className="ss-featured-card__action">
                Read article
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          }
        />
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
  const { edition, primary } = selection;
  const supporting = selection.supporting.slice(0, 2);

  if (!primary) {
    return null;
  }

  const editionKey =
    edition?.id ?? selection.articles.map((post) => post.slug).join(":");
  const freshSlugs = new Set(selection.freshSlugs);

  return (
    <section
      aria-labelledby="featured-insights-title"
      className="ss-srv2-section ss-featured-insights"
    >
      <div className="ss-srv2__container">
        <m.div
          className="ss-featured-insights__intro"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          transition={{ duration: reducedMotion ? 0 : 0.42, ease: "easeOut" }}
          viewport={{ amount: 0.35, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="ss-featured-insights__eyebrow">
              <span aria-hidden="true" />
              Featured intelligence
            </p>
            <h2 id="featured-insights-title">
              The newest <em>selected signals</em>
            </h2>
          </div>
          <div className="ss-featured-insights__dispatch">
            <span className="ss-featured-insights__edition">
              <span>Current dispatch</span>
              {edition?.label ?? selection.dispatchLabel}
            </span>
            <p className="ss-featured-insights__cadence">
              <span aria-hidden="true" />
              The three most recent briefings, newest first
            </p>
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
            <PrimaryInsight fresh={freshSlugs.has(primary.slug)} post={primary} />
            {supporting.map((post, index) => (
              <SupportingInsight key={post.slug} position={index + 1} post={post} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
