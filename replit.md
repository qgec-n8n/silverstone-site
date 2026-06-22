# Replit Operating Rules

Replit is a non-production staging surface for the Silverstone transformation.
It is not the source of truth, not the production deploy path, and not the final release gate.

## Ownership

Replit may edit only these directories, and only when the current lease or handoff explicitly assigns them:

- `/web/src/routes/**`
- `/web/src/components/sections/**`
- `/web/src/components/ui/**`
- `/web/src/motion/framer/**`
- `/web/src/assets/**`
- `/web/public/**`
- `/web/tests/**`
- `/web/src/test/**`

Replit must not edit any path outside the assigned scope.
Replit must not edit legacy-root site files, Netlify files, integration files, or transformation evidence.

## Required workflow

- Load the relevant skill before starting any task.
- Use Preview inspection for every changed view or viewport.
- Capture screenshots or other visual evidence for the assigned surface.
- Treat Preview as inspection evidence only, not as proof of production parity.

## Safety boundaries

- No production deploys.
- No DNS, Netlify, analytics, environment-variable, booking, or email side effects.
- No secrets.
- No changes outside assigned paths.
- No concurrent edits to paths owned by Codex.

## Handoff expectations

- Return the exact branch, commit, file list, and screenshot evidence.
- Report any Preview limitations.
- Confirm that integration, build, SEO, and environment files were left untouched unless a handoff explicitly says otherwise.

