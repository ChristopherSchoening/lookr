# Data Model: Meal Entry Counts

## Meal Entry

Existing persisted entity in SQLite table `meal_entries`.

Fields:

- `id`: Integer primary key.
- `mealName`: Trimmed display name.
- `points`: Positive meal value.
- `entryDate`: `YYYY-MM-DD` day key.
- `entryTime`: Display time for the logged instance.
- `mealType`: Optional `breakfast`, `lunch`, `dinner`, or `snack`.
- `createdAt`: ISO timestamp.
- `updatedAt`: ISO timestamp.

Validation:

- `entryDate` cannot be in the future.
- `mealName` must be non-empty after trim.
- `points` must be positive and finite.
- `mealType` must be one of the supported values or null.

Relationships:

- Many meal entries can belong to one selected history day.
- Multiple exact meal entries can be represented by one combined history row.

State transitions:

- Added: insert one row for count 1, or N rows for count N.
- Edited single row: update one row.
- Edited combined row: update represented rows and add/remove duplicate rows until represented row count equals requested count.
- Deleted single row: delete one row.
- Deleted combined row: delete all represented rows.

## Meal Count

Transient UI value, not persisted as its own database field.

Fields:

- `value`: Whole number from 1 through 99.

Validation:

- Defaults to 1 when adding a meal.
- Must reject blank, zero, negative, decimal, non-numeric, and above-99 values.
- Applies to add and combined-history edit flows.

Relationships:

- Count determines how many exact `Meal Entry` rows are inserted or represented.

## Combined History Row

Derived display entity for the selected history day.

Fields:

- `groupKey`: Stable key derived from exact-match fields.
- `mealIds`: IDs of represented meal entries.
- `mealName`: Shared display name.
- `points`: Base single-meal value.
- `totalPoints`: `points * count`.
- `entryDate`: Selected day.
- `entryTime`: Shared display time.
- `mealType`: Shared meal type or null.
- `count`: Number of represented meal entries.

Validation:

- Count is derived from `mealIds.length`.
- Rows combine only when all user-visible meal details match.
- Rows with count 1 render without a count badge.
- Rows with count greater than 1 render count and multiplied value.

Relationships:

- Represents one or more `Meal Entry` rows from the same day.
- Edit/delete actions map back to all represented IDs.

State transitions:

- Recomputed whenever selected-day meals change.
- Splits automatically when an edit makes one represented row differ from another.
- Disappears when all represented rows are deleted.
