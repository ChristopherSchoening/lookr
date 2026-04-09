import { expect, type Locator, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class HistoryPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/history');
    await expect(this.page.getByTestId('history-screen')).toBeVisible();
  }

  async selectSummary(dateKey: string) {
    await this.page.getByTestId(`history-summary-trigger-${dateKey}`).click();
  }

  mealCardByName(name: string): Locator {
    return this.page.locator('[data-testid^="meal-entry-"]', { hasText: name });
  }

  async startEditingMeal(name: string) {
    await this.mealCardByName(name).locator('[data-testid^="edit-meal-"]').click();
  }

  async saveMeal(name: string, points: number) {
    await this.page.getByTestId('meal-name-input').fill(name);
    await this.page.getByTestId('meal-points-input').fill(String(points));
    await this.page.getByTestId('save-meal-button').click();
  }

  async deleteMeal(name: string) {
    await this.mealCardByName(name).locator('[data-testid^="delete-meal-"]').click();
  }

  async expectSummaryPoints(dateKey: string, text: string) {
    await expect(this.page.getByTestId(`history-summary-points-${dateKey}`)).toHaveText(text);
  }

  async expectSummaryStatus(dateKey: string, text: string) {
    await expect(this.page.getByTestId(`history-summary-status-${dateKey}`)).toContainText(text);
  }
}
