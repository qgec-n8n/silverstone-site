# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex maintenance script
# - Runs before every Codex task.
# - Must be fast and safe to re-run.
#
# This script performs lightweight sanity checks only.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[maintenance] Node: $(node -v)"
echo "[maintenance] npm:  $(npm -v)"

# Ensure deps exist (do not install here; keep maintenance fast).
if [[ ! -d node_modules ]]; then
  echo "[maintenance] WARNING: node_modules missing. Run scripts/codex.setup.sh first."
else
  echo "[maintenance] node_modules present."
fi

echo "[maintenance] Quick build checks (CSS/JS)..."
npm run build:css || echo "[maintenance] WARNING: build:css failed (non-blocking during iterative work)."
npm run build:js  || echo "[maintenance] WARNING: build:js failed (non-blocking during iterative work)."

# Validate niche pages if the validator script exists.
if [[ -f scripts/validate-niche-pages.js ]]; then
  echo "[maintenance] Niche pages soft validation..."
  node scripts/validate-niche-pages.js || true
else
  echo "[maintenance] validate-niche-pages.js not present; skipping."
fi

echo "[maintenance] Done."
