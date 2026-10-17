# Kidgames: an agent factory for hobby apps

A reusable template for building small apps and games with my kids, using a team of Claude agents. It follows a layered "software factory" approach: plan, agents, execution, artifacts, verification, feedback, completion. The founder (me) makes the important calls and signs the PRD before anything gets built.

## Start a new app

```
./scripts/new-app.sh ../space-bunnies
cd ../space-bunnies
claude
```

Then type `/brainstorm` (with the kids!) or just `/factory` and let it guide you.

## The pipeline

```
/brainstorm -> /prd -> /signoff (founder) -> /architect -> /build -> /qa -> /ship -> /retro
```

| Command | Who does the work | Founder involvement |
|---|---|---|
| `/brainstorm` | brainstormer | Pick a concept, answer a few questions |
| `/prd` | product, reviewed by architect and qa | Answer open decisions |
| `/signoff` | you | Read the PRD, sign with `! ./scripts/signoff.sh "Name"` |
| `/architect` | architect, reviewed by developer and qa | Stack, cost or platform decisions |
| `/build` | developers in parallel, architect reviews, scribe documents | Play each milestone, decide scope questions |
| `/qa` | qa, developers fix | Choose which minor bugs to fix now |
| `/ship` | operator, scribe | Approve where it gets deployed |
| `/retro` | operator | Rate the fun, say what was annoying (kids too) |
| `/factory` | runs whichever step is next | Stops at every gate |

## The team and the models

| Agent | Model | Why this model |
|---|---|---|
| brainstormer | Sonnet | Creative and quick, does not need deep reasoning |
| product | Opus | The PRD decides everything after it, worth the best thinking |
| architect | Opus | Design and code review mistakes are expensive to fix later |
| developer | Sonnet | Strong coder at a fraction of the cost, runs many times |
| qa | Sonnet | Writes and runs tests, good at finding edge cases |
| scribe | Haiku | Docs upkeep is mechanical, cheapest model is enough |

Money saving tips:
* Run the main session on Sonnet (`/model sonnet`) during `/build` and `/qa`. Switch to Opus for `/prd` and `/architect` if you want the operator sharper during discussions.
* Opus agents run only a few times per project. Sonnet and Haiku do the repeated work.
* An agent that fails twice on a task is escalated one tier for that task only.

## How the founder stays in charge

* **PRD signoff is enforced, not just requested.** A hook blocks all code edits until `docs/PRD.approved` exists and matches the exact PRD text. Only you can create it, by running the signoff script yourself. Change the PRD later and the gate closes until you sign again. Claude is also blocked from editing the stamp, the script and the hook.
* **Important decisions come to you** as multiple choice questions with a recommendation: scope changes, anything that costs money or needs an account, kid safety, platform choice, public deployment, and any agent disagreement not settled in two review rounds.
* Everything else is logged in `docs/DECISIONS.md` and the agent debates in `docs/DISCUSSION.md`, so you can read what happened.

## Built for the iPad

Apps are played mostly in Safari on an iPad, so that is the default target for every agent: touch first, both orientations, no accidental zoom or text selection, installable to the home screen and working offline, sound after the first tap. Tests run in Playwright's WebKit engine with iPad profiles, and at each milestone you get a local network address to try it on the real iPad. The full rules are in `template/CLAUDE.md` under "Target device".

## Learning loop: every app improves the factory

1. While building, the operator logs every retry, escalation, gate block and slipped bug in `docs/FRICTION.md`.
2. `/retro` (runs at the end of `/ship`, or any time) asks you and the kids what was fun and annoying, combines that with the evidence, and sorts learnings into app lessons (kept in the app's `CLAUDE.md`) and factory learnings.
3. Factory learnings go to `learnings/inbox/` in this repo. Each app knows where its factory is and which version it came from (`.factory`, written by `new-app.sh`).
4. In this repo, run `claude` and then `/harvest`. It groups learnings across apps, skips ones already fixed, and proposes template changes. You choose adopt, park or reject. Adopted changes are applied, tested and logged in `learnings/LEARNINGS.md`.

## Testing and docs

* Every app has one check command, `./scripts/check.sh` (lint, typecheck, unit and end to end tests). Agents must pass it before a task is done, and CI runs it on every push.
* Developers ship tests with every task. QA maps every PRD acceptance criterion to a test and writes `docs/TEST_REPORT.md`.
* The scribe updates README, CHANGELOG and STATUS at every milestone. Lessons learned go into the app's `CLAUDE.md`.

## This repo

| Path | What |
|---|---|
| `template/` | Everything copied into a new app |
| `template/CLAUDE.md` | The factory operating manual the operator follows |
| `template/.claude/agents/` | The six agents |
| `template/.claude/skills/` | The pipeline commands |
| `template/.claude/hooks/prd-gate.sh` | The signoff gate |
| `scripts/new-app.sh` | Create a new app from the template and register it for `/harvest` |
| `learnings/` | Inbox of retro feedback from apps, and the log of what was adopted |
| `.claude/skills/harvest/` | `/harvest`: turn app learnings into template improvements |
| `scripts/test-template.sh` | Self test for the template (CI runs it) |

Want to use GitHub instead of the script? Make a repo, copy the contents of `template/` into it, done.
