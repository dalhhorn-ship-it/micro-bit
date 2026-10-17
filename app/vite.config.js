import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths, so the build works from any folder, like GitHub Pages.
  base: './',
  // Blockly is big but loads once and is cached for offline use.
  build: { chunkSizeWarningLimit: 1500 },
  test: { include: ['tests/unit/**/*.test.js'] },
});
