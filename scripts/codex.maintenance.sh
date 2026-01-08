# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Maintenance should track the currently active ExecPlan (see ExecPlans.md).
# For this repo revision, the active plan is WhatsApp + footer phone.
bash scripts/codex.whatsapp.sh
