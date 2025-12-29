# FILE: scripts/serve.sh
#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"

echo "Serving Silverstone site from repo root..."
echo "Open in your browser: localhost:${PORT}/index.html"
echo "Tip: niche pages are under localhost:${PORT}/niches/<page>.html"
echo

# Prefer python3, fallback to python.
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "${PORT}"
elif command -v python >/dev/null 2>&1; then
  python -m http.server "${PORT}"
else
  echo "ERROR: python3/python not found. Install Python or use another static server."
  exit 1
fi
