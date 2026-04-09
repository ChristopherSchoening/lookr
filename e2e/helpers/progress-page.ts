import { expect, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class ProgressPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/progress');
    await expect(this.page.getByTestId('progress-screen')).toBeVisible();
  }

  async saveWeight(weight: number) {
    await this.page.getByTestId('weight-input').fill(String(weight));
    await this.page.getByTestId('save-weight-button').click();
  }

  async expectWeightEntry(dateKey: string, value: string) {
    await expect(this.page.getByTestId(`weight-value-${dateKey}`)).toHaveText(value);
  }
}
