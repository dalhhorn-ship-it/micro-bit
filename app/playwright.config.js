import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  use: { baseURL: 'http://localhost:4173' },
  webServer: { command: 'npx vite --port 4173 --strictPort', port: 4173, reuseExistingServer: true },
  projects: [
    { name: 'ipad', use: { ...devices['iPad (gen 7) landscape'], browserName: 'chromium' } },
  ],
});
