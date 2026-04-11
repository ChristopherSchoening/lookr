import { expect, type Locator, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/');
    await expect(this.page.getByTestId('dashboard-screen')).toBeVisible();
  }

  async expectHomeTabChrome() {
    await expect(this.page.getByTestId('tab-button-home')).toContainText('Home');
    await expect(this.page.getByTestId('tab-icon-home').first()).toBeVisible();
    await expect(this.page.getByTestId('tab-icon-history').first()).toBeVisible();
    await expect(this.page.getByTestId('tab-icon-progress').first()).toBeVisible();
    await expect(this.page.getByText('Dashboard')).toHaveCount(0);
  }

  async setDailyLimit(points: number) {
    await this.page.getByTestId('daily-limit-input').fill(String(points));
    await this.page.getByTestId('start-tracking-button').click();
  }

  async openMealModal() {
    await this.page.getByTestId('open-add-meal-button').click();
    await expect(this.page.getByTestId('meal-modal')).toBeVisible();
  }

  async addMeal(
    mealName: string,
    points: number,
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  ) {
    await this.openMealModal();
    await this.page.getByTestId('meal-name-input').fill(mealName);
    await this.page.getByTestId('meal-points-input').fill(String(points));
    if (mealType) {
      await this.page.getByTestId(`meal-type-option-${mealType}`).click();
    }
    await this.page.getByTestId('save-meal-button').click();
    await expect(this.page.getByTestId('meal-modal')).toHaveCount(0);
  }

  async expectMealType(name: string, label: string) {
    await expect(this.mealCardByName(name).locator('[data-testid^="meal-type-"]')).toHaveText(
      label,
    );
  }

  async expectNoMealType(name: string) {
    await expect(this.mealCardByName(name).locator('[data-testid^="meal-type-"]')).toHaveCount(0);
  }

  async goToYesterday() {
    await this.page.getByTestId('date-earlier-button').click();
  }

  async returnToToday() {
    await this.page.getByTestId('date-later-button').click();
  }

  async expectRemainingPoints(value: number) {
    await expect(this.page.getByTestId('remaining-points-value')).toHaveText(String(value));
  }

  async expectConsumedPoints(value: number) {
    await expect(this.page.getByTestId('consumed-points-metric')).toContainText(String(value));
  }

  async expectStatus(text: string) {
    await expect(this.page.getByTestId('summary-status')).toContainText(text);
  }

  async expectRemovedCopy() {
    await expect(this.page.getByText('The clinical curator')).toHaveCount(0);
    await expect(this.page.getByText('Manual in now, calculator later.')).toHaveCount(0);
  }

  mealCardByName(name: string): Locator {
    return this.page.locator('[data-testid^="meal-entry-"]', { hasText: name });
  }
}
