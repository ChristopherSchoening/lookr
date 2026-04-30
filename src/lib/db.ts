import { openDatabaseAsync, type SQLiteDatabase, type SQLiteRunResult } from 'expo-sqlite';
import { Platform } from 'react-native';

import { currentTimeLabel, isFutureDate, nowIso, todayKey } from '@/lib/date';
import type {
  DailyPointLimitHistoryEntry,
  MealEntry,
  MealType,
  ThemePreference,
  UserProfile,
  WeightEntry,
} from '@/lib/types';

let databasePromise: Promise<SQLiteDatabase> | null = null;
let databaseInitializationPromise: Promise<SQLiteDatabase> | null = null;

const DATABASE_SCHEMA_VERSION = 6;

type ProfileRow = {
  daily_points_limit: number;
  target_weight: number | null;
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

type DailyPointLimitHistoryRow = {
  id: number;
  effective_date: string;
  daily_points_limit: number;
  created_at: string;
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

export type E2ESeedDailyPointLimitHistory = {
  effectiveDate: string;
  dailyPointsLimit: number;
  createdAt?: string;
};

export type E2ESeedState = {
  profile?: { dailyPointsLimit: number; targetWeight?: number | null; updatedAt?: string } | null;
  dailyPointLimitHistory?: E2ESeedDailyPointLimitHistory[];
  meals?: E2ESeedMeal[];
  weights?: E2ESeedWeight[];
};

const mealTypeValues = ['breakfast', 'lunch', 'dinner', 'snack'] satisfies MealType[];
const themePreferenceValues = ['light', 'dark', 'system'] satisfies ThemePreference[];

function normalizeMealType(mealType?: string | null): MealType | null {
  if (!mealType) {
    return null;
  }

  return mealTypeValues.includes(mealType as MealType) ? (mealType as MealType) : null;
}

function normalizeThemePreference(preference?: string | null): ThemePreference {
  return themePreferenceValues.includes(preference as ThemePreference)
    ? (preference as ThemePreference)
    : 'system';
}

async function getDb() {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync('lookr.db');
  }

  if (!databaseInitializationPromise) {
    databaseInitializationPromise = (async () => {
      const db = await databasePromise;

      await db.execAsync('PRAGMA journal_mode = WAL;');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
          daily_points_limit REAL NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS daily_point_limit_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          effective_date TEXT NOT NULL,
          daily_points_limit REAL NOT NULL,
          created_at TEXT NOT NULL
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
        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);

      const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
      const currentVersion = versionRow?.user_version ?? 0;

      if (currentVersion < 2) {
        const mealColumns = await db.getAllAsync<{ name: string }>(
          'PRAGMA table_info(meal_entries)',
        );
        if (!mealColumns.some((column) => column.name === 'meal_type')) {
          await db.execAsync('ALTER TABLE meal_entries ADD COLUMN meal_type TEXT;');
        }
      }

      if (currentVersion < 3) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS daily_point_limit_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            effective_date TEXT NOT NULL,
            daily_points_limit REAL NOT NULL,
            created_at TEXT NOT NULL
          );
        `);

        const profileRow = await db.getFirstAsync<ProfileRow>(
          'SELECT daily_points_limit, updated_at FROM user_profile WHERE id = 1',
        );
        const historyCountRow = await db.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) AS count FROM daily_point_limit_history',
        );

        if (profileRow && (historyCountRow?.count ?? 0) === 0) {
          await db.runAsync(
            `
              INSERT INTO daily_point_limit_history (
                effective_date,
                daily_points_limit,
                created_at
              ) VALUES (?, ?, ?)
            `,
            todayKey(),
            profileRow.daily_points_limit,
            profileRow.updated_at,
          );
        }
      }

      if (currentVersion < 4) {
        await db.execAsync(`
          CREATE TABLE user_profile_next (
            id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
            daily_points_limit REAL NOT NULL,
            updated_at TEXT NOT NULL
          );
          INSERT INTO user_profile_next (id, daily_points_limit, updated_at)
          SELECT id, CAST(daily_points_limit AS REAL), updated_at
          FROM user_profile;
          DROP TABLE user_profile;
          ALTER TABLE user_profile_next RENAME TO user_profile;

          CREATE TABLE daily_point_limit_history_next (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            effective_date TEXT NOT NULL,
            daily_points_limit REAL NOT NULL,
            created_at TEXT NOT NULL
          );
          INSERT INTO daily_point_limit_history_next (
            id,
            effective_date,
            daily_points_limit,
            created_at
          )
          SELECT
            id,
            effective_date,
            CAST(daily_points_limit AS REAL),
            created_at
          FROM daily_point_limit_history;
          DROP TABLE daily_point_limit_history;
          ALTER TABLE daily_point_limit_history_next RENAME TO daily_point_limit_history;
        `);
      }

      if (currentVersion < 5) {
        await db.execAsync('ALTER TABLE user_profile ADD COLUMN target_weight REAL;');
      }

      await db.execAsync(`PRAGMA user_version = ${DATABASE_SCHEMA_VERSION};`);
      // app_settings table uses CREATE TABLE IF NOT EXISTS, no migration needed

      return db;
    })().catch((error) => {
      databaseInitializationPromise = null;
      throw error;
    });
  }

  return databaseInitializationPromise;
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

async function insertProfileSeed(
  db: SQLiteDatabase,
  profile: NonNullable<E2ESeedState['profile']>,
) {
  const updatedAt = profile.updatedAt ?? nowIso();
  const targetWeight = profile.targetWeight ?? null;
  await db.runAsync(
    `
      INSERT INTO user_profile (id, daily_points_limit, target_weight, updated_at)
      VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        daily_points_limit = excluded.daily_points_limit,
        target_weight = excluded.target_weight,
        updated_at = excluded.updated_at
    `,
    profile.dailyPointsLimit,
    targetWeight,
    updatedAt,
  );
}

async function insertDailyPointLimitHistorySeed(
  db: SQLiteDatabase,
  historyEntry: E2ESeedDailyPointLimitHistory,
) {
  await db.runAsync(
    `
      INSERT INTO daily_point_limit_history (effective_date, daily_points_limit, created_at)
      VALUES (?, ?, ?)
    `,
    historyEntry.effectiveDate,
    historyEntry.dailyPointsLimit,
    historyEntry.createdAt ?? nowIso(),
  );
}

export async function loadProfile(): Promise<UserProfile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ProfileRow>(
    'SELECT daily_points_limit, target_weight, updated_at FROM user_profile WHERE id = 1',
  );

  if (!row) return null;

  return {
    dailyPointsLimit: row.daily_points_limit,
    targetWeight: row.target_weight ?? null,
    updatedAt: row.updated_at,
  };
}

export async function listDailyPointLimitHistory(): Promise<DailyPointLimitHistoryEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DailyPointLimitHistoryRow>(
    `
      SELECT id, effective_date, daily_points_limit, created_at
      FROM daily_point_limit_history
      ORDER BY effective_date DESC, created_at DESC, id DESC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    effectiveDate: row.effective_date,
    dailyPointsLimit: row.daily_points_limit,
    createdAt: row.created_at,
  }));
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
  await db.runAsync(
    `
      INSERT INTO daily_point_limit_history (effective_date, daily_points_limit, created_at)
      VALUES (?, ?, ?)
    `,
    todayKey(),
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

export async function updateWeight(id: number, input: { entryDate: string; weight: number }) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE weight_entries SET entry_date = ?, weight = ?, updated_at = ? WHERE id = ?',
    input.entryDate,
    input.weight,
    nowIso(),
    id,
  );
}

