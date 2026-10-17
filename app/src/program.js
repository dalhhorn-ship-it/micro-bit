// Turns a saved Blockly workspace (plain JSON) into a list of steps.
// Only blocks inside "when Run is pressed" run, like "on start" in MakeCode.
import { ICONS } from './icons.js';
import { NOTES, BEATS } from './notes.js';

export const START = 'sb_on_start';
export const MAX_REPEAT = 20;

export function programFromWorkspace(json) {
  const tops = json?.blocks?.blocks ?? [];
  const start = tops.find((b) => b.type === START);
  return start ? chain(start.inputs?.DO?.block) : [];
}

function chain(block) {
  const steps = [];
  while (block) {
    const s = step(block);
    if (s) steps.push(s);
    block = block.next?.block;
  }
  return steps;
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function step(b) {
  const f = b.fields ?? {};
  const id = b.id;
  switch (b.type) {
    case 'sb_servo':
      return { id, op: 'servo', channel: num(f.SERVO, 1), angle: num(f.ANGLE, 90) };
    case 'sb_show_text':
      return { id, op: 'text', text: String(f.TEXT ?? '') };
    case 'sb_show_icon':
      return { id, op: 'image', rows: ICONS[f.ICON] ?? ICONS.heart };
    case 'sb_show_leds':
      return { id, op: 'image', rows: f.LEDS };
    case 'sb_clear':
      return { id, op: 'clear' };
    case 'sb_play_note':
      return { id, op: 'tone', freq: NOTES[f.NOTE] ?? NOTES.C, ms: BEATS[f.BEAT] ?? BEATS.quarter };
    case 'sb_pause':
      return { id, op: 'pause', ms: Math.max(0, num(f.MS, 500)) };
    case 'sb_wait_button':
      return { id, op: 'wait', button: f.BUTTON ?? 'A' };
    case 'sb_repeat':
      return {
        id,
        op: 'repeat',
        times: Math.min(MAX_REPEAT, Math.max(0, Math.round(num(f.TIMES, 2)))),
        body: chain(b.inputs?.DO?.block),
      };
    default:
      return null;
  }
}
