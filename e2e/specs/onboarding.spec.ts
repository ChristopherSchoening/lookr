import {
  attachSnapshotOnFailure,
  annotateScenario,
  gotoApp,
  readAppSnapshot,
} from '../helpers/app-helpers';
import { getRelativeDateKey } from '../fixtures/seed-states';
import { expect, test } from '../fixtures/app-fixtures';

test.afterEach(async ({ appPage }, testInfo) => {
  await attachSnapshotOnFailure(appPage, testInfo);
});

test.describe('Onboarding gate', () => {
  test('requires onboarding before tabs and saves starter metrics', async ({
    appPage,
  }, testInfo) => {
    annotateScenario(testInfo, 'onboarding-required-before-app', [
      'ONBOARDING-AS1',
      'ONBOARDING-AS2',
      'ONBOARDING-AS3',
    ]);

    await gotoApp(appPage, '/history');
    await expect(appPage.getByTestId('onboarding-screen')).toBeVisible();
    await expect(appPage.getByTestId('history-screen')).toHaveCount(0);
    await expect(appPage.getByTestId('onboarding-title')).toContainText(
      'lookr keeps the day simple',
    );

    await appPage.getByTestId('onboarding-next-button').click();
    await expect(appPage.getByTestId('onboarding-title')).toContainText('Points guide meals');

    await appPage.getByTestId('onboarding-next-button').click();
    await appPage.getByTestId('onboarding-next-button').click();
    await expect(appPage.getByTestId('onboarding-error')).toContainText(
      'Weight must be between 30 and 300.',
    );
    await appPage.getByTestId('onboarding-current-weight-input').fill('82.4');
    await appPage.getByTestId('onboarding-next-button').click();

    await appPage.getByTestId('onboarding-target-weight-input').fill('78');
    await appPage.getByTestId('onboarding-next-button').click();

    await appPage.getByTestId('onboarding-daily-limit-input').fill('24.5');
    await appPage.getByTestId('onboarding-finish-button').click();

    await expect(appPage.getByTestId('dashboard-screen')).toBeVisible();
    await expect(appPage.getByTestId('onboarding-screen')).toHaveCount(0);

    const snapshot = await readAppSnapshot(appPage);
    expect(snapshot.profile?.dailyPointsLimit).toBe(24.5);
    expect(snapshot.profile?.targetWeight).toBe(78);
    expect(snapshot.weights).toEqual(
      expect.arrayContaining([
        { id: expect.any(Number), entryDate: getRelativeDateKey(0), weight: 82.4 },
      ]),
    );
  });
});
