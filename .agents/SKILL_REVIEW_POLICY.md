# Skill Review Policy

Use skills when they materially improve the current task. Do not treat the skill catalogue as an always-on preflight step.

## Rules

- Select the minimum skill set that directly applies to the task.
- Use `.agents/skill-profiles.json`, `.agents/SKILLS.md`, or `docs/codex/skills-inventory.md` to identify candidates before opening full instructions.
- Open and read a complete `SKILL.md` only after choosing that skill.
- Do not rescan the catalogue unless the task scope materially changes.
- Do not use a skill solely because it exists or because it is exposed in `.claude/skills/`.
- Do not search for new skills unless the task requires a capability unavailable in the current project profiles.
- Do not claim to have used a skill or MCP server unless it was actually used.

## Default Profile

The default Claude exposure profile is `core`. Specialist profiles are opt-in:

```bash
node .agents/sync-skills.mjs --profile frontend
node .agents/sync-skills.mjs --profile visual-motion
node .agents/sync-skills.mjs --profile seo-content
node .agents/sync-skills.mjs --profile testing
node .agents/sync-skills.mjs --profile marketing
node .agents/sync-skills.mjs --profile automation
node .agents/sync-skills.mjs --profile image-assets
node .agents/sync-skills.mjs --profile all
```

Use `node .agents/sync-skills.mjs --check` to verify the active links and Codex MCP config.
