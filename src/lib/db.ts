import { openDatabaseAsync, type SQLiteDatabase, type SQLiteRunResult } from 'expo-sqlite';
import { Platform } from 'react-native';

import { currentTimeLabel, isFutureDate, nowIso } from '@/lib/date';
import type { MealEntry, MealType, UserProfile, WeightEntry } from '@/lib/types';

let databasePromise: Promise<SQLiteDatabase> | null = null;

type ProfileRow = {
  daily_points_limit: number;
  updated_at: string;
};

type MealRow = {
  id: number;
  meal_name: string;
  points: number;
  entry_date: string;
  entry_time: string;
  meal_type: string | null;
  created_at: string;
  updated_at: string;
};

type WeightRow = {
  id: number;
  entry_date: string;
  weight: number;
  created_at: string;
  updated_at: string;
};

export type E2ESeedMeal = {
  mealName: string;
  points: number;
  entryDate: string;
  entryTime: string;
  mealType?: MealType | null;
  createdAt?: string;
  updatedAt?: string;
};

export type E2ESeedWeight = {
  entryDate: string;
  weight: number;
  createdAt?: string;
  updatedAt?: string;
};

export type E2ESeedState = {
  profile?: { dailyPointsLimit: number } | null;
  meals?: E2ESeedMeal[];
  weights?: E2ESeedWeight[];
};

const mealTypeValues = ['breakfast', 'lunch', 'dinner', 'snack'] satisfies MealType[];

function normalizeMealType(mealType?: string | null): MealType | null {
  if (!mealType) {
    return null;
  }

  return mealTypeValues.includes(mealType as MealType) ? (mealType as MealType) : null;
}

async function getDb() {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync('lookr.db');
  }

  const db = await databasePromise;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      daily_points_limit INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS meal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_name TEXT NOT NULL,
      points INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      entry_time TEXT NOT NULL,
      meal_type TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_date TEXT NOT NULL UNIQUE,
      weight REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const mealColumns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(meal_entries)');
  if (!mealColumns.some((column) => column.name === 'meal_type')) {
    await db.execAsync('ALTER TABLE meal_entries ADD COLUMN meal_type TEXT;');
  }

  return db;
}

function assertWebE2EAccess() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    throw new Error('E2E state controls are only available on web.');
  }
}

