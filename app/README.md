# Space Bunnies app

An iPad web app that controls a BBC micro:bit with SG90 servos on a Kitronik Compact 16 servo board.

* **Control tab:** sliders for servos 1 to 3, a 5 by 5 LED drawing grid with icons, words that scroll, and a small piano.
* **Program tab:** MakeCode style blocks. Kids build a program under "when Run is pressed" and tap Run. The program is saved on the iPad.
* **Demo button:** a pretend micro:bit on screen, so you can try everything without hardware.

## 1. Set up the micro:bit

1. Connect the servo board to the micro:bit and plug the SG90s into servo outputs 1, 2 and 3. Power the board from the 4x AA holder (see `docs/EQUIPMENT.md` about voltage).
2. Open [makecode.microbit.org](https://makecode.microbit.org), start a new project and switch to JavaScript.
3. Add the extensions `bluetooth` and `kitronik-i2c-16-servo`.
4. Paste `microbit/space-bunnies.ts`.
5. Gear icon, Project Settings: choose **No Pairing Required**.
6. Download to the micro:bit. It shows a rabbit.

## 2. Open the app on the iPad

Safari cannot talk to a micro:bit. Install the free **Bluefy** browser from the App Store and open the app there. Tap **Connect micro:bit** and pick the micro:bit from the list. It shows a check mark when it is connected.

Bluetooth only works on a secure (HTTPS) address, so the app is hosted on a Cloudflare Worker. See "Publish" below.

## Develop

```
npm install
npm run dev        # http://localhost:5173, use Demo to try it
npm test           # unit tests
npm run test:e2e   # browser tests with the demo micro:bit
npm run build      # makes dist/
```

## Publish (Cloudflare Worker)

The Worker only serves the files in `dist/`. There is no server code. The setup is in `wrangler.jsonc`.

**Option A: from your computer**

```
npx wrangler login   # once, opens Cloudflare in the browser
npm run deploy       # builds and uploads
```

Wrangler prints the address, like `https://space-bunnies.<your-name>.workers.dev`. Open that in Bluefy.

**Option B: automatic on every push**

In the Cloudflare dashboard, go to Workers & Pages, Create, Import a repository, and pick `micro-bit`. Use these settings:
* Root directory: `app`
* Build command: `npm run build`
* Deploy command: `npx wrangler deploy`

Then every push to the main branch publishes the app.

## How it works

The app sends one text line per command and waits for the micro:bit to answer `OK`. The micro:bit sends `A`, `B` or `L` when a button or the logo is pressed.

| Command | Meaning |
|---|---|
| `S,1,90` | Servo 1 to 90 degrees |
| `T,Hello` | Scroll text |
| `I,10,31,31,14,4` | Show a picture. One number per row, left LED is the highest bit |
| `N,440,250` | Play 440 Hz for 250 ms |
| `C` | Clear the screen |

Code map: `src/protocol.js` (commands), `src/connection/` (Bluetooth and demo), `src/blocks.js` (blocks), `src/program.js` (blocks to steps), `src/runner.js` (runs steps), `src/main.js` (screens).
