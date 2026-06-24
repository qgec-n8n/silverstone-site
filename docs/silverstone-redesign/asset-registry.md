# Asset Registry — V2 Homepage

All assets are **local** (no remote runtime dependencies). Generated imagery is
cinematic dark luxury-tech, consistent with the Precision Luminescence directive.

## Brand assets — `web/public/brand/`

| File | Source | Notes |
| --- | --- | --- |
| `silverstone-emblem.png` | `attached_assets/silverstone-icon_*.png` | Background removed → transparent RGBA (1254×1254). Header/loader/footer emblem. |
| `silverstone-logo.png` | `attached_assets/silverstone-logo-new@2x_*.png` | Background removed → transparent RGBA (1256×702). Emblem-only crop of the lockup. |
| `silverstone-emblem-source.png` | original | Untouched original kept for reference. |
| `silverstone-logo-source.png` / `…-source@2x.png` | originals | Untouched originals kept for reference. |

> The original brand PNGs shipped on a white raster background; transparent
> derivatives are required for the dark theme (no white logo plates).
>
> The source lockup pairs the emblem with a **dark slate "SILVERSTONE AI"
> wordmark** that is invisible on a dark surface. So the wordmark is rendered as
> **styled text** beside the transparent emblem in the header and footer (full
> control on dark, crisp at any size, accessible) rather than as a baked image.
> `silverstone-logo.png` is therefore an emblem-only derivative.

## Generated imagery — `web/public/home-v2/` (AI-generated, local)

| File | Aspect | Used by |
| --- | --- | --- |
| `hero-poster.png` | 16:9 | Hero static poster (source of truth / fallback for shader hero) |
| `hero-poster-portrait.png` | 9:16 | Hero poster, mobile/portrait |
| `story-operating-surface.png` | 16:9 | Storytelling — "one calm operating surface" |
| `story-voice-signal.png` | 4:3 | Storytelling — "conversations that never sleep" |
| `story-human-loop.png` | 4:3 | Storytelling — "a human always in the signal" |
| `consulting-strategy.png` | 4:3 | AI consulting section |
| `standard-chrome.png` | 16:9 | Silverstone Standard section texture |

Art direction: near-black graphite base, volumetric depth, electric cyan +
violet luminescence, chrome highlights, no text, no UI, no faces.

## Integration marks — `web/public/integrations/` (local SVG, currentColor)

Stylized **original** monochrome marks (not pixel copies of trademarks), tinted
to chrome/platinum on dark. Two marquee rows.

Row A: `whatsapp`, `gmail`, `google-calendar`, `slack`, `hubspot`, `stripe`, `calendly`
Row B: `microsoft-teams`, `outlook`, `zapier`, `make`, `notion`, `twilio`, `shopify`

## Pre-existing local studio photography — `web/public/migrated-assets/`

Only three local studio photos exist in-repo (`Silverstone_04/06/27-640.jpg`).
Body-image filenames in the audit CSV are live-site URLs not present in the repo,
so cinematic replacements were generated (above) rather than referencing remote
files.
