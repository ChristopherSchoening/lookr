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

export function createOverLimitSeedState(): E2ESeedState {
  const today = toDateKey(0);

  return {
    profile: { dailyPointsLimit: 24 },
    meals: [
      { mealName: 'Breakfast tacos', points: 11, entryDate: today, entryTime: '8:15 AM' },
      { mealName: 'Pasta dinner', points: 18, entryDate: today, entryTime: '7:10 PM' },
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
      { mealName: 'Greek yogurt bowl', points: 7, entryDate: today, entryTime: '8:00 AM' },
      { mealName: 'Lunch wrap', points: 12, entryDate: yesterday, entryTime: '12:30 PM' },
      { mealName: 'Soup dinner', points: 6, entryDate: yesterday, entryTime: '6:45 PM' },
      { mealName: 'Chili leftovers', points: 15, entryDate: twoDaysAgo, entryTime: '7:00 PM' },
    ],
    weights: [
      { entryDate: yesterday, weight: 81.8 },
      { entryDate: twoDaysAgo, weight: 82.3 },
    ],
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
      { mealName: 'Protein oats', points: 8, entryDate: today, entryTime: '8:05 AM' },
      { mealName: 'Salad bowl', points: 7, entryDate: today, entryTime: '1:00 PM' },
      { mealName: 'Takeaway burger', points: 26, entryDate: yesterday, entryTime: '7:15 PM' },
      { mealName: 'Chicken rice', points: 18, entryDate: twoDaysAgo, entryTime: '6:30 PM' },
      { mealName: 'Toast and eggs', points: 6, entryDate: threeDaysAgo, entryTime: '8:10 AM' },
    ],
    weights: [
      { entryDate: threeDaysAgo, weight: 82.6 },
      { entryDate: twoDaysAgo, weight: 82.2 },
      { entryDate: yesterday, weight: 81.9 },
    ],
  };
}

export function getRelativeDateKey(offsetDays = 0) {
  return toDateKey(offsetDays);
}
