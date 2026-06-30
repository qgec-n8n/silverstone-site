import { useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { Link } from "react-router";
import { ArrowUpRight, MapPin } from "~/components/icons/lucide";

import { Container } from "~/components/layout/container";

import { FOOTER_COLUMNS, PRIMARY_CTA } from "./nav-data";

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const footerInView = useInView(footerRef, {
    amount: 0.08,
    margin: "0px 0px -5% 0px",
    once: true,
  });

  return (
    <m.footer
      ref={footerRef}
      className="ss-footer"
      initial={false}
      animate={footerInView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
    >
      <div aria-hidden className="ss-footer__sweep" />
      <div aria-hidden className="ss-footer__lines" />
      <Container className="relative py-16 lg:py-20" size="wide">
        <div className="ss-footer__main">
          <m.div
            className="ss-footer__col ss-footer__brand"
            variants={{
              hidden: { opacity: 0, x: -18, y: 10 },
              show: { opacity: 1, x: 0, y: 0 },
            }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              className="ss-focus-ring ss-footer__brandmark inline-flex rounded-[var(--ss-radius-lg)] no-underline"
              to="/"
            >
              <img
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
              Web, app, content and AI workflow systems for ambitious UK businesses —
              designed, engineered and assured in-house.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-body-sm text-titanium">
              <MapPin aria-hidden className="size-4 text-[var(--ss-v2-signal-cyan)]" />
              London, United Kingdom
            </p>
          </m.div>
          {FOOTER_COLUMNS.map((column) => (
            <m.nav
              aria-label={column.title}
              className="ss-footer__col"
              key={column.title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="ss-eyebrow text-titanium">{column.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link, index) => (
                  <m.li
                    key={`${column.title}-${link.href}`}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.65, once: true }}
                    transition={{
                      delay: 0.12 + index * 0.035,
                      duration: 0.36,
                      ease: [0.22, 1, 0.36, 1],
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
              ) : null}
            </m.nav>
          ))}
        </div>
        <m.div
          className="ss-hairline-t mt-14 flex flex-col gap-3 pt-6 text-caption text-titanium sm:flex-row sm:items-center sm:justify-between"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
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
            <span>Staging environment — not for production use.</span>
          </div>
        </m.div>
      </Container>
    </m.footer>
  );
}
