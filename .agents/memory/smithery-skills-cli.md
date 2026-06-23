---
name: Smithery skills CLI quirk
description: Why `npx skills add <smithery url>` installs the wrong skill, and the verified fallback.
---

# Smithery `skills add` installs the CLI wrapper, not the named skill

Running `npx -y skills add https://smithery.ai/skills/<owner>/<slug> --agent replit`
exits 0 and reports success, but installs the generic **`smithery-ai-cli`**
meta-skill into `.agents/skills/smithery-ai-cli/` (and adds it to
`skills-lock.json` as a `well-known` source). It does NOT install the actual
skill body for `<slug>`.

**Why:** Smithery-hosted skills are treated as a "well-known" source that
resolves to the Smithery CLI wrapper (the agent is expected to then use the
`smithery` CLI to fetch/use skills at runtime), rather than copying the skill's
files directly.

**How to apply:** When the goal is to install a *specific* Smithery skill's
content into `.agents/skills/<slug>/`:
1. Run the given command (it's harmless; leave `smithery-ai-cli` in place).
2. Open the skill's Smithery page — it lists the canonical source, usually a
   GitHub repo path (e.g. `synqing/PRISM.unified` at `.claude/skills/<Name>`).
   smithery.ai download/api endpoints return 404; do not rely on them.
3. Sparse-clone that GitHub path and copy the real skill dir into
   `.agents/skills/<slug>/`, normalizing the frontmatter `name` to lowercase
   matching the dir.
4. Verify the installed dir name matches the requested slug — if it's
   `smithery-ai-cli`, the CLI mis-resolved and the fallback is needed.
