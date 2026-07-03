# Agent Context Cleanup Report

## 1. Summary

Primary causes found: always-loaded instructions duplicated the same safety rules, required repeated skill catalogue scans, treated MCP availability as a quality proxy, exposed all 149 project skills by default, enabled seven optional project MCP servers, and stored user-specific absolute paths in shared agent config.

Implemented cleanup: root and nested instructions were shortened, specialist guidance was moved to optional docs or path-scoped Claude rules, skill exposure now uses profiles, project MCP servers are disabled by default, active config paths are portable, and user-level Claude cleanup is proposed but not applied. Website runtime behavior and production configuration were not changed.

## 2. Before-And-After Measurements

| Measure | Before | After |
| --- | ---: | ---: |
| Primary always-loaded repo instruction bytes | 21,678 | 12,375 |
| `CLAUDE.md` | 39 lines / 1,872 bytes | 24 lines / 1,760 bytes |
| `AGENTS.md` | 139 lines / 11,053 bytes | 56 lines / 4,995 bytes |
| `web/AGENTS.override.md` | 77 lines / 4,795 bytes | 45 lines / 3,554 bytes |
| `replit.md` | 61 lines / 3,958 bytes | 39 lines / 2,066 bytes |
| Canonical project skills | 149 | 149 |
| Default exposed Claude skills | 149 | 9 |
| Specialist skills inactive by default | 0 | 140 |
| Project MCP servers enabled | 7 | 0 |
| User-specific absolute paths in changed shared config | present | 0 |

## 3. Repository Changes

| Status | File | Reason |
| --- | --- | --- |
| M | `.agents/SKILLS.md` | Documented skill profiles, conditional skill use, and optional MCP activation. |
| M | `.agents/SKILL_REVIEW_POLICY.md` | Replaced mandatory review loop with concise conditional policy. |
| M | `.agents/sync-skills.mjs` | Changed sync behavior to validate all skills but expose only the selected profile. |
| M | `.codex/bin/gpt-image-2-mcp.sh` | Made external gpt-image server path portable via GPT_IMAGE_2_MCP_DIR or $HOME. |
| M | `.codex/config.toml` | Regenerated Codex MCP config from .mcp.json with all project MCP servers disabled. |
| M | `.mcp.json` | Disabled optional project MCP servers by default and removed local absolute paths. |
| M | `AGENTS.md` | Consolidated repository-wide architecture, production, security, route, validation, and Git safety rules. |
| M | `CLAUDE.md` | Shortened repository-wide Claude guidance and removed mandatory catalogue/MCP scanning. |
| M | `docs/codex/environment-baseline.md` | Normalized active Codex baseline paths to placeholders. |
| M | `docs/codex/mandatory-dependencies.json` | Normalized repository/project paths to relative placeholders. |
| M | `docs/codex/mcp-inventory.md` | Updated MCP inventory with disabled defaults, activation method, and CLI alternatives. |
| M | `docs/codex/skill-mcp-routing.md` | Rewrote mandatory routing protocol as optional task-to-profile/tool reference. |
| M | `docs/codex/skills-inventory.md` | Regenerated inventory with relative paths, profile counts, and short descriptions. |
| M | `replit.md` | Reduced to Replit startup, staging, and handoff rules. |
| M | `web/AGENTS.override.md` | Kept only /web-specific application constraints, V2 invariants, and proportional validation. |
| M | `web/src/features/services-v2/components/secondary-hero.tsx` | Pre-existing user change detected before this task; not edited by this cleanup. |
| M | `web/src/styles/services-v2/services-v2.css` | Pre-existing user change detected before this task; not edited by this cleanup. |
| A | `.agents/skill-profiles.json` | Added default and specialist skill profile source of truth. |
| A | `.claude/rules/image-assets.md` | Added path-scoped Claude guidance for relevant files only. |
| A | `.claude/rules/web.md` | Added path-scoped Claude guidance for relevant files only. |
| A | `docs/codex/agent-context-baseline-audit.md` | Added required pre-edit baseline audit report. |
| A | `docs/codex/user-level-claude-cleanup-proposal.md` | Added review-only proposed user-level Claude cleanup diff. |
| A | `docs/codex/agent-context-cleanup-report.md` | Added full final cleanup report with detailed changed-file list, measurements, validation, and remaining actions. |

Pruned inactive default Claude skill symlinks (canonical skills remain under `.agents/skills/`):

