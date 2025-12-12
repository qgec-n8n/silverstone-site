<!-- FILE: .agent/ICON_CATALOG.md -->

# Icon Catalog (Allowed Font Awesome Solid Icons)

## Why this file exists
The site uses a **curated subset** of Font Awesome Solid icon classes. An icon renders correctly only if:
- The font files exist in `assets/webfonts/fa-solid-900.*`, AND
- The icon class is mapped in CSS via a `.fa-solid.fa-<name>::before { content: ... }` rule.

## Source of Truth
Use the CSS mappings in:
- `src/css/base/typography.css`

If an icon class is not mapped there, **do not use it** in newly generated niche pages.

## Allowed `.fa-solid` icon classes
Use only these classes in niche-page bullet lists and cards:

- `fa-diagram-project`
- `fa-robot`
- `fa-chart-line`
- `fa-gears`
- `fa-chart-bar`
- `fa-calendar-check`
- `fa-tags`
- `fa-file-lines`
- `fa-lock`
- `fa-network-wired`
- `fa-plug`
- `fa-code`
- `fa-lightbulb`
- `fa-shield-halved`
- `fa-file-invoice-dollar`
- `fa-calculator`
- `fa-chart-pie`
- `fa-bell`
- `fa-clock`
- `fa-users`
- `fa-cloud`
- `fa-arrows-rotate`
- `fa-layer-group`
- `fa-comments`
- `fa-info-circle`
- `fa-check-circle`
- `fa-location-dot`
- `fa-envelope`
- `fa-bolt`
- `fa-gauge-high`
- `fa-rocket`
- `fa-ear-listen`
- `fa-flask`

## Icon selection guidance (keep it semantic)
Use these heuristics when choosing icons for bullet lists:

- Speed, response times, delays → `fa-clock`, `fa-bolt`, `fa-gauge-high`
- Messages, DMs, reviews, chat → `fa-comments`
- Customers, staff, community → `fa-users`
- Notifications, reminders, follow-ups → `fa-bell`
- Scheduling, booking, appointments → `fa-calendar-check`
- Documents, scripts, extraction, forms → `fa-file-lines`
- Integrations, workflows, systems → `fa-network-wired`, `fa-plug`, `fa-diagram-project`, `fa-layer-group`
- Automation/AI → `fa-robot`, `fa-gears`
- Security, compliance → `fa-lock`, `fa-shield-halved`
- Growth, revenue, performance → `fa-chart-line`, `fa-chart-bar`, `fa-chart-pie`, `fa-rocket`
- Ideas/insight/triage → `fa-lightbulb`
- Listening, calls, inbound demand → `fa-ear-listen`
- Testing/experiments → `fa-flask`

## Verification step (required before writing niche bullets)
Before assigning icons, run:
- `rg "\.fa-solid\.fa-" src/css/base/typography.css`

Then ensure every icon class you add appears in that file.