async function insertMealSeed(db: SQLiteDatabase, meal: E2ESeedMeal) {
  const createdAt = meal.createdAt ?? nowIso();
  const updatedAt = meal.updatedAt ?? createdAt;
  await db.runAsync(
    `
      INSERT INTO meal_entries (
        meal_name,
        points,
        entry_date,
        entry_time,
        meal_type,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    meal.mealName.trim(),
    meal.points,
    meal.entryDate,
    meal.entryTime,
    normalizeMealType(meal.mealType),
    createdAt,
    updatedAt,
  );
}

async function insertWeightSeed(db: SQLiteDatabase, weight: E2ESeedWeight) {
  const createdAt = weight.createdAt ?? nowIso();
  const updatedAt = weight.updatedAt ?? createdAt;
  await db.runAsync(
    `
      INSERT INTO weight_entries (entry_date, weight, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `,
    weight.entryDate,
    weight.weight,
    createdAt,
    updatedAt,
  );
}

export async function loadProfile(): Promise<UserProfile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ProfileRow>(
    'SELECT daily_points_limit, updated_at FROM user_profile WHERE id = 1',
  );

  if (!row) return null;

  return {
    dailyPointsLimit: row.daily_points_limit,
    updatedAt: row.updated_at,
  };
}

export async function saveProfile(dailyPointsLimit: number) {
  const db = await getDb();
  const updatedAt = nowIso();
  await db.runAsync(
    `
      INSERT INTO user_profile (id, daily_points_limit, updated_at)
      VALUES (1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        daily_points_limit = excluded.daily_points_limit,
        updated_at = excluded.updated_at
    `,
    dailyPointsLimit,
    updatedAt,
  );
}

export async function listMeals(): Promise<MealEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MealRow>(
    `
      SELECT id, meal_name, points, entry_date, entry_time, meal_type, created_at, updated_at
      FROM meal_entries
      ORDER BY entry_date DESC, entry_time DESC, id DESC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    mealName: row.meal_name,
    points: row.points,
    entryDate: row.entry_date,
    entryTime: row.entry_time,
    mealType: normalizeMealType(row.meal_type),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function addMeal(input: {
  mealName: string;
  points: number;
  entryDate: string;
  entryTime?: string;
  mealType?: MealType | null;
}) {
  if (isFutureDate(input.entryDate)) {
    throw new Error('Meals can only be logged for today or past days.');
  }

  const db = await getDb();
  const createdAt = nowIso();
  await db.runAsync(
    `
      INSERT INTO meal_entries (
        meal_name,
        points,
        entry_date,
        entry_time,
        meal_type,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    input.mealName.trim(),
    input.points,
    input.entryDate,
    input.entryTime ?? currentTimeLabel(),
    normalizeMealType(input.mealType),
    createdAt,
    createdAt,
  );
}

export async function updateMeal(
  id: number,
  input: {
    mealName: string;
    points: number;
    entryDate: string;
    mealType?: MealType | null;
  },
) {
  if (isFutureDate(input.entryDate)) {
    throw new Error('Meals can only be logged for today or past days.');
  }

  const db = await getDb();
  await db.runAsync(
    `
      UPDATE meal_entries
      SET meal_name = ?, points = ?, entry_date = ?, meal_type = ?, updated_at = ?
      WHERE id = ?
    `,
    input.mealName.trim(),
    input.points,
    input.entryDate,
    normalizeMealType(input.mealType),
    nowIso(),
    id,
  );
}

export async function deleteMeal(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM meal_entries WHERE id = ?', id);
}

export async function listWeights(): Promise<WeightEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<WeightRow>(
    `
      SELECT id, entry_date, weight, created_at, updated_at
      FROM weight_entries
      ORDER BY entry_date DESC, id DESC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    entryDate: row.entry_date,
    weight: row.weight,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function saveWeight(input: { entryDate: string; weight: number }) {
  const db = await getDb();
  const existing = await db.getFirstAsync<WeightRow>(
    'SELECT id, entry_date, weight, created_at, updated_at FROM weight_entries WHERE entry_date = ?',
    input.entryDate,
  );
  const updatedAt = nowIso();

  if (existing) {
    await db.runAsync(
      'UPDATE weight_entries SET weight = ?, updated_at = ? WHERE entry_date = ?',
      input.weight,
      updatedAt,
      input.entryDate,
    );
    return;
  }

  await db.runAsync(
    `
      INSERT INTO weight_entries (entry_date, weight, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `,
    input.entryDate,
    input.weight,
    updatedAt,
    updatedAt,
  );
}

export async function deleteWeight(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM weight_entries WHERE id = ?', id);
}

export type InsertResult = SQLiteRunResult;

export async function resetE2EState() {
  assertWebE2EAccess();
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM meal_entries;
    DELETE FROM weight_entries;
    DELETE FROM user_profile;
    DELETE FROM sqlite_sequence WHERE name IN ('meal_entries', 'weight_entries');
  `);
}

export async function seedE2EState(seed: E2ESeedState) {
  assertWebE2EAccess();
  await resetE2EState();

  if (seed.profile) {
    await saveProfile(seed.profile.dailyPointsLimit);
  }

  const db = await getDb();

  for (const meal of seed.meals ?? []) {
    await insertMealSeed(db, meal);
  }

  for (const weight of seed.weights ?? []) {
    await insertWeightSeed(db, weight);
  }
}

export async function getE2ESnapshot() {
  assertWebE2EAccess();

  const [profile, meals, weights] = await Promise.all([loadProfile(), listMeals(), listWeights()]);

  return {
    profile,
    meals,
    weights,
  };
}
