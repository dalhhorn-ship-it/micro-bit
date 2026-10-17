import 'blockly/blocks';
import './style.css';
import * as cmd from './protocol.js';
import { ICONS, blankImage } from './icons.js';
import { NOTES } from './notes.js';
import { BluetoothConnection } from './connection/bluetooth.js';
import { DemoConnection } from './connection/demo.js';
import { Runner } from './runner.js';
import { programFromWorkspace } from './program.js';
import { createWorkspace, saveWorkspace, loadWorkspace, resizeWorkspace, STARTER } from './blocks.js';

const $ = (sel) => document.querySelector(sel);
const SAVE_KEY = 'space-bunnies-program';

let conn = null;
let runner = null;
let workspace = null;

// ---------- messages ----------
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3500);
}

async function send(line) {
  if (!conn?.connected) {
    toast('Connect the micro:bit first, or tap Demo to try it.');
    return;
  }
  try {
    await conn.send(line);
  } catch (err) {
    toast(`Oops: ${err.message}`);
  }
}

// Sends only the newest value while the micro:bit is busy. Good for sliders.
function latestOnly(fn) {
  let busy = false;
  let next = null;
  const go = async (v) => {
    busy = true;
    await fn(v);
    busy = false;
    if (next !== null) { const n = next; next = null; go(n); }
  };
  return (v) => (busy ? (next = v) : go(v));
}

// ---------- tabs ----------
for (const tab of document.querySelectorAll('[data-tab]')) {
  tab.addEventListener('click', () => {
    for (const t of document.querySelectorAll('[data-tab]')) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      $(`#tab-${t.dataset.tab}`).hidden = !on;
    }
    if (tab.dataset.tab === 'program') showProgram();
  });
}

// ---------- connection ----------
function useConnection(next) {
  conn = next;
  runner = new Runner(conn, { onStep: (id) => workspace?.highlightBlock(id) });
  conn.on((e) => {
    if (e.type === 'status') renderStatus();
    if (e.type === 'state') renderSim(e.state);
    if (e.type === 'button') toast(`Button ${e.button === 'L' ? 'logo' : e.button} pressed`);
  });
}

function renderStatus() {
  const on = !!conn?.connected;
  const demo = conn instanceof DemoConnection;
  const pill = $('#status');
  pill.textContent = on ? (demo ? 'Demo micro:bit' : 'Connected') : 'Not connected';
  pill.className = `pill ${on ? 'on' : 'off'}`;
  $('#btn-connect').hidden = on;
  $('#btn-demo').hidden = on;
  $('#btn-disconnect').hidden = !on;
  $('#sim').hidden = !(on && demo);
  if (!on) stopProgram();
}

$('#btn-connect').addEventListener('click', async () => {
  const bt = new BluetoothConnection();
  useConnection(bt);
  try {
    await bt.connect();
    toast('Connected! 🎉');
  } catch (err) {
    if (err.name !== 'NotFoundError') toast(err.message);
  }
});

$('#btn-demo').addEventListener('click', () => {
  useConnection(new DemoConnection());
  conn.connect();
});

$('#btn-disconnect').addEventListener('click', () => conn?.disconnect());

// ---------- servos ----------
const servoBox = $('#servos');
const sliders = {};
for (const ch of cmd.SERVO_CHANNELS) {
  const row = document.createElement('label');
  row.className = 'servo';
  row.innerHTML = `<span>Servo ${ch}</span><input type="range" min="0" max="180" value="90" aria-label="Servo ${ch}"><output>90°</output>`;
  const input = row.querySelector('input');
  const out = row.querySelector('output');
  const push = latestOnly((v) => send(cmd.servo(ch, v)));
  input.addEventListener('input', () => {
    out.textContent = `${input.value}°`;
    push(Number(input.value));
  });
  sliders[ch] = { input, out };
  servoBox.append(row);
}

$('#btn-center').addEventListener('click', async () => {
  for (const ch of cmd.SERVO_CHANNELS) {
    sliders[ch].input.value = 90;
    sliders[ch].out.textContent = '90°';
    await send(cmd.servo(ch, 90));
  }
});