- `.claude/skills/ab-testing`
- `.claude/skills/aceternity-ui`
- `.claude/skills/ad-creative`
- `.claude/skills/ads`
- `.claude/skills/aframe-webxr`
- `.claude/skills/agent-elements`
- `.claude/skills/agent-tools`
- `.claude/skills/ai-discoverability-audit`
- `.claude/skills/ai-elements`
- `.claude/skills/ai-seo`
- `.claude/skills/analytics`
- `.claude/skills/animated-component-libraries`
- `.claude/skills/animejs`
- `.claude/skills/aso`
- `.claude/skills/audit-website`
- `.claude/skills/babylonjs-engine`
- `.claude/skills/barba-js`
- `.claude/skills/better-auth-best-practices`
- `.claude/skills/blender-web-pipeline`
- `.claude/skills/brainstorming`
- `.claude/skills/building-native-ui`
- `.claude/skills/case-study-builder`
- `.claude/skills/cds-skill-creator`
- `.claude/skills/churn-prevention`
- `.claude/skills/co-marketing`
- `.claude/skills/cold-email`
- `.claude/skills/cold-outreach-sequence`
- `.claude/skills/community-marketing`
- `.claude/skills/competitor-profiling`
- `.claude/skills/competitors`
- `.claude/skills/content-idea-generator`
- `.claude/skills/content-strategy`
- `.claude/skills/copy-editing`
- `.claude/skills/copywriting`
- `.claude/skills/cro`
- `.claude/skills/customer-research`
- `.claude/skills/daily-briefing-builder`
- `.claude/skills/de-ai-ify`
- `.claude/skills/directory-submissions`
- `.claude/skills/emails`
- `.claude/skills/expo-tailwind-setup`
- `.claude/skills/find-skills`
- `.claude/skills/free-tools`
- `.claude/skills/go-mode`
- `.claude/skills/gsap`
- `.claude/skills/gsap-scrolltrigger`
- `.claude/skills/homepage-audit`
- `.claude/skills/image`
- `.claude/skills/interaction-design`
- `.claude/skills/landing-page-design`
- `.claude/skills/last30days`
- `.claude/skills/launch`
- `.claude/skills/lead-magnets`
- `.claude/skills/lightweight-3d-effects`
- `.claude/skills/linkedin-authority-builder`
- `.claude/skills/linkedin-profile-optimizer`
- `.claude/skills/locomotive-scroll`
- `.claude/skills/lottie-animations`
- `.claude/skills/magic-ui`
- `.claude/skills/marketing-ideas`
- `.claude/skills/marketing-plan`
- `.claude/skills/marketing-principles`
- `.claude/skills/marketing-psychology`
- `.claude/skills/meeting-prep`
- `.claude/skills/modern-web-design`
- `.claude/skills/motion-framer`
- `.claude/skills/newsletter-creation-curation`
- `.claude/skills/nextjs-app-router-patterns`
- `.claude/skills/nextjs-best-practices`
- `.claude/skills/nodejs-backend-patterns`
- `.claude/skills/nuxt`
- `.claude/skills/nuxt-ui`
- `.claude/skills/offers`
- `.claude/skills/onboarding`
- `.claude/skills/paywalls`
- `.claude/skills/pdf`
- `.claude/skills/pixijs-2d`
- `.claude/skills/plan-my-day`
- `.claude/skills/playcanvas-engine`
- `.claude/skills/popups`
- `.claude/skills/positioning-basics`
- `.claude/skills/pricing`
- `.claude/skills/product-marketing`
- `.claude/skills/programmatic-seo`
- `.claude/skills/prospecting`
- `.claude/skills/public-relations`
- `.claude/skills/react-components`
- `.claude/skills/react-native-architecture`
- `.claude/skills/react-native-best-practices`
- `.claude/skills/react-native-design`
- `.claude/skills/react-spring-physics`
- `.claude/skills/react-three-fiber`
- `.claude/skills/reddit-insights`
- `.claude/skills/referrals`
- `.claude/skills/remotion-best-practices`
- `.claude/skills/revops`
- `.claude/skills/rive-interactive`
- `.claude/skills/sales-enablement`
- `.claude/skills/scroll-reveal-libraries`
- `.claude/skills/signup`
- `.claude/skills/skill-creator`
- `.claude/skills/smithery-ai-cli`
- `.claude/skills/sms`
- `.claude/skills/social`
- `.claude/skills/social-card-gen`
- `.claude/skills/spline-interactive`
- `.claude/skills/substance-3d-texturing`
- `.claude/skills/supabase-postgres-best-practices`
- `.claude/skills/superdesign`
- `.claude/skills/tailwind-design-system`
- `.claude/skills/testimonial-collector`
- `.claude/skills/threejs-animation`
- `.claude/skills/threejs-fundamentals`
- `.claude/skills/threejs-geometry`
- `.claude/skills/threejs-interaction`
- `.claude/skills/threejs-lighting`
- `.claude/skills/threejs-loaders`
- `.claude/skills/threejs-materials`
- `.claude/skills/threejs-postprocessing`
- `.claude/skills/threejs-shaders`
- `.claude/skills/threejs-textures`
- `.claude/skills/threejs-webgl`
- `.claude/skills/tweet-draft-reviewer`
- `.claude/skills/ui-ux-pro-max`
- `.claude/skills/unocss`
- `.claude/skills/using-superpowers`
- `.claude/skills/vault-cleanup-auditor`
- `.claude/skills/vercel-composition-patterns`
- `.claude/skills/vercel-react-best-practices`
- `.claude/skills/vercel-react-native-skills`
- `.claude/skills/video`
- `.claude/skills/voice-extractor`
- `.claude/skills/vue`
- `.claude/skills/vue-best-practices`
- `.claude/skills/web-artifacts-builder`
- `.claude/skills/web-component-design`
- `.claude/skills/web-design-guidelines`
- `.claude/skills/web3d-integration-patterns`
- `.claude/skills/writing-plans`
- `.claude/skills/youtube-summarizer`

