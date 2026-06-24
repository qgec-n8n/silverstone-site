# Silverstone AI — 21st.dev Component Ledger (V2 Redesign)

> **Governing document:** `docs/silverstone-redesign/v2-creative-directive.md`.

## MCP availability status — READ FIRST

The connected **`21st.dev-replit-mcp`** server is **CURRENTLY DOWN**. Attempts to use it
return **"Failed to fetch tools"**, so the mandated semantic component search and SVG icon
search **could not be executed** during this V2 build.

As a result:

- **No** marketplace components, snippets, or SVGs were fetched, installed, or copied from
  21st.dev.
- **All** components across the redesign are **built original and in-house**, then **restyled
  fully into the Silverstone design language** defined in the V2 creative directive.
- This is a **documented limitation, not skipped work.** Every major component family below
  records the **intended MCP search query** (what we *would* have searched), the **21st.dev
  reference URLs named in the directive** where applicable, the **status**, the **Silverstone
  styling approach**, and **where the component is used**.

When the MCP server is restored, this ledger should be revisited: run the intended queries,
record candidates reviewed and selected inspiration, and confirm whether any in-house
implementation should be reconciled against a discovered reference. Until then, the
in-house implementations are authoritative.

### Reference URLs named in the V2 directive

| Short name | 21st.dev URL | Directive use |
| --- | --- | --- |
| CoreSpin Loader | `https://21st.dev/community/components/m.kumailalirajpoot/core-spin-loader/default` | Starting point for branded route loaders |
| particles-bg | `https://21st.dev/community/components/UmairXD/particles-bg/default` | Starting point for hero / body particle fields |
| hero-button-expendable | `https://21st.dev/community/components/shadway/hero-button-expendable/default` | Inspiration for scroll-triggered hero-to-body transition |
| display-cards | `https://21st.dev/community/components/Codehagen/display-cards/default` | Inspiration for the Services Universe cards |
| integration-hero | `https://21st.dev/community/components/ruixenui/integration-hero/default` | Foundation for the integration / technology carousel |

---

## Component family ledger

Each row uses status **"MCP unavailable — original implementation"** because the MCP server
could not be reached during this build.

### Header / Navigation

| Field | Detail |
| --- | --- |
| Intended MCP query | "premium glass navigation header with mega menu and scroll solidification"; "animated active route indicator nav"; SVG search: "navigation icons", "menu chevron", "hamburger drawer icon" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Dark glass / transparent initial state; intelligent solidification on scroll; animated active-route indicator; Services & Industries desktop mega menus with icons + concise descriptions; `silverstone-icon.png` lockup; prominent "Book a discovery call" CTA; sophisticated keyboard-accessible mobile drawer; Motion-based open/close; subtle GSAP/CSS entrance; no default shadcn appearance |
| Used on | Global — every route header |

### Footer

| Field | Detail |
| --- | --- |
| Intended MCP query | "premium dark metallic footer with multi-column navigation and CTA"; SVG search: "social icons", "location pin", "mail icon" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Full `silverstone-logo-new.png` / `@2x` lockup; dark metallic composition; service/industry/company/resource navigation; London positioning + UK/EU/US capability language; conversion CTA; repository-approved contact details; subtle animated technical background that does **not** run continuously behind legal links; responsive + accessible |
| Used on | Global — every route footer |

### Route Loader

| Field | Detail |
| --- | --- |
| Intended MCP query | "branded cinematic full-screen route loader spinner"; "core spin loader"; "page transition loader with status text" |
| Reference URL(s) | CoreSpin Loader — `https://21st.dev/community/components/m.kumailalirajpoot/core-spin-loader/default` (named starting point) |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Restyled from scratch into Silverstone cyan/blue/violet/pink/silver; polished emblem/technical visual treatment; route-family-specific, conversion-oriented copy (e.g. Homepage "Engineering the next advantage."); 1.5–2.3s initial appearance, shorter repeat-navigation transitions; no hydration issues; zero CLS; complete reduced-motion fallback; screen-reader-friendly status; never hides a failed page indefinitely |
| Used on | Global — every route during navigation/load |

### WebGL Hero (flagship)

| Field | Detail |
| --- | --- |
| Intended MCP query | "interactive particle hero background"; "react three fiber shader hero"; "iridescent chrome 3D hero"; "cinematic energy path particles" |
| Reference URL(s) | particles-bg — `https://21st.dev/community/components/UmairXD/particles-bg/default` (hero/body particles); hero-button-expendable — `https://21st.dev/community/components/shadway/hero-button-expendable/default` (hero-to-body transition inspiration) |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Bespoke React Three Fiber / Three.js + custom GLSL + restrained postprocessing bloom; animated particles, chrome/iridescent materials, cyan-violet-pink energy paths, subtle pointer response, depth + parallax; legible foreground copy; distinctive scroll-triggered hero-to-body transition ("entering deeper into the Silverstone system"); static/lightweight fallback for low-power/unsupported devices and reduced-motion |
| Used on | Homepage (flagship). Lighter page-family hero variants on principal routes |

### Services Universe cards

