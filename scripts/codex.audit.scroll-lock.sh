# FILE: scripts/codex.audit.scroll-lock.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

STAMP="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="artifacts/codex_scroll_audit/${STAMP}"
mkdir -p "$OUT_DIR"

REPORT="${OUT_DIR}/report.txt"

# Grep helper that avoids noisy directories.
g() {
  grep -RInE \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=artifacts \
    --exclude=*.map \
    "$@" . 2>/dev/null || true
}

{
  echo "[codex_scroll_audit] repo_root=${REPO_ROOT}"
  echo "[codex_scroll_audit] timestamp=${STAMP}"
  echo
  echo "Target pages (expected wheel scroll to work):"
  echo "  index.html"
  echo "  about.html"
  echo "  services.html"
  echo "  book.html"
  echo "  contact.html"
  echo "  niches/*.html"
  echo
  echo "Protected behavior:"
  echo "  pricing internal scroll on index.html + services.html"
  echo

  echo "========================================"
  echo "HTML: inline wheel handlers (rare but fatal)"
  echo "========================================"
  g "onwheel=|onmousewheel=|DOMMouseScroll"

  echo
  echo "========================================"
  echo "JS: wheel / mousewheel listeners"
  echo "========================================"
  g "addEventListener\\((['\"])wheel\\1|addEventListener\\((['\"])mousewheel\\1|DOMMouseScroll"

  echo
  echo "========================================"
  echo "JS: preventDefault hotspots"
  echo "========================================"
  g "preventDefault\\("

  echo
  echo "========================================"
  echo "JS: scroll-lock patterns (overflow/position/fixed)"
  echo "========================================"
  g "style\\.overflow|style\\.overflowY|style\\.position|position\\s*=\\s*(['\"])fixed\\1|overflow\\s*=\\s*(['\"])hidden\\2|scrollTo\\(|scrollBy\\("

  echo
  echo "========================================"
  echo "JS: passive listeners / wheel blocking flags"
  echo "========================================"
  g "passive\\s*:\\s*false|\\{\\s*capture\\s*:\\s*true|\\{\\s*capture\\s*:\\s*false"

  echo
  echo "========================================"
  echo "CSS: html/body overflow + scroll locking"
  echo "========================================"
  g "(^|[^a-zA-Z])(html|body)([^a-zA-Z]|$)"
  echo
  echo "-- likely scroll blockers --"
  g "overflow\\s*:\\s*(hidden|clip)|overflow-y\\s*:\\s*(hidden|clip)|position\\s*:\\s*fixed|height\\s*:\\s*100(vh|dvh|svh)|overscroll-behavior|pointer-events\\s*:\\s*(auto|none)"

  echo
  echo "========================================"
  echo "CSS: full-screen fixed overlays (inset/viewport sized)"
  echo "========================================"
  g "position\\s*:\\s*fixed.*inset\\s*:\\s*0|position\\s*:\\s*fixed.*top\\s*:\\s*0.*left\\s*:\\s*0.*right\\s*:\\s*0.*bottom\\s*:\\s*0|width\\s*:\\s*100vw|height\\s*:\\s*100vh"

  echo
  echo "========================================"
  echo "Pricing widget (protected): quick reference"
  echo "========================================"
  echo "Do not change these files unless proven root cause:"
  echo "  assets/js/pricing-widget.js"
  echo "  assets/css/pricing-widget.css"
  echo
  echo "Pricing internal scroll selectors to keep unchanged:"
  echo "  .ss-pricing[data-ss-pricing-page=\"index.html\"][data-ss-pricing-section=\"2\"] .ss-pricing__includes-body"
  echo "  .ss-pricing[data-ss-pricing-page=\"services.html\"][data-ss-pricing-section=\"2\"] .ss-pricing__includes-body"
  echo
} | tee "$REPORT"

echo
echo "[codex_scroll_audit] wrote ${REPORT}"
