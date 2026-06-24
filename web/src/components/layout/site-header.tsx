import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon, ArrowUpRightIcon, MenuIcon, XIcon } from "lucide-react";

import { Container } from "~/components/layout/container";
import {
  SiteNav,
  SiteNavDisclosure,
  SiteNavItem,
  SiteNavList,
  type SiteNavDisclosureLink,
} from "~/components/layout/site-nav";
import {
  ctaPillClass,
  industryLinks,
  primaryCta,
  primaryNavLinks,
  serviceLinks,
  type NavLink,
} from "~/components/layout/nav-data";
import { cn } from "~/lib/utils";

const SCROLL_SOLIDIFY_THRESHOLD = 8;

function MegaLink({ link }: { link: SiteNavDisclosureLink }) {
  return (
    <Link
      className="ss-focus-ring group block rounded-[var(--ss-radius-md)] px-3 py-2.5 no-underline transition-colors hover:bg-[var(--ss-color-action-ghost-hover)]"
      data-family={link.family}
      to={link.href}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-body-sm font-medium text-foreground transition-colors group-hover:text-[color:var(--ss-v2-family)]">
          {link.label}
        </span>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 text-[color:var(--ss-v2-family)] opacity-0 transition-opacity group-hover:opacity-100"
        />
      </span>
      {link.description ? (
        <span className="mt-0.5 block text-caption text-muted-foreground">
          {link.description}
        </span>
      ) : null}
    </Link>
  );
}

function HeaderLink({
  active,
  label,
  to,
}: {
  active: boolean;
  label: string;
  to: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-pill)] px-3 py-2 text-body-sm font-medium text-muted-foreground no-underline hover:text-foreground",
        active && "text-foreground",
      )}
      to={to}
    >
      {label}
    </Link>
  );
}

function DrawerLink({
  label,
  onNavigate,
  to,
}: {
  label: string;
  onNavigate: () => void;
  to: string;
}) {
  return (
    <Link
      className="ss-focus-ring rounded-[var(--ss-radius-md)] px-3 py-2.5 text-body font-medium text-foreground no-underline transition-colors hover:bg-[var(--ss-color-action-ghost-hover)]"
      onClick={onNavigate}
      to={to}
    >
      {label}
    </Link>
  );
}

function withCurrent(links: NavLink[], pathname: string): SiteNavDisclosureLink[] {
  return links.map((link) => ({ ...link, current: pathname === link.href }));
}

function SiteHeader() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLIDIFY_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-[400] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "ss-glass-strong border-b"
          : "border-b border-transparent bg-gradient-to-b from-[var(--ss-v2-ink-900)]/80 to-transparent",
      )}
      data-scrolled={scrolled}
      role="banner"
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            className="ss-focus-ring flex items-center gap-2.5 rounded-[var(--ss-radius-md)] no-underline"
            to="/"
          >
            <img
              alt=""
              className="size-8 shrink-0"
              height={32}
              src="/brand/silverstone-icon.png"
              width={32}
            />
            <span className="font-display text-h6 leading-none font-semibold tracking-[var(--ss-type-track-heading)] text-foreground">
              Silverstone
              <span className="text-[color:var(--ss-v2-cyan)]"> AI</span>
            </span>
          </Link>

          <SiteNav className="hidden lg:flex">
            <SiteNavList>
              <SiteNavItem>
                <SiteNavDisclosure
                  label="Services"
                  links={withCurrent(serviceLinks, location.pathname)}
                  renderLink={(link) => <MegaLink link={link} />}
                >
                  Capability-led services
                </SiteNavDisclosure>
              </SiteNavItem>
              <SiteNavItem>
                <SiteNavDisclosure
                  label="Industries"
                  links={withCurrent(industryLinks, location.pathname)}
                  renderLink={(link) => <MegaLink link={link} />}
                >
                  Sector-specific context
                </SiteNavDisclosure>
              </SiteNavItem>
              {primaryNavLinks.map((link) => (
                <SiteNavItem key={link.href}>
                  <HeaderLink
                    active={location.pathname === link.href}
                    label={link.label}
                    to={link.href}
                  />
                </SiteNavItem>
              ))}
            </SiteNavList>
          </SiteNav>

          <div className="flex items-center gap-2">
            <Link className={cn(ctaPillClass, "hidden lg:inline-flex")} to={primaryCta.href}>
              {primaryCta.label}
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
            <button
              aria-expanded={mobileOpen}
              aria-label="Open menu"
              className="ss-focus-ring inline-flex size-10 items-center justify-center rounded-[var(--ss-radius-md)] text-foreground hover:bg-[var(--ss-color-action-ghost-hover)] lg:hidden"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <MenuIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            animate="show"
            className="fixed inset-0 z-[600] lg:hidden"
            exit="hidden"
            initial="hidden"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--ss-color-surface-scrim)] backdrop-blur-sm"
              onClick={closeMobile}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            />
            <motion.aside
              className="ss-glass-strong absolute inset-y-0 right-0 flex w-[min(88vw,22rem)] flex-col overflow-y-auto p-6"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 34 }
              }
              variants={{ hidden: { x: "100%" }, show: { x: 0 } }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-h6 font-semibold text-foreground">
                  Silverstone
                  <span className="text-[color:var(--ss-v2-cyan)]"> AI</span>
                </span>
                <button
                  aria-label="Close menu"
                  className="ss-focus-ring inline-flex size-10 items-center justify-center rounded-[var(--ss-radius-md)] text-foreground hover:bg-[var(--ss-color-action-ghost-hover)]"
                  onClick={closeMobile}
                  type="button"
                >
                  <XIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {primaryNavLinks.map((link) => (
                  <DrawerLink
                    key={link.href}
                    label={link.label}
                    onNavigate={closeMobile}
                    to={link.href}
                  />
                ))}

                <p className="ss-mono-label mt-6 px-3 text-[color:var(--ss-v2-cyan)]">
                  Services
                </p>
                {serviceLinks.map((link) => (
                  <DrawerLink
                    key={link.href}
                    label={link.label}
                    onNavigate={closeMobile}
                    to={link.href}
                  />
                ))}

                <p className="ss-mono-label mt-6 px-3 text-[color:var(--ss-v2-cyan)]">
                  Industries
                </p>
                {industryLinks.map((link) => (
                  <DrawerLink
                    key={link.href}
                    label={link.label}
                    onNavigate={closeMobile}
                    to={link.href}
                  />
                ))}
              </nav>

              <Link
                className={cn(ctaPillClass, "mt-8 w-full")}
                onClick={closeMobile}
                to={primaryCta.href}
              >
                {primaryCta.label}
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export { SiteHeader };
