# FILE: scripts/codex.audit.mobile-bg-gap.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

if ! command -v rg >/dev/null 2>&1; then
  echo "ERROR: This script requires ripgrep (rg)."
  exit 2
fi

echo "== Mobile background gap audit: key repo locations =="
echo

echo "-- CSS: mobile parallax stage/layers --"
rg -n -S "parallax-mobile-stage|parallax-mobile-layer|prefers-reduced-motion|max-width: 768px|inset:|position: fixed|z-index" src/css/features/parallax.css assets/css/styles.css || true
echo

echo "-- JS: parallax initialization + mobile stage creation --"
rg -n -S "initParallax|enableMobile|createMobileStage|parallax-mobile-stage|IntersectionObserver|visualViewport|innerHeight|backgroundImage|body-section-background-2025\\.webp" src/js/parallax.js assets/js/app.js src/js/app.js || true
echo

echo "-- HTML: confirm parallax markup and themes on target pages --"
PAGES=("index.html" "about.html" "services.html" "book.html" "contact.html")
for p in "${PAGES[@]}"; do
  if [[ -f "${p}" ]]; then
    echo
    echo "Page: ${p}"
    rg -n -S "parallax-section|data-parallax-theme|bg-lines|bg-circuit|bg-mesh|bg-waves" "${p}" || true
  fi
done

if [[ -d "niches" ]]; then
  echo
  echo "Niches pages:"
  rg -n -S "parallax-section|data-parallax-theme|bg-lines|bg-circuit|bg-mesh|bg-waves" niches/*.html || true
fi
echo

echo "-- Asset existence: background image file on disk --"
ls -l assets/images/body_section_parallax/body-section-background-2025.webp 2>/dev/null || true
echo

echo "Next steps:"
echo "1) Use a mobile viewport and run the diagnostic snippet in codex/snippets."
echo "2) Confirm whether the background provider is:"
echo "   - the mobile parallax stage (fixed element), or"
echo "   - section backgrounds, or"
echo "   - something else (overlay/wrapper)."
echo "3) If the issue only happens on niches/* pages, investigate document-relative asset URLs in JS."
