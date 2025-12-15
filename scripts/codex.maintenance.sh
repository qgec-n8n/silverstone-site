# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex maintenance script
# - Runs before every Codex task.
# - Must be fast and safe to re-run.
#
# Performs lightweight checks only; strict validation is enforced by ExecPlan gates.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[maintenance] Repo root: $REPO_ROOT"

if command -v node >/dev/null 2>&1; then
  echo "[maintenance] Node: $(node -v)"
else
  echo "[maintenance] WARNING: node not found."
fi

if command -v npm >/dev/null 2>&1; then
  echo "[maintenance] npm:  $(npm -v)"
else
  echo "[maintenance] WARNING: npm not found."
fi

echo "[maintenance] Quick build checks (non-blocking during iterative work)..."
if command -v npm >/dev/null 2>&1; then
  npm run build:css || echo "[maintenance] WARNING: build:css failed."
  npm run build:js  || echo "[maintenance] WARNING: build:js failed."
fi

if [[ -f scripts/validate-niche-pages.js ]]; then
  echo "[maintenance] Niche pages soft validation..."
  node scripts/validate-niche-pages.js || echo "[maintenance] WARNING: niche validation failed."
fi

if [[ -f scripts/assert-ui-spec.js ]]; then
  echo "[maintenance] UI spec soft assertion..."
  node scripts/assert-ui-spec.js --strict || echo "[maintenance] WARNING: UI spec assertion failed."
fi

echo "[maintenance] Done."
