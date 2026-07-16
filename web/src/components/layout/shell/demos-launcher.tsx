/**
 * Floating demo-preview launcher: a compact icon + invitation bubble that
 * expands into a short list of the site's demo sections — the two live
 * ElevenLabs voice demos and the reserved web-design preview.
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
 * Article routes are gate-free but deliberately keep the launcher: readers
 * should have the same immediate demo access as visitors on every other
 * content page.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import {
  Bot,
  MessageSquare,
  Mic,
  PencilRuler,
  Sparkles,
  X,
  type LucideIcon,
} from "~/components/icons/lucide";
import { DEMO_REGISTRY } from "~/data/demo-registry";
import { isGateFreeRoute } from "~/data/gate-free-routes";
import "~/styles/visual/home-v2.css";

const DEMO_ICONS: Record<string, LucideIcon> = {
  "grace-receptionist": Mic,
  "sam-receptionist": MessageSquare,
  "ai-voice-agents": Bot,
  "web-design": PencilRuler,
};

export function DemosLauncher() {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
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

  if (
    location.pathname === "/book" ||
    (isGateFreeRoute(location.pathname) && !location.pathname.startsWith("/blog/"))
  ) {
    return null;
  }

  // Only ever floats over the Particles BG body — never over the loader or
  // the Aether Flow hero (loading/intro/opening/closing). `headerHidden` is
  // false exactly once the gate has fully cleared, including gate-free
  // deep-link navigations (the launcher's own demo links), where no route
  // experience plays at all — the launcher must survive those relocations
  // rather than vanish on arrival.
  if (headerHidden) {
    return null;
  }

  return (
    <div className="ss-demo-launcher" data-open={open ? "true" : "false"} ref={rootRef}>
      {open ? (
        <div
          className="ss-demo-launcher__panel"
          id={panelId}
          role="menu"
          aria-label="Demos"
        >
          <div className="ss-demo-launcher__panel-head">
            <div className="ss-demo-launcher__panel-copy">
              <span>Live systems · 04 online</span>
              <strong>Meet the agents. Test the work.</strong>
              <p>Call, message or explore — every experience opens at the demo.</p>
            </div>
            <button
              type="button"
              className="ss-demo-launcher__close"
              onClick={closeAndRestoreFocus}
              aria-label="Close demos"
              ref={closeButtonRef}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <ul className="ss-demo-launcher__list">
            {DEMO_REGISTRY.map((demo) => {
              const Icon = DEMO_ICONS[demo.id] ?? Sparkles;
              return (
                <li key={demo.id}>
                  <Link
                    className="ss-demo-launcher__item"
                    to={demo.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <span className="ss-demo-launcher__item-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="ss-demo-launcher__item-copy">
                      <span className="ss-demo-launcher__item-label">{demo.label}</span>
                      <span className="ss-demo-launcher__item-desc">
                        {demo.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <span className="ss-demo-launcher__bubble" aria-hidden="true">
          Try a live demo
        </span>
      )}
      <button
        type="button"
        className="ss-demo-launcher__fab"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close demos" : "See demos"}
        onClick={() => setOpen((value) => !value)}
        ref={fabRef}
      >
        {open ? <X aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
      </button>
    </div>
  );
}
