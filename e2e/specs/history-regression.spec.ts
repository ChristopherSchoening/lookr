import { attachSnapshotOnFailure, annotateScenario, seedAppState } from '../helpers/app-helpers';
import { createHistorySeedState, getRelativeDateKey } from '../fixtures/seed-states';
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

    await history.startEditingMeal('Lunch wrap');
    await history.saveMeal('Lunch wrap', 9);
    await history.expectSummaryPoints(yesterday, '15/24');
    await history.expectSummaryStatus(yesterday, '9 points remaining');
    await history.expectSummaryPoints(today, '7/24');

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
});