// ---------- LED picture ----------
let picture = blankImage();
const ledGrid = $('#led-grid');
const ledButtons = [];
for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 5; x++) {
    const b = document.createElement('button');
    b.className = 'led';
    b.dataset.x = x;
    b.dataset.y = y;
    b.setAttribute('aria-label', `LED ${x + 1}, ${y + 1}`);
    ledGrid.append(b);
    ledButtons.push(b);
  }
}
function renderPicture() {
  for (const b of ledButtons) b.classList.toggle('on', !!picture[b.dataset.y][b.dataset.x]);
}
// Tap to flip one LED. Drag to paint with the same color as the first LED.
let paint = null;
ledGrid.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.led');
  if (!b) return;
  paint = picture[b.dataset.y][b.dataset.x] ? 0 : 1;
  picture[b.dataset.y][b.dataset.x] = paint;
  renderPicture();
});
ledGrid.addEventListener('pointermove', (e) => {
  if (paint === null) return;
  const b = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.led');
  if (b && ledGrid.contains(b)) { picture[b.dataset.y][b.dataset.x] = paint; renderPicture(); }
});
window.addEventListener('pointerup', () => { paint = null; });

const ICON_EMOJI = { rabbit: '🐰', heart: '❤️', happy: '🙂', sad: '🙁', rocket: '🚀', star: '⭐', yes: '✔️', no: '❌' };
for (const name of Object.keys(ICONS)) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = ICON_EMOJI[name] ?? name;
  b.setAttribute('aria-label', name);
  b.addEventListener('click', () => {
    picture = ICONS[name].map((r) => [...r]);
    renderPicture();
    send(cmd.image(picture));
  });
  $('#icon-row').append(b);
}
$('#btn-send-leds').addEventListener('click', () => send(cmd.image(picture)));
$('#btn-clear-leds').addEventListener('click', () => {
  picture = blankImage();
  renderPicture();
  send(cmd.clear());
});

// ---------- words ----------
$('#text-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const words = cmd.cleanText($('#text-input').value).trim();
  if (words) send(cmd.text(words));
});

// ---------- sound ----------
for (const [name, freq] of Object.entries(NOTES)) {
  const k = document.createElement('button');
  k.className = 'key';
  k.textContent = name === 'C high' ? 'C²' : name;
  k.setAttribute('aria-label', `Note ${name}`);
  k.addEventListener('pointerdown', () => send(cmd.tone(freq, 250)));
  $('#piano').append(k);
}

// ---------- demo micro:bit ----------
const simLeds = [];
for (let i = 0; i < 25; i++) {
  const d = document.createElement('div');
  d.className = 'led';
  $('#sim-leds').append(d);
  simLeds.push(d);
}
function renderSim(state) {
  state.leds.flat().forEach((on, i) => simLeds[i].classList.toggle('on', !!on));
  $('#sim-text').textContent = state.text || (state.note ? `♪ ${state.note} Hz` : '');
  $('#sim-servos').innerHTML = Object.entries(state.servos)
    .map(([ch, deg]) => `<span>Servo ${ch}: <b data-servo="${ch}">${deg}°</b></span>`)
    .join('');
}
for (const b of document.querySelectorAll('[data-press]')) {
  b.addEventListener('click', () => conn instanceof DemoConnection && conn.press(b.dataset.press));
}

// ---------- program ----------
function showProgram() {
  if (workspace) {
    resizeWorkspace(workspace);
    return;
  }
  workspace = createWorkspace($('#blockly'));
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { /* start fresh */ }
  try { loadWorkspace(workspace, saved ?? STARTER); } catch { loadWorkspace(workspace, STARTER); }
  workspace.addChangeListener((e) => {
    if (e.isUiEvent) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saveWorkspace(workspace))); } catch { /* storage full or blocked */ }
  });
}

async function runProgram() {
  if (!conn?.connected) { toast('Connect the micro:bit first, or tap Demo to try it.'); return; }
  const steps = programFromWorkspace(saveWorkspace(workspace));
  if (!steps.length) { toast('Put some blocks inside “when Run is pressed”.'); return; }
  $('#btn-run').disabled = true;
  $('#btn-stop').disabled = false;
  try {
    await runner.run(steps);
  } catch (err) {
    toast(`Oops: ${err.message}`);
  } finally {
    $('#btn-run').disabled = false;
    $('#btn-stop').disabled = true;
  }
}

function stopProgram() {
  runner?.stop();
}

$('#btn-run').addEventListener('click', runProgram);
$('#btn-stop').addEventListener('click', stopProgram);
$('#btn-new').addEventListener('click', () => {
  if (!confirm('Start a new program? The old one is replaced.')) return;
  workspace.clear();
  loadWorkspace(workspace, STARTER);
});

// ---------- offline ----------
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

renderStatus();
