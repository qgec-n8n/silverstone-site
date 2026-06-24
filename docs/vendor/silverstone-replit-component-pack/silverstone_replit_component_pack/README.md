# Silverstone Replit Component and Prompt Pack

This archive replaces the unavailable 21st.dev MCP workflow with local source references and four Replit prompts.

## Folder structure

- `components/21st-reference/` — local source references for the six requested components and supporting utilities.
- `demos/` — minimal usage examples.
- `styles/` — animation/theme reference CSS.
- `docs/ADAPTATION_GUIDE.md` — required compatibility and design guidance.
- `docs/LIBRARY_CATALOG.md` — researched component-library sources Replit can inspect directly.
- `docs/SOURCE_MANIFEST.md` — source URLs and dependency summary.
- `prompts/00-selective-rollback-preparation.txt` — run first.
- `prompts/01-global-system-and-homepage.txt` — run after preparation.
- `prompts/02-services-consulting-and-demos.txt` — run after reviewing Prompt 1 Preview.
- `prompts/03-remaining-pages-seo-and-final-pass.txt` — run after reviewing Prompt 2 Preview.

## Important

The reference components are not intended to be copied into production unchanged. Replit must:

1. inspect the source and dependencies;
2. adapt imports and aliases for the existing React Router/Vite app;
3. replace all template content and fake claims;
4. restyle everything with Silverstone tokens;
5. fix accessibility, reduced-motion, cleanup, responsiveness and performance;
6. copy only the selected adapted implementation into `/web/src/**`;
7. keep this archive under documentation/vendor reference, not as a runtime dependency.

The `hero-button-theme-reference.css` file is intentionally off-brand source material. It must not replace the Silverstone theme.
