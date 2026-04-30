import type { CombinedHistoryRow, MealEntry } from './types';

function buildGroupKey(meal: MealEntry) {
  return JSON.stringify([
    meal.entryDate,
    meal.entryTime,
    meal.mealType ?? null,
    meal.points,
    meal.mealName,
  ]);
}

function buildGroupTestId(mealIds: number[]) {
  return `meal-group-${mealIds.join('-')}`;
}

export function combineMeals(meals: MealEntry[]): CombinedHistoryRow[] {
  const grouped = new Map<string, MealEntry[]>();

  for (const meal of meals) {
    const key = buildGroupKey(meal);
    const groupMeals = grouped.get(key) ?? [];
    groupMeals.push(meal);
    grouped.set(key, groupMeals);
  }

  return [...grouped.values()].map((groupMeals) => {
    const representative = groupMeals[0];
    const mealIds = groupMeals.map((meal) => meal.id);
    const count = mealIds.length;

    return {
      ...representative,
      groupKey: buildGroupTestId(mealIds),
      mealIds,
      count,
      totalPoints: representative.points * count,
    };
  });
}
