import {
  attachSnapshotOnFailure,
  annotateScenario,
  prepareLegacyMealTypeMigration,
  readAppSnapshot,
  seedAppState,
} from '../helpers/app-helpers';
import {
  createCleanSeedState,
  createLegacyMealSeedState,
  createMealSuggestionSeedState,
  createOverLimitSeedState,
} from '../fixtures/seed-states';
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
    await dashboard.expectSetupPrompt();
    await dashboard.expectNoDailyLimitControls();
    await expect(appPage.getByText('Add, edit, or remove meals for this day.')).toHaveCount(0);
    await expect(
      appPage.getByText('Add in modal, then edit or remove meals for this day.'),
    ).toHaveCount(0);
    await expect(appPage.getByText('Keep each day accurate with quick meal changes.')).toHaveCount(
      0,
    );
    await expect(appPage.getByText('Use one shared modal for add and edit.')).toHaveCount(0);

    await dashboard.openProgressLimitSetup();
    await seedAppState(appPage, createCleanSeedState());
    await dashboard.goto();
    await dashboard.expectRemovedCopy();
    await dashboard.expectNoDailyLimitControls();
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

    await seedAppState(appPage, createCleanSeedState());

    const today = getRelativeDateKey(0);
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();

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

  test('dashboard-counted-meal-add creates separate rows and validates count', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-counted-meal-add', [
      '009-US1-AS1',
      '009-US1-AS2',
      '009-US1-AS3',
    ]);

    await seedAppState(appPage, createCleanSeedState());

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();

    await dashboard.openMealModal();
    await dashboard.expectMealCount('1');
    await appPage.getByTestId('meal-name-input').fill('Repeat snack');
    await appPage.getByTestId('meal-points-input').fill('4');

    for (const invalidCount of ['', '0', '-1', '2.5', '2e1', 'abc', '100']) {
      await dashboard.fillMealCount(invalidCount);
      await appPage.getByTestId('save-meal-button').click();
      await dashboard.expectCountError();
    }

    await dashboard.fillMealCount('3');
    await appPage.getByTestId('save-meal-button').click();
    await expect(appPage.getByTestId('meal-modal')).toHaveCount(0);

    await dashboard.expectRemainingPoints(12);
    await dashboard.expectConsumedPoints(12);
    await dashboard.expectLoggedMealCount(3);

    const snapshot = await readAppSnapshot(appPage);
    const repeatSnacks = snapshot.meals.filter(
      (meal) => meal.mealName === 'Repeat snack' && meal.points === 4,
    );
    expect(repeatSnacks).toHaveLength(3);
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

  test('dashboard-refreshes-after-progress-limit-edit and appends history row', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-limit-edit-refresh', ['US1-AS1', 'US1-AS2', 'US1-AS3']);

    await seedAppState(appPage, createOverLimitSeedState());

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();

    await dashboard.expectDailyLimit(24);
    await dashboard.expectRemainingPoints(-5);
    await dashboard.expectNoDailyLimitControls();

    await seedAppState(appPage, {
      profile: { dailyPointsLimit: 30 },
      meals: createOverLimitSeedState().meals,
    });
    await dashboard.goto();
    await dashboard.expectDailyLimit(30);
    await dashboard.expectRemainingPoints(1);
    await dashboard.expectStatus('1 points left today.');
    await dashboard.expectNoDailyLimitControls();

    const snapshot = await readAppSnapshot(appPage);
    expect(snapshot.profile?.dailyPointsLimit).toBe(30);
    expect(snapshot.dailyPointLimitHistory[0]?.dailyPointsLimit).toBe(30);
    expect(snapshot.dailyPointLimitHistory[0]?.effectiveDate).toBe(getRelativeDateKey(0));
  });

  test('dashboard-add-meal-suggestions cover threshold, ordering, dedupe, and selection', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-add-meal-suggestions', [
      'US1-AS1',
      'US1-AS2',
      'US1-AS3',
      'US1-AS4',
      'US1-AS5',
      'US2-AS2',
      'US2-AS3',
      'US2-AS4',
      'US2-AS5',
      'US3-AS1',
      'US3-AS2',
      'US3-AS3',
    ]);

    await seedAppState(appPage, createMealSuggestionSeedState());

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await dashboard.fillMealName('Ch');
    await dashboard.expectNoMealSuggestions();

    await dashboard.fillMealName('Chi');
    await dashboard.expectNoMealSuggestions();
    await dashboard.expectMealSuggestionNames([
      'Chicken rice',
      'Chipotle bowl',
      'Chili leftovers',
      'Chia pudding',
      'Chicken salad',
    ]);

    await dashboard.selectMealSuggestion('Chicken rice');
    await dashboard.expectMealFormValues('Chicken rice', 18);
    await dashboard.fillMealName('Chicken rice repeat');
    await dashboard.saveMealModal();

    await expect(dashboard.mealCardByName('Chicken rice repeat')).toContainText('18 pt');
    await dashboard.expectMealType('Chicken rice repeat', 'Dinner');

    await dashboard.openMealModal();
    await dashboard.fillMealName('zzz');
    await dashboard.expectMealSuggestionEmpty();
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

  test('dashboard-migrates-legacy-schema-on-boot', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'dashboard-migrates-legacy-schema-on-boot', [
      'US3-AS1',
      'US3-AS2',
      'US3-AS3',
    ]);

    await seedAppState(appPage, createLegacyMealSeedState());
    await prepareLegacyMealTypeMigration(appPage);

    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.goToYesterday();

    await expect(dashboard.mealCardByName('Legacy soup')).toBeVisible();
    await dashboard.expectNoMealType('Legacy soup');
    await expect(dashboard.mealCardByName('Typed lunch')).toBeVisible();
    await dashboard.expectRemainingPoints(5);
  });
});
