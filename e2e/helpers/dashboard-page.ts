import { expect, type Locator, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/');
    await expect(this.page.getByTestId('dashboard-screen')).toBeVisible();
  }

  async setDailyLimit(points: number) {
    await this.page.getByTestId('daily-limit-input').fill(String(points));
    await this.page.getByTestId('start-tracking-button').click();
  }

  async addMeal(mealName: string, points: number) {
    await this.page.getByTestId('meal-name-input').fill(mealName);
    await this.page.getByTestId('meal-points-input').fill(String(points));
    await this.page.getByTestId('save-meal-button').click();
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

  mealCardByName(name: string): Locator {
    return this.page.locator('[data-testid^="meal-entry-"]', { hasText: name });
  }
}
