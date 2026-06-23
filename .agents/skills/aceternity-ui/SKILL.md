---
name: aceternity-ui
description: Use this skill when users want to add, discover, or troubleshoot Aceternity UI components in React/Next.js projects — animated heroes, backgrounds, cards, navbars, text effects, and other motion-rich sections. Covers component selection, shadcn-style installation, and using the Aceternity UI MCP server to search and fetch install commands.
metadata:
  short-description: Build motion-rich UIs with Aceternity UI components
---

# Aceternity UI

Use this skill when the task involves Aceternity UI components — animated sections, dramatic backgrounds, hero blocks, scroll/cursor effects, or converting static sections into polished, motion-rich UI.

## When To Apply

Apply this skill when users ask to:

- Add an Aceternity UI component (for example: `bento-grid`, `background-beams`, `floating-dock`, `world-map`, `typewriter-effect`).
- Build a section with Aceternity effects (hero, feature grid, testimonials, CTA, navigation).
- Replace bespoke animation code with an Aceternity component.
- Troubleshoot installation/import issues for Aceternity components.

## Prerequisites

- React/Next.js project with Tailwind CSS.
- `framer-motion` (Motion) is the animation engine for most components — installs are usually handled automatically by the component's install command.
- A shadcn-initialised project is recommended so registry installs resolve aliases and dependencies:

```bash
npx shadcn@latest init
```

## Core Workflow

1. **Define the UI outcome first.** Identify the section type, tone, motion intensity, and responsive behaviour. Keep motion intentional — avoid stacking many high-motion effects in one viewport.
2. **Discover the right component.** Use the Aceternity UI MCP server (see below) to `search_components` and `get_component_info`, or browse <https://ui.aceternity.com/components>.
3. **Install the component** using the install command returned by `get_installation_info` (a shadcn `add` against the Aceternity registry / a documented manual install). Run it from the project root.
4. **Wire it in**, then verify required global CSS, keyframes, and the `@/` alias are configured.
5. **Tune motion and responsiveness** before adding more effects.

## Aceternity UI MCP Server

The MCP server (`aceternityui-mcp`) lets the agent search the Aceternity registry and fetch authoritative install commands instead of guessing. It is configured for this workspace in both `.codex/config.toml` (`[mcp_servers.aceternityui]`) and `.mcp.json` (`mcpServers.aceternityui`). It runs over stdio via `npx -y aceternityui-mcp` and requires **no API key**.

### Available MCP tools

- `search_components` — search components by name, description, or tags.
  - Example: `search_components({ query: "grid" })`
- `get_component_info` — detailed info about one component.
  - Example: `get_component_info({ componentName: "bento-grid" })`
- `get_installation_info` — install command + setup for a component.
  - Example: `get_installation_info({ componentName: "bento-grid" })`
- `list_categories` — list all component categories.
- `get_all_components` — list all available components (pass `includeProOnly: true` to include Pro components).

### Recommended MCP flow

1. `list_categories` or `search_components` to find candidates.
2. `get_component_info` to confirm fit (props, dependencies, Pro status).
3. `get_installation_info` to get the exact install command, then run it.

If the MCP server is unavailable, fall back to <https://ui.aceternity.com/components> and install the component per its documented instructions.

## Component Reference

Categories: layout, cards, form, navigation, background, text, map, sidebar, container, utilities.

Common components by use case:

- **Hero / impact:** `hero`, `hero-highlight`, `background-beams`, `container-cover`, `world-map`.
- **Layout / grids:** `bento-grid`, `layout-grid`, `feature-section`, `focus-cards`, `expandable-cards`.
- **Navigation:** `resizable-navbar`, `floating-dock`, `sidebar`, `animated-tabs`.
- **Text effects:** `text-generate-effect`, `text-hover-effect`, `typewriter-effect`, `text-reveal-card`.
- **Inputs / forms:** `signup-form`, `file-upload`, `placeholder-and-vanish-input`.
- **Misc:** `animated-tooltip`, `timeline`, `loader`.

Some components are Pro-only — `get_all_components` and `get_component_info` flag these via `isPro`.

## Troubleshooting

- **Registry / `components.json` error:** run `npx shadcn@latest init` in the project root.
- **`@/` alias not resolving:** use the project's alias style or relative imports.
- **Animation not running:** ensure `framer-motion` (Motion) is installed and the component is a client component (`"use client"` in Next.js App Router).
- **Visual mismatch after install:** check for required global CSS/keyframes listed in the component docs.

## Reference Links

- Components: <https://ui.aceternity.com/components>
- Docs: <https://ui.aceternity.com>
- MCP server: <https://github.com/rudra016/aceternityui-mcp>
