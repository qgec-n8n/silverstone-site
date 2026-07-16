/**
 * Pure state model for the Web Design & Development live showcase
 * (`browser-showcase.tsx`). Kept free of React and the DOM so the invariants
 * that matter — one live demo at a time across BOTH surfaces (the browser
 * window embed and the phone's mobile embed), activation as a one-time entry
 * action, clean idle/timeout/section-exit transitions — are directly
 * unit-testable.
 */

export type ShowcaseSiteId = "ownly-housing" | "aesthetics-by-clouds";

export type DemoPhase = "idle" | "connecting" | "live";

/**
 * Which device surface holds the live demo: the desktop browser window or the
 * phone — both are interactive embeds of the same site at different logical
 * viewports. Only meaningful while `activeSite` is non-null.
 */
export type ShowcaseSurface = "window" | "phone";

/**
 * Which presentation family the host page is currently in. Derived from the
 * same media conditions the stylesheet uses, so the embedded site and the
 * Silverstone layout always represent the same device class:
 *
 * - `desktop`  — ≥64rem with hover + fine pointer: full composed stage,
 *   live iframes render the demo's desktop layout.
 * - `tablet`   — ≥48rem otherwise (or ≥64rem coarse-pointer): same composed
 *   stage, live iframes render the demo's tablet layout.
 * - `mobile`   — <48rem: captured phone previews only, no iframe ever mounts;
 *   the phone links out to the live site instead.
 */
export type ShowcaseDeviceClass = "desktop" | "tablet" | "mobile";

/**
 * Logical CSS-pixel viewport given to a live iframe, scaled down to fit its
 * visible frame. Both demo sites use Tailwind-style breakpoints (desktop from
 * 64rem/1024px, tablet band 48–64rem), so these land safely inside the
 * intended band whatever the visible frame measures — the embedded breakpoint
 * no longer depends on the host container's width.
 */
export const EMBED_VIEWPORT_WIDTH: Record<
  Exclude<ShowcaseDeviceClass, "mobile">,
  number
> = {
  desktop: 1440,
  tablet: 834,
};

/**
 * Logical CSS-pixel viewport for the PHONE surface's live embed. Both demo
 * sites treat everything below 768px as their phone band, and the captured
 * posters are 390 wide — so the embed renders the exact mobile build the
 * posters promise, scaled to sit precisely inside the phone screen.
 */
export const PHONE_EMBED_VIEWPORT_WIDTH = 390;

/**
 * Inactivity window before a live embed returns to standby — the same rule on
 * both surfaces (browser window and phone). The countdown only runs while the
 * visitor's attention is observably *outside* the demo — the timer suspends
 * while the embedded page holds focus and re-arms instead of firing while the
 * pointer rests over the frame (see `browser-showcase.tsx`) — so two minutes
 * of genuinely elsewhere-focused time is generous without keeping an unused
 * live embed (and its network activity) alive indefinitely.
 */
export const SHOWCASE_IDLE_TIMEOUT_MS = 120_000;

export type ShowcaseState = {
  /** The one site allowed to hold a live demo. */
  activeSite: ShowcaseSiteId | null;
  /** The device surface that live demo runs on. */
  surface: ShowcaseSurface;
  phase: DemoPhase;
  /** Keys the iframe: bumping it forces a clean remount (restart). */
  frameNonce: number;
  /** True when the last deactivation was the inactivity timeout. */
  idlePaused: boolean;
};

export const initialShowcaseState: ShowcaseState = {
  activeSite: null,
  surface: "window",
  phase: "idle",
  frameNonce: 0,
  idlePaused: false,
};

export type ShowcaseEvent =
  | { type: "activate"; site: ShowcaseSiteId; surface: ShowcaseSurface }
  | { type: "loaded"; site: ShowcaseSiteId }
  | { type: "restart"; site: ShowcaseSiteId }
  | { type: "standby" }
  | { type: "idle-timeout" }
  /** The scene the project switcher has moved to. */
  | { type: "scene-change"; site: ShowcaseSiteId }
  /** A scene's device toggle brought the given surface to the foreground. */
  | { type: "view-change"; site: ShowcaseSiteId; focus: ShowcaseSurface }
  /** The showcase section left the viewport (or the tab was hidden). */
  | { type: "section-exit" }
  | { type: "device-class"; deviceClass: ShowcaseDeviceClass };

const deactivated = (state: ShowcaseState, idlePaused: boolean): ShowcaseState => ({
  ...state,
  activeSite: null,
  phase: "idle",
  idlePaused,
});

export function showcaseReducer(
  state: ShowcaseState,
  event: ShowcaseEvent,
): ShowcaseState {
  switch (event.type) {
    case "activate":
      // Activating one demo is also the exclusive-ownership handover: the
      // iframe is keyed by site and surface, so a previously live demo —
      // whichever surface it ran on — unmounts in the same commit; never two
      // live embeds. The nonce bump gives every connect attempt a fresh
      // identity (slow-connect hints key off it).
      return {
        ...state,
        activeSite: event.site,
        surface: event.surface,
        phase: "connecting",
        frameNonce: state.frameNonce + 1,
        idlePaused: false,
      };
    case "loaded":
      return state.activeSite === event.site && state.phase === "connecting"
        ? { ...state, phase: "live" }
        : state;
    case "restart":
      return state.activeSite === event.site
        ? { ...state, phase: "connecting", frameNonce: state.frameNonce + 1 }
        : state;
    case "standby":
      return state.activeSite === null ? state : deactivated(state, false);
    case "idle-timeout":
      return state.activeSite === null ? state : deactivated(state, true);
    case "scene-change":
      // Moving the journey to the other project releases an off-screen live
      // demo; its poster remains for instant reactivation.
      return state.activeSite !== null && state.activeSite !== event.site
        ? deactivated(state, false)
        : state;
    case "view-change":
      // Sending the live surface to the background is a deactivation: a live
      // embed must never keep running (or intercept input) behind the
      // foreground device.
      return state.activeSite === event.site && state.surface !== event.focus
        ? deactivated(state, false)
        : state;
    case "section-exit":
      // Leaving the section stops all playback; returning never auto-resumes.
      return state.activeSite === null ? state : deactivated(state, false);
    case "device-class":
      // Mobile never mounts an iframe; desktop↔tablet keeps the session and
      // simply re-sizes the logical viewport.
      return event.deviceClass === "mobile" && state.activeSite !== null
        ? deactivated(state, false)
        : state;
  }
}
