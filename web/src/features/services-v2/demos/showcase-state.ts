/**
 * Pure state model for the Web Design & Development live showcase
 * (`browser-showcase.tsx`). Kept free of React and the DOM so the invariants
 * that matter — one live demo at a time, activation as a one-time entry
 * action, clean idle/timeout transitions — are directly unit-testable.
 */

export type ShowcaseSiteId = "ownly-housing" | "aesthetics-by-clouds";

export type DemoPhase = "idle" | "connecting" | "live";

/**
 * Which presentation family the host page is currently in. Derived from the
 * same media conditions the stylesheet uses, so the embedded site and the
 * Silverstone layout always represent the same device class:
 *
 * - `desktop`  — ≥64rem with hover + fine pointer: pinned horizontal journey,
 *   live iframes render the demo's desktop layout.
 * - `tablet`   — ≥48rem otherwise (or ≥64rem coarse-pointer): touch-first
 *   snap rail, live iframes render the demo's tablet layout.
 * - `mobile`   — <48rem: captured phone previews only, no iframe ever mounts.
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
 * Inactivity window before a live demo returns to standby. There is no
 * booking-flow-scale idle convention in the repo (the only prior art is the
 * homepage's 20s ambient-particle idle, a far cheaper concern), so this is a
 * deliberate choice: the countdown only runs while the visitor's attention is
 * observably *outside* the demo — the timer suspends while the embedded page
 * holds focus and re-arms instead of firing while the pointer rests over the
 * frame (see `browser-showcase.tsx`) — so two minutes of genuinely
 * elsewhere-focused time is generous without keeping an unused live embed
 * (and its network activity) alive indefinitely.
 */
export const SHOWCASE_IDLE_TIMEOUT_MS = 120_000;

export type ShowcaseState = {
  /** The one site allowed to hold a live embed. */
  activeSite: ShowcaseSiteId | null;
  phase: DemoPhase;
  /** Keys the iframe: bumping it forces a clean remount (restart). */
  frameNonce: number;
  /** True when the last deactivation was the inactivity timeout. */
  idlePaused: boolean;
};

export const initialShowcaseState: ShowcaseState = {
  activeSite: null,
  phase: "idle",
  frameNonce: 0,
  idlePaused: false,
};

export type ShowcaseEvent =
  | { type: "activate"; site: ShowcaseSiteId }
  | { type: "loaded"; site: ShowcaseSiteId }
  | { type: "restart"; site: ShowcaseSiteId }
  | { type: "standby" }
  | { type: "idle-timeout" }
  /** The scene the journey/rail has moved to. */
  | { type: "scene-change"; site: ShowcaseSiteId }
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
      // Activating one site is also the exclusive-ownership handover: the
      // iframe is keyed by site, so a previously live site unmounts in the
      // same commit — never two live embeds. The nonce bump gives every
      // connect attempt a fresh identity (slow-connect hints key off it).
      return {
        ...state,
        activeSite: event.site,
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
      // embed; its poster remains for instant reactivation.
      return state.activeSite !== null && state.activeSite !== event.site
        ? deactivated(state, false)
        : state;
    case "device-class":
      // Mobile never mounts an iframe; desktop↔tablet keeps the session and
      // simply re-sizes the logical viewport.
      return event.deviceClass === "mobile" && state.activeSite !== null
        ? deactivated(state, false)
        : state;
  }
}
