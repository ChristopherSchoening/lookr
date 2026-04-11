import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import { createLegacyMealSeedState, createOverLimitSeedState } from '../fixtures/seed-states';
import { getRelativeDateKey } from '../fixtures/seed-states';
import { DashboardPage } from '../helpers/dashboard-page';
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
    await dashboard.expectHomeTabChrome();
    await expect(appPage.getByTestId('profile-setup-card')).toBeVisible();
    await expect(appPage.getByText('Add, edit, or remove meals for this day.')).toHaveCount(0);
    await expect(
      appPage.getByText('Add in modal, then edit or remove meals for this day.'),
    ).toHaveCount(0);
    await expect(appPage.getByText('Keep each day accurate with quick meal changes.')).toHaveCount(
      0,
    );
    await expect(appPage.getByText('Use one shared modal for add and edit.')).toHaveCount(0);

    await dashboard.setDailyLimit(24);
    await dashboard.expectRemovedCopy();
    await expect(appPage.getByText('Add, edit, or remove meals for this day.')).toBeVisible();
    await expect(
      appPage.getByText('Keep each day accurate with quick meal changes.'),
    ).toBeVisible();

    await dashboard.expectRemainingPoints(24);
    await dashboard.openMealModal();
    await expect(appPage.getByTestId('meal-modal')).toBeVisible();
    await appPage.getByTestId('cancel-meal-modal-button').click();
    await expect(appPage.getByTestId('meal-modal')).toHaveCount(0);

    await dashboard.addMeal('Greek yogurt bowl', 7, 'breakfast');
    await dashboard.expectRemainingPoints(17);
    await dashboard.expectConsumedPoints(7);
    await dashboard.expectMealType('Greek yogurt bowl', 'Breakfast');

    await dashboard.addMeal('Salmon rice bowl', 10);
    await dashboard.expectRemainingPoints(7);
    await dashboard.expectConsumedPoints(17);
    await dashboard.expectStatus('7 points left today.');
    await dashboard.expectNoMealType('Salmon rice bowl');
  });

  test('dashboard-backfill-past-day covers US1-AS4', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-backfill-past-day', ['US1-AS4']);

    const today = getRelativeDateKey(0);
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.setDailyLimit(24);

    await dashboard.goToYesterday();
    await dashboard.addMeal('Late dinner fix', 5);
    await dashboard.expectRemainingPoints(19);
    await dashboard.expectStatus('19 points left today.');

    await dashboard.returnToToday();
    await dashboard.expectRemainingPoints(24);
    await expect(
      appPage.getByTestId(`meal-editor-${today}`).getByText('No meals yet'),
    ).toBeVisible();
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
    await dashboard.expectMealType('Pasta dinner', 'Dinner');
  });

  test('dashboard-legacy-untyped-meal stays editable covers US3-AS1, US3-AS2, and US3-AS3', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-legacy-untyped-meal', ['US3-AS1', 'US3-AS2', 'US3-AS3']);

    await seedAppState(appPage, createLegacyMealSeedState());

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.goToYesterday();

    const legacyMeal = dashboard.mealCardByName('Legacy soup');
    await expect(legacyMeal).toBeVisible();
    await dashboard.expectNoMealType('Legacy soup');

    await legacyMeal.locator('[data-testid^="edit-meal-"]').click();
    await expect(appPage.getByTestId('meal-modal')).toBeVisible();
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Legacy soup');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('8');
    await appPage.getByTestId('meal-name-input').fill('Legacy soup fix');
    await appPage.getByTestId('meal-points-input').fill('9');
    await appPage.getByTestId('save-meal-button').click();

    await expect(appPage.getByTestId('meal-modal')).toHaveCount(0);
    await expect(dashboard.mealCardByName('Legacy soup fix')).toBeVisible();
    await dashboard.expectNoMealType('Legacy soup fix');
  });
});
