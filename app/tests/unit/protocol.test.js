import { describe, it, expect } from 'vitest';
import * as cmd from '../../src/protocol.js';
import { ICONS } from '../../src/icons.js';

describe('protocol', () => {
  it('builds servo commands and keeps angles in range', () => {
    expect(cmd.servo(1, 90)).toBe('S,1,90');
    expect(cmd.servo(2, 200)).toBe('S,2,180');
    expect(cmd.servo(3, -5)).toBe('S,3,0');
    expect(cmd.servo(1, 44.6)).toBe('S,1,45');
    expect(() => cmd.servo(4, 90)).toThrow();
  });

  it('cleans text to letters the micro:bit can show', () => {
    expect(cmd.text('Hallo Bunny')).toBe('T,Hallo Bunny');
    expect(cmd.text('café 🐰\nhop')).toBe('T,cafe hop');
    expect(cmd.text('x'.repeat(60))).toHaveLength(2 + cmd.MAX_TEXT);
  });

  it('packs each image row into a number, left LED is the high bit', () => {
    expect(cmd.image(ICONS.heart)).toBe('I,10,31,31,14,4');
    expect(cmd.image([[1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1]])).toBe('I,16,1,0,0,31');
  });

  it('keeps tones in a safe range', () => {
    expect(cmd.tone(440, 250)).toBe('N,440,250');
    expect(cmd.tone(10, 99999)).toBe('N,30,4000');
  });

  it('gives long text more time to scroll', () => {
    expect(cmd.timeoutFor('T,hello world')).toBeGreaterThan(cmd.timeoutFor('S,1,90'));
  });
});
