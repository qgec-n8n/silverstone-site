# Silverstone AI Services Copy & SEO Pack

## Source gate completed

This pack was prepared from three source layers:

1. **Claude research:** `compass_artifact_wf-5d78adb4-c9db-4fa2-937e-453a5e12ce86_text_markdown(1).md`, read in full. It supplied live UK/London SERP patterns, keyword ownership, competitor positioning, conversion research, service terminology, structured-data caveats and anti-cannibalisation rules.
2. **Benchmark CSV:** `silverstone_ai_agency_performance_metrics_23_6_2026(2).csv`, audited 23 June 2026, containing 129 rows. Every benchmark used in this pack has been matched to its exact CSV row index, value, unit and claim text.
3. **Repository:** `qgec-n8n/silverstone-site`, latest accessible `main` revision reviewed through the connected GitHub integration (snapshot observed at commit `21e392c5a37214af3da469000be5f3a2fd9b517e`). The audit covered canonical routes, route aliases, route-entry experience generation, existing service stories, required demo placeholders, image assignments, navigation, benchmark implementation and claims rules.

## Canonical service routes

- **Web Design & Development:** `/services/web-design-development`
- **App Development:** `/services/app-development`
- **AI Voice Agents:** `/services/ai-voice-agents`
- **AI Receptionists:** `/services/ai-receptionists`
- **Content Creation:** `/services/content-creation`
- **AI Automation:** `/services/ai-automation`
- **AI & Automation Consulting:** `/services/ai-consulting`

Legacy aliases retained by the current repository:

- `/services/ai-agents-automation` → `/services/ai-automation`
- `/services/website-design-development` → `/services/web-design-development`

## Pack contents

- `00_RESEARCH_HANDOFF_SUMMARY.md` — decisions carried forward from research and repository review.
- `00_MASTER_KEYWORD_AND_INTENT_MAP.md` — one canonical owner for each transactional query family.
- `00_CANNIBALISATION_AND_CANONICAL_MAP.md` — overlap controls between home, service, industry, London and Insights pages.
- `00_INTERNAL_LINKING_ARCHITECTURE.md` — source, target, anchor, purpose and priority.
- `00_TOPICAL_AUTHORITY_AND_INSIGHTS_PLAN.md` — supporting article clusters by service.
- `00_COPY_STYLE_AND_CONVERSION_SYSTEM.md` — editorial voice, CTA rules, proof handling and differentiation system.
- `00_METRICS_AND_CLAIMS_REGISTER.md` — exact CSV allocations, approved disclaimer and claims controls.
- `00_SCHEMA_AND_ON_PAGE_SEO_HANDOFF.md` — metadata, canonical, breadcrumb, schema, prerender and indexability guidance.
- `01_…07_*.md` — complete service-page copy, component microcopy, implementation notes and source appendices.

## Public versus non-public content

In every numbered service file, **Sections 3–4** supply the public CoreSpin and Aether route-entry copy, while **Sections 5–6** supply the complete public page and component copy. Section 7 is public demonstration or reserved-placeholder copy; the three required integration routes include exact configuration slots, while the other pages contain truthful deterministic-demo guidance. Sections 1–2 are editorial/SEO handoff material. Sections 8–9 are non-public implementation and provenance appendices and must not be rendered to visitors.

## Codex implementation route

1. Replace route metadata, H1 and body content from the corresponding numbered Markdown file.
2. Override the generated CoreSpin/Aether defaults with the unique values in Sections 3–4.
3. Preserve the current route aliases and canonical tags.
4. Render essential copy in server-generated or prerendered HTML; do not hide service substance behind the Aether entry interaction.
5. Preserve current reserved demo configuration slots and replace only their display copy until real integrations are approved.
6. Use the exact benchmark disclaimer whenever a metric appears.
7. Keep every benchmark visually labelled as external benchmark evidence, never as a Silverstone result.
8. Implement crawlable `<a href>` internal links according to the linking architecture.
9. Validate headings, canonical URLs, schema and sitemap inclusion before release.

## Required benchmark disclaimer

> Benchmark outcomes drawn from published case data across AI automation engagements and industry sources. Figures illustrate what well-scoped automation can achieve; they are not guarantees of individual results.
