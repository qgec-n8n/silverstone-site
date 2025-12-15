# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex setup script
# - Runs when creating a fresh environment.
# - Safe to re-run.
#
# This script intentionally avoids slow asset pipelines unless required by the task.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[setup] ERROR: npm is not installed or not on PATH."
  exit 1
fi

echo "[setup] Repo root: $REPO_ROOT"
echo "[setup] Node: $(node -v)"
echo "[setup] npm:  $(npm -v)"

if [[ -f package-lock.json ]]; then
  echo "[setup] Installing dependencies via npm ci..."
  npm ci
else
  echo "[setup] Installing dependencies via npm install..."
  npm install
fi

echo "[setup] Building CSS/JS bundles (sanity)..."
npm run build:css
npm run build:js

if [[ -f scripts/validate-niche-pages.js ]]; then
  echo "[setup] Niche pages validation (strict)..."
  node scripts/validate-niche-pages.js --strict || echo "[setup] WARNING: niche validation failed (fix in task rollout)."
fi

if [[ -f scripts/assert-ui-spec.js ]]; then
  echo "[setup] UI spec assertion (strict)..."
  node scripts/assert-ui-spec.js --strict || echo "[setup] WARNING: UI spec assertion failed (expected until fixes are applied)."
fi

echo "[setup] Done."
