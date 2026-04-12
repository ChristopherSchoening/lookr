import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import {
  createHistoricalLimitProgressSeedState,
  createProgressSeedState,
  getRelativeDateKey,
} from '../fixtures/seed-states';
import { DashboardPage } from '../helpers/dashboard-page';
import { ProgressPage } from '../helpers/progress-page';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('User Story 2: progress coverage', () => {
  test.beforeEach(async ({ appPage }) => {
    await seedAppState(appPage, createProgressSeedState());
  });

  test('progress-weight-trend and adherence context cover US3-AS1 and US3-AS2', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'progress-weight-trend', ['US3-AS1', 'US3-AS2']);

    const today = getRelativeDateKey(0);
    const progress = new ProgressPage(appPage);

    await progress.goto();
    await progress.expectCoreLayout();

    await expect(appPage.getByTestId('latest-weight-metric')).toContainText('81.9');
    await expect(appPage.getByTestId('adherence-metric')).toContainText('3/4');
    await expect(appPage.getByTestId('weight-delta')).toHaveText('-0.3');

    await progress.saveWeight(81.4);
    await expect(appPage.getByText('Weight saved for today.')).toBeVisible();
    await progress.expectWeightEntry(today, '81.4');
    await expect(appPage.getByTestId(`weight-bar-${today}`)).toBeVisible();
  });

  test('progress-adherence uses effective limit per day and refreshes after same-day edit', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'progress-effective-limit-adherence', [
      'US3-AS1',
      'US3-AS2',
      'US3-AS3',
    ]);

    await seedAppState(appPage, createHistoricalLimitProgressSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();
    await progress.expectAdherence('1/3');

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.updateDailyLimit(30);
    await dashboard.expectDailyLimit(30);

    await progress.goto();
    await progress.expectAdherence('2/3');
  });
});
