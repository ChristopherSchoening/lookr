import { expect, type Page } from '@playwright/test';

import { gotoApp } from './app-helpers';

export class WeightDetailsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await gotoApp(this.page, '/progress/details');
    await expect(this.page.getByTestId('weight-details-screen')).toBeVisible();
  }

  async getEntries() {
    return this.page.getByTestId('weight-entry-row').all();
  }

  async editEntry(index: number) {
    const rows = await this.getEntries();
    await rows[index]?.getByTestId('edit-weight-button').click();
  }

  async saveEdit(weight: string, date: string) {
    await this.page.getByTestId('edit-weight-input').fill(weight);
    await this.page.getByTestId('edit-date-input').fill(date);
    await this.page.getByTestId('save-edit-button').click();
  }

  async assertEditError(message: string) {
    await expect(this.page.getByTestId('edit-error-message')).toContainText(message);
  }

  async cancelEdit() {
    await this.page.getByTestId('cancel-edit-button').click();
  }

  async deleteEntry(index: number) {
    const rows = await this.getEntries();
    await rows[index]?.getByTestId('delete-weight-button').click();
  }

  async confirmDelete() {
    await this.page.getByTestId('confirm-delete-button').click();
  }

  async tapAddEntry() {
    await this.page.getByTestId('add-entry-button').click();
  }

  async assertEntryCount(count: number) {
    await expect(this.page.getByTestId('weight-entry-row')).toHaveCount(count);
  }

  async assertEntryWeight(index: number, value: string) {
    const rows = this.page.getByTestId('weight-entry-row');
    await expect(rows.nth(index).getByTestId('entry-weight-value')).toContainText(value);
  }

  async assertChartVisible() {
    await expect(this.page.getByTestId('weight-chart')).toHaveCount(1);
  }

  async assertChartHidden() {
    await expect(this.page.getByTestId('weight-chart')).toHaveCount(0);
  }
}
