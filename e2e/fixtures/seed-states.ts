import type { E2ESeedState } from '../../src/lib/db';

function toDateKey(offsetDays = 0) {
  const next = new Date();
  next.setHours(12, 0, 0, 0);
  next.setDate(next.getDate() + offsetDays);

  const year = next.getFullYear();
  const month = `${next.getMonth() + 1}`.padStart(2, '0');
  const day = `${next.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createCleanSeedState(): E2ESeedState {
  return {
    profile: { dailyPointsLimit: 24 },
    meals: [],
    weights: [],
  };
}

export function createNoLimitSeedState(): E2ESeedState {
  return {
    profile: null,
    meals: [],
    weights: [],
  };
}

export function createOverLimitSeedState(): E2ESeedState {
  const today = toDateKey(0);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      {
        mealName: 'Breakfast tacos',
        points: 11,
        entryDate: today,
        entryTime: '8:15 AM',
        mealType: 'breakfast',
      },
      {
        mealName: 'Pasta dinner',
        points: 18,
        entryDate: today,
        entryTime: '7:10 PM',
        mealType: 'dinner',
      },
    ],
    weights: [],
  };
}

export function createSameDayLimitEditSeedState(): E2ESeedState {
  return createOverLimitSeedState();
}

export function createDecimalLimitSeedState(): E2ESeedState {
  const today = toDateKey(0);

  return {
    profile: { dailyPointsLimit: 24.5 },
    dailyPointLimitHistory: [
      {
        effectiveDate: today,
        dailyPointsLimit: 24.5,
        createdAt: `${today}T08:00:00.000Z`,
      },
    ],
    meals: [
      {
        mealName: 'Decimal day lunch',
        points: 12,
        entryDate: today,
        entryTime: '12:20 PM',
        mealType: 'lunch',
      },
    ],
    weights: [],
  };
}

export function createHistorySeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      {
        mealName: 'Greek yogurt bowl',
        points: 7,
        entryDate: today,
        entryTime: '8:00 AM',
        mealType: 'breakfast',
      },
      {
        mealName: 'Lunch wrap',
        points: 12,
        entryDate: yesterday,
        entryTime: '12:30 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Soup dinner',
        points: 6,
        entryDate: yesterday,
        entryTime: '6:45 PM',
        mealType: 'dinner',
      },
      { mealName: 'Chili leftovers', points: 15, entryDate: twoDaysAgo, entryTime: '7:00 PM' },
    ],
    weights: [
      { entryDate: yesterday, weight: 81.8 },
      { entryDate: twoDaysAgo, weight: 82.3 },
    ],
  };
}

export function createMealSuggestionSeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);
  const threeDaysAgo = toDateKey(-3);
  const fourDaysAgo = toDateKey(-4);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      {
        mealName: 'Chicken rice',
        points: 18,
        entryDate: today,
        entryTime: '7:30 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Chipotle bowl',
        points: 14,
        entryDate: today,
        entryTime: '1:00 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Chili leftovers',
        points: 15,
        entryDate: yesterday,
        entryTime: '7:00 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Chia pudding',
        points: 9,
        entryDate: yesterday,
        entryTime: '8:00 AM',
        mealType: 'breakfast',
      },
      {
        mealName: 'Chicken salad',
        points: 11,
        entryDate: twoDaysAgo,
        entryTime: '6:30 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Chickpea curry',
        points: 13,
        entryDate: threeDaysAgo,
        entryTime: '12:15 PM',
        mealType: 'lunch',
      },
      {
        mealName: '  chicken rice  ',
        points: 16,
        entryDate: fourDaysAgo,
        entryTime: '6:45 PM',
        mealType: 'lunch',
      },
    ],
    weights: [],
  };
}

export function createLegacyMealSeedState(): E2ESeedState {
  const yesterday = toDateKey(-1);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      { mealName: 'Legacy soup', points: 8, entryDate: yesterday, entryTime: '6:30 PM' },
      {
        mealName: 'Typed lunch',
        points: 11,
        entryDate: yesterday,
        entryTime: '12:10 PM',
        mealType: 'lunch',
      },
    ],
    weights: [],
  };
}

export function createCountedHistorySeedState(): E2ESeedState {
  const yesterday = toDateKey(-1);

  return {
    profile: { dailyPointsLimit: 40 },
    meals: [
      {
        mealName: 'Turkey lunch',
        points: 5,
        entryDate: yesterday,
        entryTime: '12:15 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Turkey lunch',
        points: 5,
        entryDate: yesterday,
        entryTime: '12:15 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Turkey lunch',
        points: 5,
        entryDate: yesterday,
        entryTime: '12:15 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Turkey lunch',
        points: 6,
        entryDate: yesterday,
        entryTime: '12:15 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Turkey lunch',
        points: 5,
        entryDate: yesterday,
        entryTime: '12:45 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Turkey lunch',
        points: 5,
        entryDate: yesterday,
        entryTime: '12:15 PM',
        mealType: 'snack',
      },
    ],
    weights: [],
  };
}

export function createProgressSeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);
  const threeDaysAgo = toDateKey(-3);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      {
        mealName: 'Protein oats',
        points: 8,
        entryDate: today,
        entryTime: '8:05 AM',
        mealType: 'breakfast',
      },
      {
        mealName: 'Salad bowl',
        points: 7,
        entryDate: today,
        entryTime: '1:00 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Takeaway burger',
        points: 26,
        entryDate: yesterday,
        entryTime: '7:15 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Chicken rice',
        points: 18,
        entryDate: twoDaysAgo,
        entryTime: '6:30 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Toast and eggs',
        points: 6,
        entryDate: threeDaysAgo,
        entryTime: '8:10 AM',
        mealType: 'breakfast',
      },
    ],
    weights: [
      { entryDate: threeDaysAgo, weight: 82.6 },
      { entryDate: twoDaysAgo, weight: 82.2 },
      { entryDate: yesterday, weight: 81.9 },
    ],
  };
}

export function createHistoricalLimitSeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);
  const fiveDaysAgo = toDateKey(-5);

  return {
    profile: { dailyPointsLimit: 24 },
    dailyPointLimitHistory: [
      {
        effectiveDate: fiveDaysAgo,
        dailyPointsLimit: 20,
        createdAt: `${fiveDaysAgo}T08:00:00.000Z`,
      },
      { effectiveDate: today, dailyPointsLimit: 24 },
    ],
    meals: [
      {
        mealName: 'Today lunch',
        points: 16,
        entryDate: today,
        entryTime: '12:30 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Lunch wrap',
        points: 12,
        entryDate: yesterday,
        entryTime: '12:30 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'Soup dinner',
        points: 9,
        entryDate: yesterday,
        entryTime: '6:45 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Chili leftovers',
        points: 18,
        entryDate: twoDaysAgo,
        entryTime: '7:00 PM',
        mealType: 'dinner',
      },
    ],
    weights: [],
  };
}

export function createHistoricalLimitProgressSeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);
  const fiveDaysAgo = toDateKey(-5);

  return {
    profile: { dailyPointsLimit: 24 },
    dailyPointLimitHistory: [
      {
        effectiveDate: fiveDaysAgo,
        dailyPointsLimit: 20,
        createdAt: `${fiveDaysAgo}T08:00:00.000Z`,
      },
      { effectiveDate: today, dailyPointsLimit: 24 },
    ],
    meals: [
      {
        mealName: 'Today bowl',
        points: 26,
        entryDate: today,
        entryTime: '7:10 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Yesterday soup',
        points: 18,
        entryDate: yesterday,
        entryTime: '6:30 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Burger night',
        points: 22,
        entryDate: twoDaysAgo,
        entryTime: '7:00 PM',
        mealType: 'dinner',
      },
    ],
    weights: [
      { entryDate: twoDaysAgo, weight: 82.2 },
      { entryDate: yesterday, weight: 81.9 },
    ],
  };
}

export function createMixedHistorySeedState(): E2ESeedState {
  const today = toDateKey(0);
  const yesterday = toDateKey(-1);
  const twoDaysAgo = toDateKey(-2);
  const sixDaysAgo = toDateKey(-6);

  return {
    profile: { dailyPointsLimit: 30 },
    dailyPointLimitHistory: [
      {
        effectiveDate: sixDaysAgo,
        dailyPointsLimit: 20,
        createdAt: `${sixDaysAgo}T08:00:00.000Z`,
      },
      {
        effectiveDate: yesterday,
        dailyPointsLimit: 30,
        createdAt: `${yesterday}T08:00:00.000Z`,
      },
    ],
    meals: [
      {
        mealName: 'Today meal',
        points: 28,
        entryDate: today,
        entryTime: '1:00 PM',
        mealType: 'lunch',
      },
      {
        mealName: 'New limit dinner',
        points: 27,
        entryDate: yesterday,
        entryTime: '7:00 PM',
        mealType: 'dinner',
      },
      {
        mealName: 'Old limit dinner',
        points: 22,
        entryDate: twoDaysAgo,
        entryTime: '7:00 PM',
        mealType: 'dinner',
      },
    ],
    weights: [],
  };
}

export function getRelativeDateKey(offsetDays = 0) {
  return toDateKey(offsetDays);
}

export function getEmptyDateKey(offsets: number[], usedDateKeys: string[]) {
  const usedDates = new Set(usedDateKeys);

  for (const offset of offsets) {
    const dateKey = toDateKey(offset);
    if (!usedDates.has(dateKey)) {
      return dateKey;
    }
  }

  throw new Error('No empty date available for requested offsets.');
}
