#!/bin/bash
set -euo pipefail

# Post-merge reconciliation for the active /web React application.
#
# Runs automatically after a task is merged into main. Its job is to make this
# environment match the freshly merged code: install any new/changed npm
# dependencies so the dev workflow and gates resolve correctly.
#
# Constraints (see replit.md):
# - The active app is /web; all install/build commands run from there.
# - The root is frozen legacy reference — do NOT install or build it here.
# - There is no database/migration step in this project.
#
# Must stay idempotent, non-interactive (stdin is closed), and fail fast.

cd "$(dirname "$0")/.."

cd web
npm install --no-audit --no-fund
