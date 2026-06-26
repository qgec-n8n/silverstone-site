import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight, ChevronDown, Menu, X } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import { Container } from "~/components/layout/container";
import { cn } from "~/lib/utils";

import { BrandLockup } from "./brand-lockup";
import {
  INDUSTRIES_MENU,
  type NavMenu,
  PRIMARY_CTA,
  PRIMARY_LINKS,
  SERVICES_MENU,
} from "./nav-data";

const TRIGGER_CLASS =
  "ss-focus-ring inline-flex items-center gap-1 rounded-[var(--ss-radius-pill)] px-3 py-2 text-sm font-medium text-[color:var(--ss-v2-header-text)] ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]";

const ctaClass =
  "ss-focus-ring ss-transition-interactive inline-flex min-h-11 items-center gap-1.5 rounded-[var(--ss-radius-pill)] bg-[var(--ss-v2-signal-cyan)] px-5 text-sm font-semibold text-[#05070a] hover:-translate-y-px hover:shadow-[var(--ss-v2-glow-cyan)]";

function isActive(menu: NavMenu, path: string): boolean {
  return path === menu.href || menu.items.some((item) => item.href === path);
}

function ServicesPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid w-[min(88vw,34rem)] grid-cols-1 gap-1 sm:grid-cols-2">
      {menu.items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            className="ss-focus-ring group flex items-start gap-3 rounded-[var(--ss-radius-md)] p-3 no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)]"
            key={item.href}
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
        );
      })}
    </div>
  );
}

function IndustriesPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="grid w-[min(88vw,26rem)] grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
      {menu.items.map((item) => (
        <Link
          className="ss-focus-ring rounded-[var(--ss-radius-sm)] px-3 py-2 text-sm font-medium text-[color:var(--ss-v2-header-text)] no-underline ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] hover:text-[color:var(--ss-v2-header-text-strong)]"
          key={item.href}
          to={item.href}
        >
          {item.label}
        </Link>
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
  variant: "cards" | "columns";
};

function HeaderMenu({
  currentPath,
  isOpen,
  menu,
  onClose,
  onOpen,
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
      <button
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
        onClick={() => (isOpen ? onClose() : onOpen())}
        ref={triggerRef}
        type="button"
      >
        {menu.label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 ss-transition-interactive", isOpen && "rotate-180")}
        />
      </button>
      <div
        aria-label={menu.label}
        className={cn(
          "absolute top-[calc(100%-0.25rem)] left-0 pt-3 ss-transition-panel",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
        id={panelId}
        role="region"
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
          <Link
            className="ss-focus-ring mt-2 flex items-center gap-1.5 rounded-[var(--ss-radius-sm)] border-t border-[color:var(--ss-v2-header-panel-border)] px-3 pt-3 pb-1 text-sm font-semibold text-[color:var(--ss-v2-header-accent)] no-underline ss-transition-interactive hover:gap-2.5"
            to={menu.href}
          >
            {menu.viewAllLabel}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </li>
  );
}

type MobileDrawerProps = {
  currentPath: string;
  onClose: () => void;
  open: boolean;
};

function MobileDrawer({ currentPath, onClose, open }: MobileDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const node = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),summary") ??
          [],
      );

    getFocusable()[0]?.focus();
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
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[500] lg:hidden",
        open ? "visible" : "pointer-events-none invisible",
      )}
      id="mobile-nav"
    >
      <button
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 h-full w-full cursor-default bg-[color-mix(in_srgb,var(--ss-v2-void-black)_72%,transparent)] backdrop-blur-sm ss-transition-panel",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-label="Site menu"
        aria-modal="true"
        className={cn(
          "ss-void-bg absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col border-l border-[color:var(--ss-v2-hairline)] ss-transition-panel",
          open ? "translate-x-0" : "translate-x-full",
        )}
        ref={dialogRef}
        role="dialog"
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
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  className="ss-focus-ring px-3 py-2 text-sm font-semibold text-[var(--ss-v2-signal-cyan)] no-underline"
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
                to={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="ss-hairline-t shrink-0 p-5">
          <Link className={cn(ctaClass, "w-full justify-center")} to={PRIMARY_CTA.href}>
            {PRIMARY_CTA.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

type SiteHeaderProps = {
  pendingIndicator?: ReactNode;
};

export function SiteHeader({ pendingIndicator }: SiteHeaderProps) {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);

  // Adjust state during render (React's recommended pattern) to close any open
  // menu/drawer when the route changes, without a cascading effect.
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const elevated = scrolled || openMenu !== null;

  // Mirror the coordinator's hidden state onto `inert` so the lifted header is
  // fully removed from the tab order and the a11y tree while it is off-screen
  // (CSS handles the visual lift; `inert` handles focus + assistive tech).
  useEffect(() => {
    const node = headerRef.current;
    if (node) {
      node.inert = headerHidden;
    }
  }, [headerHidden]);

  return (
    <header
      aria-hidden={headerHidden || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-[400] h-[var(--ss-layout-header)] border-b ss-transition-panel",
        elevated
          ? "border-[color:var(--ss-v2-header-border-strong)] bg-[var(--ss-v2-header-surface-scroll)] shadow-[var(--ss-v2-header-shadow)]"
          : "border-[color:var(--ss-v2-header-border)] bg-[var(--ss-v2-header-surface)]",
      )}
      data-scrolled={scrolled}
      data-site-header=""
      ref={headerRef}
    >
      <Container className="flex h-full items-center gap-6" size="wide">
        <BrandLockup
          className="mr-1"
          emblemClassName="h-[3.25rem] w-auto lg:h-[4.75rem]"
          tone="onLight"
        />
        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-1">
            <HeaderMenu
              currentPath={location.pathname}
              isOpen={openMenu === "services"}
              menu={SERVICES_MENU}
              onClose={() => setOpenMenu(null)}
              onOpen={() => setOpenMenu("services")}
              variant="cards"
            />
            <HeaderMenu
              currentPath={location.pathname}
              isOpen={openMenu === "industries"}
              menu={INDUSTRIES_MENU}
              onClose={() => setOpenMenu(null)}
              onOpen={() => setOpenMenu("industries")}
              variant="columns"
            />
            {PRIMARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  className={cn(
                    TRIGGER_CLASS,
                    location.pathname === link.href &&
                      "text-[color:var(--ss-v2-header-accent)]",
                  )}
                  data-active={location.pathname === link.href || undefined}
                  data-nav-item=""
                  to={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link className={cn(ctaClass, "hidden lg:inline-flex")} to={PRIMARY_CTA.href}>
            {PRIMARY_CTA.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <button
            aria-controls="mobile-nav"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            className="ss-focus-ring grid size-11 place-items-center rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-header-border-strong)] text-[color:var(--ss-v2-header-text)] ss-transition-interactive hover:bg-[var(--ss-v2-header-hover)] lg:hidden"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </Container>
      {pendingIndicator ? (
        <div className="absolute inset-x-0 bottom-0">{pendingIndicator}</div>
      ) : null}
      <MobileDrawer
        currentPath={location.pathname}
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
      />
    </header>
  );
}
