# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex maintenance script (React pricing embed)
# - Quick checks intended for iterative work

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[maintenance] Repo root: $REPO_ROOT"

command -v node >/dev/null 2>&1 || { echo "[maintenance] ERROR: node not found"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "[maintenance] ERROR: npm not found"; exit 1; }

echo "[maintenance] node: $(node -v)"
echo "[maintenance] npm:  $(npm -v)"

echo "[maintenance] Build site assets (non-blocking warnings allowed)..."
npm run build:css || echo "[maintenance] WARNING: build:css failed"
npm run build:js  || echo "[maintenance] WARNING: build:js failed"

echo "[maintenance] Validate pricing copy map (non-strict)..."
node scripts/validate-pricing-copy-map.js || echo "[maintenance] WARNING: pricing copy validation failed"

echo "[maintenance] Build pricing widget (non-strict)..."
node scripts/build-pricing-widget.js || echo "[maintenance] WARNING: pricing widget build failed"

echo "[maintenance] Validate embed markup (non-strict)..."
node scripts/validate-pricing-embed-markup.js || echo "[maintenance] WARNING: embed markup validation failed"

echo "[maintenance] Done."
