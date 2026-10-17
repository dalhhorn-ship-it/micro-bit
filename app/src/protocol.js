// Text commands the app sends to the micro:bit, one per line.
// The micro:bit answers "OK" after each command. It also sends "A", "B"
// or "L" when button A, button B or the gold logo is pressed.
// Keep this in sync with microbit/space-bunnies.ts.

export const SERVO_CHANNELS = [1, 2, 3];
export const MAX_TEXT = 40;

export function clampAngle(deg) {
  const n = Math.round(Number(deg));
  if (!Number.isFinite(n)) return 90;
  return Math.min(180, Math.max(0, n));
}

export function servo(channel, deg) {
  if (!SERVO_CHANNELS.includes(channel)) throw new Error(`No servo ${channel}`);
  return `S,${channel},${clampAngle(deg)}`;
}

// Only letters the micro:bit font can show, and no line breaks.
export function cleanText(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\x20-\x7e]/g, '')
    .slice(0, MAX_TEXT);
}

export function text(t) {
  return `T,${cleanText(t)}`;
}

// rows: 5 rows of 5 values (0 or 1). Each row is sent as a number 0..31,
// with the leftmost LED as the highest bit.
export function image(rows) {
  const nums = rows.map((row) => row.reduce((acc, on) => (acc << 1) | (on ? 1 : 0), 0));
  return `I,${nums.join(',')}`;
}

export function tone(freq, ms) {
  const f = Math.min(4000, Math.max(30, Math.round(freq)));
  const d = Math.min(4000, Math.max(20, Math.round(ms)));
  return `N,${f},${d}`;
}

export const clear = () => 'C';

// How long the micro:bit may take before it says OK.
export function timeoutFor(line) {
  if (line.startsWith('T,')) return 3000 + (line.length - 2) * 800;
  if (line.startsWith('N,')) return 3000 + Number(line.split(',')[2]);
  return 3000;
}
