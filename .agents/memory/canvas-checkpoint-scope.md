---
name: Canvas assets vs. checkpoint write-scope
description: How to keep `.canvas/` board assets out of a checkpoint when working under a strict write-scope that forbids editing tracked config.
---

# Canvas assets get swept into checkpoints

Placing images on the Canvas writes them to a top-level `.canvas/` directory. By
default `.canvas/` is **untracked and NOT gitignored**, so the platform's
end-of-task checkpoint (`git add -A` style) will sweep it in.

**Rule:** when a task restricts writes to specific paths (e.g. `/web/**`,
`/docs/**`) and Canvas was used for review, keep `.canvas/` out of the checkpoint
**without** editing the tracked `.gitignore` — append `.canvas/` to
`.git/info/exclude` instead (local, non-committed). Keep any image evidence you
actually need by saving canonical copies under an owned docs path
(`screenshots/`), not by relying on `.canvas/`.

**Why:** editing the root `.gitignore` is a tracked-file change outside owned
paths and reads as an ownership/scope violation in architect review; the local
exclude achieves the same exclusion with zero tracked edits. Deleting `.canvas/`
also works but destroys the user's board.

**How to apply:** `grep -qxF '.canvas/' .git/info/exclude || printf '%s\n' '.canvas/' >> .git/info/exclude`, then verify with `git check-ignore .canvas`.
