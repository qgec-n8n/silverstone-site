# Silverstone sitewide art direction v1

**Status:** Authoritative visual and interaction specification for Replit prototypes. No implementation code.  
**Visual direction:** **Precision Luminescence** — premium technological depth expressed through disciplined light, machined structure and legible operational diagrams rather than generic AI spectacle.

## 1. Evidence boundary

### Observed constraints
- **[OBS-F02]** The supplied F-02 pack sets a 111.83 KB gzip foundation baseline, a 220 KB initial-route JavaScript target, a 300 KB hard ceiling, no animation-caused task above 50 ms, and a representative sustained desktop animation target of at least 45 FPS.
- **[OBS-F02]** Native scrolling, one animation owner per property, static reduced-motion comprehension, off-screen pausing and shader deferral are fixed design-system rules.
- **[OBS-H01]** The supplied H-01 pack establishes six service routes, nine industry routes, core conversion routes, a blog system and a discovery-call primary conversion.
- **[OBS-B02]** The supplied B-02 pack treats Agentive Labs as a strategic benchmark only and rejects copying its wording, layouts, interactions or assets.

### Proposal
Everything below is original Silverstone direction. Third-party components may inform feasibility, never composition.

## 2. Creative thesis

Silverstone should feel like a high-value systems studio, not a consumer AI toy. The visual language combines:

1. **Platinum clarity:** predominantly white and pale-platinum canvases so non-technical buyers can scan comfortably.
2. **Graphite precision:** dark structural typography, frames and navigation establish authority.
3. **Controlled energy:** cyan-to-blue-to-violet-to-pink illumination is used as a directional signal, not as a full-page wash.
4. **Operational proof:** diagrams show inputs, decisions, handoffs and exceptions. Decorative technology imagery never substitutes for explanation.
5. **Quiet luxury:** generous spacing, restrained motion, exact alignment, tactile metallic details and deliberate contrast.

The visual ratio is approximately **70% calm light surface / 20% graphite structure / 10% luminous accent** on core routes. Dark sections are limited to one or two high-emphasis moments per long page.

## 3. Core visual system

### Colour
Use F-02 semantic tokens. Key primitives:
- Deep Graphite `#39454D`
- Silverstone Graphite `#43555D`
- Titanium Silver `#A0A4AB`
- Platinum Silver `#E9EAEF`
- Electric Cyan `#5EC5D0`
- Digital Blue `#597FAD`
- Neural Violet `#A97CC0`
- Electric Pink `#C884C3`

Accents appear as narrow signal lines, focal halos, status nodes and selective borders. Body text never sits directly over a moving gradient.

### Typography
Use the F-02 proposal of Sora Variable for display and Inter Variable for body/interface, subject to licence verification. Headlines are compact, left aligned and rarely centred. H1 measure: 12–18ch. Body measure: 56–68ch. No more than two font preloads.

### Surfaces
- **Canvas:** white or cool platinum.
- **Raised panel:** white with a precise 1px titanium boundary and soft, non-cloudy shadow.
- **Graphite chamber:** deep graphite with platinum text for demos or decisive CTAs.
- **Instrument glass:** subtle translucent panel only when the background is static and contrast remains deterministic.
- Avoid excessive glassmorphism, blurred blobs, neon outlines around every card and nested rounded rectangles.

### Geometry
Use 8px base rhythm, 12–20px radii depending on scale, and 1px structural borders. Large media frames can use a clipped 20px corner plus one small chamfer to suggest engineered hardware. Do not use sci-fi hexagons as a default motif.

## 4. Premium futuristic icon language — “Machined Signal”

### Proposal
Create an original icon family with:
- 24, 32 and 48px optical sizes;
- 1.75px graphite/titanium primary stroke;
- one luminous signal segment or status node per icon;
- rounded internal joins and squared external terminals;
- no robot heads, brains, magic wands, sparkles or generic circuit-board clichés;
- filled state only for active/confirmed status;
- semantic labels always visible where the icon carries meaning.

Service signatures:
- Web: structured viewport plus guided path.
- App: layered product states and role boundary.
- Voice: waveform entering a decision gate.
- Receptionist: multi-channel intake converging on a handoff.
- Content: approved source branching into governed outputs.
- Automation: connected nodes with explicit exception loop.

Industry icons use operational objects, not stereotypes: key/property card, reservation bell, appointment comb/calendar, service van/job sheet, parcel/order state, intake form, recall calendar, class roster, consultation pathway.

## 5. Imagery reuse policy

Existing useful imagery should be reused only after an asset register confirms rights, purpose, focal point and minimum resolution. The branch did not expose a dedicated current-image register in the supplied inputs, so prototypes must label every reused asset with its repository path before implementation.

### Reuse gate
An image passes only when it:
1. explains a service, workflow, person or environment;
2. has clear usage rights;
3. remains credible at the intended crop;
4. is large enough for responsive delivery;
5. does not conflict with current brand colour or content claims.

### Stronger treatments
- editorial image paired with a concise annotation rail;
- full-bleed image inside a machined frame with one luminous locator line;
- before/after interface crop with explicit labels;
- documentary image beside a workflow diagram, never buried under effects.

