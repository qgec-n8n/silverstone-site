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
    body: "Calls, messages, bookings and follow-up stop living in separate apps and disconnected inboxes. Silverstone unifies every channel into a single operating surface your team can actually see, search and steer. Nothing falls between tools, no enquiry waits for someone to notice it, and the full history of each customer travels with the conversation. The result is a calmer day: fewer tabs, fewer handovers, and one source of truth for everyone who touches the work.",
    image: "/home-v2/story-operating-surface.png",
    alt: "Layered translucent control planes glowing in dark space, representing one unified operating surface.",
    align: "right",
  },
  {
    id: "voice-signal",
    eyebrow: "Always answering",
    title: "Conversations that never sleep",
    body: "Voice and chat agents pick up the moment a customer reaches out — answering, qualifying and booking in seconds, day or night. Every conversation is greeted in your brand's tone, the right questions get asked, and the appointment lands in your calendar before a lead has time to cool. After hours, weekends and peak rushes are covered without overtime, voicemail backlogs or missed-call regret. Your team starts the day with qualified appointments instead of a list of people to chase.",
    image: "/home-v2/story-voice-signal.png",
    alt: "Luminous concentric waveform radiating from a glowing orb, representing always-on voice automation.",
    align: "left",
  },
  {
    id: "human-loop",
    eyebrow: "In control",
    title: "A human always in the signal",
    body: "Automation handles the volume; your team keeps the judgement. Every workflow has clear review points, approval gates and an audit trail, so a person stays accountable for the decisions that matter. You choose what runs autonomously and what waits for a human nod, and you can move those boundaries as trust grows. It is leverage without losing oversight — speed where it is safe, and a human firmly in the signal everywhere it counts.",
    image: "/home-v2/story-human-loop.png",
    alt: "A lone figure contemplating a softly glowing field of data nodes, representing human-in-the-loop control.",
    align: "right",
  },
] as const;
