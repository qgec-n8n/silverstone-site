# FILE: scripts/codex.setup.sh
set -euo pipefail

echo "Codex setup: installing deps + baseline validation"
echo ""

echo "1) Node version"
node -v
npm -v
echo ""

echo "2) Install dependencies"

if [ "${CODEX_SKIP_NPM:-0}" = "1" ]; then
  echo "   Skipping npm install (CODEX_SKIP_NPM=1)"
else
  # NOTE: In some sandboxed environments network access may be disabled. If install fails,
  # we continue with file-based validations so Codex can still run.
  npm install || echo "WARN: npm install failed. Continuing (validators can still run)."
fi
echo ""

echo "3) Baseline build (best-effort; may require deps)"
if [ "${CODEX_SKIP_BUILD:-0}" = "1" ]; then
  echo "   Skipping npm run build (CODEX_SKIP_BUILD=1)"
else
  npm run build || echo "WARN: npm run build failed. Continuing (validators can still run)."
fi
echo ""

echo "4) Baseline validation (existing site validators + copy map)"
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-copy-map.js
echo ""

echo "Setup complete."
echo ""
echo "Next: run Codex using codex/CODEX_INIT_PROMPT.md as the initiation prompt."
