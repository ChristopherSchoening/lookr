import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  addMeal as addMealRecord,
  deleteMeal as deleteMealRecord,
  deleteWeight as deleteWeightRecord,
  getE2ESnapshot,
  listDailyPointLimitHistory,
  listMeals,
  listWeights,
  loadProfile,
  prepareLegacyMealTypeMigrationE2E,
  resetE2EState,
  saveProfile as saveProfileRecord,
  saveTargetWeight as saveTargetWeightRecord,
  saveWeight as saveWeightRecord,
  seedE2EState,
  type E2ESeedState,
  updateMeal as updateMealRecord,
  updateWeight as updateWeightRecord,
} from '@/lib/db';
import { currentTimeLabel } from '@/lib/date';
import type {
  DailyPointLimitHistoryEntry,
  DailySummary,
  MealEditorInput,
  MealEntry,
  MealType,
  UserProfile,
  WeightEntry,
} from '@/lib/types';

type TrackedDateInfo = {
  mealCount: number;
  status: DailySummary['status'];
};

type E2EWindowControls = {
  enabled: boolean;
  reset: () => Promise<void>;
  seed: (seed: E2ESeedState) => Promise<void>;
  prepareLegacyMealTypeMigration: () => Promise<void>;
  snapshot: typeof getE2ESnapshot;
  refresh: () => Promise<void>;
};

declare global {
  interface Window {
    __LOOKR_E2E__?: E2EWindowControls;
  }
}

