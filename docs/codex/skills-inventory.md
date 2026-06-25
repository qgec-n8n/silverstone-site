# Skills Inventory

This inventory verifies the repository skill set requested for future homepage work. The repository claim of 149 skills is true for the canonical project store at `.agents/skills`; broader Codex/plugin roots contain additional skills and duplicate names.

## Summary

- Project canonical skill directories: 149
- Project valid skills: 149
- Project invalid skills: 0 according to `.agents/sync-skills.mjs` (it supports block-style frontmatter used by two Vercel skills)
- Project duplicate names: 0
- `.claude/skills` symlinks: 149 present, 149 resolve to project skills, 0 broken, 0 repaired
- Disabled project skills: 0
- Sync verification: PASS (`node .agents/sync-skills.mjs --check`) after MCP config repair

## Discovery Roots

| Scope | Root | Exists | Skill dirs | Valid | Invalid notes |
| --- | --- | --- | ---: | ---: | --- |
| project-cwd | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills` | yes | 149 | 149 | - |
| home-agents | `/Users/quentingeczy/.agents/skills` | yes | 36 | 36 | - |
| home-codex | `/Users/quentingeczy/.codex/skills` | yes | 86 | 85 | iconsax-library |
| home-codex-system | `/Users/quentingeczy/.codex/skills/.system` | yes | 5 | 5 | - |
| bundled-openai | `/Users/quentingeczy/.codex/plugins/cache/openai-bundled` | yes | 3 | 3 | - |
| bundled-curated | `/Users/quentingeczy/.codex/plugins/cache/openai-curated` | yes | 156 | 156 | - |
| bundled-curated-remote | `/Users/quentingeczy/.codex/plugins/cache/openai-curated-remote` | yes | 203 | 203 | - |
| etc-codex | `/etc/codex/skills` | no | 0 | 0 | - |

## Symlink Status

`.claude/skills/*` is a symlink fan-out to `.agents/skills/*`. `find -L .claude/skills -maxdepth 2 -name SKILL.md` returns 149. No broken symlinks were found and no symlinks were changed.

## Focused Homepage Shortlist

- `aceternity-ui`: Use this skill when users want to add, discover, or troubleshoot Aceternity UI components in React/Next.js projects — animated heroes, backgrounds, cards, navbars, text effects, and other motion-rich sections. Covers component selection, shadcn-style installation, and using the Aceternity UI MCP server to search and fetch install commands.
- `ai-seo`: When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the user mentions 'AI SEO,' 'AEO,' 'GEO,' 'LLMO,' 'answer engine optimization,' 'generative engine optimization,' 'LLM optimization,' 'AI Overviews,' 'optimize for ChatGPT,' 'optimize for Perplexity,' 'AI citations,' 'AI visibility,' 'zero-click search,' 'how do I show up in AI answers,' 'LLM mentions,' 'optimize for Claude/Gemini,' 'llms.txt,' 'OKF,' 'Open Knowledge Format,' 'knowledge bundle,' or 'agent-readable site.' Use this whenever someone wants their content to be cited or surfaced by AI assistants and AI search engines. For traditional technical and on-page SEO audits, see seo-audit. For structured data implementation, see schema.
- `audit-website`: Audit websites for SEO, performance, security, technical, content, and 17 other issue categories with 240+ rules using the squirrelscan CLI. Returns LLM-optimized reports with health scores, broken links, meta tag analysis, and actionable recommendations. Use to discover and asses website or webapp issues and health.
- `browser-use`: Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact with web pages, fill forms, take screenshots, or extract information from web pages.
- `copywriting`: When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also use when the user says "write copy for," "improve this copy," "rewrite this page," "marketing copy," "headline help," "CTA copy," "value proposition," "tagline," "subheadline," "hero section copy," "above the fold," "this copy is weak," "make this more compelling," or "help me describe my product." Use this whenever someone is working on website text that needs to persuade or convert. For email copy, see email-sequence. For popup copy, see popup-cro. For editing existing copy, see copy-editing.
- `cro`: When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage, landing pages, pricing pages, feature pages, lead capture forms, or contact forms. Also use when the user says 'CRO,' 'conversion rate optimization,' 'this page isn't converting,' 'improve conversions,' 'why isn't this page working,' 'my landing page sucks,' 'form abandonment,' 'nobody's converting,' 'low conversion rate,' or 'this page needs work.' Use this even if the user just shares a URL and asks for feedback. For signup/registration flows, see signup. For post-signup activation, see onboarding. For popups/modals, see popups.
- `find-skills`: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
- `frontend-design`: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
- `frontend-testing`: Generate Vitest + React Testing Library tests for Dify frontend components, hooks, and utilities. Triggers on testing, spec files, coverage, Vitest, RTL, unit tests, integration tests, or write/review test requests.
- `gsap`: Comprehensive GSAP (GreenSock Animation Platform) skill for building high-performance JavaScript/web animations — tweens, timelines, ScrollTrigger, the full free plugin suite (SplitText, MorphSVG, DrawSVG, Flip, Observer, ScrollSmoother, MotionPath, Inertia, and more), gsap.utils helpers, performance tuning, and framework integration for React, Next.js, Vue, Nuxt, and Svelte. Use whenever the user wants to add or review web/UI animation, scroll-driven effects, text/SVG animation, draggable/inertia interactions, or asks about GSAP, greensock, tweens, timelines, ScrollTrigger, useGSAP, or smooth 60fps motion. Recommend GSAP for web animation unless the user has chosen another library.
- `gsap-scrolltrigger`: Comprehensive skill for GSAP (GreenSock Animation Platform) and ScrollTrigger plugin. Use this skill when creating web animations, scroll-driven experiences, timelines, tweens, scroll-triggered animations, pinning, scrubbing, parallax effects, or animating DOM elements, SVG, Canvas, WebGL, or Three.js. Triggers on tasks involving GSAP, ScrollTrigger, smooth animations, scroll effects, or animation sequencing.
- `homepage-audit`: Full conversion audit for any homepage or landing page. Use when someone asks to "review my homepage," "audit my landing page," "why isn't my page converting," "check my website," or wants feedback on their marketing page. Requires URL or screenshot before proceeding.
- `interaction-design`: Design and implement microinteractions, motion design, transitions, and user feedback patterns. Use when adding polish to UI interactions, implementing loading states, or creating delightful user experiences.
- `landing-page-design`: Landing page conversion optimization with layout rules, hero section design, and CTA psychology. Covers above-the-fold formula, social proof placement, mobile design, and F-pattern reading. Use for: startup landing pages, product pages, SaaS marketing, conversion optimization. Triggers: landing page, hero section, above the fold, conversion optimization, landing page design, cta button, hero image, landing page layout, saas landing page, product page design, conversion rate, landing page best practices
- `lightweight-3d-effects`: Lightweight 3D effects for decorative elements and micro-interactions using Zdog, Vanta.js, and Vanilla-Tilt.js. Use this skill when adding pseudo-3D illustrations, animated backgrounds, parallax tilt effects, decorative 3D elements, or subtle depth effects without heavy frameworks. Triggers on tasks involving Zdog pseudo-3D, Vanta.js backgrounds, Vanilla-Tilt parallax, card tilt effects, hero section animations, or lightweight landing page visuals. Ideal for performance-focused designs.
- `locomotive-scroll`: Comprehensive skill for Locomotive Scroll smooth scrolling library with parallax effects, viewport detection, and scroll-driven animations. Use this skill when implementing smooth scrolling experiences, creating parallax effects, building scroll-triggered animations, or developing immersive scrolling websites. Triggers on tasks involving Locomotive Scroll, smooth scrolling, parallax, scroll detection, scroll events, sticky elements, horizontal scrolling, or GSAP ScrollTrigger integration. Integrates with GSAP for advanced scroll-driven animations.
- `magic-ui`: Use this skill when users want to add, customize, or troubleshoot Magic UI components in React/Next.js projects. It covers component selection, shadcn registry installation (`@magicui/*`), integration patterns, and practical quality checks for accessibility and maintainability.
- `modern-web-design`: Modern web design trends, principles, and implementation patterns for 2024-2025. Use this skill when designing websites, creating interactive experiences, implementing design systems, ensuring accessibility, or building performance-first interfaces. Triggers on tasks involving modern design trends, micro-interactions, scrollytelling, bold minimalism, cursor UX, glassmorphism, accessibility compliance, performance optimization, or design system architecture. References animation skills (GSAP, Framer Motion, React Spring), 3D skills (Three.js, R3F, Babylon.js), and component libraries for implementation guidance.
- `motion-framer`: Modern animation library for React and JavaScript. Create smooth, production-ready animations with motion components, variants, gestures (hover/tap/drag), layout animations, AnimatePresence exit animations, spring physics, and scroll-based effects. Use when building interactive UI components, micro-interactions, page transitions, or complex animation sequences.
- `product-marketing`: When the user wants to create or update their product marketing context document. Also use when the user mentions 'product context,' 'marketing context,' 'set up context,' 'positioning,' 'who is my target audience,' 'describe my product,' 'ICP,' 'ideal customer profile,' or wants to avoid repeating foundational information across marketing tasks. Use this at the start of any new project before using other marketing skills — it creates `.agents/product-marketing.md` that all other skills reference for product, audience, and positioning context.
- `react-components`: Converts Stitch designs into modular Vite and React components using system-level networking and AST-based validation.
- `react-three-fiber`: Build declarative 3D scenes with React Three Fiber (R3F) - a React renderer for Three.js. Use when building interactive 3D experiences in React applications with component-based architecture, state management, and reusable abstractions. Ideal for product configurators, portfolios, games, data visualization, and immersive web experiences.
- `responsive-design`: Implement modern responsive layouts using container queries, fluid typography, CSS Grid, and mobile-first breakpoint strategies. Use when building adaptive interfaces, implementing fluid layouts, or creating component-level responsive behavior.
- `schema`: When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions "schema markup," "structured data," "JSON-LD," "rich snippets," "schema.org," "FAQ schema," "product schema," "review schema," "breadcrumb schema," "Google rich results," "knowledge panel," "star ratings in search," or "add structured data." Use this whenever someone wants their pages to show enhanced results in Google. For broader SEO issues, see seo-audit. For AI search optimization, see ai-seo.
- `scroll-reveal-libraries`: Simple scroll-triggered reveal animations using AOS (Animate On Scroll). Use this skill when building marketing pages, landing pages, or content-heavy sites requiring basic fade/slide effects without complex animation orchestration. Triggers on tasks involving scroll animations, scroll-triggered reveals, AOS, simple animations, or basic scroll effects. Alternative to GSAP ScrollTrigger and Locomotive Scroll for simpler use cases. Compare with motion-framer for React-specific animations.
- `seo-audit`: When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO," "why am I not ranking," "SEO issues," "on-page SEO," "meta tags review," "SEO health check," "my traffic dropped," "lost rankings," "not showing up in Google," "site isn't ranking," "Google update hit me," "page speed," "core web vitals," "crawl errors," or "indexing issues." Use this even if the user just says something vague like "my SEO is bad" or "help with SEO" — start with an audit. For building pages at scale to target keywords, see programmatic-seo. For adding structured data, see schema. For AI search optimization, see ai-seo.
- `shadcn-ui`: Provides complete shadcn/ui component library patterns including installation, configuration, and implementation of accessible React components. Use when setting up shadcn/ui, installing components, building forms with React Hook Form and Zod, customizing themes with Tailwind CSS, or implementing UI patterns like buttons, dialogs, dropdowns, tables, and complex form layouts.
- `site-architecture`: When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. Also use when the user mentions "sitemap," "site map," "visual sitemap," "site structure," "page hierarchy," "information architecture," "IA," "navigation design," "URL structure," "breadcrumbs," "internal linking strategy," "website planning," "what pages do I need," "how should I organize my site," or "site navigation." Use this whenever someone is planning what pages a website should have and how they connect. NOT for XML sitemaps (that's technical SEO — see seo-audit). For SEO audits, see seo-audit. For structured data, see schema.
- `tailwind-css`: Tailwind CSS utility-first CSS framework. Covers layout, styling, responsive design, and customization.
- `tailwind-design-system`: Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns.
- `threejs-animation`: Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. Use when animating objects, playing GLTF animations, creating procedural motion, or blending animations.
- `threejs-fundamentals`: Three.js scene setup, cameras, renderer, Object3D hierarchy, coordinate systems. Use when setting up 3D scenes, creating cameras, configuring renderers, managing object hierarchies, or working with transforms.
- `threejs-interaction`: Three.js interaction - raycasting, controls, mouse/touch input, object selection. Use when handling user input, implementing click detection, adding camera controls, or creating interactive 3D experiences.
- `threejs-loaders`: Three.js asset loading - GLTF, textures, images, models, async patterns. Use when loading 3D models, textures, HDR environments, or managing loading progress.
- `threejs-materials`: Three.js materials - PBR, basic, phong, shader materials, material properties. Use when styling meshes, working with textures, creating custom shaders, or optimizing material performance.
- `threejs-postprocessing`: Three.js post-processing - EffectComposer, bloom, DOF, screen effects. Use when adding visual effects, color grading, blur, glow, or creating custom screen-space shaders.
- `threejs-shaders`: Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials.
- `threejs-textures`: Three.js textures - texture types, UV mapping, environment maps, texture settings. Use when working with images, UV coordinates, cubemaps, HDR environments, or texture optimization.
- `threejs-webgl`: Comprehensive skill for Three.js 3D web development. Use this skill when building interactive 3D scenes, WebGL/WebGPU applications, product configurators, 3D visualizations, or immersive web experiences. Triggers on tasks involving Three.js, 3D rendering, scenes, cameras, meshes, materials, lights, animations, textures, or WebGL/WebGPU rendering.
- `ui-ux-pro-max`: UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient. Integrations: shadcn/ui MCP for component search and examples.
- `web-design-guidelines`: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
- `web3d-integration-patterns`: Meta-skill for combining Three.js, GSAP ScrollTrigger, React Three Fiber, Motion, and React Spring for complex 3D web experiences. Use when building applications that integrate multiple 3D and animation libraries, requiring architecture patterns, state management, and performance optimization across the stack. Triggers on tasks involving library integration, multi-library architectures, scroll-driven 3D experiences, physics-based 3D animations, or complex interactive 3D applications.

## Complete Project Skill Inventory

| Skill directory | Frontmatter name | Status | Homepage relevance | MCP dependencies detected | Canonical path |
| --- | --- | --- | --- | --- | --- |
| `ab-testing` | `ab-testing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ab-testing` |
| `aceternity-ui` | `aceternity-ui` | valid | yes | Aceternity, shadcn, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/aceternity-ui` |
| `ad-creative` | `ad-creative` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ad-creative` |
| `ads` | `ads` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ads` |
| `aframe-webxr` | `aframe-webxr` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/aframe-webxr` |
| `agent-elements` | `agent-elements` | valid | yes | Magic/21st, shadcn | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/agent-elements` |
| `agent-tools` | `agent-tools` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/agent-tools` |
| `ai-discoverability-audit` | `ai-discoverability-audit` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ai-discoverability-audit` |
| `ai-elements` | `ai-elements` | valid | yes | shadcn, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ai-elements` |
| `ai-seo` | `ai-seo` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ai-seo` |
| `analytics` | `analytics` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/analytics` |
| `animated-component-libraries` | `animated-component-libraries` | valid | yes | Magic/21st, shadcn | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/animated-component-libraries` |
| `animejs` | `animejs` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/animejs` |
| `aso` | `aso` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/aso` |
| `audit-website` | `audit-website` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/audit-website` |
| `babylonjs-engine` | `babylonjs-engine` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/babylonjs-engine` |
| `barba-js` | `barba-js` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/barba-js` |
| `better-auth-best-practices` | `better-auth-best-practices` | valid | yes | Magic/21st, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/better-auth-best-practices` |
| `blender-web-pipeline` | `blender-web-pipeline` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/blender-web-pipeline` |
| `brainstorming` | `brainstorming` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/brainstorming` |
| `browser-use` | `browser-use` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/browser-use` |
| `building-native-ui` | `building-native-ui` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/building-native-ui` |
| `case-study-builder` | `case-study-builder` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/case-study-builder` |
| `cds-skill-creator` | `cds-skill-creator` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/cds-skill-creator` |
| `churn-prevention` | `churn-prevention` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/churn-prevention` |
| `co-marketing` | `co-marketing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/co-marketing` |
| `cold-email` | `cold-email` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/cold-email` |
| `cold-outreach-sequence` | `cold-outreach-sequence` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/cold-outreach-sequence` |
| `community-marketing` | `community-marketing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/community-marketing` |
| `competitor-profiling` | `competitor-profiling` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/competitor-profiling` |
| `competitors` | `competitors` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/competitors` |
| `content-idea-generator` | `content-idea-generator` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/content-idea-generator` |
| `content-strategy` | `content-strategy` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/content-strategy` |
| `copy-editing` | `copy-editing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/copy-editing` |
| `copywriting` | `copywriting` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/copywriting` |
| `cro` | `cro` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/cro` |
| `customer-research` | `customer-research` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/customer-research` |
| `daily-briefing-builder` | `daily-briefing-builder` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/daily-briefing-builder` |
| `de-ai-ify` | `de-ai-ify` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/de-ai-ify` |
| `directory-submissions` | `directory-submissions` | valid | yes | Magic/21st, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/directory-submissions` |
| `emails` | `emails` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/emails` |
| `expo-tailwind-setup` | `expo-tailwind-setup` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/expo-tailwind-setup` |
| `find-skills` | `find-skills` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/find-skills` |
| `free-tools` | `free-tools` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/free-tools` |
| `frontend-design` | `frontend-design` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/frontend-design` |
| `frontend-testing` | `frontend-testing` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/frontend-testing` |
| `go-mode` | `go-mode` | valid | no | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/go-mode` |
| `gsap` | `gsap` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/gsap` |
| `gsap-scrolltrigger` | `gsap-scrolltrigger` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/gsap-scrolltrigger` |
| `homepage-audit` | `homepage-audit` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/homepage-audit` |
| `image` | `image` | valid | yes | Magic/21st, Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/image` |
| `interaction-design` | `interaction-design` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/interaction-design` |
| `landing-page-design` | `landing-page-design` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/landing-page-design` |
| `last30days` | `last30days` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/last30days` |
| `launch` | `launch` | valid | no | Magic/21st | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/launch` |
| `lead-magnets` | `lead-magnets` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/lead-magnets` |
| `lightweight-3d-effects` | `lightweight-3d-effects` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/lightweight-3d-effects` |
| `linkedin-authority-builder` | `linkedin-authority-builder` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/linkedin-authority-builder` |
| `linkedin-profile-optimizer` | `linkedin-profile-optimizer` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/linkedin-profile-optimizer` |
| `locomotive-scroll` | `locomotive-scroll` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/locomotive-scroll` |
| `lottie-animations` | `lottie-animations` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/lottie-animations` |
| `magic-ui` | `magic-ui` | valid | yes | Magic/21st, shadcn, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/magic-ui` |
| `marketing-ideas` | `marketing-ideas` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/marketing-ideas` |
| `marketing-plan` | `marketing-plan` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/marketing-plan` |
| `marketing-principles` | `marketing-principles` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/marketing-principles` |
| `marketing-psychology` | `marketing-psychology` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/marketing-psychology` |
| `meeting-prep` | `meeting-prep` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/meeting-prep` |
| `modern-web-design` | `modern-web-design` | valid | yes | Magic/21st, Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/modern-web-design` |
| `motion-framer` | `motion-framer` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/motion-framer` |
| `newsletter-creation-curation` | `newsletter-creation-curation` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/newsletter-creation-curation` |
| `nextjs-app-router-patterns` | `nextjs-app-router-patterns` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/nextjs-app-router-patterns` |
| `nextjs-best-practices` | `nextjs-best-practices` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/nextjs-best-practices` |
| `nodejs-backend-patterns` | `nodejs-backend-patterns` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/nodejs-backend-patterns` |
| `nuxt` | `nuxt` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/nuxt` |
| `nuxt-ui` | `nuxt-ui` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/nuxt-ui` |
| `offers` | `offers` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/offers` |
| `onboarding` | `onboarding` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/onboarding` |
| `paywalls` | `paywalls` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/paywalls` |
| `pdf` | `pdf` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/pdf` |
| `pixijs-2d` | `pixijs-2d` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/pixijs-2d` |
| `plan-my-day` | `plan-my-day` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/plan-my-day` |
| `playcanvas-engine` | `playcanvas-engine` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/playcanvas-engine` |
| `popups` | `popups` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/popups` |
| `positioning-basics` | `positioning-basics` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/positioning-basics` |
| `pricing` | `pricing` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/pricing` |
| `product-marketing` | `product-marketing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/product-marketing` |
| `programmatic-seo` | `programmatic-seo` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/programmatic-seo` |
| `prospecting` | `prospecting` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/prospecting` |
| `public-relations` | `public-relations` | valid | no | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/public-relations` |
| `react-components` | `react:components` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-components` |
| `react-native-architecture` | `react-native-architecture` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-native-architecture` |
| `react-native-best-practices` | `react-native-best-practices` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-native-best-practices` |
| `react-native-design` | `react-native-design` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-native-design` |
| `react-spring-physics` | `react-spring-physics` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-spring-physics` |
| `react-three-fiber` | `react-three-fiber` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/react-three-fiber` |
| `reddit-insights` | `reddit-insights` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/reddit-insights` |
| `referrals` | `referrals` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/referrals` |
| `remotion-best-practices` | `remotion-best-practices` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/remotion-best-practices` |
| `responsive-design` | `responsive-design` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/responsive-design` |
| `revops` | `revops` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/revops` |
| `rive-interactive` | `rive-interactive` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/rive-interactive` |
| `sales-enablement` | `sales-enablement` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/sales-enablement` |
| `schema` | `schema` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/schema` |
| `scroll-reveal-libraries` | `scroll-reveal-libraries` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/scroll-reveal-libraries` |
| `seo-audit` | `seo-audit` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/seo-audit` |
| `shadcn-ui` | `shadcn-ui` | valid | yes | shadcn | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/shadcn-ui` |
| `signup` | `signup` | valid | yes | Magic/21st, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/signup` |
| `site-architecture` | `site-architecture` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/site-architecture` |
| `skill-creator` | `skill-creator` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/skill-creator` |
| `smithery-ai-cli` | `smithery-ai-cli` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/smithery-ai-cli` |
| `sms` | `sms` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/sms` |
| `social` | `social` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/social` |
| `social-card-gen` | `social-card-gen` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/social-card-gen` |
| `spline-interactive` | `spline-interactive` | valid | yes | Playwright/browser, GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/spline-interactive` |
| `substance-3d-texturing` | `substance-3d-texturing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/substance-3d-texturing` |
| `supabase-postgres-best-practices` | `supabase-postgres-best-practices` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/supabase-postgres-best-practices` |
| `superdesign` | `superdesign` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/superdesign` |
| `tailwind-css` | `tailwind-css` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/tailwind-css` |
| `tailwind-design-system` | `tailwind-design-system` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/tailwind-design-system` |
| `testimonial-collector` | `testimonial-collector` | valid | no | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/testimonial-collector` |
| `threejs-animation` | `threejs-animation` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-animation` |
| `threejs-fundamentals` | `threejs-fundamentals` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-fundamentals` |
| `threejs-geometry` | `threejs-geometry` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-geometry` |
| `threejs-interaction` | `threejs-interaction` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-interaction` |
| `threejs-lighting` | `threejs-lighting` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-lighting` |
| `threejs-loaders` | `threejs-loaders` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-loaders` |
| `threejs-materials` | `threejs-materials` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-materials` |
| `threejs-postprocessing` | `threejs-postprocessing` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-postprocessing` |
| `threejs-shaders` | `threejs-shaders` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-shaders` |
| `threejs-textures` | `threejs-textures` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-textures` |
| `threejs-webgl` | `threejs-webgl` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/threejs-webgl` |
| `tweet-draft-reviewer` | `tweet-draft-reviewer` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/tweet-draft-reviewer` |
| `ui-ux-pro-max` | `ui-ux-pro-max` | valid | yes | shadcn | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/ui-ux-pro-max` |
| `unocss` | `unocss` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/unocss` |
| `using-superpowers` | `using-superpowers` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/using-superpowers` |
| `vault-cleanup-auditor` | `vault-cleanup-auditor` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vault-cleanup-auditor` |
| `vercel-composition-patterns` | `vercel-composition-patterns` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vercel-composition-patterns` |
| `vercel-react-best-practices` | `vercel-react-best-practices` | valid | yes | Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vercel-react-best-practices` |
| `vercel-react-native-skills` | `vercel-react-native-skills` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vercel-react-native-skills` |
| `video` | `video` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/video` |
| `voice-extractor` | `voice-extractor` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/voice-extractor` |
| `vue` | `vue` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vue` |
| `vue-best-practices` | `vue-best-practices` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/vue-best-practices` |
| `web-artifacts-builder` | `web-artifacts-builder` | valid | yes | shadcn, Playwright/browser | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/web-artifacts-builder` |
| `web-component-design` | `web-component-design` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/web-component-design` |
| `web-design-guidelines` | `web-design-guidelines` | valid | yes | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/web-design-guidelines` |
| `web3d-integration-patterns` | `web3d-integration-patterns` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/web3d-integration-patterns` |
| `writing-plans` | `writing-plans` | valid | yes | - | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/writing-plans` |
| `youtube-summarizer` | `youtube-summarizer` | valid | no | GitHub | `/Users/quentingeczy/Desktop/silverstone-site/.agents/skills/youtube-summarizer` |

## Notes

- Two project skills (`vercel-composition-patterns`, `vercel-react-native-skills`) use multiline frontmatter descriptions. Simple one-line parsers can misread them, but the project sync script validates them correctly.
- One home-level skill outside the project (`~/.codex/skills/iconsax-library`) has nonstandard `--- ` frontmatter spacing under a strict parser. It is not part of the 149 project-skill claim and was not modified.
- The broader Codex-visible skill universe has hundreds of plugin skills and duplicate names across scopes; future `/web` work should prioritize the project skills and the routing protocol in `skill-mcp-routing.md`.
