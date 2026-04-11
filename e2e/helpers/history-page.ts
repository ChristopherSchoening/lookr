import { expect, type Locator, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class HistoryPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/history');
    await expect(this.page.getByTestId('history-screen')).toBeVisible();
  }

  async expectFocusedLayout() {
    await expect(this.page.getByText('Pick any day')).toBeVisible();
    await expect(
      this.page.getByText('Jump fast to logged days. Empty days still stay open below.'),
    ).toBeVisible();
    await expect(
      this.page.getByText('Revisit tracked days without losing the signal.'),
    ).toHaveCount(0);
  }

  async selectDate(dateKey: string) {
    await this.page.getByTestId(`history-picker-day-${dateKey}`).click();
  }

  async expectSelectedDateLabel(shortLabel: string, longLabel: string) {
    await expect(this.page.getByTestId('history-selected-date-label')).toHaveText(shortLabel);
    await expect(this.page.getByTestId('history-selected-date-value')).toHaveText(longLabel);
  }

  async expectTrackedDate(dateKey: string) {
    await expect(this.page.getByTestId(`history-picker-tracked-${dateKey}`)).toBeVisible();
  }

  async expectEmptyDate(dateKey: string) {
    await expect(this.page.getByTestId(`history-picker-tracked-${dateKey}`)).toHaveCount(0);
  }

  mealCardByName(name: string): Locator {
    return this.page.locator('[data-testid^="meal-entry-"]', { hasText: name });
  }

  async startEditingMeal(name: string) {
    await this.mealCardByName(name).locator('[data-testid^="edit-meal-"]').click();
    await expect(this.page.getByTestId('meal-modal')).toBeVisible();
  }

  async saveMeal(
    name: string,
    points: number,
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null,
  ) {
    await this.page.getByTestId('meal-name-input').fill(name);
    await this.page.getByTestId('meal-points-input').fill(String(points));
    if (mealType === null) {
      await this.page.getByTestId('meal-type-option-none').click();
    } else if (mealType) {
      await this.page.getByTestId(`meal-type-option-${mealType}`).click();
    }
    await this.page.getByTestId('save-meal-button').click();
    await expect(this.page.getByTestId('meal-modal')).toHaveCount(0);
  }

  async fillMealName(value: string) {
    await this.page.getByTestId('meal-name-input').fill(value);
  }

  async expectNoMealSuggestions() {
    await expect(this.page.getByTestId('meal-suggestion-list')).toHaveCount(0);
  }

  async expectMealSuggestionNames(names: string[]) {
    await expect(this.page.getByTestId('meal-suggestion-list')).toBeVisible();
    await expect(this.page.locator('[data-testid^="meal-suggestion-row-"]')).toHaveCount(
      names.length,
    );
    for (const [index, name] of names.entries()) {
      await expect(this.page.getByTestId(`meal-suggestion-name-${index}`)).toHaveText(name);
    }
  }

  async expectMealSuggestionEmpty() {
    await expect(this.page.getByTestId('meal-suggestion-empty')).toBeVisible();
    await expect(this.page.getByTestId('meal-suggestion-list')).toHaveCount(0);
  }

  async selectMealSuggestion(name: string) {
    await this.page
      .locator('[data-testid^="meal-suggestion-row-"]')
      .filter({ hasText: name })
      .first()
      .click();
  }

  async expectMealFormValues(name: string, points: number) {
    await expect(this.page.getByTestId('meal-name-input')).toHaveValue(name);
    await expect(this.page.getByTestId('meal-points-input')).toHaveValue(String(points));
  }

  async deleteMeal(name: string) {
    await this.mealCardByName(name).locator('[data-testid^="delete-meal-"]').click();
  }

  async expectSummaryPoints(text: string) {
    await expect(this.page.getByTestId('history-selected-summary-points')).toHaveText(text);
  }

  async expectSummaryStatus(text: string) {
    await expect(this.page.getByTestId('history-selected-summary-status')).toContainText(text);
  }

  async expectEmptyDayState() {
    await expect(this.page.getByTestId('history-empty-day-state')).toBeVisible();
  }

  async expectMealType(name: string, label: string) {
    await expect(this.mealCardByName(name).locator('[data-testid^="meal-type-"]')).toHaveText(
      label,
    );
  }

  async expectNoMealType(name: string) {
    await expect(this.mealCardByName(name).locator('[data-testid^="meal-type-"]')).toHaveCount(0);
  }
}
