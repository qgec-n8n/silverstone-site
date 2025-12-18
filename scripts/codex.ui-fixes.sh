# FILE: scripts/codex.ui-fixes.sh
set -euo pipefail

echo "Codex site UI fixes: build + validations"
echo ""

echo "1) Install dependencies"
if [ "${CODEX_SKIP_NPM:-0}" = "1" ]; then
  echo "   Skipping npm install (CODEX_SKIP_NPM=1)"
else
  npm install || echo "WARN: npm install failed. Continuing (validations may still run)."
fi
echo ""

echo "2) Build site (best-effort; may require deps)"
if [ "${CODEX_SKIP_BUILD:-0}" = "1" ]; then
  echo "   Skipping npm run build (CODEX_SKIP_BUILD=1)"
else
  npm run build || echo "WARN: npm run build failed."
fi
echo ""

echo "3) Validate (site UI fixes spec)"
node scripts/validate-site-ui-fixes.js --strict
echo ""

echo "4) Validate (existing base page validators)"
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
echo ""

echo "Site UI fixes validations complete."
