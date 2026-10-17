// 5 by 5 pictures for the micro:bit LEDs. "#" is on, "." is off.
const art = {
  rabbit: ['#.#..', '#.#..', '####.', '##.#.', '####.'],
  heart: ['.#.#.', '#####', '#####', '.###.', '..#..'],
  happy: ['.....', '.#.#.', '.....', '#...#', '.###.'],
  sad: ['.....', '.#.#.', '.....', '.###.', '#...#'],
  rocket: ['..#..', '.###.', '.###.', '.###.', '#.#.#'],
  star: ['..#..', '.###.', '#####', '.###.', '.#.#.'],
  yes: ['.....', '....#', '...#.', '#.#..', '.#...'],
  no: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
};

export const ICONS = Object.fromEntries(
  Object.entries(art).map(([name, rows]) => [name, rows.map((r) => [...r].map((c) => (c === '#' ? 1 : 0)))]),
);

export const ICON_NAMES = Object.keys(ICONS);

export const blankImage = () => Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]);
