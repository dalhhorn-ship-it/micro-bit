import { describe, it, expect } from 'vitest';
import { Runner } from '../../src/runner.js';
import { DemoConnection } from '../../src/connection/demo.js';

async function demo() {
  const conn = new DemoConnection({ speed: 0 });
  const sent = [];
  const write = conn.write.bind(conn);
  conn.write = (line) => { sent.push(line.trim()); return write(line); };
  await conn.connect();
  return { conn, sent };
}

describe('Runner', () => {
  it('sends each step and repeats loops', async () => {
    const { conn, sent } = await demo();
    const seen = [];
    const runner = new Runner(conn, { onStep: (id) => seen.push(id) });
    await runner.run([
      { id: 'r', op: 'repeat', times: 2, body: [{ id: 's', op: 'servo', channel: 1, angle: 10 }, { id: 'p', op: 'pause', ms: 1 }] },
      { id: 't', op: 'text', text: 'Hi' },
    ]);
    expect(sent).toEqual(['S,1,10', 'S,1,10', 'T,Hi']);
    expect(seen).toEqual(['r', 's', 'p', 's', 'p', 't', null]);
    expect(conn.state.servos[1]).toBe(10);
    expect(runner.running).toBe(false);
  });

  it('waits for a button press', async () => {
    const { conn, sent } = await demo();
    const runner = new Runner(conn);
    const done = runner.run([{ op: 'wait', button: 'A' }, { op: 'clear' }]);
    await new Promise((r) => setTimeout(r, 10));
    expect(sent).toEqual([]);
    conn.press('B');
    await new Promise((r) => setTimeout(r, 10));
    expect(sent).toEqual([]);
    conn.press('A');
    await done;
    expect(sent).toEqual(['C']);
  });

  it('stops in the middle of a pause', async () => {
    const { conn, sent } = await demo();
    const runner = new Runner(conn);
    const done = runner.run([{ op: 'pause', ms: 60000 }, { op: 'clear' }]);
    runner.stop();
    await done;
    expect(sent).toEqual([]);
  });
});

describe('DemoConnection', () => {
  it('shows images and waits for OK before the next command', async () => {
    const { conn, sent } = await demo();
    await Promise.all([conn.send('I,10,31,31,14,4'), conn.send('N,440,10')]);
    expect(sent).toEqual(['I,10,31,31,14,4', 'N,440,10']);
    expect(conn.state.leds[0]).toEqual([0, 1, 0, 1, 0]);
  });

  it('refuses to send when not connected', async () => {
    const conn = new DemoConnection({ speed: 0 });
    await expect(conn.send('C')).rejects.toThrow('Not connected');
  });
});
