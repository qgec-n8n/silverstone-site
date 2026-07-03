---
paths:
  - "web/**"
---
# /web Rules

- `/web` is the active React application.
- Keep `/web` isolated from the frozen legacy root until an approved cutover.
- Preserve indexable initial HTML for routes: route content, metadata, canonical tags, JSON-LD, links, pricing essentials, legal text, and conversion paths must not depend on a client-only shell.
- Change generated files under `web/src/**/generated/` only through documented scripts or with matching source evidence.
- Run validation from `/web` and choose the smallest command set that covers the changed behavior.
