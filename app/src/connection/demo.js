import { BaseConnection } from './base.js';
import { blankImage } from '../icons.js';
import { SERVO_CHANNELS } from '../protocol.js';

// A pretend micro:bit, so the app can be tried and tested without hardware.
// It understands the same commands as microbit/space-bunnies.ts.
export class DemoConnection extends BaseConnection {
  constructor({ speed = 1 } = {}) {
    super();
    this.speed = speed;
    this.state = {
      leds: blankImage(),
      servos: Object.fromEntries(SERVO_CHANNELS.map((c) => [c, 90])),
      text: '',
      note: null,
    };
  }

  async connect() {
    this.setConnected(true);
    this.emit({ type: 'state', state: this.state });
  }

  async disconnect() {
    this.setConnected(false);
  }

  press(button) {
    if (this.connected) this.receive(`${button}\n`);
  }

  async write(raw) {
    const line = raw.trim();
    const [cmd, ...args] = line.split(',');
    let ms = 0;
    if (cmd === 'S') {
      this.state.servos[Number(args[0])] = Number(args[1]);
    } else if (cmd === 'T') {
      this.state.text = line.slice(2);
      this.state.leds = blankImage();
      ms = 150 * this.state.text.length;
    } else if (cmd === 'I') {
      this.state.leds = args.map((n) => [4, 3, 2, 1, 0].map((bit) => (Number(n) >> bit) & 1));
    } else if (cmd === 'N') {
      this.state.note = Number(args[0]);
      ms = Number(args[1]);
    } else if (cmd === 'C') {
      this.state.leds = blankImage();
    }
    this.emit({ type: 'state', state: this.state });
    setTimeout(() => {
      this.state.text = '';
      this.state.note = null;
      this.emit({ type: 'state', state: this.state });
      this.receive('OK\n');
    }, ms * this.speed);
  }
}