type AppDataContextValue = {
  isReady: boolean;
  profile: UserProfile | null;
  dailyPointLimitHistory: DailyPointLimitHistoryEntry[];
  meals: MealEntry[];
  weights: WeightEntry[];
  summaries: DailySummary[];
  refresh: () => Promise<void>;
  saveProfile: (dailyPointsLimit: number) => Promise<void>;
  addMeal: (input: {
    mealName: string;
    points: number;
    entryDate: string;
    mealType?: MealType | null;
    count?: number;
  }) => Promise<void>;
  updateMeal: (
    id: number,
    input: { mealName: string; points: number; entryDate: string; mealType?: MealType | null },
  ) => Promise<void>;
  updateMealGroup: (ids: number[], input: MealEditorInput) => Promise<void>;
  deleteMeal: (id: number) => Promise<void>;
  deleteMealGroup: (ids: number[]) => Promise<void>;
  saveWeight: (input: { entryDate: string; weight: number }) => Promise<void>;
  updateWeight: (id: number, input: { entryDate: string; weight: number }) => Promise<void>;
  deleteWeight: (id: number) => Promise<void>;
  saveTargetWeight: (weight: number | null) => Promise<void>;
  getMealsByDate: (date: string) => MealEntry[];
  getSummaryByDate: (date: string) => DailySummary;
  trackedDates: Record<string, TrackedDateInfo>;
  hasTrackedMeals: (date: string) => boolean;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function resolveDailyLimitForDate(
  date: string,
  dailyPointLimitHistory: DailyPointLimitHistoryEntry[],
  profile: UserProfile | null,
) {
  const effectiveEntry = [...dailyPointLimitHistory]
    .sort((left, right) => {
      const dateOrder = right.effectiveDate.localeCompare(left.effectiveDate);
      if (dateOrder !== 0) return dateOrder;

      const createdOrder = right.createdAt.localeCompare(left.createdAt);
      if (createdOrder !== 0) return createdOrder;

      return right.id - left.id;
    })
    .find((entry) => entry.effectiveDate <= date);
  return effectiveEntry?.dailyPointsLimit ?? profile?.dailyPointsLimit ?? 0;
}

function buildSummaries(
  meals: MealEntry[],
  dailyPointLimitHistory: DailyPointLimitHistoryEntry[],
  profile: UserProfile | null,
): DailySummary[] {
  const grouped = new Map<string, MealEntry[]>();

  for (const meal of meals) {
    const items = grouped.get(meal.entryDate) ?? [];
    items.push(meal);
    grouped.set(meal.entryDate, items);
  }

  return [...grouped.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([date, items]) => {
      const dailyLimit = resolveDailyLimitForDate(date, dailyPointLimitHistory, profile);
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

function isE2EEnabled() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  return new URLSearchParams(window.location.search).get('e2e') === '1';
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyPointLimitHistory, setDailyPointLimitHistory] = useState<
    DailyPointLimitHistoryEntry[]
  >([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);

  async function refresh() {
    const [nextProfile, nextDailyPointLimitHistory, nextMeals, nextWeights] = await Promise.all([
      loadProfile(),
      listDailyPointLimitHistory(),
      listMeals(),
      listWeights(),
    ]);

    setProfile(nextProfile);
    setDailyPointLimitHistory(nextDailyPointLimitHistory);
    setMeals(nextMeals);
    setWeights(nextWeights);
    setIsReady(true);
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!isE2EEnabled()) {
      if (typeof window !== 'undefined') {
        delete window.__LOOKR_E2E__;
      }
      return;
    }

    const controls: E2EWindowControls = {
      enabled: true,
      reset: async () => {
        await resetE2EState();
        await refresh();
      },
      seed: async (seed) => {
        await seedE2EState(seed);
        await refresh();
      },
      prepareLegacyMealTypeMigration: async () => {
        await prepareLegacyMealTypeMigrationE2E();
      },
      snapshot: getE2ESnapshot,
      refresh,
    };

    window.__LOOKR_E2E__ = controls;

    return () => {
      if (window.__LOOKR_E2E__ === controls) {
        delete window.__LOOKR_E2E__;
      }
    };
  }, [profile, dailyPointLimitHistory, meals, weights]);

  const summaries = buildSummaries(meals, dailyPointLimitHistory, profile);
  const trackedDates = summaries.reduce<Record<string, TrackedDateInfo>>((lookup, summary) => {
    lookup[summary.date] = {
      mealCount: summary.mealCount,
      status: summary.status,
    };
    return lookup;
  }, {});

  const value: AppDataContextValue = {
    isReady,
    profile,
    dailyPointLimitHistory,
    meals,
    weights,
    summaries,
    refresh,
    async saveProfile(dailyPointsLimit) {
      await saveProfileRecord(dailyPointsLimit);
      await refresh();
    },
    async addMeal(input) {
      const count = input.count ?? 1;
      const entryTime = currentTimeLabel();
      for (let index = 0; index < count; index += 1) {
        await addMealRecord({ ...input, entryTime });
      }
      await refresh();
    },
    async updateMeal(id, input) {
      await updateMealRecord(id, input);
      await refresh();
    },
    async updateMealGroup(ids, input) {
      const count = input.count ?? ids.length;
      const sortedIds = [...ids].sort((left, right) => left - right);
      const idsToUpdate = sortedIds.slice(0, count);
      const idsToDelete = sortedIds.slice(count);
      const representative = meals.find((meal) => sortedIds.includes(meal.id));
      const entryTime = representative?.entryTime ?? currentTimeLabel();

      for (const id of idsToUpdate) {
        await updateMealRecord(id, input);
      }

      for (let index = idsToUpdate.length; index < count; index += 1) {
        await addMealRecord({ ...input, entryTime });
      }

      for (const id of idsToDelete) {
        await deleteMealRecord(id);
      }

      await refresh();
    },
    async deleteMeal(id) {
      await deleteMealRecord(id);
      await refresh();
    },
    async deleteMealGroup(ids) {
      for (const id of ids) {
        await deleteMealRecord(id);
      }
      await refresh();
    },
    async saveWeight(input) {
      await saveWeightRecord(input);
      await refresh();
    },
    async updateWeight(id, input) {
      await updateWeightRecord(id, input);
      await refresh();
    },
    async deleteWeight(id) {
      await deleteWeightRecord(id);
      await refresh();
    },
    async saveTargetWeight(weight) {
      await saveTargetWeightRecord(weight);
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

      const dailyLimit = resolveDailyLimitForDate(date, dailyPointLimitHistory, profile);
      return {
        date,
        dailyLimit,
        consumedPoints: 0,
        remainingPoints: dailyLimit,
        mealCount: 0,
        status: 'empty',
      };
    },
    trackedDates,
    hasTrackedMeals(date) {
      return (trackedDates[date]?.mealCount ?? 0) > 0;
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
