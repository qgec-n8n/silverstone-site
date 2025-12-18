# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.setup] Preflight: Node + deps"

if ! command -v node >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: npm is not installed or not on PATH."
  exit 1
fi

if [ -f package.json ]; then
  echo "[codex.setup] Installing npm dependencies (if needed)..."
  npm install --no-fund --no-audit
else
  echo "[codex.setup] NOTE: package.json not found; skipping npm install."
fi

echo "[codex.setup] Building CSS and JS (baseline build sanity check)..."
node build-css.js
node scripts/build-js.js

echo "[codex.setup] Done."
