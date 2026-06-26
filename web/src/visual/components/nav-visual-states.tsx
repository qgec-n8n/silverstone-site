import { useEffect, useId, useRef, useState } from "react";

import "~/styles/visual/visual.css";

import { PrimaryCta } from "~/visual/components/primary-cta";

const PRIMARY_LINKS = [
  { label: "How we work", href: "#how" },
  { label: "Insights", href: "#insights" },
  { label: "About", href: "#about" },
];

const SERVICE_LINKS = [
  { label: "Web", href: "#web" },
  { label: "App", href: "#app" },
  { label: "Content", href: "#content" },
  { label: "Voice agents", href: "#voice" },
  { label: "Receptionist", href: "#reception" },
  { label: "Automation", href: "#automation" },
];

const COMPACT_AT = 16;

/**
 * Sticky navigation with its visual states: it compacts 72→60px on scroll,
 * exposes a Services disclosure (Escape / outside-click to close), and a mobile
 * panel toggle. The disclosure is a real button with `aria-expanded`.
 */
export function NavVisualStates() {
  const [compact, setCompact] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const disclosureRef = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const mobileId = useId();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const node = disclosureRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen]);

  return (
    <header className="ss-nav" data-compact={compact ? "true" : "false"}>
      <div className="ss-nav__inner">
        <a className="ss-brand" href="#top">
          <span className="ss-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
              <circle
                cx={12}
                cy={12}
                r={8}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              />
              <circle cx={12} cy={12} r={2.6} fill="currentColor" />
            </svg>
          </span>
          Silverstone
        </a>

        <ul className="ss-nav__links">
          <li className="ss-nav__disclosure" ref={disclosureRef}>
            <button
              type="button"
              className="ss-nav__disclosure-btn"
              aria-expanded={servicesOpen}
              aria-controls={panelId}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services
              <svg
                className="ss-nav__disclosure-caret"
                viewBox="0 0 16 16"
                width={12}
                height={12}
                aria-hidden="true"
              >
                <path
                  d="M4 6 L8 10 L12 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {servicesOpen ? (
              <ul className="ss-nav__panel" id={panelId}>
                {SERVICE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          {PRIMARY_LINKS.map((link) => (
            <li key={link.href}>
              <a className="ss-nav__link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <PrimaryCta href="#book">Book a discovery call</PrimaryCta>

        <button
          type="button"
          className="ss-nav__mobile-toggle"
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="ss-sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
            <path
              d="M4 7 H20 M4 12 H20 M4 17 H20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <ul
          className="ss-nav__panel"
          id={mobileId}
          style={{ position: "static", margin: "0 1rem 1rem" }}
        >
          {[...SERVICE_LINKS, ...PRIMARY_LINKS].map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          {/* Booking action mirrors the prototype mobile panel so the primary
              conversion path stays reachable when the inline bar CTA is hidden
              (notably on small phones at <=23rem). */}
          <li>
            <a href="#book">Book a discovery call</a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
