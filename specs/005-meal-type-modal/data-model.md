# Data Model: Meal Type Modal Editing

## Meal Entry

**Purpose**: Canonical stored meal record used by Home, History, summaries, and
E2E seed state.

**Fields**

- `id`: numeric primary key
- `mealName`: user-entered meal name
- `points`: positive integer points value
- `entryDate`: tracked date key for grouping and summaries
- `entryTime`: display time for ordering and review
- `mealType`: optional classification with allowed values `breakfast`,
  `lunch`, `dinner`, `snack`, or unset
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

**Validation Rules**

- `mealName` is required and trimmed before save.
- `points` must stay a positive numeric value.
- `entryDate` cannot be in the future.
- `mealType` is optional.
- When provided, `mealType` must match one of the four supported values.

**Lifecycle Rules**

- New meals start in add mode with `mealType` unset unless the user selects one
  before saving.
- Existing meals load into edit mode with their stored `mealType` value or
  unset if the record predates the schema change.
- Clearing `mealType` during edit keeps the same meal record and updates only
  the optional classification state.

## Meal Modal Session

**Purpose**: Temporary interaction state for the shared add/edit modal.

**Fields**

- `mode`: `add` or `edit`
- `targetMealId`: selected meal id in edit mode, absent in add mode
- `mealNameDraft`: current typed meal name
- `pointsDraft`: current typed points string
- `mealTypeDraft`: selected type or unset
- `statusMessage`: success or error feedback shown after actions

**Behavioral Rules**

- The same field layout and validation rules apply in both modes.
- Closing or canceling the modal discards unsaved draft changes.
- Successful save closes or resets the modal and refreshes meal displays from
  persisted data.

## Daily Summary

**Purpose**: Existing per-day aggregate used on Home and History.

**Fields Used**

- `date`
- `dailyLimit`
- `consumedPoints`
- `remainingPoints`
- `mealCount`
- `status`

**Behavioral Rules**

- Meal type does not change how points totals are calculated.
- Add, edit, and delete actions continue to recalculate summaries from the same
  meal records after refresh.

## E2E Seed Meal

**Purpose**: Test-only seed representation used to preload app state for
Playwright flows.

**Fields**

- Existing meal seed fields remain unchanged
- `mealType`: optional seeded classification using the same allowed values as
  `MealEntry`

**Behavioral Rules**

- Seeded meals without `mealType` represent legacy data and must remain valid.
- Seeded meals with `mealType` prove add, edit, and display assertions without
  special-case test setup outside the existing seed pipeline.
