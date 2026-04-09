import { test as base, expect } from '@playwright/test';

import { gotoApp, resetAppState } from '../helpers/app-helpers';

type AppFixtures = {
  appPage: import('@playwright/test').Page;
};

export const test = base.extend<AppFixtures>({
  appPage: async ({ page }, use) => {
    await gotoApp(page, '/');
    await resetAppState(page);
    await use(page);
  },
});

export { expect };
