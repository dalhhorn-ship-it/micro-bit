import { describe, it, expect } from 'vitest';
import { programFromWorkspace } from '../../src/program.js';
import { ICONS } from '../../src/icons.js';

const ws = (start, ...others) => ({ blocks: { languageVersion: 0, blocks: [start, ...others] } });
const link = (...blocks) => {
  for (let i = blocks.length - 2; i >= 0; i--) blocks[i].next = { block: blocks[i + 1] };
  return blocks[0];
};

describe('programFromWorkspace', () => {
  it('reads blocks in order from the start block', () => {
    const body = link(
      { id: 'a', type: 'sb_servo', fields: { SERVO: '2', ANGLE: 45 } },
      { id: 'b', type: 'sb_show_icon', fields: { ICON: 'heart' } },
      { id: 'c', type: 'sb_show_text', fields: { TEXT: 'Hop' } },
      { id: 'd', type: 'sb_play_note', fields: { NOTE: 'A', BEAT: 'half' } },
      { id: 'e', type: 'sb_pause', fields: { MS: 300 } },
      { id: 'f', type: 'sb_wait_button', fields: { BUTTON: 'B' } },
      { id: 'g', type: 'sb_clear' },
    );
    const steps = programFromWorkspace(ws({ type: 'sb_on_start', inputs: { DO: { block: body } } }));
    expect(steps).toEqual([
      { id: 'a', op: 'servo', channel: 2, angle: 45 },
      { id: 'b', op: 'image', rows: ICONS.heart },
      { id: 'c', op: 'text', text: 'Hop' },
      { id: 'd', op: 'tone', freq: 440, ms: 500 },
      { id: 'e', op: 'pause', ms: 300 },
      { id: 'f', op: 'wait', button: 'B' },
      { id: 'g', op: 'clear' },
    ]);
  });

  it('nests repeat loops and caps the count', () => {
    const loop = { id: 'r', type: 'sb_repeat', fields: { TIMES: 999 }, inputs: { DO: { block: { id: 'x', type: 'sb_clear' } } } };
    const [step] = programFromWorkspace(ws({ type: 'sb_on_start', inputs: { DO: { block: loop } } }));
    expect(step.times).toBe(20);
    expect(step.body).toEqual([{ id: 'x', op: 'clear' }]);
  });

  it('ignores loose blocks outside the start block', () => {
    expect(programFromWorkspace(ws({ type: 'sb_clear' }))).toEqual([]);
    expect(programFromWorkspace(ws({ type: 'sb_on_start' }, { type: 'sb_clear' }))).toEqual([]);
    expect(programFromWorkspace(null)).toEqual([]);
  });

  it('reads drawn LED pictures', () => {
    const rows = [[1, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1]];
    const steps = programFromWorkspace(ws({ type: 'sb_on_start', inputs: { DO: { block: { id: 'l', type: 'sb_show_leds', fields: { LEDS: rows } } } } }));
    expect(steps).toEqual([{ id: 'l', op: 'image', rows }]);
  });
});
