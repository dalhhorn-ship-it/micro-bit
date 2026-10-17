import { timeoutFor } from '../protocol.js';

// Shared by every connection: sends one command at a time, waits for "OK",
// and passes button presses on to listeners.
export class BaseConnection {
  constructor() {
    this.listeners = new Set();
    this.chain = Promise.resolve();
    this.waiting = null;
    this.buffer = '';
    this.connected = false;
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(event) {
    for (const fn of this.listeners) fn(event);
  }

  setConnected(on) {
    this.connected = on;
    if (!on && this.waiting) this.waiting.reject(new Error('Disconnected'));
    this.emit({ type: 'status', connected: on });
  }

  // Resolves when the micro:bit says OK. Commands never overlap.
  send(line) {
    const run = () => this.sendOne(line);
    const result = this.chain.then(run, run);
    this.chain = result.catch(() => {});
    return result;
  }

  sendOne(line) {
    if (!this.connected) return Promise.reject(new Error('Not connected'));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waiting = null;
        reject(new Error(`No answer to ${line}`));
      }, timeoutFor(line));
      this.waiting = {
        resolve: () => { clearTimeout(timer); this.waiting = null; resolve(); },
        reject: (err) => { clearTimeout(timer); this.waiting = null; reject(err); },
      };
      Promise.resolve(this.write(`${line}\n`)).catch((err) => this.waiting?.reject(err));
    });
  }

  // Feed raw text from the micro:bit. Lines end with a newline.
  receive(chunk) {
    this.buffer += chunk;
    let i;
    while ((i = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, i).trim();
      this.buffer = this.buffer.slice(i + 1);
      if (line === 'OK') this.waiting?.resolve();
      else if (line === 'A' || line === 'B' || line === 'L') this.emit({ type: 'button', button: line });
    }
  }

  // Subclasses implement these.
  async connect() {}
  async disconnect() {}
  async write() {}
}
