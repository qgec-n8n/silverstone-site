import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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
import { DEEP_LINK_JUMP_EVENT } from "~/app/experience/deep-link-scroll";
import { Container } from "~/components/layout/container";
import { cn } from "~/lib/utils";
import {
  faqContentVariants,
  menuPanelVariants,
  mobileOverlayVariants,
  mobilePanelVariants,
  pressableVariants,
} from "~/motion";

import { CurrencyToggle } from "~/components/ui/currency-toggle";

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

/** The header's own hide animation (see `headerMotionVariants.hidden`, 0.18s)
 * plus a small margin. Interactivity (`inert`) is only disabled once the header
 * has finished animating off-screen — see the effect in `SiteHeader` — so a
 * click on a still-visible header is never dropped. */
const HEADER_HIDE_ANIM_MS = 240;

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
  // Menu entries deliberately carry no per-item reveal variants: the panel
  // fades in as one surface and every link is simply there, immediately.
  return (
    <div className="flex w-[min(90vw,36rem)] flex-col gap-1">
      <div>
        <Link
          className="ss-focus-ring group flex items-center gap-3.5 rounded-[var(--ss-radius-md)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_7%,transparent)] p-3.5 no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)]"
          prefetch="intent"
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
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {menu.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.href}>
              <Link
                className="ss-focus-ring group flex items-start gap-3 rounded-[var(--ss-radius-md)] p-3 no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)]"
                prefetch="intent"
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
            </div>
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
  onNavigate: (href: string) => void;
  /** The drawer link whose destination is currently being resolved, if any. */
  pendingHref: string | null;
};

/** Trailing pulse on the tapped row while its destination route resolves. */
function NavCommitPulse() {
  return (
    <span aria-hidden="true" className="ss-mobile-nav-pulse">
      <span />
      <span />
      <span />
    </span>
  );
}

