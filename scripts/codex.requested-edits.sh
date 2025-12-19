# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

install_deps() {
  local dir="$1"
  echo "=== Installing deps (${dir}) ==="
  (
    cd "${dir}"
    if [[ -f package-lock.json ]]; then
      # Prefer deterministic installs; fall back if lock drift exists.
      npm ci --no-fund --no-audit || npm install --no-fund --no-audit
    else
      npm install --no-fund --no-audit
    fi
  )
}

install_deps "."
install_deps "pricing-widget"

echo "=== Building site CSS/JS ==="
node build-css.js
node scripts/build-js.js

echo "=== Building pricing widget ==="
( cd pricing-widget && npm run build )

echo "=== Running validators ==="
node scripts/validate-core-pages.js --strict
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-mounts.js --strict
node scripts/validate-pricing-ui-tuning.js --strict
node scripts/validate-requested-edits.js --strict

echo "=== OK ==="
