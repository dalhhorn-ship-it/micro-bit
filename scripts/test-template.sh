#!/usr/bin/env bash
# Self test for the template: agent and skill files are valid, and the PRD gate works.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
fail() { echo "FAIL: $*"; exit 1; }
pass() { echo "ok: $*"; }

# 1. Frontmatter
for f in "$here"/template/.claude/agents/*.md; do
  n=$(basename "$f" .md)
  head -1 "$f" | grep -qx -- '---' || fail "$f has no frontmatter"
  grep -qx "name: $n" "$f" || fail "$f name does not match file name"
  grep -q '^description: ' "$f" || fail "$f has no description"
  grep -Eq '^model: (haiku|sonnet|opus)$' "$f" || fail "$f has no valid model"
done
pass "agents valid"
for f in "$here"/template/.claude/skills/*/SKILL.md; do
  n=$(basename "$(dirname "$f")")
  grep -qx "name: $n" "$f" || fail "$f name does not match folder"
  grep -q '^description: ' "$f" || fail "$f has no description"
done
grep -q '^disable-model-invocation: true' "$here/template/.claude/skills/signoff/SKILL.md" || fail "signoff must be founder only"
for f in "$here"/.claude/skills/*/SKILL.md; do
  grep -qx "name: $(basename "$(dirname "$f")")" "$f" || fail "$f name does not match folder"
done
pass "skills valid"
python3 -m json.tool "$here/template/.claude/settings.json" >/dev/null || fail "settings.json invalid"
pass "settings.json valid"

# 2. New app scaffolding
git config --global user.email >/dev/null 2>&1 || export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
FACTORY_NO_REGISTER=1 "$here/scripts/new-app.sh" "$tmp/app" >/dev/null
app="$tmp/app"
[[ -x "$app/.claude/hooks/prd-gate.sh" ]] || fail "hook not executable in new app"
grep -q '^factory_path: ' "$app/.factory" || fail ".factory missing factory_path"
grep -q '^factory_version: ' "$app/.factory" || fail ".factory missing factory_version"
[[ -f "$app/.claude/skills/retro/SKILL.md" && -f "$app/docs/FRICTION.md" ]] || fail "retro files missing"
for f in "$here"/template/.claude/skills/*/SKILL.md "$here"/template/.claude/agents/*.md; do
  rel="${f#"$here"/template/}"
  git -C "$app" ls-files --error-unmatch "$rel" >/dev/null 2>&1 || fail "$rel is not committed in a new app (gitignore?)"
done
pass "new-app.sh creates a repo linked to the factory"

hook() { printf '{"tool_name":"Write","tool_input":{"file_path":"%s","content":"x"}}' "$1" \
  | CLAUDE_PROJECT_DIR="$app" "$app/.claude/hooks/prd-gate.sh" 2>/dev/null; }
expect() { local want=$1 path=$2 got=0; hook "$path" || got=$?; [[ $got -eq $want ]] || fail "hook $path: want $want got $got"; }

# 3. Gate closed before signoff
expect 0 "$app/docs/PRD.md"
expect 0 "$app/CLAUDE.md"
expect 2 "$app/src/main.ts"
expect 2 "$app/docs/PRD.approved"
expect 2 "$app/scripts/signoff.sh"
expect 2 "$app/.claude/settings.json"
pass "gate blocks code before signoff"

# 4. Signoff requires READY status
( cd "$app" && ! ./scripts/signoff.sh "Founder" >/dev/null ) || fail "signed a template PRD"
sed -i.bak 's/Status: TEMPLATE/Status: READY FOR SIGNOFF/' "$app/docs/PRD.md"
( cd "$app" && ./scripts/signoff.sh "Founder" >/dev/null ) || fail "signoff failed"
grep -q 'Status: APPROVED by Founder' "$app/docs/PRD.md" || fail "status not flipped"
expect 0 "$app/src/main.ts"
expect 2 "$app/docs/PRD.approved"
pass "signoff opens the gate"

# 5. Changing the PRD closes the gate again
echo "* sneaky new feature" >> "$app/docs/PRD.md"
expect 2 "$app/src/main.ts"
( cd "$app" && ! ./scripts/signoff.sh --check >/dev/null ) || fail "check passed on changed PRD"
pass "PRD change closes the gate"

( cd "$app" && ./scripts/check.sh >/dev/null ) || fail "check.sh fails on empty app"
pass "check.sh runs on empty app"
echo "All template tests passed."
