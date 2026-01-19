# FILE: scripts/codex.serve.sh
#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[serve] Static server starting"
echo "[serve] Port: ${PORT}"
echo
echo "Open these paths in your browser:"
echo "  /index.html"
echo "  /about.html"
echo "  /services.html"
echo "  /book.html"
echo "  /contact.html"
echo "  /niches/ (pick any niche page)"
echo
echo "[serve] Press Ctrl+C to stop."
python3 -m http.server "${PORT}"
