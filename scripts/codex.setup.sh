# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.setup] Preflight: Node + npm + dependencies"

if ! command -v node >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: npm is not installed or not on PATH."
  exit 1
fi

if [ -f package.json ]; then
  echo "[codex.setup] Installing root npm dependencies (if needed)..."
  npm install --no-fund --no-audit
else
  echo "[codex.setup] NOTE: package.json not found; skipping root npm install."
fi

if [ -f pricing-widget/package.json ]; then
  echo "[codex.setup] Installing pricing-widget npm dependencies (if needed)..."
  pushd pricing-widget >/dev/null
  npm install --no-fund --no-audit
  popd >/dev/null
else
  echo "[codex.setup] NOTE: pricing-widget/package.json not found; skipping pricing-widget npm install."
fi

echo "[codex.setup] Baseline build sanity check..."
npm run build:css
npm run build:js

if [ -f pricing-widget/package.json ]; then
  pushd pricing-widget >/dev/null
  npm run build
  popd >/dev/null
fi

echo "[codex.setup] Done."