## 4. Skills

Default active profile: `core`.

Default enabled skills: `browser-use`, `frontend-design`, `frontend-testing`, `responsive-design`, `schema`, `seo-audit`, `shadcn-ui`, `site-architecture`, `tailwind-css`.

Specialist profiles: `frontend`, `visual-motion`, `seo-content`, `testing`, `marketing`, `automation`, `image-assets`, `all`.

Activation commands:

```bash
node .agents/sync-skills.mjs --profile core
node .agents/sync-skills.mjs --profile frontend
node .agents/sync-skills.mjs --profile visual-motion
node .agents/sync-skills.mjs --profile seo-content
node .agents/sync-skills.mjs --profile testing
node .agents/sync-skills.mjs --profile marketing
node .agents/sync-skills.mjs --profile automation
node .agents/sync-skills.mjs --profile image-assets
node .agents/sync-skills.mjs --profile all
node .agents/sync-skills.mjs --check
```

Validation: `core`, `image-assets`, and `all` activation were tested; final state restored to `core`; `--check` passed.

## 5. MCP Servers

| Server | Retained | Default | Activation | CLI Alternative | Reason |
| --- | --- | --- | --- | --- | --- |
| `aceternityui` | yes | disabled | set `enabled: true`, sync, restart host | existing components/local search | Specialist animated component lookup. |
| `gpt-image-2` | yes | disabled | set `enabled: true`, ensure env file, sync, restart host | verified existing assets | Unique generated-image capability. |
| `magic_21st` | yes | disabled | set `enabled: true`, provide `API_KEY_21ST`, sync, restart host | manual design/code search | Authenticated visual exploration only. |
| `magicui` | yes | disabled | set `enabled: true`, sync, restart host | existing components/local search | Specialist Magic UI registry lookup. |
| `shadcn` | yes | disabled | set `enabled: true`, sync, restart host | `cd web && npx shadcn@4.11.0 ...` | CLI is enough for routine work. |
| `typeui` | yes | disabled | set `enabled: true`, sync, restart host | project tokens/components | Optional remote design-system reference. |
| `untitledui` | yes | disabled | set `enabled: true`, sync, restart host | existing accessible components | Optional provider; PRO access may be limited. |

## 6. User-Level Claude Audit

Files inspected are listed in `docs/codex/user-level-claude-cleanup-proposal.md`. No `~/.claude` or `/Library/Application Support/ClaudeCode` file was modified.

Duplicates/obsolete context found: overlapping global plugins, route-specific Silverstone memories in the always visible memory index, legacy-root memories that can conflict with active `/web` framing, and generated-image setup details that should be image-task-only.

Proposed review-only diff: `docs/codex/user-level-claude-cleanup-proposal.md`.

## 7. Validation

Commands run and results:

- `node .agents/sync-skills.mjs --check` - passed.
- `node --check .agents/sync-skills.mjs` - passed.
- JSON parse for `.mcp.json`, `.agents/skill-profiles.json`, `.claude/settings.local.json`, `docs/codex/mandatory-dependencies.json` - passed.
- TOML parse for `.codex/config.toml`, `.agents/agent_assets_metadata.toml` - passed.
- `zsh -n .codex/bin/gpt-image-2-mcp.sh` - passed.
- `zsh -n .codex/bin/21st-magic-mcp.sh` - passed.
- Active symlink validation - passed, 9/9 core links resolve.
- `node .agents/sync-skills.mjs --profile image-assets` and `--profile all` - passed, then restored to `core`.
- MCP docs consistency check - passed, 7/7 project servers documented.
- `git diff --check` - passed.

Skipped: `/web` lint/typecheck/test/build/staging checks because this cleanup did not modify application runtime files. The two `/web` files shown in Git status were pre-existing user changes before this task.

## 8. Uncertain Items

- Historical large artifacts under `artifacts/` were left unchanged.
- Image manifests, contact sheets, and provenance records with local source paths were left unchanged as historical evidence.
- User-level Claude plugin settings and memory files were not changed without approval.
- Existing pre-task `/web` source changes were left untouched.

## 9. Remaining Manual Actions

- Review and approve or reject `docs/codex/user-level-claude-cleanup-proposal.md` before any user-level Claude changes.
- Run Claude Code `/memory` to verify the effective loaded instruction and memory list in an actual Claude session.
- Change global Claude plugin/account settings only if you approve the proposed user-level cleanup.
