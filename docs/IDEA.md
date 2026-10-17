# Idea

## Seed
"browser app for ipad to control micro:bit and a few lego servos connected to it". App name: Space Bunnies. Use the bunny and space theme loosely. The hardware control is the real request.

## Who it is for
* Kids 10 and up, alone or two kids sharing one iPad.
* Device: iPad. Hardware: a BBC micro:bit V2.2 with a Kitronik Compact 16 servo board and 5 servos. Full list in `EQUIPMENT.md`.
* This seed overrides the generic game framing. The concepts are ways to use an iPad browser app to drive the micro:bit and its servos.

## Connection finding (read this first)
Safari on iPad does not support Web Bluetooth or WebUSB. Chrome, Edge and every other iPad browser use Apple's WebKit engine, so they cannot either. A plain web page on the iPad cannot talk to a micro:bit directly. Research found no way around this inside normal Safari. Apple's own micro:bit app only sends programs to the micro:bit and does not let a web page send live commands.

### Options compared
| Option | How it works | Pros | Cons |
| --- | --- | --- | --- |
| A. Bluefy browser | Free iPad browser app that adds Web Bluetooth. Our page talks to the micro:bit over the Nordic UART Bluetooth service. | Nothing else to buy. Page stays a simple web page. No server. | Not Safari. Connections can drop, and one report says it can be flaky with some devices. Needs testing with the real micro:bit. Kids must open the page inside Bluefy. |
| B. Pi or ESP32 bridge | A Raspberry Pi (or similar) serves the page over Wi-Fi to Safari. Safari talks to it with a WebSocket. The Pi talks to the micro:bit by USB serial or Bluetooth. | Works in plain Safari. Very stable. Wired USB to the micro:bit is rock solid. | Needs an extra small computer and a little server code. Breaks the "no server" rule. Wi-Fi setup needed. |
| C. Laptop bridge | Same as B, but a laptop runs Chrome with Web Serial or Web Bluetooth and relays the iPad's commands. | No new hardware if there is a spare laptop. | Laptop must stay on. Clumsy for kids. |
| D. Second micro:bit as radio bridge | One micro:bit on radio, one at the servos. | Fun and cheap. | Does not solve the iPad problem alone. The bridge micro:bit still needs a host that the iPad can reach, so it only helps when combined with B or C. |
| E. Small native iPad app wrapper | A tiny app (WKWebView plus CoreBluetooth) that shows our page and passes messages to Bluetooth. | Most polished result. | Needs a Mac, Xcode and an Apple developer account. Largest effort. |

### micro:bit
* We have a V2.2. It has enough memory for Bluetooth, plus a speaker, a touch logo and a microphone.
* The micro:bit needs its own program. In MakeCode, add the Bluetooth extension and the Kitronik servo board extension, start the UART service, and listen for text commands such as `S1:90` (servo 1 to 90 degrees). The same program drives the servos and can send sensor data back (buttons, PIR motion, shake, temperature, compass).
* Pairing mode: hold A + B, press and release reset, then let go of A + B.

### Servos
* The Kitronik Compact 16 board powers the servos from its own battery input, not from the micro:bit pins. It talks to the micro:bit over I2C.
* We have 3 SG90 hobby servos and 2 Building Brick Motors. Still to check: do the Building Brick Motors move to an angle, or spin all the way around?

### Recommended path
Start with option A (Bluefy plus Bluetooth UART). It is the cheapest and keeps the project a single web page. Test the connection with a tiny "move servo 1" page in the first hour. If Bluefy proves flaky, fall back to option B with a Raspberry Pi serving the same page, so the app code barely changes. Build the app with a small "connection" layer so it can swap between Bluetooth and WebSocket.

## Concepts
### 1. Bunny Cockpit
* Pitch: A touch control panel on the iPad that drives the bunny robot's arms, ears and wheels with big sliders and buttons.
* Core loop: Drag a slider, see the servo move right away. Tap the micro:bit's LEDs to show a face. Fun because it reacts instantly.
* For: Ages 10 and up, alone or two kids (one drives, one is co-pilot).
* Smallest fun version: Connect, then one slider per servo, a "center all" button, and an LED face picker.
* Later: Joystick pad, button on the micro:bit plays a sound on the iPad, show shake and temperature as gauges, saved pose presets.
* Effort: S

### 2. Hop Recorder
* Pitch: Record a dance for your bunny robot by moving the sliders, then play it back and loop it to music.
* Core loop: Record, tweak, play, share the dance with a friend. Fun because you make a show.
* For: Ages 10 and up, alone or taking turns.
* Smallest fun version: Record 10 seconds of slider moves, play back, loop. Store dances in the browser.
* Later: Timeline editor with keyframes, speed control, beat sync with iPad music, export dances as a link.
* Effort: M

### 3. Code Burrow
* Pitch: Snap puzzle pieces together to program your bunny, like "turn arm to 90, wait, show a heart".
* Core loop: Build a short program, press play, watch the robot do it, fix it. Fun because you are the programmer.
* For: Ages 10 and up, alone or in pairs.
* Smallest fun version: A row of tap to add step cards (move servo, wait, LED icon, repeat) that play in order.
* Later: Drag and drop blocks, loops and if blocks that react to micro:bit buttons, the PIR sensor and shake, save and share programs.
* Effort: M to L

### 4. Moon Duel
* Pitch: Two kids race to copy a bunny pose, with one micro:bit button each.
* Core loop: A pose shows on the iPad and the robot. Each kid taps a button first to score. The robot moves, LEDs show the score, the buzzer cheers. Fun because it is fast and silly.
* For: Ages 10 and up, two players on one iPad plus the two micro:bit buttons A and B.
* Smallest fun version: Random servo pose, first button press wins the point, first to 5 wins.
* Later: Memory pose chains, difficulty levels, team mode, sound effects.
* Effort: M

### 5. Space Pet (wild card)
* Pitch: Your robot bunny is a pet with moods. Pet it, feed it, and it wiggles, sleeps and sulks.
* Core loop: Check on the pet, react to its mood, watch the servos express it. The PIR sensor notices when you walk by, and the touch logo is for petting. Fun because the robot feels alive.
* For: Ages 10 and up, alone, with a family shared pet.
* Smallest fun version: Three moods (happy, sleepy, grumpy) each with a servo motion and an LED face, changed by taps and micro:bit buttons.
* Later: Mood timers, tricks to teach it (links to the recorder), night mode, wakes up when the PIR sees someone.
* Effort: M

## Recommendation
Build Concept 1, Bunny Cockpit, first. It proves the hard part (the connection and servos) in one weekend, and it becomes the base for Hop Recorder and Code Burrow later. After it works, add Hop Recorder as the next step.

## Open questions
1. Is a Bluefy browser (free iPad app) acceptable instead of Safari? Suggested: yes, try it first.
2. If Bluefy is flaky, can we add a Raspberry Pi (or spare laptop) as a bridge? Suggested: yes, as a backup only.
3. Which concept excites the kids most, and should the bunny and space theme be strong? Suggested: Bunny Cockpit first, theme as light decoration (bunny ears, star background).

## Chosen concept
Not chosen yet.

## Founder answers
* micro:bit version: V2.2 (from the equipment list).
* Servo board: Kitronik Compact 16 Servo Driver Board, powered by a 4x AA holder.
* Servos: 3x SG90 and 2x Building Brick Motor (EF-09087).
* Develop inside the `micro-bit` repo, no separate app folder.
