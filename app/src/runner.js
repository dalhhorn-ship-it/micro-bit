// Runs a list of steps on a connection, one at a time.
import * as cmd from './protocol.js';

export class Runner {
  constructor(connection, { onStep = () => {} } = {}) {
    this.conn = connection;
    this.onStep = onStep;
    this.stopped = true;
    this.wake = null;
  }

  get running() {
    return !this.stopped;
  }

  async run(steps) {
    this.stopped = false;
    try {
      await this.runAll(steps);
    } finally {
      this.stopped = true;
      this.onStep(null);
    }
  }

  stop() {
    this.stopped = true;
    this.wake?.();
  }

  async runAll(steps) {
    for (const s of steps) {
      if (this.stopped) return;
      this.onStep(s.id);
      await this.runStep(s);
    }
  }

  async runStep(s) {
    switch (s.op) {
      case 'servo': return this.conn.send(cmd.servo(s.channel, s.angle));
      case 'text': return this.conn.send(cmd.text(s.text));
      case 'image': return this.conn.send(cmd.image(s.rows));
      case 'clear': return this.conn.send(cmd.clear());
      case 'tone': return this.conn.send(cmd.tone(s.freq, s.ms));
      case 'pause': return this.sleep(s.ms);
      case 'wait': return this.waitFor(s.button);
      case 'repeat':
        for (let i = 0; i < s.times && !this.stopped; i++) await this.runAll(s.body);
        return undefined;
      default: return undefined;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      const t = setTimeout(done, ms);
      const self = this;
      function done() { clearTimeout(t); self.wake = null; resolve(); }
      this.wake = done;
    });
  }

  waitFor(button) {
    return new Promise((resolve) => {
      const off = this.conn.on((e) => {
        if (e.type === 'button' && e.button === button) done();
      });
      const self = this;
      function done() { off(); self.wake = null; resolve(); }
      this.wake = done;
    });
  }
}
