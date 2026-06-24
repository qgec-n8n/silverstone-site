/**
 * Image-storytelling panels. Images are locally generated cinematic assets in
 * `web/public/home-v2/` (catalogued in `docs/silverstone-redesign/asset-registry.md`).
 */

export type StoryPanel = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Side the media sits on for desktop layout. */
  align: "left" | "right";
};

export const STORY_PANELS: readonly StoryPanel[] = [
  {
    id: "operating-surface",
    eyebrow: "One surface",
    title: "Every channel, one calm operating surface",
    body: "Calls, messages, bookings and follow-up stop living in separate apps. Silverstone unifies them into a single system you can actually see and steer.",
    image: "/home-v2/story-operating-surface.png",
    alt: "Layered translucent control planes glowing in dark space, representing one unified operating surface.",
    align: "right",
  },
  {
    id: "voice-signal",
    eyebrow: "Always answering",
    title: "Conversations that never sleep",
    body: "Voice and chat agents pick up the moment a customer reaches out — answering, qualifying and booking in seconds, so no enquiry slips through after hours.",
    image: "/home-v2/story-voice-signal.png",
    alt: "Luminous concentric waveform radiating from a glowing orb, representing always-on voice automation.",
    align: "left",
  },
  {
    id: "human-loop",
    eyebrow: "In control",
    title: "A human always in the signal",
    body: "Automation handles the volume; your team handles the judgement. Every workflow has review points, so you keep the final say on what matters.",
    image: "/home-v2/story-human-loop.png",
    alt: "A lone figure contemplating a softly glowing field of data nodes, representing human-in-the-loop control.",
    align: "right",
  },
] as const;
