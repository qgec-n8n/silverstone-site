/**
 * Floating demo-preview launcher: a compact icon + invitation bubble that
 * expands into a short list of the site's reserved demo-preview sections.
 * Deep-links use the same shared scroll mechanism as every "Book a discovery
 * call" CTA (`href="path#section-id"`, resolved by `useDeepLinkScroll`), but
 * via `Link` rather than a native anchor: each target is registered in
 * `GATE_FREE_DEEP_LINKS` (see `~/data/gate-free-routes`), so the client-side
 * navigation skips the destination's loader/Aether-intro/explore-hero gate
 * entirely and lands straight on the demo section — never behind a gate
 * mid-intro.
 *
 * Deliberately not shaped like a support-chat widget: no message thread, no
 * input field, no avatar — a short menu that expands upward from the icon.
 * Hidden on gate-free routes (Book) so the single-intent booking page stays
 * distraction-free.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { Sparkles, X } from "~/components/icons/lucide";
import { DEMO_REGISTRY } from "~/data/demo-registry";
import { isGateFreeRoute } from "~/data/gate-free-routes";
import "~/styles/visual/home-v2.css";

export function DemosLauncher() {
  const location = useLocation();
  const { homepageBodyActive, routeBodyActive } = useAppExperience();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const closeAndRestoreFocus = () => {
    setOpen(false);
    fabRef.current?.focus();
  };

  // Close the panel on navigation by adjusting state during render (same
  // pattern as AppExperienceProvider) rather than an effect that would
  // trigger an extra cascading render.
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAndRestoreFocus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const node = rootRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (isGateFreeRoute(location.pathname)) {
    return null;
  }

  // Only ever floats over the Particles BG body — never over the Aether
  // Flow hero (loading/intro/opening/closing), on the homepage or any other
  // route experience.
  if (!homepageBodyActive && !routeBodyActive) {
    return null;
  }

  return (
    <div className="ss-demo-launcher" data-open={open ? "true" : "false"} ref={rootRef}>
      {open ? (
        <div
          className="ss-demo-launcher__panel"
          id={panelId}
          role="menu"
          aria-label="Demo previews"
        >
          <div className="ss-demo-launcher__panel-head">
            <span>Demo previews</span>
            <button
              type="button"
              className="ss-demo-launcher__close"
              onClick={closeAndRestoreFocus}
              aria-label="Close demo previews"
              ref={closeButtonRef}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <ul className="ss-demo-launcher__list">
            {DEMO_REGISTRY.map((demo) => (
              <li key={demo.id}>
                <Link
                  className="ss-demo-launcher__item"
                  to={demo.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <span className="ss-demo-launcher__item-label">{demo.label}</span>
                  <span className="ss-demo-launcher__item-desc">
                    {demo.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <span className="ss-demo-launcher__bubble" aria-hidden="true">
          Preview a reserved demo
        </span>
      )}
      <button
        type="button"
        className="ss-demo-launcher__fab"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close demo previews" : "See demo previews"}
        onClick={() => setOpen((value) => !value)}
        ref={fabRef}
      >
        {open ? <X aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
      </button>
    </div>
  );
}
