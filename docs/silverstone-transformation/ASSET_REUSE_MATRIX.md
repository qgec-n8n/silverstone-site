# Silverstone Asset Reuse Matrix

**Status:** Asset reuse and prevention contract for the `/web` rebuild.  
**Last updated:** 2026-06-30.
**Sources:** `docs/silverstone-transformation/audits/asset-integration-inventory-v1.csv`, `docs/codex/image-assets/verified-image-asset-manifest.json`, `docs/codex/image-assets/page-image-selection-policy.md`, `web/public/brand/`, `web/public/home-v2/`, `assets/logo/`, `attached_assets/`.

## Asset Rules

- Inspect actual pixels before selecting an image or logo.
- Use verified existing assets where they materially improve the page.
- Do not add assets just because they exist.
- Do not present generated dashboards, labels, metrics, appointments, or outcomes as verified Silverstone results.
- Do not use assets containing baked-in copy behind live text.
- Provide dimensions, aspect ratio, responsive sources, and stable containers to avoid layout shift.
- Preserve original uploads and generated derivatives until owner-approved cleanup.

## Logo Matrix

| Asset                                                         | Dimensions observed | Background safety                                 | Use                                                                                         | Disposition                      |
| ------------------------------------------------------------- | ------------------: | ------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| `web/public/brand/silverstone-ai-logo-dark-v3.png`            |           1484x1060 | dark/near-black sections only; sampled dark field | Primary dark-lockup candidate for `/web` CTA/footer/header contexts after visual inspection | preserve exactly                 |
| `web/public/brand/silverstone-ai-logo-footer.png`             |           1484x1060 | dark/near-black sections only                     | Footer-specific dark lockup alias/source                                                    | preserve exactly                 |
| `web/public/brand/silverstone-ai-logo-dark-v2.png`            |           1562x1007 | dark/near-black sections only                     | Previous dark lockup; retain as fallback/reference                                          | preserve exactly                 |
| `web/public/brand/silverstone-ai-logo-dark.png`               |             869x561 | dark/near-black sections only                     | Older dark lockup; retain as reference                                                      | preserve exactly                 |
| `web/public/brand/silverstone-ai-emblem-dark-transparent.png` |             860x929 | transparent/dark sections                         | Emblem where transparent edges are required                                                 | preserve exactly                 |
| `web/public/brand/silverstone-ai-emblem-dark.png`             |             860x929 | dark sections; inspect edge field                 | Emblem variant                                                                              | preserve exactly                 |
| `web/public/brand/silverstone-emblem.png`                     |           1254x1254 | transparent/neutral; inspect                      | Icon/emblem source in `/web`                                                                | preserve exactly                 |
| `web/public/brand/silverstone-logo.png`                       |            1256x702 | light or explicitly matched backgrounds only      | Legacy light-background brand lockup reference                                              | preserve but avoid dark sections |
| `assets/logo/silverstone-logo-new.png`                        |             628x351 | light/white-background sections only              | Legacy root logo; migration evidence                                                        | preserve exactly in legacy root  |
| `assets/logo/silverstone-logo-new@2x.png`                     |            1256x702 | light/white-background sections only              | Legacy density pair                                                                         | preserve exactly in legacy root  |
| `assets/logo/silverstone-logo-cropped-whitebg-v2.png`         |             628x339 | light/white-background sections only              | Do not place on dark UI; white rectangle risk                                               | preserve as legacy evidence      |
| `assets/logo/silverstone-logo-cropped-whitebg-v2@2x.png`      |             628x339 | light/white-background sections only              | Byte-identical to non-2x file per A-01; do not treat as real density pair                   | unresolved cleanup later         |
| `assets/logo/silverstone-icon.png`                            |           1254x1254 | inspect before use                                | Legacy icon                                                                                 | preserve exactly                 |

## Explicit Logo Prevention Rule

Do not place a white-background logo on a dark, cinematic, gradient, shader, black, navy, graphite, or image-backed section. This creates visible white or dark rectangles around the logo. For dark UI, use the dark-lockup assets in `web/public/brand/` only after checking their edge colour against the section background.

