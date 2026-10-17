# Decisions

| # | Date | Decision | Options considered | Chosen | Who | Status |
|---|---|---|---|---|---|---|
| 1 | 2026-10-17 | Where the app lives | Separate app repo from the template, inside `micro-bit` | Inside `micro-bit`, folder `app/` | Founder | DECIDED |
| 2 | 2026-10-20 | First scope | Full concepts from `IDEA.md` | Control the 3 SG90 servos, LEDs, words and sound, plus a block program editor | Founder | DECIDED |
| 3 | 2026-10-20 | Design system | Material, Bootstrap, Tailwind, Blockly plus own tokens | Blockly plus own tokens (see `DESIGN.md`) | Operator, founder asked for advice | DECIDED |
| 4 | 2026-10-20 | iPad connection | Bluefy browser, Pi bridge, laptop bridge, native wrapper | Bluefy first. A connection layer keeps a bridge possible later | Operator | NEEDS FOUNDER |
| 5 | 2026-10-20 | Where to host the app (Bluefy needs HTTPS) | GitHub Pages, Cloudflare Worker | Cloudflare Worker serving static files | Founder | DECIDED |
