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
import { ArrowUpRight, ChevronDown, Menu, X } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import { Container } from "~/components/layout/container";
import { cn } from "~/lib/utils";
import {
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

function ServicesPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid w-[min(88vw,34rem)] grid-cols-1 gap-1 sm:grid-cols-2">
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
  );
}

function IndustriesPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid w-[min(88vw,26rem)] grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
      {menu.items.map((item) => (
        <m.div key={item.href} variants={menuItemVariants}>
          <Link
            className="ss-focus-ring block rounded-[var(--ss-radius-sm)] px-3 py-2 text-sm font-medium text-[color:var(--ss-v2-header-text)] no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]"
            to={item.href}
          >
            {item.label}
          </Link>
        </m.div>
      ))}
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
  variant: "cards" | "columns";
};

function HeaderMenu({
  currentPath,
  isOpen,
  menu,
  onClose,
  onOpen,
  showIndicator,
  variant,
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
              {variant === "cards" ? (
                <ServicesPanel menu={menu} />
              ) : (
                <IndustriesPanel menu={menu} />
              )}
              <m.div variants={menuItemVariants}>
                <Link
                  className="ss-focus-ring mt-2 flex items-center gap-1.5 rounded-[var(--ss-radius-sm)] border-t border-[color:var(--ss-v2-header-panel-border)] px-3 pt-3 pb-1 text-sm font-semibold text-[color:var(--ss-v2-header-accent)] no-underline ss-transition-interactive hover:gap-2.5"
                  to={menu.href}
                >
                  {menu.viewAllLabel}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </m.div>
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
  const previousOverflowRef = useRef("");

  useEffect(() => {
    const node = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),summary") ??
          [],
      );

    getFocusable()[0]?.focus();
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = previousOverflowRef.current;
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
        className="ss-void-bg absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col border-l border-[color:var(--ss-v2-hairline)]"
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
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
          {[SERVICES_MENU, INDUSTRIES_MENU].map((menu) => (
            <details className="ss-hairline-b py-1" key={menu.id}>
              <summary className="ss-focus-ring flex cursor-pointer list-none items-center justify-between rounded-[var(--ss-radius-sm)] py-3 text-base font-semibold text-platinum [&::-webkit-details-marker]:hidden">
                {menu.label}
                <ChevronDown aria-hidden className="size-4 text-titanium" />
              </summary>
              <div className="flex flex-col gap-0.5 pb-2">
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
                <Link
                  className="ss-focus-ring px-3 py-2 text-sm font-semibold text-[var(--ss-v2-signal-cyan)] no-underline"
                  onClick={onClose}
                  to={menu.href}
                >
                  {menu.viewAllLabel}
                </Link>
              </div>
            </details>
          ))}
          <div className="flex flex-col gap-0.5 py-2">
            {PRIMARY_LINKS.map((link) => (
              <Link
                aria-current={currentPath === link.href ? "page" : undefined}
                className={cn(
                  "ss-focus-ring rounded-[var(--ss-radius-sm)] px-3 py-3 text-base font-semibold no-underline",
                  currentPath === link.href
                    ? "text-platinum"
                    : "text-titanium hover:text-platinum",
                )}
                key={link.href}
                onClick={onClose}
                to={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="ss-hairline-t shrink-0 p-5">
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
 * during the first small scroll of a page. */
const SCROLL_HIDE_THRESHOLD = 120;
/** Minimum scroll delta before counting as a deliberate direction change,
 * so momentum/bounce scrolling doesn't flicker the header in and out. */
const SCROLL_DIRECTION_NOISE_FLOOR = 6;

export function SiteHeader({ pendingIndicator }: SiteHeaderProps) {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
  const headerRef = useRef<HTMLElement>(null);
  const scrollY = useMotionValue(typeof window !== "undefined" ? window.scrollY : 0);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);

    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;

    if (Math.abs(delta) < SCROLL_DIRECTION_NOISE_FLOOR) {
      return;
    }
    if (delta > 0 && latest > SCROLL_HIDE_THRESHOLD) {
      setHiddenByScroll(true);
    } else if (delta < 0) {
      setHiddenByScroll(false);
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
        "fixed inset-x-0 top-0 z-[400] h-[var(--ss-layout-header)] border-b",
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
          <nav aria-label="Primary" className="hidden min-w-0 items-center lg:flex">
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
                variant="cards"
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
                variant="columns"
              />
              {PRIMARY_LINKS.map((link) => {
                const active = location.pathname === link.href;
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
            <Link className={ctaClass} to={PRIMARY_CTA.href}>
              {PRIMARY_CTA.label}
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
