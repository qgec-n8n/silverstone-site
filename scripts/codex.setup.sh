# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

# Codex setup script (Pricing widget integration)
# - Safe to re-run
# - Installs dependencies
# - Builds CSS/JS
# - Builds pricing widget bundle
# - Runs strict pricing validation

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[setup] Repo root: $REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

echo "[setup] node: $(node -v)"
echo "[setup] npm:  $(npm -v)"

if [ ! -d node_modules ]; then
  echo "[setup] Installing npm dependencies..."
  npm install
else
  echo "[setup] node_modules present; skipping npm install."
fi

echo "[setup] Building site CSS/JS bundles..."
npm run build:css
npm run build:js

echo "[setup] Building pricing widget bundle (if configured)..."
node scripts/build-pricing-widget.js || echo "[setup] WARNING: build-pricing-widget failed (may be expected until widget sources/deps are added)."

echo "[setup] Strict pricing embed validation..."
node scripts/validate-pricing-embeds.js --strict || echo "[setup] WARNING: validate-pricing-embeds failed (must pass before final delivery)."

echo "[setup] Done."
