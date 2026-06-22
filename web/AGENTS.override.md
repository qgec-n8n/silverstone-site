# AGENTS.override

This file is the Codex instruction source for `/web`.
It is complete for `/web` work and does not rely on omitted rules elsewhere.

## Scope

- The approved rebuild may be implemented only inside `/web/**`.
- Do not edit any path outside `/web/**` unless that exact path is explicitly listed in the active ownership register or handoff for this prompt.
- Legacy root production files, Netlify files, integration files, and transformation evidence remain frozen unless explicitly named as owned.

## Non-negotiables

- Production safety first.
- Evidence first: reproduce and measure before editing.
- Minimal diffs only.
- No broad refactors, renames, or style-only formatting churn.
- No production deployment.
- No DNS, Netlify, analytics, environment-variable, booking, or email side effects.
- Parallax must continue to work on mobile and desktop.

## Required workflow

1. Confirm the target branch, scope, and exact files before touching anything.
2. Read the relevant authority files and the active handoff for the task.
3. Reproduce the problem or confirm the baseline with a focused command or inspection.
4. Make the smallest possible change inside `/web/**`.
5. Verify the result with the narrowest useful checks.
6. Record the evidence and the exact paths changed.

## Implementation boundary

- Use the approved rebuild architecture inside `/web`.
- Keep `/web` changes isolated from the legacy root until a separately approved cutover.
- Treat any non-`/web` change as out of scope unless it is one of the explicitly owned governance files for this prompt.

## Validation gates

- Do not claim success without fresh verification.
- Keep tests, screenshots, and command output aligned to the changed paths.
- If a regression appears, stop, isolate the cause, and revert the smallest change that introduced it.

