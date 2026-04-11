export type UserProfile = {
  dailyPointsLimit: number;
  updatedAt: string;
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
