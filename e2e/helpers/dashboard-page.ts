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

  async openProgressLimitSetup() {
    await this.page.getByTestId('open-progress-limit-setup-button').click();
    await expect(this.page.getByTestId('progress-screen')).toBeVisible();
  }

  async openMealModal() {
    await this.page.getByTestId('open-add-meal-button').click();
    await expect(this.page.getByTestId('meal-modal')).toBeVisible();
  }

  async addMeal(
    mealName: string,
    points: number,
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    count?: number,
  ) {
    await this.openMealModal();
    await this.page.getByTestId('meal-name-input').fill(mealName);
    await this.page.getByTestId('meal-points-input').fill(String(points));
    if (count !== undefined) {
      await this.page.getByTestId('meal-count-input').fill(String(count));
    }
    if (mealType) {
      await this.page.getByTestId(`meal-type-option-${mealType}`).click();
    }
    await this.page.getByTestId('save-meal-button').click();
    await expect(this.page.getByTestId('meal-modal')).toHaveCount(0);
  }

  async fillMealName(value: string) {
    await this.page.getByTestId('meal-name-input').fill(value);
  }

  async fillMealCount(value: string) {
    await this.page.getByTestId('meal-count-input').fill(value);
  }

  async expectMealCount(value: string) {
    await expect(this.page.getByTestId('meal-count-input')).toHaveValue(value);
  }

  async expectCountError() {
    await expect(this.page.getByText('Enter a whole-number count from 1 to 99.')).toBeVisible();
    await expect(this.page.getByTestId('meal-modal')).toBeVisible();
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

  async saveMealModal() {
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

  async expectLoggedMealCount(value: number) {
    await expect(this.page.getByTestId('consumed-points-metric')).toContainText(
      `${value} logged meals`,
    );
  }

  async expectDailyLimit(value: number) {
    await expect(this.page.getByTestId('daily-limit-metric')).toContainText(String(value));
  }

  async expectSetupPrompt() {
    await expect(this.page.getByTestId('profile-setup-card')).toBeVisible();
    await expect(this.page.getByTestId('open-progress-limit-setup-button')).toBeVisible();
  }

  async expectNoDailyLimitControls() {
    await expect(this.page.getByTestId('daily-limit-input')).toHaveCount(0);
    await expect(this.page.getByTestId('save-daily-limit-button')).toHaveCount(0);
    await expect(this.page.getByTestId('start-tracking-button')).toHaveCount(0);
  }

  async expectStatus(text: string) {
    await expect(this.page.getByTestId('summary-status')).toContainText(text);
  }

  async expectDailyLimitMessage(text: string) {
    await expect(this.page.getByTestId('daily-limit-message')).toContainText(text);
  }

  async expectRemovedCopy() {
    await expect(this.page.getByText('The clinical curator')).toHaveCount(0);
    await expect(this.page.getByText('Manual in now, calculator later.')).toHaveCount(0);
  }

  mealCardByName(name: string): Locator {
    return this.page.locator('[data-testid^="meal-entry-"]', { hasText: name });
  }
}
