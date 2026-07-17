import { Link } from "react-router";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import { ArrowUpRight, Clock } from "~/components/icons/lucide";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
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

function PrimaryInsight({ post }: { post: SilverstoneBlogPost }) {
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
        tiltStrength={2.25}
      >
        <CardBody className="ss-featured-primary__body">
          <Link
            className="ss-featured-primary__link"
            prefetch="intent"
            to={`/blog/${post.slug}`}
          >
            <CardItem className="ss-featured-primary__media" translateZ={5}>
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
            <CardItem
              aria-hidden="true"
              className="ss-featured-primary__atmosphere"
              translateZ={9}
            />
            <div className="ss-featured-primary__content">
              <CardItem className="ss-featured-primary__topline" translateZ={16}>
                <span className="ss-featured-card__category">{post.categoryLabel}</span>
                <span className="ss-featured-primary__rank">Primary signal</span>
                <ArticleMeta post={post} />
              </CardItem>
              <CardItem className="ss-featured-primary__title" translateZ={25}>
                <h3 id={titleId}>{post.title}</h3>
              </CardItem>
              <CardItem className="ss-featured-primary__footer" translateZ={20}>
                <p>{post.subtitle}</p>
                <span className="ss-featured-card__action">
                  Read the intelligence
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </CardItem>
            </div>
            <span aria-hidden="true" className="ss-featured-card__inner-rule" />
          </Link>
        </CardBody>
      </CardContainer>
    </m.article>
  );
}

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
      <CardContainer
        className="ss-featured-support__stage"
        containerClassName="ss-featured-support__perspective"
        tiltStrength={1.6}
      >
        <CardBody className="ss-featured-support__body">
          <Link
            className="ss-featured-support__link"
            prefetch="intent"
            to={`/blog/${post.slug}`}
          >
            <CardItem className="ss-featured-support__media" translateZ={3}>
              <img
                alt={post.heroImageAlt}
                decoding="async"
                height="864"
                loading="lazy"
                src={post.heroImage}
                width="1536"
              />
            </CardItem>
            <CardItem
              aria-hidden="true"
              className="ss-featured-support__scrim"
              translateZ={6}
            />
            <div className="ss-featured-support__content">
              <CardItem className="ss-featured-support__topline" translateZ={12}>
                <span className="ss-featured-card__category">{post.categoryLabel}</span>
                <ArticleMeta post={post} />
              </CardItem>
              <CardItem className="ss-featured-support__title" translateZ={18}>
                <h3 id={titleId}>{post.title}</h3>
              </CardItem>
              <CardItem className="ss-featured-support__action" translateZ={22}>
                <span className="ss-featured-card__action">
                  Read article
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </CardItem>
            </div>
            <span aria-hidden="true" className="ss-featured-card__inner-rule" />
          </Link>
        </CardBody>
      </CardContainer>
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
  const supporting = selection.supporting.slice(0, 4);

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
              This week’s <em>selected signals</em>
            </h2>
          </div>
          <div className="ss-featured-insights__dispatch">
            <p>
              Five practical reads for the systems, sites and technology decisions in
              front of UK operators now.
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
            <PrimaryInsight post={primary} />
            {supporting.map((post, index) => (
              <SupportingInsight key={post.slug} position={index + 1} post={post} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
