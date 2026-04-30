import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import { formatLongDate } from '../../src/lib/date';
import {
  createCountedHistorySeedState,
  createHistorySeedState,
  createHistoricalLimitSeedState,
  createLegacyMealSeedState,
  createMealSuggestionSeedState,
  getEmptyDateKey,
  getRelativeDateKey,
} from '../fixtures/seed-states';
import { HistoryPage } from '../helpers/history-page';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('History picker and editing coverage', () => {
  test.beforeEach(async ({ appPage }) => {
    await seedAppState(appPage, createHistorySeedState());
  });

  test('history-picker-default-and-tracked-selection covers US1-AS1, US1-AS2, and US1-AS3', async ({
    appPage,
  }, testInfo) => {
    const today = getRelativeDateKey(0);
    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.expectFocusedLayout();
    annotateScenario(testInfo, 'history-picker-default-and-tracked-selection', [
      'US1-AS1',
      'US1-AS2',
      'US1-AS3',
    ]);

    await expect(appPage.getByTestId(`history-summary-trigger-${today}`)).toHaveCount(0);
    await history.expectSelectedDateLabel('Today', formatLongDate(today));
    await history.expectTrackedDate(today);
    await history.expectSummaryPoints('7/24');
    await history.expectSummaryStatus('17 points remaining');
    await expect(history.mealCardByName('Greek yogurt bowl')).toBeVisible();

    await history.selectDate(yesterday);
    await history.expectSummaryPoints('18/24');
    await history.expectSummaryStatus('6 points remaining');
    await expect(history.mealCardByName('Lunch wrap')).toContainText('12 pt');
    await expect(history.mealCardByName('Lunch wrap')).toContainText('12:30 PM');
    await history.expectMealType('Lunch wrap', 'Lunch');
  });

  test('history-picker-keeps-empty-days-open covers US2-AS1, US2-AS2, and US2-AS3', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-picker-keeps-empty-days-open', [
      'US2-AS1',
      'US2-AS2',
      'US2-AS3',
    ]);

    const today = getRelativeDateKey(0);
    const yesterday = getRelativeDateKey(-1);
    const twoDaysAgo = getRelativeDateKey(-2);
    const emptyDate = getEmptyDateKey([-3, -4, -5, -6], [today, yesterday, twoDaysAgo]);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.expectFocusedLayout();

    await history.expectTrackedDate(today);
    await history.expectTrackedDate(yesterday);
    await history.expectTrackedDate(twoDaysAgo);
    await history.expectEmptyDate(emptyDate);

    await history.selectDate(emptyDate);
    await history.expectEmptyDayState();
    await expect(
      appPage.getByText('This date stays selected. Add the first meal below.'),
    ).toBeVisible();
    await expect(appPage.getByTestId('open-add-meal-button')).toBeVisible();
  });

  test('history-edit-delete-recalculates and empty-day-refresh holds covers US3-AS1, US3-AS2, and US3-AS3', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-edit-delete-recalculates-and-empty-refresh', [
      'US3-AS1',
      'US3-AS2',
      'US3-AS3',
    ]);
    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.selectDate(yesterday);

    await history.startEditingMeal('Lunch wrap');
    await history.saveMeal('Lunch wrap', 9, 'dinner');
    await history.expectSummaryPoints('15/24');
    await history.expectSummaryStatus('9 points remaining');
    await history.expectMealType('Lunch wrap', 'Dinner');

    await history.deleteMeal('Soup dinner');
    await history.expectSummaryPoints('9/24');
    await history.expectSummaryStatus('15 points remaining');

    await history.deleteMeal('Lunch wrap');
    await history.expectEmptyDayState();
    await history.expectEmptyDate(yesterday);

    await appPage.getByTestId('open-add-meal-button').click();
    await history.saveMeal('Recovery soup', 6, 'dinner');
    await history.expectTrackedDate(yesterday);
    await history.expectSummaryPoints('6/24');
    await history.expectSummaryStatus('18 points remaining');
    await expect(history.mealCardByName('Recovery soup')).toBeVisible();
  });

  test('history-combines-exact-duplicates-and-keeps-variants-separate', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-combined-duplicate-display', [
      '009-US2-AS1',
      '009-US2-AS2',
      '009-US2-AS3',
    ]);

    await seedAppState(appPage, createCountedHistorySeedState());

    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);
    await history.goto();
    await history.selectDate(yesterday);

    await history.expectSummaryPoints('31/40');
    await history.expectMealRowCount('Turkey lunch', 4);
    await history.expectCombinedMeal('Turkey lunch', 3, '15 pt');
    await history.expectNoCountBadge('Turkey lunch', '6 pt');
    await history.expectNoCountBadge('Turkey lunch', '5 pt');
  });

  test('history-edits-and-deletes-combined-rows', async ({ appPage }, testInfo) => {
    annotateScenario(testInfo, 'history-combined-edit-delete', ['009-US3-AS1', '009-US3-AS2']);

    await seedAppState(appPage, createCountedHistorySeedState());

    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);
    await history.goto();
    await history.selectDate(yesterday);

    await history.startEditingCombinedMeal('Turkey lunch', '15 pt');
    await history.expectMealFormCount(3);
    await history.saveMeal('Turkey lunch fixed', 4, 'dinner', 2);
    await history.expectSummaryPoints('24/40');
    await history.expectSummaryStatus('16 points remaining');
    await history.expectMealRowCount('Turkey lunch fixed', 1);
    await history.expectCombinedMeal('Turkey lunch fixed', 2, '8 pt');

    await history.deleteCombinedMeal('Turkey lunch fixed', '8 pt');
    await history.expectSummaryPoints('16/40');
    await history.expectSummaryStatus('24 points remaining');
    await history.expectMealRowCount('Turkey lunch fixed', 0);
  });

  test('history-keeps old limit after today changes and past edits recalc against that limit', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-historical-limit-preserved', [
      'US2-AS1',
      'US2-AS2',
      'US2-AS3',
    ]);

    const fiveDaysAgo = getRelativeDateKey(-5);
    await seedAppState(appPage, {
      profile: { dailyPointsLimit: 30 },
      dailyPointLimitHistory: [
        {
          effectiveDate: fiveDaysAgo,
          dailyPointsLimit: 20,
          createdAt: `${fiveDaysAgo}T08:00:00.000Z`,
        },
        { effectiveDate: getRelativeDateKey(0), dailyPointsLimit: 30 },
      ],
      meals: createHistoricalLimitSeedState().meals,
    });

    const yesterday = getRelativeDateKey(-1);
    const history = new HistoryPage(appPage);
    await history.goto();
    await history.selectDate(yesterday);
    await history.expectSummaryPoints('21/20');
    await history.expectSummaryStatus('1 points over limit');

    await history.startEditingMeal('Lunch wrap');
    await history.saveMeal('Lunch wrap', 11, 'lunch');
    await history.expectSummaryPoints('20/20');
    await history.expectSummaryStatus('0 points remaining');

    await history.deleteMeal('Soup dinner');
    await history.expectSummaryPoints('11/20');
    await history.expectSummaryStatus('9 points remaining');
  });

  test('history-edit-suggestions stay quiet until name changes and remain editable', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'history-edit-suggestions', ['US2-AS4', 'US2-AS5', 'US3-AS1']);

    await seedAppState(appPage, createMealSuggestionSeedState());

    const today = getRelativeDateKey(0);
    const history = new HistoryPage(appPage);

    await history.goto();
    await history.selectDate(today);
    await history.startEditingMeal('Chipotle bowl');
    await history.expectNoMealSuggestions();

    await history.fillMealName('Chi');
    await history.expectMealSuggestionNames([
      'Chicken rice',
      'Chipotle bowl',
      'Chili leftovers',
      'Chia pudding',
      'Chicken salad',
    ]);

    await history.selectMealSuggestion('Chicken rice');
    await history.expectMealFormValues('Chicken rice', 18);
    await history.saveMeal('Chicken rice remix', 17, 'snack');
    await expect(history.mealCardByName('Chicken rice remix')).toBeVisible();
    await history.expectMealType('Chicken rice remix', 'Snack');

    await history.startEditingMeal('Chicken rice remix');
    await history.fillMealName('zzz');
    await history.expectMealSuggestionEmpty();
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
    await history.selectDate(yesterday);
    await history.expectNoMealType('Legacy soup');

    await history.startEditingMeal('Legacy soup');
    await history.saveMeal('Legacy soup', 8, null);
    await history.expectNoMealType('Legacy soup');

    await history.startEditingMeal('Typed lunch');
    await history.saveMeal('Typed lunch', 11, null);
    await history.expectNoMealType('Typed lunch');
  });
});
