import { defineConfig, devices } from '@playwright/test';

const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  workers: process.env.CI ? 1 : 5,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: 'test-results/playwright',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 1100 },
  },
  webServer: {
    command: `CI=1 npx expo start --web --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
