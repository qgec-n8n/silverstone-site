# Original Demo System Opportunities v1

**Purpose:** Define original demonstration and conversion opportunities for Silverstone without reproducing Agentive Labs or 21st.dev code, wording, composition, assets or protected creative expression.  
**Downstream consumers:** D-01 and I-01.  
**Implementation:** Out of scope for this pack.

## Design principles

1. **Demonstrate operational behaviour, not decorative technology.** A visitor should understand what enters the system, what decisions occur, what is handed to a human and what business outcome follows.
2. **Keep proof separate from promise.** Simulations must be visibly labelled as demonstrations unless they are connected to a real sandbox.
3. **Build progressive enhancement first.** Every demonstration requires a meaningful static representation before animation, WebGL or advanced interaction is added.
4. **Make control explicit.** Motion must stop under reduced-motion preferences, keyboard operation must be complete, and any modal must follow the WAI dialog pattern. [T3–T5, T11]
5. **Preserve conversion continuity.** A demonstration should end with a context-aware CTA rather than trapping the prospect in an isolated visual experience.

## Opportunity 1 — Enquiry-to-booking workflow simulator

**Original concept:** A visitor selects an enquiry source and use case, then steps through a deterministic simulation showing qualification, consent, scheduling, confirmation and staff escalation.

- **Primary page:** Home, with deeper versions on service and industry pages.
- **Conversion role:** Converts abstract automation claims into a visible process and reveals handoff boundaries.
- **Default mode:** Static, vertically readable sequence with optional “play through” enhancement.
- **Accessibility:** Step controls are semantic buttons; current step is announced; no auto-advance by default; reduced motion switches transitions to instant state changes. [T4–T5, T11]
- **Performance:** No WebGL required. Use CSS/SVG only.
- **Originality boundary:** Do not reuse Agentive's wording, diagrams, section order, service examples or graphics. The workflow logic must come from Silverstone's own operating model.

## Opportunity 2 — Existing-tools integration map

**Original concept:** A hub-and-spoke or layered data-flow map showing categories such as enquiry sources, communication, scheduling, payments, CRM and reporting. Each node reveals support status and data exchanged.

- **Primary pages:** Home, platform/service overview and industry pages.
- **Conversion role:** Reduces switching anxiety and exposes implementation realism.
- **Interaction:** Click/focus a tool category to reveal “reads”, “writes”, “human approval” and “custom assessment” states.
- **Accessibility:** The visual map is paired with a complete semantic list/table. Pointer-only connections are prohibited.
- **Performance:** SVG or HTML; no continuously animated canvas.
- **Governance:** Do not imply official partnerships without evidence. Logos require permission and trademark-compliant use.

## Opportunity 3 — AI receptionist conversation lab

**Original concept:** A scripted demonstration with selectable scenarios such as new enquiry, reschedule, unsuitable request, emergency escalation and consent refusal. The visitor can inspect why each response or handoff occurs.

- **Primary pages:** Receptionist service page and healthcare/allied-health industry pages.
- **Conversion role:** Demonstrates boundaries, tone control and escalation rather than merely showing a chat window.
- **Truthfulness:** Clearly label as a scripted or sandbox demonstration.
- **Accessibility:** Complete keyboard path, transcript alternative, no typing animation under reduced motion, and visible pause/restart controls for any auto-play. [T4–T5, T11]
- **Risk control:** Use synthetic data only; never accept real health information in a marketing demo.

## Opportunity 4 — Before/after operating-day comparison

**Original concept:** A side-by-side timeline comparing a manual day with an automated day across response time, interruptions, follow-up and reporting.

- **Primary pages:** Home and industry pages.
- **Conversion role:** Helps prospects recognize operational waste without relying on unverified numerical claims.
- **Evidence:** Use qualitative labels until Silverstone has audited customer data. Quantitative claims require source notes and methodology.
- **Accessibility:** Avoid horizontal-only scrolling. Provide a stacked mobile view and a text summary.

