# Data Model: History Date Picker

## History Selection State

**Purpose**: Canonical UI state that determines which day History is showing at
any moment.

**Fields**

- `selectedDate`: current date key in `YYYY-MM-DD` form
- `selectedMonth`: visible month window for the date picker grid
- `isTodaySelected`: derived flag for default-open behavior
- `hasTrackedMeals`: derived flag indicating whether `selectedDate` has one or
  more meals

**Behavioral Rules**

- History opens with `selectedDate` set to today.
- Selecting a new date updates `selectedDate` without leaving the History tab.
- If deletions remove the last meal from the selected date, the state remains
  valid and shifts that date into the empty-day presentation.
- If the picker month changes, the selected date remains stable until the user
  chooses another day.

## Picker Day Cell

**Purpose**: One visible date option inside the History picker.

**Fields**

- `date`: date key in `YYYY-MM-DD` form
- `isSelected`: whether this cell matches `selectedDate`
- `isToday`: whether this cell represents today
- `hasMeals`: whether one or more meal entries exist on this date
- `summaryStatus`: optional derived summary status (`empty`, `within`, `over`)
  when meals exist

**Validation Rules**

- Every rendered cell maps to one valid date.
- `hasMeals` is derived from current meal records, not stored separately.
- A cell may be both `isToday` and `hasMeals`, or neither.
- Empty dates remain selectable.

**Behavioral Rules**

- Cells with meals render with stronger emphasis than empty dates.
- The selected cell remains visibly distinct from all other cells.
- Empty cells never imply that meals already exist there.

## Daily Summary

**Purpose**: Existing aggregate used by History to show tracked-day totals.

**Fields Used**

- `date`
- `dailyLimit`
- `consumedPoints`
- `remainingPoints`
- `mealCount`
- `status`

**Behavioral Rules**

- When `selectedDate` has meals, the summary reflects that day's aggregate.
- When `selectedDate` has no meals, the History surface uses an empty-day state
  instead of showing a stale or fabricated summary card.
- Summary values continue to refresh after add, edit, or delete operations.

## Meal Entry

**Purpose**: Existing persisted meal record shown and edited from History.

**Fields Used**

- `id`
- `mealName`
- `points`
- `entryDate`
- `entryTime`
- `mealType`

**Behavioral Rules**

- Meal entries remain grouped by `entryDate`.
- Selecting an empty date yields an empty meal list but still allows add flow
  for that `entryDate`.
- Editing or deleting a meal updates both the meal list and any derived tracked
  state used by the picker.

## Derived Tracked Date Set

**Purpose**: Lightweight derived collection used to style tracked versus empty
dates in the picker.

**Fields**

- `date`
- `mealCount`
- `status`

**Behavioral Rules**

- Built from existing meal records or daily summaries already present in app
  state.
- Must stay in sync after every meal add, update, delete, and refresh.
- Exists only to drive picker emphasis and does not introduce new persisted
  storage.
