import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  addMeal as addMealRecord,
  deleteMeal as deleteMealRecord,
  deleteWeight as deleteWeightRecord,
  listMeals,
  listWeights,
  loadProfile,
  saveProfile as saveProfileRecord,
  saveWeight as saveWeightRecord,
  updateMeal as updateMealRecord,
} from '@/lib/db';
import type { DailySummary, MealEntry, UserProfile, WeightEntry } from '@/lib/types';

type AppDataContextValue = {
  isReady: boolean;
  profile: UserProfile | null;
  meals: MealEntry[];
  weights: WeightEntry[];
  summaries: DailySummary[];
  refresh: () => Promise<void>;
  saveProfile: (dailyPointsLimit: number) => Promise<void>;
  addMeal: (input: { mealName: string; points: number; entryDate: string }) => Promise<void>;
  updateMeal: (
    id: number,
    input: { mealName: string; points: number; entryDate: string },
  ) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  saveWeight: (input: { entryDate: string; weight: number }) => Promise<void>;
  deleteWeight: (id: number) => Promise<void>;
  getMealsByDate: (date: string) => MealEntry[];
  getSummaryByDate: (date: string) => DailySummary;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function buildSummaries(meals: MealEntry[], profile: UserProfile | null): DailySummary[] {
  const dailyLimit = profile?.dailyPointsLimit ?? 0;
  const grouped = new Map<string, MealEntry[]>();

  for (const meal of meals) {
    const items = grouped.get(meal.entryDate) ?? [];
    items.push(meal);
    grouped.set(meal.entryDate, items);
  }

  return [...grouped.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([date, items]) => {
      const consumedPoints = items.reduce((total, meal) => total + meal.points, 0);
      const remainingPoints = dailyLimit - consumedPoints;

      return {
        date,
        dailyLimit,
        consumedPoints,
        remainingPoints,
        mealCount: items.length,
        status: consumedPoints === 0 ? 'empty' : remainingPoints < 0 ? 'over' : 'within',
      } satisfies DailySummary;
    });
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  async function refresh() {
    const [nextProfile, nextMeals, nextWeights] = await Promise.all([
      loadProfile(),
      listMeals(),
      listWeights(),
    ]);

    setProfile(nextProfile);
    setMeals(nextMeals);
    setWeights(nextWeights);
    setIsReady(true);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const summaries = buildSummaries(meals, profile);

  const value: AppDataContextValue = {
    isReady,
    profile,
    meals,
    weights,
    summaries,
    refresh,
    async saveProfile(dailyPointsLimit) {
      await saveProfileRecord(dailyPointsLimit);
      await refresh();
    },
    async addMeal(input) {
      await addMealRecord(input);
      await refresh();
    },
    async updateMeal(id, input) {
      await updateMealRecord(id, input);
      await refresh();
    },
    async deleteMeal(id) {
      await deleteMealRecord(id);
      await refresh();
    },
    async saveWeight(input) {
      await saveWeightRecord(input);
      await refresh();
    },
    async deleteWeight(id) {
      await deleteWeightRecord(id);
      await refresh();
    },
    getMealsByDate(date) {
      return meals.filter((meal) => meal.entryDate === date);
    },
    getSummaryByDate(date) {
      const existing = summaries.find((summary) => summary.date === date);
      if (existing) {
        return existing;
      }

      const dailyLimit = profile?.dailyPointsLimit ?? 0;
      return {
        date,
        dailyLimit,
        consumedPoints: 0,
        remainingPoints: dailyLimit,
        mealCount: 0,
        status: 'empty',
      };
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
