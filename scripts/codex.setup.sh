# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "== Codex setup: silverstone-site =="
echo "Repo: $REPO_ROOT"
echo ""

echo "1) Node + npm versions"
node -v
npm -v
echo ""

echo "2) Install dependencies"
npm install
echo ""

echo "3) Baseline build (should succeed before pricing widget work begins)"
npm run build
echo ""

echo "4) Baseline validation (existing site validators)"
npm run validate
echo ""

echo "5) Pricing copy-map validation (source-of-truth integrity)"
node scripts/validate-pricing-copy-map.js
echo ""

echo "✅ Setup complete."
echo "Next: run Codex using codex/CODEX_INIT_PROMPT.md"
