# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex setup script
# - Runs when creating a fresh environment.
# - Safe to re-run.
#
# This script intentionally does NOT generate WebP assets (that can be slow).
# Use:
#   node scripts/convert-template-images-to-webp.js
# when working on niche pages.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[setup] Node version:"
node -v
echo "[setup] npm version:"
npm -v

if [[ -f package-lock.json ]]; then
  echo "[setup] Installing dependencies via npm ci..."
  npm ci
else
  echo "[setup] Installing dependencies via npm install..."
  npm install
fi

echo "[setup] Building CSS/JS bundles (fast sanity)..."
npm run build:css
npm run build:js

echo "[setup] Done."
