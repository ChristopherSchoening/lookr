# Data Model: Improve Weight Tracking

**Branch**: `010-improve-weight-tracking` | **Date**: 2026-04-25

## Entities

### WeightEntry (existing — no schema change)

| Field       | Type   | Constraints                              | Notes                                    |
|-------------|--------|------------------------------------------|------------------------------------------|
| id          | number | PK, autoincrement                        |                                          |
| entryDate   | string | UNIQUE, ISO date `YYYY-MM-DD`            | DB-level enforcement of one entry/date   |
| weight      | number | REAL, 30–300 kg (app-level validation)   |                                          |
| createdAt   | string | ISO timestamp                            |                                          |
| updatedAt   | string | ISO timestamp                            |                                          |

**Validation rules** (app-level, enforced before every write):

| Rule | Requirement |
|------|-------------|
| Weight range | 30 ≤ weight ≤ 300 (FR-007b); show "Weight must be between 30 and 300 kg" on violation |
| Date format | Valid `YYYY-MM-DD` calendar date |
| Date uniqueness | No two saved entries may share `entryDate`; DB UNIQUE constraint is the enforcement; app catches the constraint error and shows "An entry for this date already exists" (FR-007a) |

**State transitions**:

| Action | Trigger | Outcome |
|--------|---------|---------|
| Add | User submits add-entry flow | INSERT if date is unique; reject with feedback if duplicate |
| Edit | User saves edit in detail view | UPDATE by id; new date checked against UNIQUE constraint |
| Delete | User confirms delete prompt | DELETE by id |

---

### UserProfile (extended)

DB migration v4 adds a nullable `target_weight` column:

```sql
ALTER TABLE user_profile ADD COLUMN target_weight REAL;
-- Defaults to NULL for existing rows
```

| Field            | Type           | Constraints        | Notes                              |
|------------------|----------------|--------------------|------------------------------------|
| id               | number         | PK = 1 (singleton) | Unchanged                          |
| dailyPointsLimit | number         | REAL NOT NULL      | Unchanged                          |
| targetWeight     | number \| null | REAL, nullable     | NEW — goal weight for graph scaling |
| updatedAt        | string         | ISO timestamp      | Unchanged                          |

TypeScript type update in `src/lib/types.ts`:

```typescript
export type UserProfile = {
  dailyPointsLimit: number;
  targetWeight: number | null;  // NEW
  updatedAt: string;
};
```

E2E seed extension in `E2ESeedState.profile`:

```typescript
profile?: {
  dailyPointsLimit: number;
  targetWeight?: number | null;  // NEW, optional for backwards-compat seed states
  updatedAt?: string;
} | null;
```

---

### WeightOverview (derived — computed in AppDataContext, not persisted)

Computed from `weights` + `profile.targetWeight` each time data refreshes.

| Field           | Type                              | Derivation                                          |
|-----------------|-----------------------------------|-----------------------------------------------------|
| latestWeight    | WeightEntry \| null               | `weights[0]` (sorted DESC by entryDate)             |
| previousWeight  | WeightEntry \| null               | `weights[1]`                                        |
| targetWeight    | number \| null                    | `profile?.targetWeight ?? null`                     |
| weightChange    | number \| null                    | `latest.weight - previous.weight`; null if < 2 entries |
| remaining       | number \| null                    | `latest.weight - targetWeight`; null if no target   |
| trendDirection  | `'down' \| 'up' \| 'flat' \| null` | sign of `weightChange`; null if weightChange is null |
| latestEntryDate | string \| null                    | `latestWeight?.entryDate ?? null`                   |

---

### WeightTrendGraph (computed values for chart rendering)

Inputs consumed by `WeightChart` component. Derived outside the component (in the screen or a helper) to keep the component pure.

| Field      | Type                    | Derivation                                                            |
|------------|-------------------------|-----------------------------------------------------------------------|
| entries    | WeightEntry[]           | All weight entries sorted ASC by `entryDate`                          |
| targetLine | number \| null          | `profile.targetWeight`                                                |
| yMin       | number                  | See range formula below                                               |
| yMax       | number                  | See range formula below                                               |
| xDomain    | [string, string] \| null | `[entries[0].entryDate, entries[last].entryDate]`; null if < 1 entry |

**Y-axis range formula** (FR-011, FR-012):

```
highestLogged = max(entries.map(e => e.weight))
lowestLogged  = min(entries.map(e => e.weight))

if targetWeight != null:
  candidateMin = targetWeight - 5
  candidateMax = highestLogged + 5
  // expand if range is degenerate or target is outside candidate range
  yMin = min(candidateMin, lowestLogged - 5)
  yMax = max(candidateMax, targetWeight + 5)
else:
  yMin = lowestLogged - 5
  yMax = highestLogged + 5
```

Edge: if `entries` is empty, chart is not rendered; an empty state message is shown instead.

---

## New DB Functions

| Function | Signature | Behavior |
|----------|-----------|----------|
| `updateWeight` | `(id: number, input: { entryDate: string; weight: number }) => Promise<void>` | `UPDATE weight_entries SET entry_date=?, weight=?, updated_at=? WHERE id=?`. UNIQUE constraint on `entry_date` enforces FR-007a at DB level; caller handles the constraint error. |
| `saveTargetWeight` | `(weight: number \| null) => Promise<void>` | `UPDATE user_profile SET target_weight=? WHERE id=1`. Creates profile row if not exists (INSERT OR IGNORE before UPDATE). |

Both functions are added to `src/lib/db.ts` and exposed through `AppDataContext` (`updateWeight`, `saveTargetWeight`).
