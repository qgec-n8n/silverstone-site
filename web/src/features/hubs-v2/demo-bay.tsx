/**
 * /services hub — "Live Demo Systems" feature panel.
 *
 * One console-grade instrument panel sitting directly beneath the hub's trust
 * strip, linking to every live demo on the site. Sourced from `DEMO_REGISTRY`
 * (the same list the floating demos launcher reads), so adding or retiring a
 * demo updates the panel with no edit here — and because every registry href
 * is automatically in `GATE_FREE_DEEP_LINKS`, each pod lands straight on its
 * demo section instead of behind the destination route's loader/intro gate.
 *
 * Navigation uses react-router `Link`, never a native anchor: a full document
 * load would replay the destination's route gate and drop the visitor at the
 * top of the page rather than on the demo.
 *
 * Each pod carries its own custom signature animation (waveform, thread,
 * pulse rings, build frame) so the four destinations read as four distinct
 * instruments rather than one repeated card. All of it is CSS keyframes on
 * transform/opacity — compositor-friendly, no per-frame JS — and every loop
 * is disabled under `prefers-reduced-motion`.
 */
import type { CSSProperties } from "react";
import { Link } from "react-router";

import {
  ArrowUpRight,
  AudioLines,
  MessageSquare,
  Mic,
  Monitor,
  type LucideIcon,
} from "~/components/icons/lucide";
import { DEMO_REGISTRY } from "~/data/demo-registry";
import {
  BorderBeam,
  PanelReveal,
  RichText,
} from "~/features/services-v2/components/primitives";

type SignatureVariant = "waveform" | "thread" | "pulse" | "build";

type BayArt = {
  /** Interaction channel, not the discipline — the four routes overlap. */
  kicker: string;
  icon: LucideIcon;
  signature: SignatureVariant;
  accentFrom: string;
  accentTo: string;
};

/**
 * A deliberate left-to-right spectrum sweep (aqua → azure → ultraviolet →
 * orchid) rather than each destination route's own accent pair: the seven
 * discipline cards below already skim as a spectrum of route colors, and
 * repeating that trick here would flatten the two blocks into one. The bay
 * reads instead as a single machined object with four differently-lit bays.
 */
const BAY_ART: Record<string, BayArt> = {
  "grace-receptionist": {
    kicker: "Phone · Live voice",
    icon: Mic,
    signature: "waveform",
    accentFrom: "#7fe9f0",
    accentTo: "#22d3ee",
  },
  "sam-receptionist": {
    kicker: "Chat · Live messaging",
    icon: MessageSquare,
    signature: "thread",
    accentFrom: "#38bdf8",
    accentTo: "#5b62f0",
  },
  "ai-voice-agents": {
    kicker: "Agent · Live call",
    icon: AudioLines,
    signature: "pulse",
    accentFrom: "#7c5cff",
    accentTo: "#a97cc0",
  },
  "web-design": {
    kicker: "Web · Live builds",
    icon: Monitor,
    signature: "build",
    accentFrom: "#c47bd6",
    accentTo: "#22d3ee",
  },
};

const FALLBACK_ART: BayArt = {
  kicker: "Live system",
  icon: AudioLines,
  signature: "pulse",
  accentFrom: "#22d3ee",
  accentTo: "#7c5cff",
};

/** Symmetrical envelope so the resting waveform reads as a voice, not noise. */
const WAVE_HEIGHTS = [10, 18, 30, 22, 38, 26, 44, 34, 44, 26, 38, 22, 30, 18, 10];

