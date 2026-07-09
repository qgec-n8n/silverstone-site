import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useMotionValueEvent,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import { Link, useLocation } from "react-router";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutGrid,
  Menu,
  X,
} from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import { Container } from "~/components/layout/container";
import { cn } from "~/lib/utils";
import {
  faqContentVariants,
  menuItemVariants,
  menuPanelVariants,
  mobileOverlayVariants,
  mobilePanelVariants,
  pressableVariants,
} from "~/motion";

import { BrandLockup } from "./brand-lockup";
import {
  INDUSTRIES_MENU,
  type NavMenu,
  PRIMARY_CTA,
  PRIMARY_LINKS,
  SERVICES_MENU,
} from "./nav-data";

const TRIGGER_CLASS =
  "ss-focus-ring ss-transition-interactive relative inline-flex items-center gap-1 whitespace-nowrap rounded-[var(--ss-radius-pill)] px-3 py-2 text-sm font-medium text-[color:var(--ss-v2-header-text)] hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]";

const ctaClass =
  "ss-focus-ring ss-nav-cta inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-[var(--ss-radius-pill)] px-5 text-sm font-semibold text-[#05070a]";

const headerMotionVariants: Variants = {
  rest: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  hidden: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

function isActive(menu: NavMenu, path: string): boolean {
  return path === menu.href || menu.items.some((item) => item.href === path);
}

/** Nav hrefs may carry an in-page anchor (e.g. /book#booking-calendar); the
 * active state only cares about the route itself. */
function linkPath(href: string): string {
  return href.split("#")[0] ?? href;
}

function ActiveNavIndicator() {
  return (
    <m.span
      aria-hidden
      className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[var(--ss-v2-gradient-signal)]"
      layoutId="ss-primary-nav-indicator"
      transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.7 }}
    />
  );
}

function MegaMenuPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="flex w-[min(90vw,36rem)] flex-col gap-1">
      <m.div variants={menuItemVariants}>
        <Link
          className="ss-focus-ring group flex items-center gap-3.5 rounded-[var(--ss-radius-md)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_7%,transparent)] p-3.5 no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)]"
          to={menu.href}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-[var(--ss-radius-sm)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_16%,#ffffff)] text-[color:var(--ss-v2-header-accent)]">
            <LayoutGrid className="size-5" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-semibold text-[color:var(--ss-v2-header-text-strong)]">
              {menu.viewAllLabel}
            </span>
            <span className="text-body-sm text-[color:var(--ss-v2-header-muted)]">
              {menu.viewAllDescription}
            </span>
          </span>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-[color:var(--ss-v2-header-accent)] ss-transition-interactive group-hover:translate-x-0.5"
          />
        </Link>
      </m.div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {menu.items.map((item) => {
          const Icon = item.icon;
          return (
            <m.div key={item.href} variants={menuItemVariants}>
              <Link
                className="ss-focus-ring group flex items-start gap-3 rounded-[var(--ss-radius-md)] p-3 no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)]"
                to={item.href}
              >
                {Icon ? (
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--ss-radius-sm)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_10%,#ffffff)] text-[color:var(--ss-v2-header-accent)]">
                    <Icon className="size-4" />
                  </span>
                ) : null}
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[color:var(--ss-v2-header-text-strong)]">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-body-sm text-[color:var(--ss-v2-header-muted)]">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </Link>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}

type HeaderMenuProps = {
  currentPath: string;
  isOpen: boolean;
  menu: NavMenu;
  onClose: () => void;
  onOpen: () => void;
  showIndicator: boolean;
};

function HeaderMenu({
  currentPath,
  isOpen,
  menu,
  onClose,
  onOpen,
  showIndicator,
}: HeaderMenuProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = isActive(menu, currentPath);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && isOpen) {
      onClose();
      triggerRef.current?.focus();
    }
  }

  return (
    <li
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
      onPointerEnter={onOpen}
      onPointerLeave={onClose}
    >
      <m.button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          TRIGGER_CLASS,
          active && "text-[color:var(--ss-v2-header-accent)]",
          isOpen && "text-[color:var(--ss-v2-header-accent-violet)]",
        )}
        data-active={active || undefined}
        data-nav-item=""
        initial="rest"
        onClick={() => (isOpen ? onClose() : onOpen())}
        ref={triggerRef}
        type="button"
        variants={pressableVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {menu.label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 ss-transition-interactive", isOpen && "rotate-180")}
        />
        {showIndicator ? <ActiveNavIndicator /> : null}
      </m.button>
      <AnimatePresence>
        {isOpen ? (
          <m.div
            animate="open"
            aria-label={menu.label}
            className="absolute top-[calc(100%-0.25rem)] left-0 pt-3"
            exit="closed"
            id={panelId}
            initial="closed"
            role="region"
            variants={menuPanelVariants}
          >
            <div
              className="rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-header-panel-border)] bg-[var(--ss-v2-header-panel)] p-3 shadow-[var(--ss-v2-header-shadow)]"
              data-mega-panel=""
            >
              <MegaMenuPanel menu={menu} />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

type MobileDrawerProps = {
  currentPath: string;
  onClose: () => void;
};

function MobileDrawer({ currentPath, onClose }: MobileDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const node = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),summary") ??
          [],
      );

    getFocusable()[0]?.focus();

    // `overflow: hidden` alone doesn't stop iOS Safari's background
    // rubber-band scroll behind a fixed-position overlay. Locking the body
    // to its current scroll offset with `position: fixed` (and restoring
    // scroll on close) is the standard workaround.
    const body = document.body;
    const scrollY = window.scrollY;
    const previousBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${String(scrollY)}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusable = getFocusable();
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        return;
      }
      const activeEl = document.activeElement;
      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previousBodyStyle.position;
      body.style.top = previousBodyStyle.top;
      body.style.width = previousBodyStyle.width;
      body.style.overflow = previousBodyStyle.overflow;
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <m.div
      animate="open"
      className="fixed inset-0 z-[500] lg:hidden"
      exit="closed"
      id="mobile-nav"
      initial="closed"
    >
      <m.button
        aria-label="Close menu"
        className="absolute inset-0 h-full w-full cursor-default bg-[color-mix(in_srgb,var(--ss-v2-void-black)_72%,transparent)] backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
        type="button"
        variants={mobileOverlayVariants}
      />
      <m.div
        aria-label="Site menu"
        aria-modal="true"
        className="ss-void-bg absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col border-l border-[color:color-mix(in_srgb,var(--ss-v2-signal-cyan)_32%,var(--ss-v2-hairline-strong))] shadow-[var(--ss-v2-glow-soft)]"
        ref={dialogRef}
        role="dialog"
        variants={mobilePanelVariants}
      >
        <div className="ss-hairline-b flex h-[var(--ss-layout-header)] shrink-0 items-center justify-between px-5">
          <BrandLockup tone="onDark" />
          <button
            aria-label="Close menu"
            className="ss-focus-ring grid size-11 place-items-center rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-hairline)] text-platinum ss-transition-interactive hover:bg-[var(--ss-v2-glass)]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4"
        >
          <div className="divide-y divide-[color:var(--ss-v2-hairline)] rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline)] bg-[var(--ss-v2-glass)]">
            {[SERVICES_MENU, INDUSTRIES_MENU].map((menu) => {
              const open = openSection === menu.id;
              const triggerId = `${baseId}-${menu.id}-trigger`;
              const contentId = `${baseId}-${menu.id}-content`;
              return (
                <div key={menu.id}>
                  <m.button
                    aria-controls={contentId}
                    aria-expanded={open}
                    className="ss-focus-ring flex w-full items-center justify-between gap-2.5 rounded-[var(--ss-radius-sm)] px-4 py-3.5 text-left text-base font-semibold text-platinum"
                    id={triggerId}
                    initial="rest"
                    onClick={() => {
                      setOpenSection(open ? null : menu.id);
                    }}
                    type="button"
                    variants={pressableVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {menu.label}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 text-[color:var(--ss-v2-signal-cyan)] transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </m.button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <m.div
                        animate="open"
                        aria-labelledby={triggerId}
                        className="overflow-hidden"
                        exit="closed"
                        id={contentId}
                        initial="closed"
                        role="region"
                        variants={faqContentVariants}
                      >
                        <div className="flex flex-col gap-0.5 px-3 pb-3">
                          <Link
                            className="ss-focus-ring mb-1 flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] border border-[color:var(--ss-v2-hairline)] bg-[color-mix(in_srgb,var(--ss-v2-signal-cyan)_8%,transparent)] px-3 py-2.5 text-sm font-semibold text-[var(--ss-v2-signal-cyan)] no-underline"
                            onClick={onClose}
                            to={menu.href}
                          >
                            <LayoutGrid aria-hidden className="size-4" />
                            {menu.viewAllLabel}
                          </Link>
                          {menu.items.map((item) => (
                            <Link
                              className="ss-focus-ring rounded-[var(--ss-radius-sm)] px-3 py-2 text-sm text-titanium no-underline hover:text-platinum"
                              key={item.href}
                              onClick={onClose}
                              to={item.href}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-0.5 py-4">
            {PRIMARY_LINKS.map((link) => {
              const active = currentPath === linkPath(link.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "ss-focus-ring flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] px-3 py-3 text-base font-semibold no-underline",
                    active ? "text-platinum" : "text-titanium hover:text-platinum",
                  )}
                  key={link.href}
                  onClick={onClose}
                  to={link.href}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full bg-[var(--ss-v2-signal-cyan)] transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="ss-hairline-t shrink-0 px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          <Link
            className={cn(ctaClass, "w-full justify-center")}
            onClick={onClose}
            to={PRIMARY_CTA.href}
          >
            {PRIMARY_CTA.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </m.div>
    </m.div>
  );
}

type SiteHeaderProps = {
  pendingIndicator?: ReactNode;
};

/** Scroll distance the header ignores at the very top, so it never hides
 * during the first small scroll of a page. Shared by both breakpoints. */
const SCROLL_HIDE_THRESHOLD = 120;

/** Desktop (`lg:fixed` header) hide/show decision — untouched by the mobile
 * jank fix below. Desktop's fixed header never exhibited the momentum/
 * toolbar-driven scroll noise mobile does, so its behavior stays exactly
 * as it was: any qualifying single-sample delta flips it immediately. */
const DESKTOP_SCROLL_NOISE_FLOOR = 6;
const DESKTOP_RESIZE_SUPPRESS_MS = 250;

/** Mobile (`sticky` header) hide/show decision. Single-sample deltas below
 * this are sub-pixel rounding noise, not a scroll signal — filtered before
 * they can reset direction tracking. */
const SCROLL_SAMPLE_NOISE_FLOOR = 2;
/** Sustained distance (px), accumulated across samples travelling the same
 * direction, the page must cover before the header commits to hiding. A
 * single noisy sample can no longer flip it — that sample has to be part of
 * a real run of travel first. This is what makes hide immune to momentum
 * jitter and iOS's dynamic toolbar nudging `window.scrollY` by a few px. */
const HIDE_COMMIT_DISTANCE = 32;
/** Reveal is intentionally far more sensitive than hide: users expect the
 * header back the instant they start scrolling up, so it needs much less
 * accumulated travel to commit than hiding does. */
const SHOW_COMMIT_DISTANCE = 10;
/** A single-sample delta larger than this, occurring shortly after a resize
 * (see RESIZE_ADJACENT_MS), is treated as iOS shifting `window.scrollY` by
 * roughly the dynamic toolbar's own height rather than a real scroll — and
 * discarded instead of counted as travel. Deliberately scoped to only the
 * resize-adjacent window: a genuinely large scroll sample at any other time
 * (a fast fling, a deep-link jump to an anchor) is real and must still
 * register at full value, exactly as it did before this fix. */
const SCROLL_ANOMALY_JUMP = 110;
/** How long after a resize a big delta is still treated as suspect. Chosen
 * to comfortably outlast iOS's own toolbar show/hide animation (observed
 * around 300–350ms) rather than to make scrolling feel a particular way. */
const RESIZE_ADJACENT_MS = 400;

/** Matches the header's own `lg` breakpoint (`sticky lg:fixed`, see the
 * className below) so the JS decision logic and the CSS positioning it's
 * driving never disagree about which device class they're running on. */
const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

export function SiteHeader({ pendingIndicator }: SiteHeaderProps) {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
  const headerRef = useRef<HTMLElement>(null);
  const scrollY = useMotionValue(typeof window !== "undefined" ? window.scrollY : 0);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const travelDistance = useRef(0);
  const travelDirection = useRef<-1 | 0 | 1>(0);
  const lastResizeAt = useRef(0);
  const isDesktop = useRef(
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches : false,
  );
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const updateScrollValue = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scrollY.set(window.scrollY);
      });
    };

    updateScrollValue();
    window.addEventListener("scroll", updateScrollValue, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollValue);
    };
  }, [scrollY]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateIsDesktop = () => {
      isDesktop.current = mediaQuery.matches;
    };
    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);
    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  useEffect(() => {
    // Checks `isDesktop.current` (kept live by the effect above) at fire
    // time rather than branching once at mount, so a resize that crosses
    // the `lg` breakpoint itself (e.g. a tablet rotation) still gets the
    // right behavior instead of whichever branch happened to be registered
    // first.
    const onResize = () => {
      lastResizeAt.current = Date.now();
      if (isDesktop.current) {
        // Desktop path, unchanged: blanket-suppress direction decisions
        // for a beat after any resize instead of resyncing immediately.
        return;
      }
      // Mobile path: a real viewport resize (toolbar collapse/expand,
      // orientation change) invalidates whatever direction we were
      // tracking — resync the baseline immediately rather than guessing
      // how long the animation might run. The timestamp above additionally
      // gates SCROLL_ANOMALY_JUMP for the samples right around this resize.
      lastScrollY.current = window.scrollY;
      travelDistance.current = 0;
      travelDirection.current = 0;
    };
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      viewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);

    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;

    if (isDesktop.current) {
      // Desktop path, unchanged from before this session's mobile-only
      // jank fix.
      if (Date.now() - lastResizeAt.current < DESKTOP_RESIZE_SUPPRESS_MS) {
        return;
      }
      if (Math.abs(delta) < DESKTOP_SCROLL_NOISE_FLOOR) {
        return;
      }
      if (delta > 0 && latest > SCROLL_HIDE_THRESHOLD) {
        setHiddenByScroll(true);
      } else if (delta < 0) {
        setHiddenByScroll(false);
      }
      return;
    }

    if (
      Math.abs(delta) > SCROLL_ANOMALY_JUMP &&
      Date.now() - lastResizeAt.current < RESIZE_ADJACENT_MS
    ) {
      // Discard — see SCROLL_ANOMALY_JUMP. Don't let it reset direction
      // tracking either, since it isn't a real scroll sample at all.
      return;
    }
    if (Math.abs(delta) < SCROLL_SAMPLE_NOISE_FLOOR) {
      return;
    }

    const direction = delta > 0 ? 1 : -1;
    if (direction !== travelDirection.current) {
      travelDirection.current = direction;
      travelDistance.current = 0;
    }
    travelDistance.current += Math.abs(delta);

    if (direction > 0) {
      if (travelDistance.current >= HIDE_COMMIT_DISTANCE && latest > SCROLL_HIDE_THRESHOLD) {
        setHiddenByScroll(true);
        travelDistance.current = 0;
      }
    } else if (travelDistance.current >= SHOW_COMMIT_DISTANCE) {
      setHiddenByScroll(false);
      travelDistance.current = 0;
    }
  });

  const elevated = scrolled || openMenu !== null;
  // Never hide the header while one of its own menus is open — scrolling a
  // mega-menu or the mobile drawer shouldn't make the trigger disappear.
  const hidden = headerHidden || (hiddenByScroll && openMenu === null && !mobileOpen);

  useEffect(() => {
    const node = headerRef.current;
    if (node) {
      node.inert = hidden;
    }
  }, [hidden]);

  const header = (
    <m.header
      animate={hidden ? "hidden" : "rest"}
      aria-hidden={hidden || undefined}
      className={cn(
        /*
         * `sticky` below the lg breakpoint, `fixed` at/above it. iOS Safari's
         * dynamic bottom toolbar resizes the visual viewport on its own native
         * timeline, independent of any scroll/resize listener — a `fixed`
         * header gets visibly out of sync with that resize (the jank this is
         * fixing). `sticky` is tracked by the browser's own scroll/compositing
         * engine instead of being pinned to the viewport, so it never
         * desyncs. Desktop has no dynamic toolbar, so it keeps `fixed`
         * unchanged (unaffected by this at all).
         */
        "sticky lg:fixed inset-x-0 top-0 z-[400] h-[var(--ss-layout-header)] border-b",
        elevated
          ? "border-[color:var(--ss-v2-header-border-strong)] bg-[var(--ss-v2-header-surface-scroll)] shadow-[var(--ss-v2-header-shadow)]"
          : "border-[color:var(--ss-v2-header-border)] bg-[var(--ss-v2-header-surface)]",
      )}
      data-scrolled={scrolled}
      data-site-header=""
      initial={false}
      ref={headerRef}
      variants={headerMotionVariants}
    >
      <Container className="flex h-full items-center gap-6" data-nav-row size="wide">
        <BrandLockup
          className="mr-1 shrink-0"
          emblemClassName="h-[3.25rem] w-auto lg:h-[4.75rem]"
          tone="onLight"
        />
        <LayoutGroup id="ss-primary-nav">
          <nav aria-label="Primary" className="hidden shrink-0 items-center lg:flex">
            <ul className="flex items-center gap-1">
              <HeaderMenu
                currentPath={location.pathname}
                isOpen={openMenu === "services"}
                menu={SERVICES_MENU}
                onClose={() => setOpenMenu(null)}
                onOpen={() => setOpenMenu("services")}
                showIndicator={
                  openMenu === "services" ||
                  (openMenu === null && isActive(SERVICES_MENU, location.pathname))
                }
              />
              <HeaderMenu
                currentPath={location.pathname}
                isOpen={openMenu === "industries"}
                menu={INDUSTRIES_MENU}
                onClose={() => setOpenMenu(null)}
                onOpen={() => setOpenMenu("industries")}
                showIndicator={
                  openMenu === "industries" ||
                  (openMenu === null && isActive(INDUSTRIES_MENU, location.pathname))
                }
              />
              {PRIMARY_LINKS.map((link) => {
                const active = location.pathname === linkPath(link.href);
                const showIndicator = openMenu === null && active;
                return (
                  <li key={link.href}>
                    <m.div
                      initial="rest"
                      variants={pressableVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          TRIGGER_CLASS,
                          active && "text-[color:var(--ss-v2-header-accent)]",
                        )}
                        data-active={active || undefined}
                        data-nav-item=""
                        to={link.href}
                      >
                        {link.label}
                        {showIndicator ? <ActiveNavIndicator /> : null}
                      </Link>
                    </m.div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </LayoutGroup>
        <div className="ml-auto flex items-center gap-2">
          <m.div
            className="hidden lg:block"
            initial="rest"
            variants={pressableVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              aria-label={PRIMARY_CTA.label}
              className={ctaClass}
              to={PRIMARY_CTA.href}
            >
              <span aria-hidden="true">
                <span className="ss-nav-cta__label-short">Book</span>
                <span className="ss-nav-cta__label-full">{PRIMARY_CTA.label}</span>
              </span>
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </m.div>
          <m.button
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            className="ss-focus-ring grid size-11 place-items-center rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-header-border-strong)] text-[color:var(--ss-v2-header-text)] ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] lg:hidden"
            initial="rest"
            onClick={() => setMobileOpen(true)}
            type="button"
            variants={pressableVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Menu aria-hidden className="size-5" />
          </m.button>
        </div>
      </Container>
      {pendingIndicator ? (
        <div className="absolute inset-x-0 bottom-0">{pendingIndicator}</div>
      ) : null}
    </m.header>
  );

  /*
   * The drawer renders as a sibling of <header>, not nested inside it.
   * Motion sets `will-change: transform` on the header for its hide/show
   * variants and, per spec, that alone establishes a new containing block
   * for fixed-position descendants — so the drawer's `fixed inset-0` would
   * resolve against the header's own ~80px box instead of the viewport,
   * squashing the full-screen overlay into a sliver. Being a sibling (rather
   * than a DOM descendant) sidesteps that without needing a portal or
   * touching the header's own animation.
   */
  return (
    <>
      {header}
      <AnimatePresence>
        {mobileOpen ? (
          <MobileDrawer
            currentPath={location.pathname}
            key="mobile-nav"
            onClose={() => setMobileOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
