---
name: particles.js strict-mode load
description: Why particles.js must be loaded as a classic script, not an ES import, in the /web Vite app.
---

# particles.js (v2.0.0) cannot be `import`ed as an ES module

`Object.deepExtend` inside `particles.js` calls `arguments.callee(...)` (recursion
without a named reference). `arguments.callee` is a hard error under ES-module
strict mode, so any `await import("particles.js")` (or bare `import`) throws:

> 'caller', 'callee', and 'arguments' properties may not be accessed on strict
> mode functions or the arguments objects for calls to them
> at Object.deepExtend → new pJS → window.particlesJS

The error fires the moment `window.particlesJS(...)` constructs `pJS` (it merges
defaults via deepExtend), so it is independent of the config you pass.

**Why:** the library predates ES modules and was written for sloppy-mode `<script>`
inclusion. Vite's dep optimizer (`.vite/deps/particles__js.js`) keeps it in strict
mode, so optimizing/importing it does not help.

**How to apply:** load it as a classic script so it runs in sloppy mode. Keep the
npm dep for provenance and resolve its URL with Vite's `?url`
(`import url from "particles.js/particles.js?url"`), then inject a `<script src={url}>`
once and call `window.particlesJS` on load. No CDN, no committed vendor blob.
Globals (`window.particlesJS`, `window.pJSDom`) are declared in
`web/src/types/particles-js.d.ts`. Pause via
`cancelAnimationFrame(pJS.drawAnimFrame)` / resume via `pJS.fn.vendors.draw()`;
tear down with `pJS.fn.vendors.destroypJS()` and remove the leftover `<canvas>`.

Note: a stale strict-mode error can linger in the cumulative browser console after
you switch to the script-tag path — force a fresh reload before concluding it
still fails.
