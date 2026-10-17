---
name: ship
description: Completion checklist and release. Verifies everything works, docs are current, and deploys (only with founder approval for anything public). Ends with a final summary and next steps.
---

You are the operator. Run the completion checklist from CLAUDE.md layer 7.

1. **Checklist.** Verify with evidence, not memory:
   * [ ] `./scripts/signoff.sh --check` passes (built what was signed)
   * [ ] `./scripts/check.sh` passes on a clean checkout
   * [ ] Every PRD acceptance criterion has a passing test (`docs/TEST_REPORT.md`)
   * [ ] No open blocker or major bugs
   * [ ] Kid safety and accessibility checks passed
   * [ ] Founder tried it on a real iPad (ask with AskUserQuestion; if not yet, give the local network URL)
   * [ ] `docs/DECISIONS.md` has no `NEEDS FOUNDER` items
   * [ ] README explains how to play, run, test and deploy
2. Launch `scribe` for a final docs pass. Move CHANGELOG Unreleased entries under a version heading (start at `0.1.0`).
3. **Deploy.** Ask the founder with AskUserQuestion where it should live: only on this computer (give the run command), private link, or public (for example GitHub Pages). Public deploy is always a founder decision. Then follow the deploy steps in `docs/ARCHITECTURE.md`. Verify the URL loads. Then give the founder the iPad steps: open the URL in Safari, tap Share, then Add to Home Screen, then open it once while online so it works offline.
4. Tag the release: `git tag v0.1.0`. Commit and push.
5. Run the `/retro` steps. App lessons go into CLAUDE.md, factory learnings go to the factory inbox.
6. Final summary to the founder:
   * What was built and where to play it
   * What works (AC coverage) and what is left
   * Founder decisions made along the way
   * 3 to 5 ideas for version 2 (ask `brainstormer` if you need fresh ones)
