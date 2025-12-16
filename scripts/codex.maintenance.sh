# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex maintenance script (Pricing widget integration)
# - Fast and safe to re-run
# - Performs lightweight checks
# - Non-blocking warnings during iterative work

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[maintenance] Repo root: $REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[maintenance] ERROR: node is not installed or not on PATH."
  exit 1
fi

echo "[maintenance] node: $(node -v)"
echo "[maintenance] npm:  $(npm -v)"

echo "[maintenance] Quick build checks (non-blocking during iterative work)..."
npm run build:css || echo "[maintenance] WARNING: build:css failed."
npm run build:js  || echo "[maintenance] WARNING: build:js failed."

echo "[maintenance] Pricing embed validation (non-strict)..."
node scripts/validate-pricing-embeds.js || echo "[maintenance] WARNING: pricing validation failed."

echo "[maintenance] Done."
