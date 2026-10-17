#!/usr/bin/env bash
# Create a new hobby app from the agent factory template.
#   ./scripts/new-app.sh ../space-bunnies
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
target="${1:-}"
[[ -n "$target" ]] || { echo "Usage: ./scripts/new-app.sh <path-to-new-app>"; exit 1; }
[[ ! -e "$target" ]] || { echo "$target already exists"; exit 1; }

mkdir -p "$target"
cp -R "$here/template/." "$target/"
name="$(basename "$target")"
sed -i.bak "s/^# App name/# $name/" "$target/README.md" && rm -f "$target/README.md.bak"
cd "$target"
cat > .factory <<FACTORY
factory_path: $here
factory_version: $(git -C "$here" rev-parse --short HEAD 2>/dev/null || echo unknown)
created: $(date +%Y-%m-%d)
FACTORY
mkdir -p "$here/learnings"
[[ -n "${FACTORY_NO_REGISTER:-}" ]] || echo "$(pwd)" >> "$here/learnings/apps.local"
git init -q
git add -A
git commit -qm "chore: start $name from agent factory template"
echo "Created $target"
echo "Next: cd $target && claude, then type /brainstorm"
