# Data Model: Daily Limit Adherence

## User Profile

**Purpose**: Existing single-row local profile that stores the latest active
daily point limit for first-load and current-day views.

**Fields**

- `dailyPointsLimit`: latest saved positive numeric daily point limit,
  including whole numbers or decimals
- `updatedAt`: timestamp of the latest profile save

**Behavioral Rules**

- Still represents the current active limit for the app.
- Saving a new daily limit updates this row and also writes a dated history
  record.
- Initial setup from Progress creates both the profile row and the first
  effective-limit history record.

## Daily Point Limit Change

**Purpose**: New persisted history record that defines which daily point limit
is effective from a specific date forward until replaced.

**Fields**

- `id`: unique row identifier
- `effectiveDate`: date key in `YYYY-MM-DD` form for when the limit starts
- `dailyPointsLimit`: positive numeric daily limit active from that date,
  including whole numbers or decimals
- `createdAt`: timestamp when the change was saved

**Validation Rules**

- `dailyPointsLimit` must be a positive finite numeric value and must preserve
  valid decimal input without rounding.
- `effectiveDate` must be a valid local app date key.
- Multiple rows may share the same `effectiveDate`; the latest saved row for
  that date wins.

**Behavioral Rules**

- A same-day limit change writes a row whose `effectiveDate` is today and
  applies to the whole current day.
- A future day resolves to the latest change whose `effectiveDate` is on or
  before that future date.
- A past day resolves to the latest change whose `effectiveDate` is on or
  before that past date.

## Meal Entry

**Purpose**: Existing persisted meal record used to calculate point totals for a
calendar day.

**Fields Used**

- `id`
- `mealName`
- `points`
- `entryDate`
- `entryTime`
- `mealType`
- `createdAt`
- `updatedAt`

**Behavioral Rules**

- Meal rows do not store a copied daily limit.
- Editing a past meal or deleting a past meal recalculates that day's summary
  against the limit active on that past date.
- Same-day meal changes always use the current effective limit for today.

## Tracked Day Summary

**Purpose**: Derived aggregate used by Home, History, and Progress for a single
calendar day.

**Fields**

- `date`
- `dailyLimit`
- `consumedPoints`
- `remainingPoints`
- `mealCount`
- `status`

**Validation Rules**

- `dailyLimit` is resolved from historical limit changes, not assumed from the
  latest profile row.
- `status` remains one of `empty`, `within`, or `over`.
- `mealCount` is derived from meals for `date`.

**Behavioral Rules**

- `remainingPoints = dailyLimit - consumedPoints`.
- `remainingPoints` preserves decimal results when the effective daily limit or
  consumed points include decimals.
- `status = empty` when `mealCount` is zero.
- `status = over` when `remainingPoints < 0`.
- `status = within` when `mealCount > 0` and `remainingPoints >= 0`.
- Past-day status stays historically correct after later limit changes because
  the resolved `dailyLimit` for that date does not change unless an earlier
  effective-limit row is edited through future product work.

## Adherence Summary

**Purpose**: Derived aggregate shown on Progress that counts tracked days within
their effective daily limit.

**Fields**

- `trackedDays`: count of days where `mealCount > 0`
- `withinDays`: count of tracked days where `status = within`
- `includesToday`: derived flag when today has tracked meals and is part of the
  current adherence count

**Behavioral Rules**

- Current day counts immediately when it has tracked meals and is within the
  current effective limit.
- Empty days stay outside adherence counts unless existing rules already define
  them differently.
- Changing today's limit can increase or decrease `withinDays` immediately.

## Relationships

- One `User Profile` has many `Daily Point Limit Change` records over time.
- One `Tracked Day Summary` derives from many `Meal Entry` rows for one date
  plus the most recent `Daily Point Limit Change` effective on or before that
  date.
- One `Adherence Summary` derives from many `Tracked Day Summary` records.
