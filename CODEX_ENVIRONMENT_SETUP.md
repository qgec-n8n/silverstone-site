<!-- CODEX_ENVIRONMENT_SETUP.md -->

# CODEX_ENVIRONMENT_SETUP – How this environment installs dependencies

The current branch is a static site with a minimal Node toolchain. There is **no Playwright test harness** checked in right now; `package.json` only contains build scripts (`build`, `build:css`) and lists `sharp` as the sole devDependency.

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
    echo "[setup] Skipping Playwright browser install (playwright CLI not found in node_modules/.bin). This is expected for this branch until the automated test suite is restored."
  fi
fi

echo "[setup] Setup script completed. Any npm/Playwright issues were logged but are non-fatal."
exit 0

```

### Maintenance script

Use a lightweight maintenance script to refresh `node_modules` only when the directory is missing (cached containers normally retain it). Example:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/workspace/silverstone-site"

if [ -d "$REPO_DIR" ]; then
  cd "$REPO_DIR"
else
  echo "[maintenance] Repo directory not found; skipping."
  exit 0
fi

if [ -d node_modules ]; then
  echo "[maintenance] node_modules present; nothing to do."
  exit 0
fi

npm_failed=0

if command -v npm >/dev/null 2>&1; then
  echo "[maintenance] node_modules missing; reinstalling dependencies (best-effort)..."
  if [ -f package-lock.json ]; then
    (npm ci || npm install) || npm_failed=1
  else
    npm install || npm_failed=1
  fi
else
  echo "[maintenance] WARNING: npm is not available in this environment."
  npm_failed=1
fi

if [ "$npm_failed" -ne 0 ]; then
  echo "[maintenance] WARNING: npm install failed (likely registry/network restrictions)."
  echo "[maintenance] Site build scripts may need local/CI installs instead."
else
  echo "[maintenance] Dependencies refreshed."
fi

exit 0
```
