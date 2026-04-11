# Data Model: Simplified Tracking UI

This feature does not introduce new persisted entities. It changes how existing
entities are presented and edited inside the current tab flows.

## Meal Entry

**Purpose**: A logged meal record shown on Home and History and editable from
History.

**Existing Fields Used**

- `id`
- `date`
- `name`
- `points`
- time metadata already shown in History

**Behavioral Rules**

- Editing from History updates the same underlying meal record rather than
  creating a new one.
- Deleting from History removes the meal record and recalculates affected day
  totals.
- Home and History must reflect the updated points state after any edit or
  delete action.

## Daily Summary

**Purpose**: Aggregated per-day tracking data used for Home points overview,
History day cards, and adherence calculations.

**Existing Fields Used**

- `date`
- `consumedPoints`
- `dailyLimit`
- `remainingPoints`
- `mealCount`
- `status`

**Behavioral Rules**

- Home shows the compact points overview for the selected day.
- History summary cards remain selectable and must refresh after meal edits or
  deletion.
- No new summary states are introduced for this feature.

## Weight Entry

**Purpose**: Recorded weight value used on Progress for latest value, trend,
history, and change calculations.

**Existing Fields Used**

- `id`
- `entryDate`
- `weight`

**Behavioral Rules**

- Progress continues to allow one saved value per day through the existing save
  path.
- If at least two entries exist, Progress shows the change since the previous
  tracked entry.
- The trend visualization and logbook continue to read from the same stored
  entries; only surrounding explanatory copy is reduced.

## Navigation Tab Metadata

**Purpose**: Shared presentation metadata for the primary destinations.

**Fields**

- `routeName`: existing route key (`index`, `history`, `progress`)
- `label`: visible tab text (`Home`, `History`, `Progress`)
- `iconSet`: `MaterialCommunityIcons`
- `iconName`: canonical icon identifier

**Behavioral Rules**

- Metadata is owned by the shared tab layout.
- Labels and icons stay synchronized across all supported platforms.
- The metadata change does not alter route paths or persisted data.
