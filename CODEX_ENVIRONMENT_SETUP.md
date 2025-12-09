<!-- CODEX_ENVIRONMENT_SETUP.md -->

# CODEX_ENVIRONMENT_SETUP – How this environment installs dependencies

The repository already includes a full Playwright test harness:

- `package.json` devDependencies:
  - `@playwright/test`, `axe-core`, `http-server`, `jsdom`, `typescript`, `vitest`, `sharp`
- `playwright.config.ts`
- `tsconfig.json`
- `tests/**` (accessibility, dom, e2e, visual specs)

Codex Cloud environments support **manual setup** and **maintenance** scripts with full network access during those steps. These scripts run **outside** the agent’s sandbox and are cached for subsequent tasks.   

This project uses **Manual** scripts configured in the environment UI:

---

## Setup script

Paste this into the **Setup script** box (you may already have done this):

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "[setup] Starting setup for silverstone-site"

REPO_DIR="/workspace/silverstone-site"

if [ ! -d "$REPO_DIR" ]; then
  FIRST_DIR="$(ls -d /workspace/* 2>/dev/null | head -n 1 || true)"
  if [ -n "${FIRST_DIR:-}" ]; then
    REPO_DIR="$FIRST_DIR"
  fi
fi

if [ -d "$REPO_DIR" ]; then
  cd "$REPO_DIR"
else
  echo "[setup] WARNING: could not find repo directory under /workspace."
  echo "[setup] Continuing without project-specific setup."
  exit 0
fi

echo "[setup] In repo directory: $(pwd)"

echo "[setup] Node version: $(node -v 2>/dev/null || echo 'not found')"
echo "[setup] npm version: $(npm -v 2>/dev/null || echo 'not found')"

npm_failed=0

if command -v npm >/dev/null 2>&1; then
  echo "[setup] Installing npm dependencies (preferring npm ci if lockfile exists)..."
  if [ -f package-lock.json ]; then
    (npm ci || npm install) || npm_failed=1
  else
    npm install || npm_failed=1
  fi
else
  echo "[setup] WARNING: npm is not available in this environment."
  npm_failed=1
fi

if [ "$npm_failed" -ne 0 ]; then
  echo "[setup] WARNING: npm install failed."
  echo "[setup] This is often due to registry/network policy (e.g. HTTP 403 from npmjs.org)."
  echo "[setup] The environment will still be usable, but Playwright-based tests may not run."
else
  echo "[setup] npm dependencies installed successfully."
  if [ -x node_modules/.bin/playwright ]; then
    echo "[setup] Installing Playwright browsers (best-effort)..."
    npx playwright install --with-deps || {
      echo "[setup] WARNING: 'npx playwright install --with-deps' failed."
      echo "[setup] Visual/E2E tests may need browsers installed locally or via CI."
    }
  else
    echo "[setup] Skipping Playwright browser install (playwright CLI not found in node_modules/.bin)."
  fi
fi

echo "[setup] Setup script completed. Any npm/Playwright issues were logged but are non-fatal."
exit 0
