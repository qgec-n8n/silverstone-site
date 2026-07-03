# User-Level Claude Cleanup Proposal

No files under `~/.claude/` were modified. This document is a proposed diff for review only.

## Files Inspected

- `~/.claude/settings.json`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/MEMORY.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/feedback_benchmark_attribution.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/feedback_premium_visual_variety.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/feedback_preview_tool_visibility_throttling.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/project_industries_v2_rebuild.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/project_seo_status.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/project_services_v2_rebuild.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/project_site_overview.md`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/reference_gpt_image_2_mcp.md`

Absent:

- `~/.claude/CLAUDE.md`
- `~/.claude/rules/`
- `~/.claude/settings.local.json`
- `/Library/Application Support/ClaudeCode/CLAUDE.md`

## Safe Shortening Candidate

`~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/MEMORY.md`

```diff
- [SEO Implementation Status](project_seo_status.md) — What SEO changes were made on 2026-03-18 and what's still pending (legacy root site)
- [Site Overview](project_site_overview.md) — Key facts about the silverstone-ai.com site structure, tech stack, and GA4 ID (legacy root site)
- [Industries-v2 Rebuild](project_industries_v2_rebuild.md) — 9 industry routes + both hubs rebuilt 2026-07-02 from the approved copy pack; wiring map, AnimatedMetricValue prerender fix, gpt-image-2 billing limit open item
- [Services-v2 Rebuild](project_services_v2_rebuild.md) — All 7 /web service pages built + 4 refinement passes 2026-07-01; flex/replaced-element and intro-overlay-timing gotchas worth reading first
- [Benchmark Attribution](feedback_benchmark_attribution.md) — User wants CSV figures framed as verified Silverstone results, not external benchmarks
- [gpt-image-2-mcp Setup](reference_gpt_image_2_mcp.md) — Image-gen server config, secret storage, and session-registration gotcha
- [Preview Tool Visibility Throttling](feedback_preview_tool_visibility_throttling.md) — Claude_Preview tab is visibility:hidden, breaks IntersectionObserver-based reveal testing
- [Premium Visual Variety](feedback_premium_visual_variety.md) — Don't flatten per-page design variety into one generic shared colour/treatment when asked to "make things match"
+ Active `/web` route work:
+ - [Services-v2 Rebuild](project_services_v2_rebuild.md) — Open only for services-v2 layout, CTA, reveal, or image-fit work.
+ - [Industries-v2 Rebuild](project_industries_v2_rebuild.md) — Open only for industry route, hub, canonical, or generated-route work.
+
+ Project-specific feedback:
+ - [Benchmark Attribution](feedback_benchmark_attribution.md) — Use for service/industry metric attribution.
+ - [Premium Visual Variety](feedback_premium_visual_variety.md) — Use for visual-consistency requests involving CTA/accent treatments.
+ - [Preview Tool Visibility Throttling](feedback_preview_tool_visibility_throttling.md) — Use when Claude preview disagrees with scroll-triggered reveal behavior.
+
+ On-demand references:
+ - [gpt-image-2-mcp Setup](reference_gpt_image_2_mcp.md) — Open only for generated-image tasks.
+ - [SEO Implementation Status](project_seo_status.md) — Legacy root SEO history; do not use as active `/web` architecture.
+ - [Site Overview](project_site_overview.md) — Legacy root site snapshot; superseded by repository `/web` instructions for active work.
```

Reason: keep useful memories discoverable while making route-specific and legacy-root context conditional.

## User Decision Candidate

`~/.claude/settings.json`

```diff
 {
   "enabledPlugins": {
-    "marketing-skills@marketingskills": true,
-    "frontend-design@claude-code-plugins": true,
-    "code-review@claude-code-plugins": true,
-    "superpowers@superpowers-dev": true,
-    "frontend-design@claude-plugins-official": true,
-    "github@claude-plugins-official": true,
-    "playwright@claude-plugins-official": true,
-    "superpowers@claude-plugins-official": true,
-    "chrome-devtools-mcp@claude-plugins-official": true,
-    "firecrawl@claude-plugins-official": true,
-    "skill-creator@claude-plugins-official": true
+    "marketing-skills@marketingskills": false,
+    "frontend-design@claude-code-plugins": false,
+    "code-review@claude-code-plugins": false,
+    "superpowers@superpowers-dev": false,
+    "frontend-design@claude-plugins-official": true,
+    "github@claude-plugins-official": true,
+    "playwright@claude-plugins-official": true,
+    "superpowers@claude-plugins-official": false,
+    "chrome-devtools-mcp@claude-plugins-official": false,
+    "firecrawl@claude-plugins-official": false,
+    "skill-creator@claude-plugins-official": false
   },
```

Reason: reduce duplicate plugin surfaces and disable broad optional plugins by default. Keep GitHub and Playwright because they are commonly useful; keep one frontend-design provider. This needs user approval because it affects global Claude behavior outside this repository.

## Uncertain Changes Left For User

- Whether to remove legacy root memories from the silverstone memory index entirely.
- Whether to disable global marketplace entries, not just plugin enablement.
- Whether to delete task/session JSON files under `~/.claude/tasks/` or `~/.claude/sessions/`; they were not audited for content and may be useful history.
- Whether to keep both official and non-official frontend-design plugins.
