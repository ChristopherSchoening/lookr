import { attachSnapshotOnFailure, openTab } from '../helpers/app-helpers';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('Theme settings coverage', () => {
  test('settings dark mode applies app surface colors', async ({ appPage }) => {
    await openTab(appPage, 'Settings');
    await expect(appPage.getByTestId('settings-screen')).toBeVisible();
    await expect(appPage.getByRole('tab').nth(0)).toContainText('Home');
    await expect(appPage.getByRole('tab').nth(1)).toContainText('History');
    await expect(appPage.getByRole('tab').nth(2)).toContainText('Settings');
    await expect(appPage.getByRole('tab').nth(3)).toContainText('Progress');
    await expect(appPage.getByTestId('theme-option-note-system')).toContainText(
      /System preference: (Light|Dark)/,
    );

    const screenRoot = appPage
      .getByTestId('settings-screen')
      .locator('xpath=ancestor::*[@data-testid="screen-root"][1]');

    await expect(screenRoot).toHaveCSS('background-color', 'rgb(248, 250, 251)');

    await appPage.getByTestId('theme-option-dark').click();
    await expect(screenRoot).toHaveCSS('background-color', 'rgb(15, 26, 22)');

    await appPage.getByTestId('theme-option-light').click();
    await expect(screenRoot).toHaveCSS('background-color', 'rgb(248, 250, 251)');

    await appPage.getByTestId('theme-option-system').click();
    await expect(appPage.getByTestId('theme-option-note-system')).toContainText(
      /System preference: (Light|Dark)/,
    );
  });
});
