# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Maintenance is intentionally the same contract as requested-edits validation.
bash scripts/codex.requested-edits.sh
