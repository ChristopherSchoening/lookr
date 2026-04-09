import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import { DashboardPage } from '../helpers/dashboard-page';
import { createOverLimitSeedState } from '../fixtures/seed-states';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('User Story 1: core dashboard coverage', () => {
  test('dashboard-initial-setup covers US1-AS1, US1-AS2, and US1-AS3', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-initial-setup', ['US1-AS1', 'US1-AS2', 'US1-AS3']);

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();

    await expect(appPage.getByTestId('profile-setup-card')).toBeVisible();
    await dashboard.setDailyLimit(24);

    await dashboard.expectRemainingPoints(24);
    await dashboard.addMeal('Greek yogurt bowl', 7);
    await dashboard.expectRemainingPoints(17);
    await dashboard.expectConsumedPoints(7);

    await dashboard.addMeal('Salmon rice bowl', 10);
    await dashboard.expectRemainingPoints(7);
    await dashboard.expectConsumedPoints(17);
    await dashboard.expectStatus('A precise view of what remains for the day.');
  });

  test('dashboard-backfill-past-day covers US1-AS4', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-backfill-past-day', ['US1-AS4']);

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.setDailyLimit(24);

    await dashboard.goToYesterday();
    await dashboard.addMeal('Late dinner fix', 5);
    await dashboard.expectRemainingPoints(19);

    await dashboard.returnToToday();
    await dashboard.expectRemainingPoints(24);
    await expect(appPage.getByText('No meals recorded')).toBeVisible();
  });

  test('dashboard-over-limit-warning preserves the meal and failure context', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-over-limit-warning', ['US1-AS2', 'US1-AS3']);

    await seedAppState(appPage, createOverLimitSeedState());

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();

    await dashboard.expectRemainingPoints(-5);
    await dashboard.expectConsumedPoints(29);
    await dashboard.expectStatus('5 points over today');
    await expect(dashboard.mealCardByName('Pasta dinner')).toBeVisible();
  });
});
