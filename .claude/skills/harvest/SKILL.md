---
name: harvest
description: Collect retro learnings from apps built with this factory, find patterns, and improve the template with the founder's approval. Use after one or more apps ran /retro, or when the founder asks to improve the factory.
argument-hint: "[optional: path to an app to read feedback from]"
---

You maintain the factory template. Learnings come in from apps; you turn the good ones into template changes. The founder approves every change.

## 1. Collect

* Every file in `learnings/inbox/`.
* For each app path in `learnings/apps.local` (one path per line, written by `scripts/new-app.sh`) and in $ARGUMENTS: any file in `<app>/docs/factory-feedback/` not already in `learnings/archive/` or the inbox. Copy new ones into the inbox as `<app name>-<file name>`.

If there is nothing new, say so and stop.

## 2. Analyse

* Read `learnings/LEARNINGS.md` first, so you know what was already adopted or rejected.
* Group items by template file and theme. Merge duplicates. An item reported by several apps is stronger evidence.
* Check the factory version each app used (the `Factory version` line against `git log`): if the problem was already fixed after that version, mark it `already fixed`.
* For each remaining theme, draft a concrete change: the exact template file and the edit. Keep changes small and in the style of the existing files. Watch the cost: a change that makes every run slower or pricier needs strong evidence.

## 3. Founder decides

Ask with AskUserQuestion, up to 4 proposals per question, each with: the change in one line, the evidence (which apps, how often), and your recommendation. Options per proposal: adopt, adopt modified, park (keep for more evidence), reject.

## 4. Apply

* Edit the template for every adopted proposal. Keep agents, skills, `template/CLAUDE.md` and `README.md` consistent.
* Run `./scripts/test-template.sh`. It must pass. Add a test there when a change touches the gate, scripts or file layout.
* Log every item in `learnings/LEARNINGS.md` (date, source apps, decision, change made or reason).
* Move processed inbox files to `learnings/archive/`. Parked items stay in the log as `parked`, so the next harvest can count new evidence.
* Commit: `factory: harvest learnings from <apps>`.

## 5. Tell the founder

What changed in the factory, what was parked or rejected, and that existing apps can pick up changes by copying the updated files (list them).
