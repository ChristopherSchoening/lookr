import {
  attachSnapshotOnFailure,
  annotateScenario,
  readAppSnapshot,
  seedAppState,
} from '../helpers/app-helpers';
import {
  createDecimalLimitSeedState,
  createHistoricalLimitProgressSeedState,
  createMixedHistorySeedState,
  createNoLimitSeedState,
  createProgressSeedState,
  createSameDayLimitEditSeedState,
  getRelativeDateKey,
} from '../fixtures/seed-states';
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

  test('progress sets initial limit, accepts decimals, and rejects invalid values', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'progress-limit-setup-and-validation', [
      'US1-AS1',
      'US1-AS4',
      'US1-AS5',
    ]);

    await seedAppState(appPage, createNoLimitSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();
    await progress.expectDailyLimitMetric('—');

    for (const invalidValue of ['', '0', '-2', 'abc']) {
      await progress.saveDailyLimit(invalidValue);
      await progress.expectDailyLimitValidation('Daily point limit must be a positive number.');
    }

    await progress.saveDailyLimit('24.5');
    await progress.expectDailyLimitMessage('Daily point limit saved.');
    await progress.expectDailyLimitMetric('24.5');

    const snapshot = await readAppSnapshot(appPage);
    expect(snapshot.profile?.dailyPointsLimit).toBe(24.5);
    expect(snapshot.dailyPointLimitHistory[0]?.dailyPointsLimit).toBe(24.5);
    expect(snapshot.dailyPointLimitHistory[0]?.effectiveDate).toBe(getRelativeDateKey(0));
  });

  test('progress edit refreshes same-day budget and preserves decimal display', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'progress-limit-edit-same-day-refresh', [
      'US1-AS2',
      'US1-AS3',
      'US1-AS4',
    ]);

    await seedAppState(appPage, createSameDayLimitEditSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();
    await progress.expectDailyLimitInput('24');
    await progress.expectDailyLimitMetric('24');
    await progress.expectAdherence('0/1');

    await progress.saveDailyLimit('30.5');
    await progress.expectDailyLimitMessage('Daily point limit updated for today.');
    await progress.expectDailyLimitInput('30.5');
    await progress.expectDailyLimitMetric('30.5');
    await progress.expectAdherence('1/1');
  });

  test('progress reads a seeded decimal limit without rounding', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'progress-decimal-limit-seed', ['US1-AS4', 'US3-AS1']);

    await seedAppState(appPage, createDecimalLimitSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();
    await progress.expectDailyLimitInput('24.5');
    await progress.expectDailyLimitMetric('24.5');
    await progress.expectAdherence('1/1');
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

    await progress.saveDailyLimit(30);
    await progress.expectDailyLimitMessage('Daily point limit updated for today.');
    await progress.expectAdherence('2/3');
  });

  test('progress aggregate matches day outcomes across a limit boundary', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'progress-mixed-history-adherence-boundary', ['US3-AS1', 'US3-AS2']);

    await seedAppState(appPage, createMixedHistorySeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();
    await progress.expectAdherence('2/3');

    await progress.saveDailyLimit(20);
    await progress.expectAdherence('1/3');
  });
});