function MobileDrawer({
  currentPath,
  onClose,
  onNavigate,
  pendingHref,
}: MobileDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const navigating = pendingHref !== null;

  /*
   * Body scroll locking lives in `SiteHeader`, keyed on the open flag rather
   * than on this component's lifetime. AnimatePresence keeps the drawer
   * mounted for its ~300ms exit, so releasing the lock from an unmount
   * cleanup released it a third of a second late — long enough for the
   * destination page to be painted at the *previous* page's scroll offset.
   */
  useEffect(() => {
    const node = dialogRef.current;
    const getFocusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),summary") ??
          [],
      );

    getFocusable()[0]?.focus();

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

    // Focus is handed back by `SiteHeader` the moment the drawer is dismissed,
    // not here: unmount is a full exit animation later, which would leave
    // focus sitting inside a panel already sliding off screen.
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <m.div
      animate="open"
      className="fixed inset-0 z-[500] lg:hidden"
      data-mobile-nav=""
      data-navigating={navigating || undefined}
      exit="closed"
      id="mobile-nav"
      initial="closed"
    >
      <m.button
        aria-label="Close menu"
        className="absolute inset-0 h-full w-full cursor-default bg-[color-mix(in_srgb,var(--ss-v2-void-black)_38%,transparent)] backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
        type="button"
        variants={mobileOverlayVariants}
      />
      <m.div
        aria-busy={navigating || undefined}
        aria-label="Site menu"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col overflow-hidden border-l border-[color:var(--ss-v2-header-border-strong)] bg-[var(--ss-v2-header-surface)] shadow-[var(--ss-v2-header-shadow)]"
        ref={dialogRef}
        role="dialog"
        variants={mobilePanelVariants}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--ss-v2-gradient-signal)] opacity-70"
        />
        <div className="flex h-[var(--ss-layout-header)] shrink-0 items-center justify-between border-b border-[color:var(--ss-v2-header-border)] px-5">
          <BrandLockup tone="onLight" />
          <button
            aria-label="Close menu"
            className="ss-focus-ring grid size-11 place-items-center rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-header-border-strong)] text-[color:var(--ss-v2-header-text)] ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]"
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
          <div className="divide-y divide-[color:var(--ss-v2-header-border)] rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_4%,var(--ss-v2-header-surface))]">
            {[SERVICES_MENU, INDUSTRIES_MENU].map((menu) => {
              const open = openSection === menu.id;
              const triggerId = `${baseId}-${menu.id}-trigger`;
              const contentId = `${baseId}-${menu.id}-content`;
              return (
                <div key={menu.id}>
                  <m.button
                    aria-controls={contentId}
                    aria-expanded={open}
                    className="ss-mobile-nav-section ss-focus-ring flex w-full items-center justify-between gap-2.5 rounded-[var(--ss-radius-sm)] px-4 py-3.5 text-left text-base font-semibold text-[color:var(--ss-v2-header-text-strong)]"
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
                        "size-4 shrink-0 text-[color:var(--ss-v2-header-accent)] transition-transform duration-300",
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
                            className="ss-mobile-nav-link ss-focus-ring mb-1 flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] border border-[color:var(--ss-v2-header-panel-border)] bg-[color-mix(in_srgb,var(--ss-v2-header-accent)_10%,var(--ss-v2-header-surface))] px-3 py-2.5 text-sm font-semibold text-[color:var(--ss-v2-header-accent)] no-underline ss-transition-interactive"
                            data-pending={pendingHref === menu.href || undefined}
                            onClick={() => {
                              onNavigate(menu.href);
                            }}
                            prefetch="intent"
                            to={menu.href}
                          >
                            <LayoutGrid aria-hidden className="size-4" />
                            {menu.viewAllLabel}
                            {pendingHref === menu.href ? <NavCommitPulse /> : null}
                          </Link>
                          {menu.items.map((item) => (
                            <Link
                              className="ss-mobile-nav-link ss-focus-ring flex items-center rounded-[var(--ss-radius-sm)] px-3 py-2 text-sm text-[color:var(--ss-v2-header-muted)] no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]"
                              data-pending={pendingHref === item.href || undefined}
                              key={item.href}
                              onClick={() => {
                                onNavigate(item.href);
                              }}
                              prefetch="intent"
                              to={item.href}
                            >
                              {item.label}
                              {pendingHref === item.href ? <NavCommitPulse /> : null}
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
                    "ss-mobile-nav-link ss-focus-ring ss-transition-interactive flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] px-3 py-3 text-base font-semibold no-underline",
                    active
                      ? "text-[color:var(--ss-v2-header-text-strong)]"
                      : "text-[color:var(--ss-v2-header-muted)] hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]",
                  )}
                  data-pending={pendingHref === link.href || undefined}
                  key={link.href}
                  onClick={() => {
                    onNavigate(link.href);
                  }}
                  prefetch="intent"
                  to={link.href}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full bg-[var(--ss-v2-header-accent)] transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {link.label}
                  {pendingHref === link.href ? <NavCommitPulse /> : null}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="shrink-0 border-t border-[color:var(--ss-v2-header-border)] px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          {/* The phone and tablet display-currency control. It sits with the
              drawer's own actions rather than in the top bar, where a third
              control clipped the menu button at 320px. */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="ss-eyebrow font-mono text-[10px] text-[color:var(--ss-v2-header-muted)]">
              Display currency
            </span>
            <CurrencyToggle context="drawer" />
          </div>
          <Link
            className={cn(ctaClass, "ss-mobile-nav-link w-full justify-center")}
            data-pending={pendingHref === PRIMARY_CTA.href || undefined}
            onClick={() => {
              onNavigate(PRIMARY_CTA.href);
            }}
            prefetch="intent"
            to={PRIMARY_CTA.href}
          >
            {PRIMARY_CTA.label}
            {pendingHref === PRIMARY_CTA.href ? (
              <NavCommitPulse />
            ) : (
              <ArrowUpRight aria-hidden className="size-4" />
            )}
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
 * during the first small scroll of a page. Desktop-only (mobile never hides). */
const SCROLL_HIDE_THRESHOLD = 120;

/** Desktop hide/show decision. The header only auto-hides on scroll on desktop;
 * on mobile it stays visible the whole time (see the scroll handler below), so
 * these thresholds and the resize suppression only ever apply at `lg`+. Any
 * qualifying single-sample delta flips the desktop header immediately. */
const DESKTOP_SCROLL_NOISE_FLOOR = 6;
const DESKTOP_RESIZE_SUPPRESS_MS = 250;

/** After a deep-link section jump the desktop header hides so the section
 * lands 1rem below the viewport top. A smooth same-page scroll to a target
 * ABOVE the current position emits upward deltas the whole way, which would
 * re-show the header mid-travel — suppress the upward re-show long enough
 * for the smooth scroll to settle. */
const DEEP_LINK_SHOW_SUPPRESS_MS = 1800;

/** Matches the header's own `lg` breakpoint so the JS decision logic and the CSS
 * positioning it's driving never disagree about which device class they're on.
 * Below this width the header is permanently shown; at/above it hides on scroll. */
const DESKTOP_MEDIA_QUERY = "(min-width: 64rem)";

/**
 * Ceiling on how long a mobile drawer link tap will hold the drawer open
 * waiting for its destination to commit. A navigation that never resolves
 * (offline, a route error) must not wedge the drawer on screen; past this the
 * drawer closes anyway. Comfortably clears a cold core page on a throttled
 * 3G connection (measured just over 3s), which is exactly the case the hold
 * exists for — a cap that expires mid-navigation reintroduces the flash it
 * was added to prevent.
 */
const MOBILE_NAV_MAX_HOLD_MS = 4000;

/** `useLayoutEffect` on the client, a no-op-safe `useEffect` during prerender
 * (React warns about layout effects on the server). The drawer's scroll lock
 * must be released before the browser paints the frame that reveals the
 * destination, so it cannot wait for a passive effect. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Locks background scrolling for the lifetime of the mobile drawer.
 *
 * `overflow: hidden` alone doesn't stop iOS Safari's background rubber-band
 * scroll behind a fixed overlay, so the body is pinned to its current offset
 * with `position: fixed`. The offset is only *restored* if the drawer closed
 * without going anywhere: a drawer that closed because the visitor navigated
 * must hand the destination its own top, not the previous page's scroll
 * position. Restoring it was why a page opened from the menu landed halfway
 * down its body instead of on its hero.
 *
 * `navigated` covers the case the pathname alone misses — a navigation that
 * was requested but hasn't committed yet (the hold timed out, or the visitor
 * dismissed the drawer straight after tapping a link). The destination is
 * still on its way, so the offset must not come back with it.
 */
function useMobileDrawerScrollLock(
  open: boolean,
  navigated: { readonly current: boolean },
): void {
  useIsomorphicLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    const body = document.body;
    const scrollY = window.scrollY;
    const openedAtPath = window.location.pathname;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${String(scrollY)}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      const stayedPut = !navigated.current && window.location.pathname === openedAtPath;
      window.scrollTo(0, stayedPut ? scrollY : 0);
    };
    // `navigated` is a ref box read at cleanup time, never a re-run trigger.
  }, [navigated, open]);
}

export function SiteHeader({ pendingIndicator }: SiteHeaderProps) {
  const location = useLocation();
  /*
   * The narrow signal, not the broad one. `headerHidden` stays true for the
   * whole Explore morph, which parked this header at its `hidden` variant
   * while experience-gate.css was animating it in — so the moment the morph
   * ended and that animation stopped applying, Motion's inline hidden style
   * showed through and the bar slid in a SECOND time. `introOwnsScreen` is
   * true only while a loader or splash really owns the screen, so the header
   * gets one entrance, owned by the stylesheet, and Motion holds it at rest
   * for the rest of the morph.
   */
  const { introOwnsScreen } = useAppExperience();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollY = useMotionValue(typeof window !== "undefined" ? window.scrollY : 0);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const lastResizeAt = useRef(0);
  const suppressShowUntil = useRef(0);
  const isDesktop = useRef(
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      : false,
  );
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(location.pathname);
  const [lastNavKey, setLastNavKey] = useState(location.key);

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setOpenMenu(null);
  }

  /*
   * The mobile drawer closes on the navigation KEY, not the pathname, so a
   * same-path navigation (a nav href carrying an in-page anchor) can never
   * strand it open. `useLocation()` is React state: it lands in the commit
   * that first paints the destination — which is exactly when the drawer
   * should get out of the way. React Router's own history push happens
   * earlier, but the tree is rendered inside a transition, so nothing commits
   * until the destination's lazily-loaded body has resolved.
   *
   * This is what keeps a tap from flashing the OUTGOING page: the drawer used
   * to close on click, uncovering the page the visitor was leaving for as long
   * as the destination took to resolve (measured at ~800ms on a throttled
   * connection) before the real page replaced it.
   */
  if (location.key !== lastNavKey) {
    setLastNavKey(location.key);
    setMobileOpen(false);
    setPendingHref(null);
  }

  /** True once a drawer link has sent the visitor somewhere else, whether or
   * not that navigation has committed yet. Cleared when the drawer reopens. */
  const drawerNavigatedRef = useRef(false);

  useMobileDrawerScrollLock(mobileOpen, drawerNavigatedRef);

  /*
   * Dismissing the drawer (X, scrim, Escape, or the hold failsafe) hands focus
   * straight back to the trigger that opened it. Closing it by *navigating*
   * goes through the location block above instead, which leaves focus alone —
   * the app shell has already moved it to the destination's <main>.
   */
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setPendingHref(null);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  const openMobile = useCallback(() => {
    drawerNavigatedRef.current = false;
    setMobileOpen(true);
  }, []);

  const handleMobileNavigate = useCallback(
    (href: string) => {
      // A link to the page already on screen swaps no route body, so there is
      // nothing to wait for — close immediately and let the deep-link handler
      // take any anchor from here.
      if (linkPath(href) === location.pathname) {
        closeMobile();
        return;
      }
      drawerNavigatedRef.current = true;
      setPendingHref(href);
    },
    [closeMobile, location.pathname],
  );

  // Failsafe: a navigation that never commits must not leave the drawer up.
  useEffect(() => {
    if (pendingHref === null) {
      return undefined;
    }
    const timer = window.setTimeout(closeMobile, MOBILE_NAV_MAX_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [closeMobile, pendingHref]);

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
      // The header only auto-hides on desktop. Crossing below `lg` (e.g. a
      // tablet rotating to portrait, or a desktop window narrowing) must clear
      // any scroll-hidden state so the permanent mobile header is shown.
      if (!mediaQuery.matches) {
        setHiddenByScroll(false);
      }
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
      // Record the timestamp only; the desktop scroll branch reads it to
      // suppress direction decisions for a beat after a resize. The mobile
      // header never hides, so it ignores resizes entirely.
      lastResizeAt.current = Date.now();
    };
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      viewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    // Deep-link section jumps land with the desktop header minimized so the
    // section pill sits 1rem below the viewport top (mobile never hides).
    const onDeepLinkJump = () => {
      if (isDesktop.current) {
        suppressShowUntil.current = Date.now() + DEEP_LINK_SHOW_SUPPRESS_MS;
        setHiddenByScroll(true);
      }
    };
    window.addEventListener(DEEP_LINK_JUMP_EVENT, onDeepLinkJump);
    return () => window.removeEventListener(DEEP_LINK_JUMP_EVENT, onDeepLinkJump);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);

    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;

    // Mobile: the header is permanently visible — it never auto-hides on scroll
    // (only the elevated border/shadow above responds via `setScrolled`). This
    // deliberately sidesteps iOS Safari's dynamic URL-bar resize, which made a
    // scroll-driven hide/show animation lag, snap, and shudder no matter how the
    // decision logic was tuned. Auto-hide stays desktop-only.
    if (!isDesktop.current) {
      return;
    }

    // Desktop path — unchanged: any qualifying single-sample delta flips it.
    if (Date.now() - lastResizeAt.current < DESKTOP_RESIZE_SUPPRESS_MS) {
      return;
    }
    if (Math.abs(delta) < DESKTOP_SCROLL_NOISE_FLOOR) {
      return;
    }
    if (delta > 0 && latest > SCROLL_HIDE_THRESHOLD) {
      setHiddenByScroll(true);
    } else if (delta < 0 && Date.now() > suppressShowUntil.current) {
      setHiddenByScroll(false);
    }
  });

  const elevated = scrolled || openMenu !== null;
  // Never hide the header while one of its own menus is open — scrolling a
  // mega-menu or the mobile drawer shouldn't make the trigger disappear.
  const hidden =
    introOwnsScreen || (hiddenByScroll && openMenu === null && !mobileOpen);

  // Interactivity must follow the header's VISIBILITY, not the logical `hidden`
  // flag — the header keeps animating for a beat after the flag flips. Disabling
  // interaction (`inert`) the instant `hidden` turns true would drop a click on
  // a header that is still on-screen (e.g. a scroll that momentarily flags a
  // re-hide right as the user clicks a nav link, or a click landing while the
  // header animates back in). So re-enable immediately on reveal, and only
  // disable once the hide-out animation has finished. A reveal that interrupts a
  // pending hide cancels the deferred disable via the cleanup below.
  //
  // `aria-hidden` is applied HERE rather than in the JSX so it can never lead
  // `inert`. Driving it from the render flipped it the instant `hidden` turned
  // true, leaving the header removed from the accessibility tree while still
  // focusable for HEADER_HIDE_ANIM_MS — the `aria-hidden-focus` violation. The
  // two now move as one: still announced while it is still reachable.
  useEffect(() => {
    const node = headerRef.current;
    if (!node) {
      return undefined;
    }
    const setDisabled = (disabled: boolean) => {
      node.inert = disabled;
      if (disabled) {
        node.setAttribute("aria-hidden", "true");
      } else {
        node.removeAttribute("aria-hidden");
      }
    };
    if (!hidden) {
      setDisabled(false);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setDisabled(true);
    }, HEADER_HIDE_ANIM_MS);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  const header = (
    <m.header
      animate={hidden ? "hidden" : "rest"}
      className={cn(
        /*
         * `fixed` at every breakpoint. iOS Safari's dynamic bottom URL bar
         * only changes the visual viewport's HEIGHT as it collapses/expands —
         * its top edge never moves (visualViewport.offsetTop stays 0, verified
         * on-device). A `fixed` top:0 header is pinned to that stable top edge,
         * so the bar's resize can't move it. A `sticky` header (the previous
         * mobile approach) is re-evaluated by the compositor whenever the
         * viewport height changes, which — combined with the hide/show
         * transform animating at the same time — produced a visible two-stage
         * flicker on every scroll. Desktop was already `fixed`, so it is
         * unchanged; `translateZ(0)`/`backface-visibility` keep the element on
         * a stable GPU layer so the transform never triggers an in-place
         * repaint of the bar underneath it.
         */
        "fixed inset-x-0 top-0 z-[400] h-[var(--ss-layout-header)] border-b [backface-visibility:hidden] [-webkit-backface-visibility:hidden] transition-[border-color,box-shadow] duration-300 ease-out lg:transition-none",
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
                        prefetch="intent"
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
        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          {/* Display currency. Desktop only: below `lg` the top bar is brand +
              menu, and at 320px a third control pushes the menu button off
              screen. The drawer carries the phone/tablet toggle, where the
              site already keeps navigation. */}
          <div className="hidden lg:block">
            <CurrencyToggle context="header" />
          </div>
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
              prefetch="intent"
              to={PRIMARY_CTA.href}
            >
              <span aria-hidden="true">{PRIMARY_CTA.label}</span>
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </m.div>
          <m.button
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            className="ss-focus-ring grid size-11 place-items-center rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-header-border-strong)] text-[color:var(--ss-v2-header-text)] ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] lg:hidden"
            initial="rest"
            onClick={openMobile}
            ref={menuButtonRef}
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
            onClose={closeMobile}
            onNavigate={handleMobileNavigate}
            pendingHref={pendingHref}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
