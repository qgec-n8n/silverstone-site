<!-- FILE: codex/SERVICES_ICON_MAP.md -->

# Services Page — Icon Selection Guidance (Allowed Set Only)

## Allowed `.fa-solid` icon classes
Use only icons that are mapped in `src/css/base/typography.css` (curated subset).
Commonly useful mapped icons in this repo include:
- `fa-bell` (alerts, reminders, notifications)
- `fa-clock` (speed, response times, saving time)
- `fa-calendar-check` (booking, confirmations, no-shows)
- `fa-comments` (conversations, messaging, follow-up)
- `fa-file-lines` (forms, admin, paperwork, copying/pasting)
- `fa-diagram-project` (workflows, routing, pipelines)
- `fa-layer-group` (systems, process, organisation)
- `fa-network-wired` / `fa-plug` (integrations)
- `fa-robot` / `fa-gears` (automation/AI)
- `fa-gauge-high` (visibility, tracking, dashboards)
- `fa-chart-line` / `fa-chart-bar` / `fa-chart-pie` (performance, conversion, ROI)
- `fa-shield-halved` / `fa-lock` (security, compliance)
- `fa-lightbulb` (smart triage, insight)
- `fa-users` (handover, teams, customer experience)

## Rule for applying icons to bullets
For each bullet list in `Services_Overhaul_Copy.md`:
1) Identify the bullet’s *intent* (time, booking, conversion, admin, visibility, compliance, integrations).
2) Pick the closest mapped icon from the list above.
3) Ensure the chosen icon class exists in `src/css/base/typography.css` before committing.

## HTML bullet pattern
Each bullet list item should follow:
- `<li><i class="fa-solid fa-ICON"></i>Bullet text...</li>`

## Do not
- Do not use icons that are not mapped in `src/css/base/typography.css`.
- Do not leave bullets without icons in feature/outcome lists.