| Field | Detail |
| --- | --- |
| Intended MCP query | "animated stacked display cards"; "interactive service cards with icon and accent"; SVG search: "service icons", "AI/automation/web/app icons" |
| Reference URL(s) | display-cards — `https://21st.dev/community/components/Codehagen/display-cards/default` (one possible inspiration) |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Visually rich introduction to every service; animated icons; page-specific colour accents; interactive cards / stacked displays in Silverstone glass + chrome + luminous-edge treatment; deliberate entrance/hover/scroll behaviour |
| Used on | Homepage section 3 (Services Universe); service landing entry points |

### Metrics / Animated Counters

| Field | Detail |
| --- | --- |
| Intended MCP query | "animated number counters"; "outcome dashboard stat cards"; "benchmark KPI cards"; "comparison rail" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Animated counters, outcome dashboards, benchmark cards, comparison rails and service-proof sections styled in the Silverstone palette; values and framing sourced strictly from `docs/silverstone-redesign/metrics-registry.md`; all CSV "(calculated average rate)" items framed as calculated agency averages / performance benchmarks, never as Silverstone's own client results |
| Used on | Homepage section 5 (Selected performance benchmarks); service/industry proof sections |

### Integration / Technology Carousel

| Field | Detail |
| --- | --- |
| Intended MCP query | "logo marquee carousel two rows opposite direction"; "integration hero scrolling logos"; SVG search: "OpenAI / Anthropic / Gemini / Azure / AWS / ElevenLabs / Vapi / Retell / Twilio / n8n / Zapier / Make / HubSpot / Salesforce / Pipedrive / GoHighLevel / Slack / Teams / Gmail / Outlook / Google Calendar / Calendly / Stripe / Shopify / WooCommerce / WordPress / Webflow / Framer / Figma / Notion / Airtable / Supabase / PostgreSQL / MongoDB / Snowflake / BigQuery brand logos" |
| Reference URL(s) | integration-hero — `https://21st.dev/community/components/ruixenui/integration-hero/default` (foundation; recreate the interaction pattern, not proprietary source or exact composition) |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Two or more continuously moving rows in opposing directions; pause on hover and keyboard focus; static / manually scrollable reduced-motion state; accessible labels; richly integrated into the Silverstone palette. Because MCP SVG search is unavailable, integration icons must come from **official brand SVG sources** rather than generic letter circles; until sourced, accessible labelled placeholders may be used and must be replaced before production |
| Used on | Homepage section 6 (Integration and technology carousel) |

### Process Timeline

| Field | Detail |
| --- | --- |
| Intended MCP query | "animated process timeline with nodes"; "system diagram flowing lines"; "scroll-linked steps strategy to launch" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Immersive, animated, visual process from strategy through launch and optimisation; flowing lines, nodes, timelines or system diagrams; GSAP/ScrollTrigger scroll-linked choreography in Silverstone palette; reduced-motion fallback |
| Used on | Homepage section 7 (Process section) |

### Image-led sections

| Field | Detail |
| --- | --- |
| Intended MCP query | "cinematic image reveal section"; "parallax masked image storytelling"; "responsive picture art-directed section" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Cinematic crops; parallax or masked reveals; responsive `<picture>` with mobile-specific sources; imagery selected from `docs/silverstone-redesign/asset-registry.md` (homepage + studio assets confirmed available under `web/public/images/`) |
| Used on | Homepage section 8 (Image-led sections); about/studio storytelling |

### Silverstone Standard assurance

| Field | Detail |
| --- | --- |
| Intended MCP query | "premium trust / guarantee section"; "assurance commitment cards"; SVG search: "shield check", "milestone", "handshake", "warranty icon" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Premium, highly trustworthy assurance system using only defensible service-process commitments (suitability assessment, milestone approval, defined scope, scoped revisions, implementation warranty, transparent handover, pause/cancellation points, documented acceptance criteria, support/remediation). No invented revenue/ranking/ROI/lead/conversion guarantees. Unapproved commercial wording is drafted and flagged internally for owner approval before production |
| Used on | Homepage section 9 (Silverstone Standard assurance) |

### Final CTA / Conversion sequence

| Field | Detail |
| --- | --- |
| Intended MCP query | "premium conversion CTA section with visual climax"; "booking call CTA hero"; "gradient cinematic call to action" |
| Reference URL(s) | None named in directive for this family |
| Status | MCP unavailable — original implementation |
| Silverstone styling | Not a generic CTA card; branded visual climax; strong booking CTA; full logo where appropriate; cinematic Silverstone palette + motion |
| Used on | Homepage section 10 (Rich final conversion sequence); shared conversion blocks |

---

## When MCP is restored — follow-up checklist

1. Run each **intended MCP query** above (semantic + SVG search).
2. Record **candidates reviewed**, **selected inspiration**, **source name**, and
   **dependencies** for each component family.
3. Source **authentic brand SVGs** for the integration carousel (replace any placeholders).
4. Reconcile each in-house implementation against discovered references; restyle further only
   if it improves the Silverstone design language.
5. Update this ledger from "MCP unavailable — original implementation" to the full record
   required by the V2 directive (query, candidates, selection, source, dependencies, restyle,
   usage).
