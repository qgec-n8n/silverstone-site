# Agentive Labs Observation Audit v1

**Research date:** 22 June 2026  
**Scope:** Publicly retrievable content from Agentive Labs and its directly linked/indexed service and contact pages.  
**Use:** Benchmark evidence only. This document does not reproduce the site's code, assets, layout, or protected wording.

## Inspection boundary

- **Verified:** The required homepage was retrieved, but the text extractor returned no line-level DOM content. Search-indexed excerpts and directly indexed internal pages exposed enough text to verify positioning, service taxonomy, conversion language, and selected process statements. [A1–A4]
- **Verified limitation:** Interactive previews, animation timing, responsive states, hover states, media assets, and client-side demonstrations could not be dynamically operated in the available inspection channel. No claim below treats an unobserved dynamic state as verified. [A1]
- **No private-code inference:** No framework, CMS, component library, hosting stack, animation library, analytics product, or private implementation is attributed to the site.

## Executive assessment

Agentive Labs presents a narrow, clinic-specific offer rather than a generic AI consultancy. The public copy links automation to three operational outcomes: less administrative work, stronger enquiry capture, and smoother clinic operations. [A1] The benchmark value is therefore strategic rather than visual: focused audience definition, problem-led service pages, low-friction consultation language, and reassurance that automation can coexist with tools already used by the clinic.

Silverstone should not imitate the site's language, visual composition, ordering, or interaction details. The transferable lesson is to make each page resolve five questions quickly: who the service is for, which operational failure it fixes, what the system does, how adoption works, and what the visitor should do next.

## Positioning

| Finding | Status | Evidence and interpretation |
|---|---|---|
| The offer is explicitly aimed at private clinics. | **Verified** | The homepage's indexed description identifies private clinics as the audience. [A1] |
| The benefit framing is operational, not model-centric. | **Verified** | Public descriptions emphasize administration, enquiries and day-to-day operations rather than technical model specifications. [A1] |
| The public service set includes website builds, an AI enquiry assistant and an AI receptionist. | **Verified** | These options are exposed in the contact form and service navigation excerpts. [A2–A4] |
| Some additional services are presented as forthcoming rather than available now. | **Verified** | Indexed service navigation marks at least one content-related service as coming later. [A2–A3] |
| The narrow vertical focus likely improves relevance and reduces the amount of explanation needed. | **Technical inference** | This follows from the consistent clinic-specific audience and problem language; conversion impact was not measured. [A1–A3] |

## Page structure and information architecture

### Homepage

The retrievable evidence supports the following functional sequence, without establishing exact visual order:

1. **Audience-and-outcome proposition.** The homepage describes clinic automation in terms of reduced administration, better enquiry capture and operational continuity. **Verified.** [A1]
2. **Service routes.** Indexed excerpts expose routes for website builds, an enquiry assistant and an AI receptionist. **Verified.** [A2–A4]
3. **Service-level outcome summaries.** One homepage excerpt describes a system that responds to website enquiries continuously, answers questions, collects details and moves visitors toward booking. **Verified.** [A1]
4. **Existing-tool reassurance.** The homepage names Google Calendar and Gmail in an integrations treatment. **Verified.** [A1]
5. **Consultation call to action.** The homepage invites a short call to examine the clinic's current enquiry process and whether a system is appropriate, using deliberately low-pressure framing. **Verified.** [A1]
6. **Contact route and footer navigation.** Indexed content exposes a contact page, email address and quick links. **Verified.** [A4]

The exact section order, visual hierarchy and mobile reflow were not dynamically verified.

### Service pages

- **AI enquiry assistant:** The page opens with the operational mismatch between round-the-clock enquiries and finite staff availability, then explains that visitors may leave when questions are not answered promptly. **Verified.** [A2]
- **Website builds:** The page frames the website as an underperforming operational asset and contrasts mere online presence with performance. **Verified.** [A3]
- **Process explanation:** Both indexed service pages expose a numbered or staged “how it works” treatment from discovery to a live/final deliverable. **Verified.** [A2–A3]
- **Page-end conversion:** The website service page repeats a short-call request tied to reviewing the current site and explaining feasible options. **Verified.** [A3]

## Conversion path

**Verified path:** Homepage/service explanation → short consultation CTA → contact form with service-interest selection. [A1–A4]

### Strengths

- The consultation is framed as a fit assessment rather than an immediate purchase. **Verified.** [A1, A3]
- The contact form lets the prospect identify a service category, reducing ambiguity for follow-up. **Verified.** [A4]
- Service pages connect a concrete operational problem to a defined system before repeating the CTA. **Verified.** [A2–A3]

### Risks and gaps

- No verified public pricing, quantified case study, named client proof, measurable before/after result, security detail, or implementation SLA was available in the retrieved evidence. **Verified evidence gap, not a claim of site-wide absence.** [A1–A4]
- No live functional demonstration could be operated in the available inspection channel. **Verified inspection limitation.** [A1–A3]
- The single dominant call path may be effective for high-consideration services, but it gives research-stage visitors limited self-qualification evidence. **Technical inference.** [A1–A4]

## Observable demonstrations