function indexStyle(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

function WaveformSignature() {
  return (
    <svg className="ss-hub2-bay__sig" viewBox="0 0 128 56" aria-hidden="true">
      {WAVE_HEIGHTS.map((height, index) => (
        <rect
          className="ss-hub2-bay__wave"
          key={index}
          x={8 + index * 8}
          y={(56 - height) / 2}
          width="3.2"
          height={height}
          rx="1.6"
          style={indexStyle(index)}
        />
      ))}
    </svg>
  );
}

function ThreadSignature() {
  return (
    <svg className="ss-hub2-bay__sig" viewBox="0 0 128 56" aria-hidden="true">
      <rect className="ss-hub2-bay__bubble" x="8" y="9" width="62" height="16" rx="8" />
      <rect
        className="ss-hub2-bay__bubble"
        data-side="out"
        x="52"
        y="31"
        width="68"
        height="16"
        rx="8"
      />
      {[66, 76, 86].map((cx, index) => (
        <circle
          className="ss-hub2-bay__dot"
          key={cx}
          cx={cx}
          cy="39"
          r="2.6"
          style={indexStyle(index)}
        />
      ))}
    </svg>
  );
}

function PulseSignature() {
  return (
    <svg className="ss-hub2-bay__sig" viewBox="0 0 128 56" aria-hidden="true">
      {/* Static orbit: the pulses spend most of the loop faded out, so without
          a resting mark the plate would read as empty between transmissions. */}
      <circle className="ss-hub2-bay__orbit" cx="64" cy="28" r="19" />
      {[0, 1, 2].map((index) => (
        <circle
          className="ss-hub2-bay__ring"
          key={index}
          cx="64"
          cy="28"
          r="10"
          style={indexStyle(index)}
        />
      ))}
      <circle className="ss-hub2-bay__core" cx="64" cy="28" r="6.5" />
    </svg>
  );
}

function BuildSignature() {
  return (
    <svg className="ss-hub2-bay__sig" viewBox="0 0 128 56" aria-hidden="true">
      <rect
        className="ss-hub2-bay__chrome"
        x="10"
        y="6"
        width="108"
        height="44"
        rx="5"
      />
      <path className="ss-hub2-bay__chrome" d="M10 18h108" />
      {[17.5, 24.5, 31.5].map((cx) => (
        <circle className="ss-hub2-bay__chrome-dot" key={cx} cx={cx} cy="12" r="1.7" />
      ))}
      <rect className="ss-hub2-bay__tile" x="84" y="25" width="26" height="19" rx="3" />
      {[
        { width: 34, y: 25 },
        { width: 52, y: 33 },
        { width: 26, y: 41 },
      ].map((bar, index) => (
        <rect
          className="ss-hub2-bay__bar"
          key={bar.y}
          x="18"
          y={bar.y}
          width={bar.width}
          height="4"
          rx="2"
          style={indexStyle(index)}
        />
      ))}
      <rect className="ss-hub2-bay__scan" x="12" y="20" width="2" height="28" rx="1" />
    </svg>
  );
}

function BaySignature({ variant }: { variant: SignatureVariant }) {
  if (variant === "waveform") {
    return <WaveformSignature />;
  }
  if (variant === "thread") {
    return <ThreadSignature />;
  }
  if (variant === "build") {
    return <BuildSignature />;
  }
  return <PulseSignature />;
}

const ONLINE_COUNT = String(DEMO_REGISTRY.length).padStart(2, "0");

export function DemoBay() {
  return (
    <section
      className="ss-srv2-section ss-hub2-bay-section"
      aria-labelledby="hub2-demos"
    >
      <div className="ss-srv2__container">
        <PanelReveal className="ss-hub2-bay ss-srv2-beam-border">
          <span className="ss-hub2-bay__aura" aria-hidden="true" />
          <span className="ss-hub2-bay__rail" aria-hidden="true" />
          <span className="ss-hub2-bay__corners" aria-hidden="true">
            <span data-pos="tl" />
            <span data-pos="tr" />
            <span data-pos="bl" />
            <span data-pos="br" />
          </span>

          <div className="ss-hub2-bay__status">
            <span className="ss-hub2-bay__status-id">
              <span className="ss-hub2-bay__status-dot" aria-hidden="true" />
              Live demo systems
            </span>
            <span className="ss-hub2-bay__status-live">
              <span className="ss-hub2-bay__status-live-dot" aria-hidden="true" />
              {ONLINE_COUNT} online
            </span>
          </div>

          <div className="ss-hub2-bay__intro">
            <h2 className="ss-hub2-bay__title" id="hub2-demos">
              <RichText text="Don't imagine the system. *Talk to it.*" />
            </h2>
            <p className="ss-hub2-bay__lead">
              Four working systems are running on this site right now — the same
              architecture we deploy for clients, opened up for you. Call the
              receptionist, message the assistant, speak with a voice agent, or step
              inside two finished production builds. No sign-up, no sales call, no
              waiting.
            </p>
          </div>

          <ul className="ss-hub2-bay__grid">
            {DEMO_REGISTRY.map((demo, index) => {
              const art = BAY_ART[demo.id] ?? FALLBACK_ART;
              const Icon = art.icon;
              return (
                <li key={demo.id}>
                  <Link
                    className="ss-focus-ring ss-hub2-bay__pod"
                    to={demo.href}
                    style={
                      {
                        "--bay-accent": art.accentFrom,
                        "--bay-accent-2": art.accentTo,
                        "--pod": index,
                      } as CSSProperties
                    }
                  >
                    <span className="ss-hub2-bay__pod-stage" aria-hidden="true">
                      <BaySignature variant={art.signature} />
                      <span className="ss-hub2-bay__pod-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="ss-hub2-bay__pod-kicker">
                      <Icon aria-hidden="true" />
                      {art.kicker}
                    </span>
                    <span className="ss-hub2-bay__pod-label">{demo.label}</span>
                    <span className="ss-hub2-bay__pod-desc">{demo.description}</span>
                    <span className="ss-hub2-bay__pod-cta">
                      Launch
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <BorderBeam />
        </PanelReveal>
      </div>
    </section>
  );
}