export async function saveTargetWeight(weight: number | null) {
  const db = await getDb();
  await db.runAsync(
    `
      INSERT INTO user_profile (id, daily_points_limit, target_weight, updated_at)
      VALUES (1, 0, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        target_weight = excluded.target_weight,
        updated_at = excluded.updated_at
    `,
    weight,
    nowIso(),
  );
}

export async function loadThemePreference(): Promise<ThemePreference> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_settings WHERE key = 'theme_preference'",
  );
  return normalizeThemePreference(row?.value);
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('theme_preference', ?)",
    preference,
  );
}

export type InsertResult = SQLiteRunResult;

export async function resetE2EState() {
  assertWebE2EAccess();
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM daily_point_limit_history;
    DELETE FROM meal_entries;
    DELETE FROM weight_entries;
    DELETE FROM user_profile;
    DELETE FROM app_settings;
    DELETE FROM sqlite_sequence
    WHERE name IN ('daily_point_limit_history', 'meal_entries', 'weight_entries');
  `);
}

export async function seedE2EState(seed: E2ESeedState) {
  assertWebE2EAccess();
  await resetE2EState();

  const db = await getDb();

  if (seed.profile) {
    await insertProfileSeed(db, seed.profile);
  }

  for (const historyEntry of seed.dailyPointLimitHistory ?? []) {
    await insertDailyPointLimitHistorySeed(db, historyEntry);
  }

  if (seed.profile && (seed.dailyPointLimitHistory?.length ?? 0) === 0) {
    await insertDailyPointLimitHistorySeed(db, {
      effectiveDate: todayKey(),
      dailyPointsLimit: seed.profile.dailyPointsLimit,
      createdAt: seed.profile.updatedAt,
    });
  }

  for (const meal of seed.meals ?? []) {
    await insertMealSeed(db, meal);
  }

  for (const weight of seed.weights ?? []) {
    await insertWeightSeed(db, weight);
  }
}

export async function prepareLegacyMealTypeMigrationE2E() {
  assertWebE2EAccess();

  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE meal_entries_legacy (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_name TEXT NOT NULL,
      points INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      entry_time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    INSERT INTO meal_entries_legacy (
      id,
      meal_name,
      points,
      entry_date,
      entry_time,
      created_at,
      updated_at
    )
    SELECT
      id,
      meal_name,
      points,
      entry_date,
      entry_time,
      created_at,
      updated_at
    FROM meal_entries;
    DROP TABLE meal_entries;
    ALTER TABLE meal_entries_legacy RENAME TO meal_entries;
    PRAGMA user_version = 1;
  `);
}

export async function getE2ESnapshot() {
  assertWebE2EAccess();

  const [profile, dailyPointLimitHistory, meals, weights] = await Promise.all([
    loadProfile(),
    listDailyPointLimitHistory(),
    listMeals(),
    listWeights(),
  ]);

  return {
    profile,
    dailyPointLimitHistory,
    meals,
    weights,
  };
}
