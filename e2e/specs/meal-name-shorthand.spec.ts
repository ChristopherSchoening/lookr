import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import { createCleanSeedState } from '../fixtures/seed-states';
import { DashboardPage } from '../helpers/dashboard-page';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('Meal name shorthand sync', () => {
  test('bang-prefix syncs points and keeps token in name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-bang-points', ['shorthand-AS1']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Pizza !7');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('7');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Pizza !7');
  });

  test('x-prefix syncs count and keeps token in name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-x-count', ['shorthand-AS2']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Snack x3');
    await expect(appPage.getByTestId('meal-count-input')).toHaveValue('3');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Snack x3');
  });

  test('both shorthands in one name sync independently', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-combined', ['shorthand-AS3']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Rice bowl !10 x2');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('10');
    await expect(appPage.getByTestId('meal-count-input')).toHaveValue('2');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Rice bowl !10 x2');
  });

  test('editing points field updates bang token in meal name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-points-reverse-sync', ['shorthand-AS4']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Wrap !5');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('5');

    await appPage.getByTestId('meal-points-input').fill('9');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Wrap !9');
  });

  test('editing count field updates x token in meal name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-count-reverse-sync', ['shorthand-AS5']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Muffin x2');
    await expect(appPage.getByTestId('meal-count-input')).toHaveValue('2');

    await appPage.getByTestId('meal-count-input').fill('4');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Muffin x4');
  });

  test('clearing points shows !0 in meal name preserving sync', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-clear-points', ['shorthand-AS6']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Oats !6');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('6');

    await appPage.getByTestId('meal-points-input').fill('');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Oats !0');

    await appPage.getByTestId('meal-points-input').fill('8');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Oats !8');
  });

  test('clearing count shows x0 in meal name preserving sync', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-clear-count', ['shorthand-AS7']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Granola x3');
    await expect(appPage.getByTestId('meal-count-input')).toHaveValue('3');

    await appPage.getByTestId('meal-count-input').fill('');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Granola x0');

    await appPage.getByTestId('meal-count-input').fill('2');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Granola x2');
  });

  test('meal saves correctly with shorthand-filled points and count', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-save', ['shorthand-AS8']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Pasta !12 x2');
    await appPage.getByTestId('save-meal-button').click();
    await expect(appPage.getByTestId('meal-modal')).toHaveCount(0);

    await dashboard.expectRemainingPoints(0);
    await dashboard.expectConsumedPoints(24);
    await dashboard.expectLoggedMealCount(2);
  });

  test('hash-prefix syncs points and keeps token in name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-hash-points', ['shorthand-AS10']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Pizza #7');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('7');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Pizza #7');
  });

  test('editing points field updates hash token in meal name', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-hash-reverse-sync', ['shorthand-AS11']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Wrap #5');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('5');

    await appPage.getByTestId('meal-points-input').fill('9');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Wrap #9');
  });

  test('hash decimal points shorthand syncs correctly', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-hash-decimal-points', ['shorthand-AS12']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Yogurt #4.5');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('4.5');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Yogurt #4.5');
  });

  test('decimal points shorthand syncs correctly', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'meal-name-shorthand-decimal-points', ['shorthand-AS9']);

    await seedAppState(appPage, createCleanSeedState());
    const dashboard = new DashboardPage(appPage);
    await dashboard.goto();
    await dashboard.openMealModal();

    await appPage.getByTestId('meal-name-input').fill('Yogurt !4.5');
    await expect(appPage.getByTestId('meal-points-input')).toHaveValue('4.5');
    await expect(appPage.getByTestId('meal-name-input')).toHaveValue('Yogurt !4.5');
  });
});
