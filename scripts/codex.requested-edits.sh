# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.requested-edits] Rebuild + validate Requested Edits (1–8)"
echo ""

echo "[1/4] Rebuild main site CSS + JS"
node build-css.js
node scripts/build-js.js
echo ""

echo "[2/4] Build pricing widget"
if [ -f "pricing-widget/package.json" ]; then
  if [ "${CODEX_SKIP_WIDGET_INSTALL:-0}" = "1" ]; then
    echo "  Skipping pricing-widget npm install (CODEX_SKIP_WIDGET_INSTALL=1)"
  else
    (cd pricing-widget && npm install --no-fund --no-audit)
  fi
  (cd pricing-widget && npm run build)
else
  echo "ERROR: pricing-widget/ not found; cannot build pricing widget."
  exit 1
fi
echo ""

echo "[3/4] Validate pricing mounts (regression guard)"
node scripts/validate-pricing-mounts.js
echo ""

echo "[4/4] Validate Requested Edits (1–8)"
node scripts/validate-requested-edits.js --strict
echo ""

echo "[codex.requested-edits] ✅ All Requested Edits validations passed."
