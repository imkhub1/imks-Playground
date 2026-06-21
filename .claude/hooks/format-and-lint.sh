#!/usr/bin/env bash
# PostToolUse hook: formats with Prettier and auto-fixes lint with ESLint.
# Triggered after Write, Edit, and MultiEdit tool calls.
set -euo pipefail

input=$(cat)
file=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")

# Nothing to do if no file path
[ -z "$file" ] && exit 0
# Skip if file doesn't exist on disk
[ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || true

# Prettier: format whatever it understands; --ignore-unknown silently skips unsupported types
npx --no-install prettier --write --ignore-unknown "$file" >/dev/null 2>&1 || true

# ESLint --fix: only JS/TS family files
case "$file" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs)
    npx --no-install eslint --fix "$file" >/dev/null 2>&1 || true
    ;;
esac

exit 0
