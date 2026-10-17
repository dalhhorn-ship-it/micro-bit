# Status

**Phase:** first build done, waiting for a real hardware test
**Next step:** flash the micro:bit, publish to the Cloudflare Worker, try it on the iPad in Bluefy
**Blockers:** none

## Done
* Brainstorm: `IDEA.md`
* Equipment list: `EQUIPMENT.md`
* App v0.1 in `app/`: control panel, block programs, demo micro:bit, tests
* Cloudflare Worker setup: `app/wrangler.jsonc`, `npm run deploy`
* micro:bit program: `app/microbit/space-bunnies.ts`

## Notes
* The founder chose to skip the PRD step for this first version and build straight away.
* Only tested with the demo micro:bit and in Chromium. Not yet tested on a real micro:bit, on the iPad or in WebKit.
