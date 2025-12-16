# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex setup script (React pricing embed)
# - Safe to re-run
# - Installs deps
# - Builds site CSS/JS
# - Builds pricing widget bundle
# - Runs strict validations

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[setup] Repo root: $REPO_ROOT"

command -v node >/dev/null 2>&1 || { echo "[setup] ERROR: node not found"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "[setup] ERROR: npm not found"; exit 1; }

echo "[setup] node: $(node -v)"
echo "[setup] npm:  $(npm -v)"

echo "[setup] Installing dependencies..."
npm install

echo "[setup] Building site CSS/JS bundles..."
npm run build:css
npm run build:js

echo "[setup] Validating pricing copy map (strict)..."
node scripts/validate-pricing-copy-map.js --strict

echo "[setup] Building pricing widget (strict)..."
node scripts/build-pricing-widget.js --strict

echo "[setup] Validating embed markup (strict)..."
node scripts/validate-pricing-embed-markup.js --strict

echo "[setup] Done."
