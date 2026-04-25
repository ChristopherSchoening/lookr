export type UserProfile = {
  dailyPointsLimit: number;
  updatedAt: string;
};

export type DailyPointLimitHistoryEntry = {
  id: number;
  effectiveDate: string;
  dailyPointsLimit: number;
  createdAt: string;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MealEntry = {
  id: number;
  mealName: string;
  points: number;
  entryDate: string;
  entryTime: string;
  mealType?: MealType | null;
  createdAt: string;
  updatedAt: string;
};

export type MealEditorInput = {
  mealName: string;
  points: number;
  entryDate: string;
  mealType?: MealType | null;
  count?: number;
};

export type CombinedHistoryRow = MealEntry & {
  groupKey: string;
  mealIds: number[];
  count: number;
  totalPoints: number;
};

export type MealSuggestion = {
  displayName: string;
  normalizedName: string;
  sourceMealId: number;
  sourcePoints: number;
  sourceMealType?: MealType | null;
};

export type WeightEntry = {
  id: number;
  entryDate: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type DailySummary = {
  date: string;
  dailyLimit: number;
  consumedPoints: number;
  remainingPoints: number;
  mealCount: number;
  status: 'empty' | 'within' | 'over';
};
