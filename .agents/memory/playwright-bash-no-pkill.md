---
name: Playwright in agent bash — never pkill chrome/chromium
description: Why `pkill -f chrome|chromium|playwright|headless` silently kills the agent's own bash call (exit 137, no output), and how to run Playwright reliably.
---

# Running Playwright/Chromium from the agent bash tool

**Rule:** Do NOT run `pkill -f 'chrome'` / `pkill -f 'chromium|playwright|headless'` to "clean up" before a Playwright run. Run the Playwright script WITHOUT any pkill.

**Why:** The agent's bash-execution harness itself has `chrome`/`chromium`/`playwright`/`headless` in its process command line. `pkill -f <those patterns>` matches and SIGKILLs the agent's own shell/infra, so the whole bash call dies with **exit 137 and no output** — which masquerades as a Chromium OOM and sends you down a memory-debugging rabbit hole. Every failing call had a pkill; every call without pkill succeeded.

**How to confirm it's NOT memory:** check `cat /sys/fs/cgroup/memory.max` vs `memory.current` — there was ~4.6GB headroom (8GB limit, ~3.4GB used) while "OOM" 137s were happening. `node -e` and `require('@playwright/test')` both work fine alone; only the pkill-containing calls die.

**How to apply (reliable recipe):**
- Launch with `chromium.launch({ headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] })`.
- Make scripts **sliceable** (argv start/end) and **write results incrementally per page** (merge into the JSON after each page), so a mid-run crash or the bash 118s timeout never loses gathered data.
- Relaunch the browser per small slice rather than driving all ~28 pages in one process; avoid `fullPage` JPEG on very tall pages (big memory spike — the one genuine mid-run crash came from a long slice, not from launch).
- Use `require('/home/runner/workspace/web/node_modules/@playwright/test')`, explicit `.html` URLs, base `http://localhost:5000/prototypes`.
- Leftover chromium procs from crashes are harmless given the cgroup headroom — just leave them; do not pkill.
