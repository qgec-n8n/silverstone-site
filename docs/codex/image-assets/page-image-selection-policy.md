# Silverstone Page Image Selection Policy

This policy applies before designing or substantially revising any `/web` route.
The preserved catalogue, verified manifest, and route-candidate manifest are
decision inputs, not automatic placement instructions.

## Required Inputs

- Machine catalogue:
  `docs/codex/image-assets/silverstone-image-asset-catalogue.json`
- Human catalogue:
  `docs/codex/image-assets/silverstone-image-asset-catalogue.md`
- Verified asset manifest:
  `docs/codex/image-assets/verified-image-asset-manifest.json`
- Route candidate manifest:
  `docs/codex/image-assets/route-image-candidates.json`
- Contact sheets:
  `docs/codex/image-assets/contact-sheets/`

## Step 1 - Page Purpose

Before selecting imagery, identify and record:

- route;
- page objective;
- audience;
- page content;
- visual tone;
- sections requiring visual support;
- whether an image would materially improve hierarchy, storytelling, trust, or
  premium character.

If an image does not have a clear page-design job, do not add it.

## Step 2 - Catalogue Review

Review the verified manifest and route-candidate manifest for:

- route recommendations;
- adjacent-page copy;
- visual description;
- recommended uses;
- fit score;
- palette;
- risks;
- desktop/mobile relationships;
- verified repository path;
- actual dimensions and file format.

Catalogue recommendations are guidance only. Do not force an asset into a route
just because a previous URL or filename appears related.

## Step 3 - Actual Image Inspection

Open every shortlisted image before selection.

Do not rely only on:

- filename;
- catalogue prose;
- route recommendations;
- fit score;
- generated contact-sheet thumbnails.

Use the contact sheets for fast triage, then inspect the original file for every
serious candidate. Record any visual issue that affects placement, including
baked-in copy, unreadable small labels, false client/result implication, awkward
mobile crop, or style mismatch with the dark premium `/web` direction.

## Step 4 - Selection Decision

Use an existing asset when it:

- materially improves the page;
- reinforces the section's actual message;
- looks premium and luxurious;
- suits the dark high-technology design;
- has sufficient resolution;
- has a suitable responsive counterpart when first-view or layout-critical;
- does not falsely imply client work;
- does not conflict with adjacent live copy;
- does not introduce misleading claims.

Reject an asset when it:

- looks visibly weaker than the surrounding page;
- duplicates another visual without adding value;
- contains baked-in copy conflicting with the new section;
- contains irrelevant labels;
- creates a false client/result implication;
- is too low resolution;
- creates an awkward responsive crop;
- reduces readability;
- makes the page look busier rather than more premium.

## Step 5 - Active Selection Requirement

Do not exclude catalogue assets merely because a CSS-only layout is easier.

For every route:

- actively shortlist relevant candidates;
- inspect their actual pixels;
- record why each strong candidate was used or rejected.

Default expectation: when a route has a directly relevant asset with fit score
9-10 and a suitable responsive counterpart, use at least one such asset unless a
documented design, content, credibility, or responsive issue makes exclusion
clearly better.

Skipping every relevant high-fit image requires a written design reason.

## Step 6 - Restraint Requirement

Do not add images merely because they exist.

No page should become an indiscriminate image gallery. Every selected image must
serve a clear section-level purpose, such as:

- explaining a workflow;
- creating a premium editorial break;
- supporting an industry-specific pain point;
- showing a self-contained illustrative panel;
- reinforcing a booking, confirmation, or operational outcome.

## Step 7 - Responsive Delivery

Where desktop and mobile counterparts exist:

- use `<picture>`;
- use the purpose-built mobile composition;
- do not force the desktop image into a narrow mobile crop;
- set `sizes`;
- provide dimensions or a stable aspect ratio;
- avoid CLS;
- use appropriate loading priority;
- preload/decode first-view images;
- lazy-load genuinely below-the-fold images.

If no mobile counterpart exists, document why the asset still fits and how the
layout protects smaller viewports.

## Step 8 - Baked-In Copy

Images containing substantial baked-in text must be treated as self-contained
visual panels.

Do not:

- place important live text over them;
- repeat the same message immediately beside them unless editorially justified;
- present mock dashboards, names, addresses, appointments, metrics, or results
  as verified Silverstone outcomes.

Treat all visible dashboards, labels, names, metrics, appointments, and results
inside artwork as illustrative mock content unless separately verified.

## Step 9 - Image Presentation

Use premium presentation appropriate to the asset:

- cinematic full-width break;
- editorial image/text split;
- large self-contained visual panel;
- restrained browser/device frame;
- layered depth where it genuinely improves the result;
- controlled edge lighting;
- appropriate contrast section.

Avoid:

- tiny thumbnails;
- excessive rounded cards;
- random floating crops;
- heavy overlays on text-rich images;
- arbitrary neon borders;
- distortion;
- over-cropping;
- excessive parallax.

## Step 10 - Decision Log

For every implemented page, record:

- route;
- candidates considered;
- catalogue IDs;
- verified paths;
- images selected;
- images rejected;
- reasons;
- responsive pairing;
- preload/lazy-loading decision;
- accessibility alt text;
- any illustrative-content disclaimer required.

This log may live in the route implementation notes, an ExecPlan, or a
route-specific handoff document, but it must be discoverable before the work is
claimed complete.
