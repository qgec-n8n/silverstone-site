import { useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { Link } from "react-router";
import { ArrowUpRight, Mail, MapPin } from "~/components/icons/lucide";

import { Container } from "~/components/layout/container";
import { useHydrated } from "~/lib/use-hydrated";
import { useRevealStart } from "~/motion/use-reveal-start";
import { RasterPicture } from "~/components/ui/raster-picture";

import { FOOTER_COLUMNS, PRIMARY_CTA } from "./nav-data";

const CURRENT_YEAR = new Date().getFullYear();

const entranceEase = [0.22, 1, 0.36, 1] as const;

/**
 * Footer entrance choreography, strictly top-to-bottom then left-to-right:
 * the brand block and the column headers form the first visual row (left →
 * right), then the link rows cascade downward as a diagonal wave (each row
 * slightly after the previous, each column slightly after its left
 * neighbour). All offsets hang off one scheduler-gated start, so the footer
 * can never begin before page content above it has started its own reveal.
 */
const HEADER_STEP_S = 0.09;
const ROW_STEP_S = 0.12;
/* Kept below ROW_STEP_S ÷ (columns − 1) so a full link row always finishes
   starting before the next row begins — strict top-to-bottom, left-to-right. */
const COLUMN_STEP_S = 0.05;
const LINKS_START_S = 0.46;

/** The bottom bar begins only after the deepest link of the widest column. */
const BOTTOM_BAR_START_S =
  Math.max(
    ...FOOTER_COLUMNS.map(
      (column, columnIndex) =>
        LINKS_START_S +
        (column.links.length - 1) * ROW_STEP_S +
        columnIndex * COLUMN_STEP_S,
    ),
  ) + 0.15;

type SiteFooterProps = {
  /**
   * True while the homepage intro owns the screen. The footer stays in the
   * document (it is the homepage's crawlable link graph) but must not be
   * reachable by keyboard or exposed to assistive technology while it sits
   * below the locked viewport — the same treatment SiteHeader applies to
   * itself. Deferred until hydration so the prerendered HTML ships a clean,
   * fully exposed footer.
   */
  hidden?: boolean;
};

export function SiteFooter({ hidden = false }: SiteFooterProps) {
  const hydrated = useHydrated();
  const suppressed = hydrated && hidden;
  const footerRef = useRef<HTMLElement | null>(null);
  const footerInView = useInView(footerRef, {
    amount: 0.15,
    margin: "0px 0px -10% 0px",
    once: true,
  });
  const start = useRevealStart(footerRef, footerInView, 0);
  const base = (start?.delayMs ?? 0) / 1000;
  const pace = start?.durationScale ?? 1;

  return (
    <m.footer
      ref={footerRef}
      className="ss-footer"
      // `inert` alone. It already removes the suppressed footer from the tab
      // order and the accessibility tree; pairing it with `aria-hidden` added
      // nothing for users and made text extractors skip the site's canonical
      // link graph on every gated route.
      inert={suppressed}
      initial={false}
      animate={start !== null ? "show" : "hidden"}
    >
      <div aria-hidden className="ss-footer__sweep" />
      <div aria-hidden className="ss-footer__lines" />
      <Container className="relative py-16 lg:py-20" size="wide">
        <div className="ss-footer__main">
          <m.div
            className="ss-footer__col ss-footer__brand"
            variants={{
              hidden: { opacity: 0, x: -22, y: 12, filter: "blur(8px)" },
              show: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
            }}
            transition={{ delay: base, duration: 1.2 * pace, ease: entranceEase }}
          >
            <Link
              className="ss-focus-ring ss-footer__brandmark inline-flex rounded-[var(--ss-radius-lg)] no-underline"
              to="/"
            >
              <RasterPicture
                alt="Silverstone AI"
                className="ss-footer__logo"
                decoding="async"
                height={1060}
                loading="lazy"
                src="/brand/silverstone-ai-logo-footer.png"
                width={1484}
              />
              <span className="sr-only">Silverstone AI — home</span>
            </Link>
            <p className="mt-3 max-w-[23rem] text-body-sm text-titanium">
              Silverstone AI builds AI reception, voice, automation, web, app and
              content systems for businesses in the US and UK, designed, engineered and
              assured in-house.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-body-sm text-titanium">
              <MapPin aria-hidden className="size-4 text-[var(--ss-v2-signal-cyan)]" />
              London studio · US-based team · 24-hour coverage
            </p>
            <p className="mt-2">
              <a
                className="ss-focus-ring ss-transition-interactive inline-flex items-center gap-2 rounded-[var(--ss-radius-xs)] text-body-sm text-titanium no-underline hover:text-platinum"
                href="mailto:info@silverstone-ai.com"
              >
                <Mail aria-hidden className="size-4 text-[var(--ss-v2-signal-cyan)]" />
                info@silverstone-ai.com
              </a>
            </p>
            {/* Directory recognition seal — a credential, so it belongs with
                the brand block rather than the legal row. */}
            <a
              className="ss-focus-ring ss-footer__seal"
              href="https://aiagentsdirectory.com/agent/silverstone-ai"
              rel="noopener"
              target="_blank"
              title="Discover Silverstone AI on AI Agents Directory"
            >
              <img
                alt="Silverstone AI - Featured on AI Agents Directory"
                className="ss-footer__seal-img"
                decoding="async"
                height={50}
                loading="lazy"
                src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                width={200}
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </m.div>
          {FOOTER_COLUMNS.map((column, columnIndex) => (
            <m.nav
              aria-label={column.title}
              className="ss-footer__col"
              key={column.title}
              variants={{
                hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{
                delay: base + (0.18 + columnIndex * HEADER_STEP_S) * pace,
                duration: 1.1 * pace,
                ease: entranceEase,
              }}
            >
              {/*
                Not a heading. Each column is already a `<nav aria-label>`, so
                the label is exposed to assistive tech by the landmark; an `h2`
                on top of that put three extra level-2 entries into every page's
                outline, at the same level as the page's own section headings.
                `block font-display max-w-[…]` reproduce exactly what the `h2`
                base rule contributed here (`.ss-eyebrow` already owns size,
                weight, tracking, leading and casing), so the box is unchanged.
              */}
              <span className="ss-eyebrow text-titanium block font-display max-w-[var(--ss-type-measure-heading)]">
                {column.title}
              </span>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link, rowIndex) => (
                  <m.li
                    key={`${column.title}-${link.href}`}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0 },
                    }}
                    transition={{
                      delay:
                        base +
                        (LINKS_START_S +
                          rowIndex * ROW_STEP_S +
                          columnIndex * COLUMN_STEP_S) *
                          pace,
                      duration: 0.75 * pace,
                      ease: entranceEase,
                    }}
                  >
                    <Link
                      className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] text-body-sm text-titanium no-underline hover:text-platinum"
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  </m.li>
                ))}
              </ul>
              {column.title === "Company" ? (
                <m.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    delay:
                      base +
                      (LINKS_START_S +
                        column.links.length * ROW_STEP_S +
                        columnIndex * COLUMN_STEP_S) *
                        pace,
                    duration: 0.75 * pace,
                    ease: entranceEase,
                  }}
                >
                  <m.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link
                      className="ss-focus-ring ss-footer__cta ss-transition-interactive"
                      to={PRIMARY_CTA.href}
                    >
                      {PRIMARY_CTA.label}
                      <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  </m.div>
                </m.div>
              ) : null}
            </m.nav>
          ))}
        </div>
        <m.div
          className="ss-hairline-t mt-14 flex flex-col gap-3 pt-6 text-caption text-titanium sm:flex-row sm:items-center sm:justify-between"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{
            delay: base + BOTTOM_BAR_START_S * pace,
            duration: 1.1 * pace,
            ease: entranceEase,
          }}
        >
          <p>© {CURRENT_YEAR} Silverstone AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] no-underline hover:text-platinum"
              to="/privacy-policy"
            >
              Privacy policy
            </Link>
            <Link
              className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] no-underline hover:text-platinum"
              to="/contact"
            >
              Contact
            </Link>
          </div>
        </m.div>
      </Container>
    </m.footer>
  );
}
