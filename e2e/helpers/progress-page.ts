import { expect, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class ProgressPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/progress');
    await expect(this.page.getByTestId('progress-screen')).toBeVisible();
  }

  async expectCoreLayout() {
    await expect(this.page.getByText('Core progress')).toBeVisible();
    await expect(this.page.getByText('Change since last track')).toBeVisible();
    await expect(this.page.getByText('Weight context, not daily panic.')).toHaveCount(0);
  }

  async saveDailyLimit(points: number | string) {
    await this.page.getByTestId('daily-limit-input').fill(String(points));
    await this.page.getByTestId('save-daily-limit-button').click();
  }

  async expectDailyLimitInput(value: string) {
    await expect(this.page.getByTestId('daily-limit-input')).toHaveValue(value);
  }

  async expectDailyLimitMetric(value: string) {
    await expect(this.page.getByTestId('progress-daily-limit-metric')).toContainText(value);
  }

  async expectDailyLimitMessage(text: string) {
    await expect(this.page.getByTestId('daily-limit-message')).toContainText(text);
  }

  async expectDailyLimitValidation(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async saveWeight(weight: number) {
    await this.page.getByTestId('weight-input').fill(String(weight));
    await this.page.getByTestId('save-weight-button').click();
  }

  async expectAdherence(text: string) {
    await expect(this.page.getByTestId('adherence-metric')).toContainText(text);
  }

  async expectWeightEntry(dateKey: string, value: string) {
    await expect(this.page.getByTestId(`weight-value-${dateKey}`)).toHaveText(value);
  }

  async assertLatestWeight(value: string) {
    await expect(this.page.getByTestId('latest-weight-metric')).toContainText(value);
  }

  async assertGoalWeight(value: string) {
    await expect(this.page.getByTestId('goal-weight-metric')).toContainText(value);
  }

  async assertWeightChange(value: string) {
    await expect(this.page.getByTestId('weight-change-metric')).toContainText(value);
  }

  async assertDetailsButton() {
    await expect(this.page.getByTestId('view-details-button')).toBeVisible();
  }

  async assertEmptyState() {
    await expect(this.page.getByTestId('progress-empty-state')).toBeVisible();
  }

  async tapViewDetails() {
    await this.page.getByTestId('view-details-button').click();
  }
}