## Opportunity 5 — Automation fit diagnostic

**Original concept:** A short decision tree that scores opportunity readiness across enquiry volume, response delay, repetition, data structure, calendar complexity and escalation needs.

- **Primary pages:** Home lower funnel and service pages.
- **Conversion role:** Self-qualifies prospects and produces a tailored consultation brief.
- **Data minimisation:** Ask for operational ranges, not confidential business or patient data.
- **Interaction:** Inline form rather than a full-screen modal on mobile. Save progress locally only when disclosed.
- **Outcome:** Present a non-deceptive recommendation such as “strong fit”, “requires process cleanup” or “human review needed”.

## Opportunity 6 — Deployment and safeguards explorer

**Original concept:** A layered explanation of data sources, model/automation steps, human checkpoints, logging, retention and fallback.

- **Primary pages:** Service, security/trust and regulated-industry pages.
- **Conversion role:** Addresses objections that a visual hero cannot answer.
- **Accessibility:** Expand/collapse controls must expose state with `aria-expanded`; all content remains available without animation.
- **Originality:** Use Silverstone's own architecture and verified controls only.

## Opportunity 7 — Service outcome evidence cards

**Original concept:** Evidence cards that distinguish live client result, internal benchmark, illustrative scenario and target outcome.

- **Primary pages:** Home, service and industry pages.
- **Conversion role:** Prevents proof inflation and increases trust.
- **Content model:** Metric, scope, period, baseline, source type and caveat.
- **Interaction:** Optional details disclosure; no carousel required.

## Opportunity 8 — Consultation handoff panel

**Original concept:** At the end of a demo, summarize the selected scenario and pass it into the booking/contact journey so the prospect does not repeat information.

- **Primary pages:** All demo-bearing pages.
- **Conversion role:** Turns exploration into a relevant call request.
- **Implementation guardrail:** Prefer an inline or dedicated page flow. A modal is acceptable only if focus is moved inside, contained, returned on close, dismissible with Escape and properly named. [T3]

## Page allocation matrix

| Page type | Recommended demonstration intensity | Best candidates | Avoid |
|---|---:|---|---|
| Home | Medium–high, one flagship demo | Workflow simulator; integration map; fit diagnostic | Multiple simultaneous shaders; competing auto-play experiences |
| Service | High relevance, lower visual spectacle | Conversation lab; safeguards explorer; tailored workflow | Generic hero-only animation with no service proof |
| Industry | Contextual and evidence-led | Scenario variants; operating-day comparison; integration subset | Reusing identical demo copy across industries |
| Booking/contact | Low | Consultation handoff summary; short context form | Full-screen animated hero; nested scroll area; modal over modal |
| Lower-traffic legal/trust pages | Minimal | Static architecture and evidence tables | WebGL, heavy motion, decorative interaction |

## Acceptance criteria for D-01

D-01 should select at most one flagship interactive demonstration for the homepage and define:

- user question answered;
- source of scenario logic;
- static fallback;
- keyboard path;
- reduced-motion behaviour;
- mobile reflow;
- performance budget;
- truthfulness label;
- conversion handoff;
- data collection boundary.

## Acceptance criteria for I-01

I-01 should not adopt a third-party component until:

- exact source and transitive dependencies are reviewed;
- component and dependency licences are recorded;
- accessible names, focus handling and keyboard behaviour pass tests;
- reduced-motion and non-WebGL fallbacks are implemented;
- mobile CPU/GPU, memory and thermal behaviour are profiled;
- bundle impact is measured in the Silverstone build;
- the visual expression has been redesigned rather than reskinned.

## Sources

- **[T3]** WAI-ARIA Authoring Practices, modal dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **[T4]** W3C WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- **[T5]** Motion accessibility guidance: https://motion.dev/docs/react-accessibility
- **[T11]** MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
