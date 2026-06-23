# Silverstone tools carousel and demo system v1

## 1. “Work with your existing tools” — Connector Constellation

### Purpose
Reduce switching anxiety without implying unsupported integrations. The module explains compatibility states and the questions required before implementation.

### Information model
Each approved tool record contains:
- display name;
- category;
- logo asset and rights status;
- compatibility state: **commonly supported**, **requires assessment**, or **custom connector**;
- connection method label only when verified;
- data direction: in, out, two-way or unknown;
- human owner;
- limitation note;
- related services.

No logo appears until brand-use permission and integration relevance are confirmed.

### Desktop composition
A 12-column section: four-column explanation and eight-column native rail. Show approximately 3.5–4.5 cards depending on width. Cards are 240–280px wide and use one icon/logo, state label, short explanation and “What this means” disclosure.

### Mobile composition
One full card plus a visible edge of the next card. Previous/next controls remain 44px minimum. Reduced motion and 400% zoom use a single-column wrapped list.

### Interaction
- category filter buttons: Scheduling, CRM, Email, Payments, Documents, Messaging, Other;
- native horizontal scrolling and optional CSS snap;
- previous/next controls move one logical group;
- no autoplay or infinite cloning;
- status text announces active category and result count;
- focus is never moved by filtering unless the focused item is removed, in which case focus returns to the filter group.

### Visual language
Tool cards connect to a central Silverstone “workflow layer” only in a static explanatory diagram below the rail. Do not place every logo in an orbit. The diagram explicitly distinguishes configuration, API connection and custom work.

## 2. Demo framework

Every demo uses one shared shell:
1. title and purpose;
2. static scenario summary;
3. Start, Pause where temporal, Reset;
4. stage;
5. event log/status text;
6. “What this demonstrates / does not demonstrate” disclosure;
7. fallback static diagram.

Demos use synthetic names/data and deterministic paths. They must never simulate a real client result or claim live integration.

## 3. Home demo — Enquiry to handoff

Scenario: a prospective customer asks a practical question and wants a call. Steps: capture → approved answer check → minimum details → scheduling option → human handoff. An exception can be selected to show immediate staff routing.

## 4. Web demo — Conversion path mapper

User chooses one audience, primary action and proof type. The demo rearranges a synthetic page outline and produces a textual journey summary. It does not predict conversion rate, ranking or revenue.

## 5. App demo — First-release state map

User selects a core problem and two roles. The demo shows the smallest useful flow and defers nonessential features to a roadmap. It does not estimate cost or delivery time.

## 6. Voice demo — Defined call flow

A synthetic call transcript moves through disclosure, intent, information capture, approved action and handoff. Audio is optional; transcript is primary. No voice impersonation or claim of human equivalence.

## 7. Receptionist demo — Front-desk routing

User chooses web, phone or message and one enquiry type. The console shows answer, booking, message or person. Sensitive/urgent scenarios cannot be automated in the demo.

## 8. Content demo — Governed repurposing plan

User selects an approved source, audience and channels. The demo outputs a content plan and review gates, not finished claims. It visibly blocks unsupported statistics, testimonials and regulated advice.

## 9. Automation demo — Exception-aware workflow

A synthetic lead/document/task flow runs through connected systems. One exception requires human approval. Retry, failure and owner states are visible. No autonomous high-impact decision is shown.

## 10. Industry workflow instruments

Industry pages reuse the shell but not identical visuals. Each stage uses the sector-specific sequence defined in `page-visual-concepts-v1.md`. The template requires:
- named input;
- approved rule;
- connected system placeholder;
- human escalation;
- safeguard statement;
- output/next action.

## 11. Demo performance budgets

| Item | Target | Ceiling |
|---|---:|---:|
| Shared demo shell | 12 KB gzip | 18 KB |
| Route-local scenario data/visual | 8 KB gzip | 15 KB |
| GSAP route-local addition, if not already shared | measure before use | total demo route ≤50 KB added |
| Initial route | demo not executed or hydrated until near viewport/interaction | no autoplay |
| Main-thread step | <16ms preferred | no reproducible >50ms task |

Prefer SVG, CSS and semantic HTML. Canvas is not required for any demo.

## 12. Accessibility acceptance

- Complete with keyboard only.
- Start/Reset labels are explicit.
- Current step and result are available as text.
- No essential meaning depends on colour, position or motion.
- Live regions announce discrete state changes only, not decorative progress.
- Reduced motion uses instant steps.
- At 320px and 400% zoom, controls precede the stage and no page-level horizontal overflow occurs.
- Static fallback preserves the complete explanation.
