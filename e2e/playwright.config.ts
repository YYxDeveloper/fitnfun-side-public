import { defineConfig, devices } from '@playwright/test';

const BASE_PORT_18 = 5181;
const BASE_PORT_19 = 5182;
const BASE_PORT_20 = 5183;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-output',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'issue20-ux-polish',
      testMatch: /issue20\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${BASE_PORT_20}`,
        video: 'on',
      },
      webServer: {
        command: `npx vite --port ${BASE_PORT_20} --strictPort`,
        cwd: '/Users/qw/YYx/githubs/issue20/demo',
        url: `http://localhost:${BASE_PORT_20}`,
        reuseExistingServer: true,
        timeout: 60_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },
    {
      name: 'issue18-avatar-upload',
      testMatch: /issue18\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${BASE_PORT_18}`,
        video: 'on',
      },
      webServer: {
        command: `npx vite --port ${BASE_PORT_18} --strictPort`,
        cwd: '/Users/qw/YYx/githubs/issue18/demo',
        url: `http://localhost:${BASE_PORT_18}`,
        reuseExistingServer: true,
        timeout: 60_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },
    {
      name: 'issue19-chip-selector',
      testMatch: /issue19\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${BASE_PORT_19}`,
        video: 'on',
      },
      webServer: {
        command: `npx vite --port ${BASE_PORT_19} --strictPort`,
        cwd: '/Users/qw/YYx/githubs/issue19/demo',
        url: `http://localhost:${BASE_PORT_19}`,
        reuseExistingServer: true,
        timeout: 60_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
    },
  ],
});
