import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import {
  createHistorySeedState,
  createLegacyMealSeedState,
  getRelativeDateKey,
} from '../fixtures/seed-states';
import { HistoryPage } from '../helpers/history-page';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('User Story 2: history and editing coverage', () => {
  test.beforeEach(async ({ appPage }) => {
    await seedAppState(appPage, createHistorySeedState());
  });

  test('history-edit-delete-recalculates covers US2-AS1 and US2-AS2', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-edit-delete-recalculates', ['US2-AS1', 'US2-AS2']);

    const yesterday = getRelativeDateKey(-1);
    const today = getRelativeDateKey(0);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.expectFocusedLayout();
    await history.selectSummary(yesterday);

    await expect(history.mealCardByName('Lunch wrap')).toContainText('12 pt');
    await expect(history.mealCardByName('Lunch wrap')).toContainText('12:30 PM');
    await history.expectMealType('Lunch wrap', 'Lunch');

    await history.startEditingMeal('Lunch wrap');
    await history.saveMeal('Lunch wrap', 9, 'dinner');
    await history.expectSummaryPoints(yesterday, '15/24');
    await history.expectSummaryStatus(yesterday, '9 points remaining');
    await history.expectSummaryPoints(today, '7/24');
    await history.expectMealType('Lunch wrap', 'Dinner');

    await history.deleteMeal('Soup dinner');
    await history.expectSummaryPoints(yesterday, '9/24');
    await history.expectSummaryStatus(yesterday, '15 points remaining');
  });

  test('history-recent-day-summaries covers US2-AS3', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'history-recent-day-summaries', ['US2-AS3']);

    const today = getRelativeDateKey(0);
    const yesterday = getRelativeDateKey(-1);
    const twoDaysAgo = getRelativeDateKey(-2);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.expectFocusedLayout();

    await history.expectSummaryPoints(today, '7/24');
    await history.expectSummaryStatus(today, '17 points remaining');
    await history.expectSummaryPoints(yesterday, '18/24');
    await history.expectSummaryStatus(yesterday, '6 points remaining');
    await history.expectSummaryPoints(twoDaysAgo, '15/24');
    await history.expectSummaryStatus(twoDaysAgo, '9 points remaining');
  });

  test('history-legacy-edit-clears-type covers US3-AS1, US3-AS2, and US3-AS3', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-legacy-edit-clears-type', [
      'US3-AS1',
      'US3-AS2',
      'US3-AS3',
    ]);

    await seedAppState(appPage, createLegacyMealSeedState());

    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.selectSummary(yesterday);
    await history.expectNoMealType('Legacy soup');

    await history.startEditingMeal('Legacy soup');
    await history.saveMeal('Legacy soup', 8, null);
    await history.expectNoMealType('Legacy soup');

    await history.startEditingMeal('Typed lunch');
    await history.saveMeal('Typed lunch', 11, null);
    await history.expectNoMealType('Typed lunch');
  });
});