- The homepage exposes “see how it works” style routing for at least one automation offer. **Verified.** [A1]
- The service pages expose staged process explanations. **Verified.** [A2–A3]
- A functioning chatbot simulation, receptionist call simulation, workflow visualizer, calendar handoff, analytics view, or before/after operational demonstration could not be verified dynamically. **Verified inspection limitation.** [A1–A3]

**Benchmark implication:** Silverstone should provide original, inspectable demonstrations that prove system behaviour without copying Agentive's presentation. Recommended concepts are defined in `original-demo-system-opportunities-v1.md`.

## Service explanation

Agentive's retrievable service narratives use a repeatable logic:

1. identify a familiar clinic failure;
2. describe the visitor or staff consequence;
3. explain the system's operational role;
4. show a straightforward implementation process;
5. invite a call.

Steps 1–5 are **Verified as a recurring content pattern** across the indexed homepage and two service pages, although exact layout and visual treatment are not verified. [A1–A3]

This is a useful content architecture for Silverstone, but the wording, sequence depth, examples and graphic system must be original.

## Interaction patterns

| Pattern | Status | Assessment |
|---|---|---|
| Repeated CTA routing to a consultation/contact flow | **Verified** | Supports a clear primary conversion action. [A1, A3–A4] |
| Service-specific navigation | **Verified** | Enables prospects to self-select by need. [A2–A4] |
| Numbered process explanation | **Verified** | Reduces perceived implementation ambiguity. [A2–A3] |
| “See how it works” pathway | **Verified** | Indicates a move from proposition to explanation, but the destination's dynamic behaviour was not operated. [A1] |
| Hover, scroll-triggered animation, cursor effects, accordions, carousels or modal behaviour | **Not inspectable** | No reliable conclusion. [A1–A4] |

## “Work with your existing tools” treatment

- The homepage explicitly names Google Calendar and Gmail as examples of existing clinic tools. **Verified.** [A1]
- The treatment functions as adoption-risk reassurance: the automation is positioned as integrating with the current operating environment rather than requiring a wholesale platform replacement. **Technical inference supported by the wording and named tools.** [A1]
- The retrieved evidence does not verify integration depth, API method, supported editions, data direction, failure handling, consent controls, security model or whether integrations are native, custom or mediated by another platform. **Verified evidence gap.** [A1]

**Silverstone opportunity:** Create an original integration architecture section that separates “commonly supported”, “requires assessment” and “custom connector” states, with explicit data-flow and responsibility boundaries.

## Accessibility risks

Because dynamic states and rendered styles could not be inspected, the following are risk prompts rather than defect findings:

- **Technical inference:** Any continuously animated hero, auto-advancing demonstration or moving background would need pause/stop controls and reduced-motion behaviour. No such behaviour was dynamically verified. [A1; T4, T5, T11]
- **Technical inference:** Consultation forms should preserve visible labels, clear errors, focus order and keyboard completion. The contact form fields were indexed, but the rendered accessibility tree was not available. [A4]
- **Technical inference:** If service explanations use cards or click targets beyond semantic links/buttons, keyboard and focus-visible behaviour must be validated. The DOM was not available. [A1–A3]
- **Verified limitation:** Colour contrast, target size, heading hierarchy, landmarks, alternative text and responsive reflow were not testable in the available channel. [A1–A4]

## Performance risks

No Lighthouse trace, network waterfall, asset inventory, source map, JavaScript bundle or media payload was obtained. Therefore:

- No Core Web Vitals conclusion is made.
- No framework or rendering architecture is asserted.
- The empty line-level extraction is recorded only as an inspection limitation; it is not treated as proof of client-only rendering.
- Any rich demonstration or shader adopted by Silverstone should be separately budgeted for initial JavaScript, GPU work, mobile thermals and fallback behaviour. **Technical inference.** [T12]

## Apparent implementation

**Verified:** Public URLs expose separate homepage, contact and service routes. [A1–A4]  
**Not verified:** React, Next.js, Vite, Webflow, Framer, WordPress, a headless CMS, a specific animation stack, or any hosting provider.  
**Conclusion:** No implementation claim should enter D-01 or I-01 unless a later source-level or header-level inspection verifies it.

## Original-design benchmark takeaways

1. Keep Silverstone's positioning outcome-led and audience-specific, but use Silverstone's own strategy, language and visual identity.
2. Give each service page a problem → operational mechanism → implementation → proof → CTA structure.
3. Use an integration section to lower switching anxiety, but add data-flow precision that the retrieved benchmark evidence does not provide.
4. Pair the consultation CTA with deeper self-qualification evidence: demonstration, use-case fit, security, deployment boundaries and measurable outcomes.
5. Treat the benchmark as a strategic comparator, not a template.

## Sources

- **[A1]** Agentive Labs homepage: https://www.agentivelabs.co.uk/
- **[A2]** Agentive Labs AI enquiry assistant service page: https://www.agentivelabs.co.uk/services/chatbots
- **[A3]** Agentive Labs website builds service page: https://www.agentivelabs.co.uk/services/website-builds
- **[A4]** Agentive Labs contact page: https://www.agentivelabs.co.uk/contact
- **[T4]** W3C WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- **[T5]** Motion accessibility guidance: https://motion.dev/docs/react-accessibility
- **[T11]** MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- **[T12]** MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
