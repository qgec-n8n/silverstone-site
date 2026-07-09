/**
 * ElevenLabs live demo agent configuration.
 *
 * The agent id below is the *public* identifier of the Silverstone Website
 * Receptionist Demo ("Grace") — the same value ElevenLabs ships in its
 * public widget embed snippet, so it is safe to serve to browsers. It is the
 * only ElevenLabs credential the client ever sees: the agent is public, the
 * connection is negotiated directly with ElevenLabs over WebRTC, and no API
 * key exists anywhere in this codebase (enforced by
 * tests/unit/service-assets.test.ts).
 */
export const ELEVENLABS_DEMO_AGENT_ID = "agent_1501kwz207rjefgsck2vrxkk7tbk";

/** Customer-facing name the agent introduces itself with. */
export const ELEVENLABS_DEMO_AGENT_NAME = "Grace";

/**
 * Shared disclosure shown beside every live surface. Honest by design: the
 * demo is real, the processing is disclosed, and visitors are warned off
 * sharing sensitive details.
 */
export const ELEVENLABS_DEMO_DISCLOSURE =
  "You are speaking with Grace, Silverstone's live demo AI receptionist. Audio is " +
  "processed by ElevenLabs in real time to generate responses and the transcript. " +
  "It's a public demo — please don't share personal or sensitive details.";
