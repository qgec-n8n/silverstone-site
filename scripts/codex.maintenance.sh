# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex maintenance script
# - Runs before/after edits during the services overhaul
# - Fast and safe to re-run
# - Performs lightweight checks only

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[maintenance] Repo root: $REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[maintenance] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[maintenance] ERROR: npm is not installed or not on PATH."
  exit 1
fi

echo "[maintenance] node: $(node -v)"
echo "[maintenance] npm:  $(npm -v)"

echo "[maintenance] Ensuring required WebP assets exist..."
node scripts/convert-services-images-to-webp.js --check

echo "[maintenance] Quick build checks (non-blocking during iterative work)..."
npm run build:css || echo "[maintenance] WARNING: build:css failed."
npm run build:js  || echo "[maintenance] WARNING: build:js failed."

echo "[maintenance] Services page validation (non-strict)..."
node scripts/validate-services-page.js || echo "[maintenance] WARNING: services validation failed."

echo "[maintenance] Done."
