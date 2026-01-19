# FILE: scripts/codex.inventory.pages.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

STAMP="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="artifacts/codex_page_inventory/${STAMP}"
mkdir -p "$OUT_DIR"

REPORT="${OUT_DIR}/pages-inventory.md"

# Collect target pages.
pages=(
  "index.html"
  "about.html"
  "services.html"
  "book.html"
  "contact.html"
)

# Add niche pages (if any).
if compgen -G "niches/*.html" >/dev/null; then
  while IFS= read -r f; do
    pages+=("$f")
  done < <(ls -1 niches/*.html | sort)
fi

extract_attr() {
  local attr="$1"
  local tag="$2"
  # Extract attr="..." from a single tag string.
  sed -n "s/.*${attr}=\\\"\\([^\\\"]*\\)\\\".*/\\1/p" <<<"$tag" | head -n 1
}

has_grep() {
  local pattern="$1"
  local file="$2"
  if grep -qE "$pattern" "$file"; then
    echo "yes"
  else
    echo "no"
  fi
}

first_match() {
  local pattern="$1"
  local file="$2"
  grep -nE "$pattern" "$file" | head -n 1 || true
}

is_external_url() {
  # Treat any absolute URL with an explicit scheme as "external" (scheme://...).
  grep -qE '^[a-zA-Z][a-zA-Z0-9+.-]*://'
}

{
  echo "<!-- generated: ${STAMP} -->"
  echo "# Page inventory (inputs for scroll debugging)"
  echo
  echo "This report is a lightweight map of which pages include which scripts/embeds."
  echo "Use it to confirm whether the scroll bug is global (shared assets) or page-specific."
  echo
  echo "## Table"
  echo
  echo "| Page | body class | app.js | pricing-widget.js | external scripts | iframes | Notes |"
  echo "|---|---|---:|---:|---|---:|---|"

  for p in "${pages[@]}"; do
    if [[ ! -f "$p" ]]; then
      continue
    fi

    body_tag="$(grep -oE '<body[^>]*>' "$p" | head -n 1 || true)"
    body_class="$(extract_attr "class" "$body_tag")"

    app_js="$(has_grep 'assets/js/app\\.js' "$p")"
    pricing_js="$(has_grep 'assets/js/pricing-widget\\.js' "$p")"

    # External scripts (absolute URLs) — show up to 2 to keep the table readable.
    ext_scripts_raw="$(
      grep -oE '<script[^>]*src=\"[^\\\"]+\"' "$p" \
        | sed -E 's/.*src=\"([^\\\"]+)\".*/\\1/' \
        | while IFS= read -r u; do
            if echo "$u" | is_external_url; then
              echo "$u"
            fi
          done \
        | head -n 2 \
        | tr '\\n' ' '
    )"
    ext_scripts="$(echo "$ext_scripts_raw" | sed -E 's/[[:space:]]+$//' )"
    if [[ -z "$ext_scripts" ]]; then
      ext_scripts="(none)"
    fi

    iframe_count="$(grep -cE '<iframe' "$p" || true)"

    notes=""
    if [[ "$pricing_js" == "yes" ]]; then
      notes="pricing widget present (protected internal scroll)"
    fi
    if [[ "$iframe_count" != "0" ]]; then
      if [[ -n "$notes" ]]; then notes="${notes}; "; fi
      notes="${notes}has iframe(s)"
    fi

    echo "| ${p} | ${body_class:-\\-} | ${app_js} | ${pricing_js} | ${ext_scripts} | ${iframe_count} | ${notes:-\\-} |"
  done

  echo
  echo "## Quick references"
  echo
  echo "- If the bug reproduces on pages with app.js but without pricing-widget.js, focus on app.js sources (src/js/*) and global CSS (src/css/*)."
  echo "- If the bug reproduces only on pages with pricing-widget.js, focus on pricing widget integration and wheel handling."
  echo
  echo "## Embedded script/iframe excerpts (first match per pattern)"
  echo
  echo "### External scripts (absolute URLs)"
  for p in "${pages[@]}"; do
    [[ -f "$p" ]] || continue
    m="$(first_match '<script[^>]*src=\"[a-zA-Z][a-zA-Z0-9+.-]*://[^\\\"]+\"' "$p")"
    if [[ -n "$m" ]]; then
      echo "- ${p}: ${m}"
    fi
  done
  echo
  echo "### Iframes"
  for p in "${pages[@]}"; do
    [[ -f "$p" ]] || continue
    m="$(first_match '<iframe' "$p")"
    if [[ -n "$m" ]]; then
      echo "- ${p}: ${m}"
    fi
  done
} | tee "$REPORT"

echo
echo "[codex_page_inventory] wrote ${REPORT}"
