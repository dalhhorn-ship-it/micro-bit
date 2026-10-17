// Block definitions and toolbox for the Program tab.
// Colors follow MakeCode, so kids who know MakeCode feel at home.
import * as Blockly from 'blockly';
import '@blockly/field-bitmap';
import { ICONS } from './icons.js';
import { NOTES, BEATS } from './notes.js';
import { SERVO_CHANNELS } from './protocol.js';

export const COLORS = {
  basic: '#1E90FF',
  music: '#E63022',
  input: '#C90072',
  loops: '#00AA00',
  servo: '#FF8C1A',
};

const ICON_LABELS = {
  rabbit: '🐰 rabbit', heart: '❤️ heart', happy: '🙂 happy', sad: '🙁 sad',
  rocket: '🚀 rocket', star: '⭐ star', yes: '✔️ yes', no: '❌ no',
};

const BLOCKS = [
  {
    type: 'sb_on_start',
    message0: 'when Run is pressed %1 %2',
    args0: [{ type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }],
    colour: COLORS.basic,
    tooltip: 'The blocks inside run when you tap Run.',
  },
  {
    type: 'sb_servo',
    message0: 'servo %1 to %2 degrees',
    args0: [
      { type: 'field_dropdown', name: 'SERVO', options: SERVO_CHANNELS.map((c) => [String(c), String(c)]) },
      { type: 'field_number', name: 'ANGLE', value: 90, min: 0, max: 180, precision: 1 },
    ],
    previousStatement: null, nextStatement: null, colour: COLORS.servo,
    tooltip: 'Turn a servo. 0 is one side, 90 is the middle, 180 is the other side.',
  },
  {
    type: 'sb_show_text',
    message0: 'show text %1',
    args0: [{ type: 'field_input', name: 'TEXT', text: 'Hi!' }],
    previousStatement: null, nextStatement: null, colour: COLORS.basic,
    tooltip: 'Scroll words across the LEDs.',
  },
  {
    type: 'sb_show_icon',
    message0: 'show icon %1',
    args0: [{ type: 'field_dropdown', name: 'ICON', options: Object.keys(ICONS).map((k) => [ICON_LABELS[k] ?? k, k]) }],
    previousStatement: null, nextStatement: null, colour: COLORS.basic,
  },
  {
    type: 'sb_show_leds',
    message0: 'show leds %1',
    args0: [{
      type: 'field_bitmap', name: 'LEDS', width: 5, height: 5,
      colours: { filled: '#ff3b3b', empty: '#2b2f4a' }, buttons: { randomize: true, clear: true },
    }],
    previousStatement: null, nextStatement: null, colour: COLORS.basic,
    tooltip: 'Tap the block, then tap squares to draw.',
  },
  {
    type: 'sb_clear',
    message0: 'clear screen',
    previousStatement: null, nextStatement: null, colour: COLORS.basic,
  },
  {
    type: 'sb_pause',
    message0: 'pause %1 ms',
    args0: [{ type: 'field_number', name: 'MS', value: 500, min: 0, max: 10000, precision: 50 }],
    previousStatement: null, nextStatement: null, colour: COLORS.basic,
    tooltip: '1000 ms is one second.',
  },
  {
    type: 'sb_play_note',
    message0: 'play note %1 for %2 beat',
    args0: [
      { type: 'field_dropdown', name: 'NOTE', options: Object.keys(NOTES).map((n) => [n, n]) },
      { type: 'field_dropdown', name: 'BEAT', options: Object.keys(BEATS).map((b) => [b, b]) },
    ],
    previousStatement: null, nextStatement: null, colour: COLORS.music,
  },
  {
    type: 'sb_wait_button',
    message0: 'wait for button %1',
    args0: [{ type: 'field_dropdown', name: 'BUTTON', options: [['A', 'A'], ['B', 'B'], ['logo', 'L']] }],
    previousStatement: null, nextStatement: null, colour: COLORS.input,
    tooltip: 'Wait until someone presses this button on the micro:bit.',
  },
  {
    type: 'sb_repeat',
    message0: 'repeat %1 times %2 %3',
    args0: [
      { type: 'field_number', name: 'TIMES', value: 4, min: 0, max: 20, precision: 1 },
      { type: 'input_dummy' },
      { type: 'input_statement', name: 'DO' },
    ],
    previousStatement: null, nextStatement: null, colour: COLORS.loops,
  },
];

Blockly.common.defineBlocksWithJsonArray(BLOCKS);

const b = (type) => ({ kind: 'block', type });

export const TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    { kind: 'category', name: 'Basic', colour: COLORS.basic, contents: [
      b('sb_on_start'), b('sb_show_text'), b('sb_show_icon'), b('sb_show_leds'), b('sb_clear'), b('sb_pause'),
    ] },
    { kind: 'category', name: 'Servos', colour: COLORS.servo, contents: [b('sb_servo')] },
    { kind: 'category', name: 'Music', colour: COLORS.music, contents: [b('sb_play_note')] },
    { kind: 'category', name: 'Input', colour: COLORS.input, contents: [b('sb_wait_button')] },
    { kind: 'category', name: 'Loops', colour: COLORS.loops, contents: [b('sb_repeat')] },
  ],
};

// Links blocks so each one runs after the one before.
function seq(...blocks) {
  for (let i = blocks.length - 2; i >= 0; i--) blocks[i].next = { block: blocks[i + 1] };
  return { block: blocks[0] };
}

// What a new program looks like: a small wave hello.
export const STARTER = {
  blocks: {
    languageVersion: 0,
    blocks: [{
      type: 'sb_on_start', x: 30, y: 30,
      inputs: { DO: seq(
        { type: 'sb_show_icon', fields: { ICON: 'rabbit' } },
        { type: 'sb_repeat', fields: { TIMES: 2 }, inputs: { DO: seq(
          { type: 'sb_servo', fields: { SERVO: '1', ANGLE: 30 } },
          { type: 'sb_pause', fields: { MS: 300 } },
          { type: 'sb_servo', fields: { SERVO: '1', ANGLE: 150 } },
          { type: 'sb_pause', fields: { MS: 300 } },
        ) } },
        { type: 'sb_show_text', fields: { TEXT: 'Hi!' } },
      ) },
    }],
  },
};

export function createWorkspace(el) {
  return Blockly.inject(el, {
    toolbox: TOOLBOX,
    // Load Blockly's sounds and icons from our own site, not the internet.
    media: './blockly-media/',
    renderer: 'zelos',
    trashcan: true,
    zoom: { controls: true, startScale: 0.9, maxScale: 2, minScale: 0.5, wheel: false, pinch: true },
    move: { scrollbars: true, drag: true, wheel: true },
    grid: { spacing: 24, length: 2, colour: '#2b2f4a', snap: true },
    theme: Blockly.Theme.defineTheme('spaceBunnies', {
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#14172b',
        toolboxBackgroundColour: '#1d2140',
        toolboxForegroundColour: '#ffffff',
        flyoutBackgroundColour: '#262b52',
        flyoutOpacity: 0.95,
        scrollbarColour: '#4a5190',
      },
      fontStyle: { family: 'ui-rounded, system-ui, sans-serif', weight: 'bold', size: 14 },
    }),
  });
}

export function saveWorkspace(ws) {
  return Blockly.serialization.workspaces.save(ws);
}

export function loadWorkspace(ws, json) {
  Blockly.serialization.workspaces.load(json, ws);
}

export function resizeWorkspace(ws) {
  Blockly.svgResize(ws);
}
