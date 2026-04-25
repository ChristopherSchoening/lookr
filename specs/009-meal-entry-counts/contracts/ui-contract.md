# UI Contract: Meal Entry Counts

## Shared Meal Editor

Surface:

- Home meal add flow.
- History meal add/edit flow.

Required controls:

- `meal-name-input`: existing meal name input.
- `meal-points-input`: existing points input.
- `meal-count-input`: count input, default `1`.
- `save-meal-button`: saves one or many represented meal entries.

Validation contract:

- Count accepts whole numbers from `1` to `99`.
- Count rejects blank, zero, negative, decimal, non-numeric, and values above `99`.
- Invalid count keeps the modal open and shows an inline error.
- Existing count `1` behavior remains unchanged.

Add contract:

- Saving count `N` inserts `N` separate exact meal entries.
- All inserted entries share meal name, points, entry date, meal type, and visible time.
- Dashboard consumed and remaining totals reflect all inserted entries.

Edit contract:

- Editing a single row updates one entry.
- Editing a combined history row opens with count equal to represented rows.
- Saving combined count `N` leaves exactly `N` matching represented entries after save.
- Changed meal details apply to all represented entries.

Delete contract:

- Deleting a single row deletes one entry.
- Deleting a combined history row deletes all represented entries.

## History Display

Grouping contract:

- Group only meals from the selected day.
- Group exact matches on user-visible meal details.
- Do not group meals when name, points, meal type, date, time, or notes differ.
- Existing duplicate rows group automatically when displayed.

Rendering contract:

- Count `1`: no count badge, points show base value.
- Count greater than `1`: show visible count and multiplied points.
- Summary card totals match the represented underlying entries.

Test IDs to keep stable or add:

- `meal-count-input`
- `meal-count-badge-<groupKey or representative id>`
- Existing `meal-entry-*`, `meal-points-*`, `edit-meal-*`, and `delete-meal-*` selectors remain usable for Playwright helpers.
