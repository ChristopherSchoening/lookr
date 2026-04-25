import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import {
  createNoLimitSeedState,
  createWeightChartSeedState,
  createWeightDetailsEditSeedState,
  createWeightOverviewNoTargetSeedState,
  createWeightOverviewSeedState,
  createWeightSingleEntrySeedState,
  getRelativeDateKey,
} from '../fixtures/seed-states';
import { ProgressPage } from '../helpers/progress-page';
import { WeightDetailsPage } from '../helpers/weight-details-page';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('US1: Weight overview', () => {
  test('shows weight overview with all six stats when weight entries exist', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'weight-overview-with-data', ['US1']);

    await seedAppState(appPage, createWeightOverviewSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();

    await progress.assertLatestWeight('81.9');
    await progress.assertGoalWeight('78');
    await progress.assertWeightChange('-0.3');
    await progress.assertDetailsButton();
    await expect(appPage.getByTestId('latest-entry-date')).toBeVisible();
  });

  test('shows empty state when no weight entries exist', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-overview-empty-state', ['US1']);

    await seedAppState(appPage, createNoLimitSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();

    await progress.assertEmptyState();
    await expect(appPage.getByTestId('progress-overview-card')).toHaveCount(0);
  });

  test('does not show adherence or daily limit sections', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-overview-no-non-weight-sections', ['US1']);

    await seedAppState(appPage, createWeightOverviewSeedState());

    const progress = new ProgressPage(appPage);
    await progress.goto();

    await expect(appPage.getByTestId('progress-daily-limit-card')).toHaveCount(0);
    await expect(appPage.getByTestId('adherence-metric')).toHaveCount(0);
  });
});

test.describe('US2: Weight entry management', () => {
  test.beforeEach(async ({ appPage }) => {
    await seedAppState(appPage, createWeightDetailsEditSeedState());
  });

  test('shows full entry list with date and weight per row', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-details-entry-list', ['US2']);

    const details = new WeightDetailsPage(appPage);
    await details.goto();

    await details.assertEntryCount(3);
    await details.assertEntryWeight(0, '81.9');
  });

  test('valid edit updates entry in list', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-details-valid-edit', ['US2']);

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.editEntry(0);
    await details.saveEdit('85.0', getRelativeDateKey(0));
    await details.assertEntryWeight(0, '85.0');
  });

  test('rejects weight out of range with feedback', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-details-invalid-weight', ['US2']);

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.editEntry(0);
    await details.saveEdit('25', getRelativeDateKey(0));
    await details.assertEditError('Weight must be between 30 and 300 kg');
    await details.cancelEdit();
    await details.assertEntryWeight(0, '81.9');
  });

  test('rejects duplicate date with feedback', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-details-duplicate-date', ['US2']);

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.editEntry(0);
    await details.saveEdit('82.0', getRelativeDateKey(-1));
    await details.assertEditError('An entry for this date already exists');
  });

  test('delete with confirmation removes entry', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-details-delete', ['US2']);

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.assertEntryCount(3);
    await details.deleteEntry(0);
    await details.confirmDelete();
    await details.assertEntryCount(2);
  });
});

test.describe('US3: Weight trend chart', () => {
  test('chart SVG is present when entries exist', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-chart-visible', ['US3']);

    await seedAppState(appPage, createWeightChartSeedState());

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.assertChartVisible();
  });

  test('no chart shown when no entries exist', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-chart-no-entries', ['US3']);

    await seedAppState(appPage, createNoLimitSeedState());

    const details = new WeightDetailsPage(appPage);
    await expect(appPage.getByTestId('weight-details-screen')).toHaveCount(0);
    await appPage.goto('/progress/details');
    await expect(appPage.getByTestId('weight-details-empty')).toBeVisible();
    await details.assertChartHidden();
  });

  test('single entry renders without implying trend', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-chart-single-entry', ['US3']);

    await seedAppState(appPage, createWeightSingleEntrySeedState());

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await details.assertChartVisible();
  });

  test('chart shows target line when target weight is set', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-chart-target-line', ['US3']);

    await seedAppState(appPage, createWeightChartSeedState());

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await expect(appPage.getByTestId('weight-chart-target-line')).toHaveCount(1);
  });

  test('no target line when target weight not set', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'weight-chart-no-target-line', ['US3']);

    await seedAppState(appPage, createWeightOverviewNoTargetSeedState());

    const details = new WeightDetailsPage(appPage);
    await details.goto();
    await expect(appPage.getByTestId('weight-chart-target-line')).toHaveCount(0);
  });
});
