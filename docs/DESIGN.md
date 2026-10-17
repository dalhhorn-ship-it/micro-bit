# Design

## Recommendation: MakeCode look, no UI framework

* **Blocks: Blockly.** Blockly is the block engine inside MakeCode. Kids who know MakeCode see the same kind of blocks, the same colors and the same drag and drop. It works with touch on iPad and runs fully offline.
* **Everything else: our own small set of design tokens.** These are a few CSS variables in `app/src/style.css`. We use no Material, Bootstrap or Tailwind. Those are made for desktop forms and office apps. They add weight and do not look like a toy.
* **Font: the iPad's own rounded system font** (`ui-rounded`). It is friendly, very readable and needs no download.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#14172b` | Space background |
| `--panel` | `#1d2140` | Cards and the top bar |
| `--basic` | `#1e90ff` | LEDs, text, main buttons (MakeCode "Basic") |
| `--servo` | `#ff8c1a` | Servos |
| `--music` | `#e63022` | Sound (MakeCode "Music") |
| `--input` | `#c90072` | Buttons on the micro:bit (MakeCode "Input") |
| `--loops` | `#00aa00` | Loops and the Run button (MakeCode "Loops") |
| `--led-on` | `#ff3b3b` | A lit micro:bit LED |
| `--tap` | `52px` | Smallest touch target |
| `--radius` | `18px` | Card corners |

## Rules

* Each card has a colored top edge in its category color. The same color is used for its blocks.
* Touch targets are at least 52px. LED squares are at least 48px.
* Big emoji labels on buttons, so kids can find things without reading much.
* Dark background, so the red LEDs glow like the real ones.
* Error messages are friendly and say what to do next.
