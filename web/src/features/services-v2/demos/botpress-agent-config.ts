/**
 * Botpress live messaging demo configuration.
 *
 * The client id below is the *public* identifier of the Silverstone Website
 * Messaging Receptionist Demo ("Sam") — the same value Botpress publishes in
 * its webchat embed snippet, so it is safe to serve to browsers. It is the
 * only Botpress credential the client ever sees: the browser talks to the
 * Botpress webchat API directly and no Personal Access Token or secret
 * exists anywhere in this codebase.
 */
export const BOTPRESS_DEMO_CLIENT_ID = "47398b5a-952a-4465-91b3-8101be9e3029";

/** Customer-facing name the agent introduces itself with. */
export const BOTPRESS_DEMO_AGENT_NAME = "Sam";

/**
 * Shared disclosure shown beneath the messaging console. Honest by design:
 * the demo is real, the processing is disclosed, and visitors are warned off
 * sharing sensitive details — same contract as the Grace voice demo.
 */
export const BOTPRESS_DEMO_DISCLOSURE =
  "Sam is an AI receptionist. Botpress processes messages in real time. Public demo — don't share personal or sensitive information.";

/**
 * Sam's scripted opening line. Rendered (and prerendered) locally so the
 * thread is never empty and no Botpress conversation is created until the
 * visitor actually sends something.
 */
export const SAM_OPENING_MESSAGE =
  "Hi, I'm Sam — Silverstone AI's messaging receptionist. I handle written " +
  "inquiries the way Grace handles calls: instantly, in your brand's words, " +
  "any hour of the day. Pick a question below or write your own.";

/**
 * The four selectable conversation starters shown after Sam's opening
 * message. Exact wording is owner-approved — do not edit casually.
 */
export const SAM_CONVERSATION_STARTERS: readonly string[] = [
  "What can you do for a business like mine?",
  "What does Silverstone AI actually do?",
  "How's your day going, Sam?",
  "Can you spot where my business is losing time or leads?",
];
