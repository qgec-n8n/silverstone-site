# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "== Codex maintenance: silverstone-site =="
echo "Repo: $REPO_ROOT"
echo ""

echo "1) Install dependencies"
npm install
echo ""

echo "2) Build (must produce pricing widget assets if implemented)"
npm run build
echo ""

echo "3) Existing site validation"
npm run validate
echo ""

echo "4) Pricing copy-map validation"
node scripts/validate-pricing-copy-map.js
echo ""

echo "5) Pricing mount + hero shader invariants validation"
node scripts/validate-pricing-mounts.js
echo ""

echo "✅ Maintenance checks complete."