Generic stock “AI people”, floating holograms and unverified client imagery are rejected. The existing lower-page carousel is removed from every route. It is replaced by a static related-decision rail or route-specific next-step module.

## 6. Layout architecture

### Grid
Follow F-02: 4 columns on mobile, 8 on tablet, 12 on desktop, capped at 1440px. Core pages alternate broad editorial sections with compact operational instruments. Repetition is controlled through shared spacing and typography, not identical card grids.

### Section rhythm
- Hero: 72–112px top/bottom desktop; 48–72px mobile.
- Major section: 96–144px desktop; 64–96px mobile.
- Dense instrument/demo: 64–96px.
- Page-end conversion: distinct graphite or platinum decision chamber, not another hero duplicate.

### Card density
Maximum three cards per row. Six-service and nine-industry directories use a guided matrix with differing card sizes based on user intent, not a uniform wall of tiles.

## 7. Navigation

### Desktop
A 72px sticky header becomes a compact 60px header after 80px of native scroll. Structure:
- brand link;
- Services disclosure;
- Industries disclosure;
- How we work;
- Insights;
- About;
- primary “Book a discovery call” button.

Disclosures are ordinary navigation lists, keyboard reachable, Escape closable and do not use menu/menubar semantics. The active route has a persistent text/border cue. No animated cursor or magnetic buttons.

### Mobile
A 64px header with one disclosure button. Panel enters 16px over 320ms, uses normal document focus order, closes on Escape and restores focus. The primary CTA appears once near the top and once at the panel end, not duplicated between every group.

## 8. Footer

A calm graphite footer with four clear groups: Services, Industries, Company, Contact/legal. Include a one-line brand descriptor and verified contact details only. Mobile groups may collapse into accessible accordions, but default to fully expanded when content length remains manageable. No logo ticker, animated background or newsletter form unless separately approved.

## 9. Conversion interface hierarchy

1. **Primary:** Book a discovery call.
2. **Secondary:** Explore relevant service/industry or send an enquiry.
3. **Tertiary:** Start/reset a demonstration, read a guide, inspect process.

Every major section has at most one dominant action. Buttons remain conventional and legible. The third-party expandable hero button is rejected. An optional original inline “scope preview” disclosure may sit beside the secondary CTA on home and services only; it expands in place, never opens a modal, locks scroll or hides the primary action.

## 10. Demos and proof

Demos are synthetic, deterministic and labelled. They show operational logic without implying a live client result. Every demo has:
- static summary before activation;
- explicit Start and Reset;
- keyboard completion;
- textual event log;
- no production data;
- clear human handoff/exception state;
- static reduced-motion mode.

Evidence slots are omitted publicly until approved proof exists. Never fabricate logos, metrics, testimonials, ratings or integrations.

## 11. Animation and bundle allocation

| Budget | Target | Hard gate |
|---|---:|---:|
| Foundation baseline | 111.83 KB gzip | Observed F-02 baseline |
| Initial-route JS | ≤220 KB gzip | ≤300 KB gzip |
| New sitewide interaction JS | ≤28 KB gzip | ≤40 KB gzip |
| Route-local non-shader demo JS | ≤35 KB gzip | ≤50 KB gzip |
| Deferred shader adapter + shader | ≤45 KB gzip target | ≤65 KB gzip; never initial |
| Third-party carousel JS | 0 KB | Native implementation required |
| Animation long task | 0 above 50 ms | Fail on any reproducible animation-caused task |
| Sustained desktop animation | ≥45 FPS | Profile representative route |
| Mobile continuous animation | none by default | User-started only or capability-tier enabled |

Headroom is not permission to spend. Route-level code splitting is mandatory for demos, blog enhancements and shaders.

## 12. Capability tiers

- **Tier A — Full:** wide viewport, fine pointer, no reduced-motion request, sufficient device capability; bounded shader may activate after content and idle.
- **Tier B — Standard:** static background plus CSS/Framer state motion; no continuous shader.
- **Tier C — Low power/reduced motion:** static image/CSS composition, instant reveals, no autoplay, demos use step changes.

Use capability detection and measured performance rather than user-agent assumptions. A manual “Reduce visual effects” control may be added later but is not required for prototype acceptance.

## 13. Originality rules

- Do not reproduce Agentive Labs wording, section order, visual proportions, demos, illustration style or interactions.
- Do not install a 21st.dev component as the visual identity.
- Do not trace third-party shaders or copy registry source into prototypes before licence review.
- Every signature visual must originate from Silverstone’s workflow model, colour tokens and content hierarchy.
- Store a design rationale beside each prototype explaining what business decision the visual supports.

## 14. Sitewide wireframe shell

1. Skip link.
2. Sticky navigation.
3. Route hero with copy first in DOM.
4. Route-specific orientation module.
5. Main explanatory sections.
6. Optional explicit-start demo.
7. Existing-tools module where relevant.
8. Qualification/safeguard section.
9. Approved proof or omitted slot.
10. Related-decision rail replacing the old lower carousel.
11. Final conversion chamber.
12. Footer.
