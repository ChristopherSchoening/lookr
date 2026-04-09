import { expect, type Page, type TestInfo } from '@playwright/test';

import type { E2ESeedState } from '../../src/lib/db';

type AppSnapshot = {
  profile: { dailyPointsLimit: number } | null;
  meals: Array<{ id: number; mealName: string; points: number; entryDate: string }>;
  weights: Array<{ id: number; entryDate: string; weight: number }>;
};

async function waitForE2EBridge(page: Page) {
  await page.waitForFunction(() => window.__LOOKR_E2E__?.enabled === true);
}

export async function gotoApp(page: Page, path = '/') {
  const target = path.includes('?') ? path : `${path}?e2e=1`;
  await page.goto(target);
  await waitForE2EBridge(page);
}

export async function resetAppState(page: Page) {
  await waitForE2EBridge(page);
  await page.evaluate(async () => {
    await window.__LOOKR_E2E__?.reset();
  });
}

export async function seedAppState(page: Page, seed: E2ESeedState) {
  await waitForE2EBridge(page);
  await page.evaluate(async (nextSeed) => {
    await window.__LOOKR_E2E__?.seed(nextSeed);
  }, seed);
}

export async function readAppSnapshot(page: Page): Promise<AppSnapshot> {
  await waitForE2EBridge(page);

  return page.evaluate(async () => {
    const snapshot = await window.__LOOKR_E2E__?.snapshot();

    return {
      profile: snapshot?.profile ? { dailyPointsLimit: snapshot.profile.dailyPointsLimit } : null,
      meals:
        snapshot?.meals.map((meal) => ({
          id: meal.id,
          mealName: meal.mealName,
          points: meal.points,
          entryDate: meal.entryDate,
        })) ?? [],
      weights:
        snapshot?.weights.map((weight) => ({
          id: weight.id,
          entryDate: weight.entryDate,
          weight: weight.weight,
        })) ?? [],
    };
  });
}

export async function openTab(page: Page, label: 'Dashboard' | 'History' | 'Progress') {
  await page.getByRole('link', { name: label }).click();
}

export async function expectReadyScreen(page: Page, testId: string) {
  await expect(page.getByTestId(testId)).toBeVisible();
}

export function annotateScenario(testInfo: TestInfo, regressionScenarioId: string, refs: string[]) {
  testInfo.annotations.push({ type: 'regression-scenario', description: regressionScenarioId });

  for (const ref of refs) {
    testInfo.annotations.push({ type: 'acceptance-scenario', description: ref });
  }
}

export async function attachSnapshotOnFailure(page: Page, testInfo: TestInfo) {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  const snapshot = await readAppSnapshot(page);
  await testInfo.attach('app-state', {
    body: Buffer.from(JSON.stringify(snapshot, null, 2)),
    contentType: 'application/json',
  });
}