## Current `/web` Homepage Imagery

| Asset group            | Examples                                                                                                         | Safe usage                                                             | Disposition                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| Hero posters           | `hero-poster.png`, `hero-poster-portrait.png`                                                                    | Homepage first-view/static fallback; use responsive pairing            | preserve exactly                                    |
| Service visuals        | `service-consulting.*`, `service-data-integration.*`, `service-lead-followup.*`, `service-workflow-automation.*` | Homepage/service storytelling where illustrative, not proof            | preserve behaviour but redesign placement as needed |
| General service images | `general-services-1*` through `general-services-3*`                                                              | Service overview/editorial sections with proper desktop/mobile pairing | preserve behaviour but redesign presentation        |
| Story visuals          | `story-human-loop.png`, `story-operating-surface.png`, `story-voice-signal.png`                                  | Narrative sections; not proof/results                                  | preserve behaviour but redesign presentation        |
| Studio visuals         | `studio-mission.*`, `studio-story.*`, `secondary-hero.png`, `standard-chrome.png`, `consulting-strategy.png`     | About/process/consulting sections after route-specific review          | migrate and improve                                 |

### 2026-06-30 Homepage V2 Asset Note

- The homepage conversion pass reused existing `/web/public/home-v2/` imagery and `/web/public/brand/` assets; it did not add new image assets.
- Integration marks in `/web/public/integrations/*.svg` remain local visual compatibility/category marks only. They are not proof of active production integrations.
- Browser network checks on the staging preview recorded no failed image/font requests and no 4xx image/font responses. SVG integration marks can report `naturalWidth: 0` in Chromium because several files do not expose intrinsic dimensions; this is not treated as a network failure.

## Verified Image Catalogue

- `docs/codex/image-assets/verified-image-asset-manifest.json` contains 85 records.
- 12 records were exact-verified and 73 were prefix-fallback verified.
- 64 records have dimension mismatches between catalogue and actual files, so actual file dimensions must be trusted over catalogue dimensions.
- Images with baked-in copy are self-contained panels and must not sit behind additional live text.
- Route recommendations are guidance only; page purpose and pixel inspection decide final use.

## Legacy Asset Estate

| Asset class                 | Evidence                                                                  | Disposition                                                                         |
| --------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Public assets               | A-01 recorded 1,615 public assets and about 703 MB                        | unresolved pending owner cleanup; do not delete during presentation rebuild         |
| Generated image derivatives | A-01 recorded 1,227 committed generated derivatives and clean-build drift | replace only after deterministic `/web` asset pipeline is proven                    |
| Generated CSS/JS bundles    | `assets/css/styles.css`, `assets/js/app.js`, pricing widget bundles       | preserve legacy root; replace in `/web` implementation                              |
| Blog images                 | `assets/images/blog/*` and derivatives                                    | preserve article content imagery until route-specific review                        |
| Social/email artwork        | `assets/images/socialmedia/*`, `assets/images/email/*`                    | unresolved pending evidence; many are campaign assets, not automatic website assets |
| Font Awesome webfonts       | `assets/webfonts/*`                                                       | preserve legacy root; avoid importing into `/web` unless explicitly needed          |
| Google Sans Flex WOFF2      | `assets/fonts/*`                                                          | preserve as evidence; `/web` currently uses local fontsource packages               |

## Component And Registry Assets

- `web/components.json` configures shadcn style `new-york`, Tailwind CSS at `src/app/app.css`, lucide icons, and an Aceternity registry endpoint.
- `web/cybercore-section-hero.json` is a shadcn registry item for `src/components/ui/cybercore-section-hero.tsx`.
- `web/public/integrations/*.svg` contains local integration marks. These are visual compatibility/category marks unless specific integrations are separately verified.
- `web/public/prototypes/**` and `web/src/visual/**` are visual handoff/prototype assets, not proof of production integration.
