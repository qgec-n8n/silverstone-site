# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex setup script (Services overhaul)
# - Safe to re-run
# - Installs dependencies
# - Generates required WebP assets
# - Runs basic build + validation

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[setup] Repo root: $REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[setup] ERROR: npm is not installed or not on PATH."
  exit 1
fi

echo "[setup] node: $(node -v)"
echo "[setup] npm:  $(npm -v)"

if [[ -f package-lock.json ]]; then
  echo "[setup] Installing dependencies via npm ci..."
  npm ci
else
  echo "[setup] Installing dependencies via npm install..."
  npm install
fi

echo "[setup] Generating high-quality WebP assets for Services image sections..."
node scripts/convert-services-images-to-webp.js

echo "[setup] Building CSS/JS bundles (sanity)..."
npm run build:css
npm run build:js

echo "[setup] Validating services page structure (strict)..."
node scripts/validate-services-page.js --strict

echo "[setup] Done."
