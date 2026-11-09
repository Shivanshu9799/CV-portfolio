import { defineConfig, devices } from '@playwright/test';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}${BASE_PATH}`,
    trace: 'retain-on-failure',
  },
  // Serves the static export in out/ under the same base path the build used.
  webServer: {
    command: `pnpm exec tsx scripts/serve.ts ${PORT}`,
    url: `http://127.0.0.1:${PORT}${BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
