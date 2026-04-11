# Data Model: Meal Name Suggestions

## Meal Entry

**Purpose**: Canonical persisted meal record already used by Home, History,
summaries, and E2E seed state.

**Fields Used By This Feature**

- `id`: numeric primary key
- `mealName`: stored meal display name and source text for suggestion matching
- `points`: stored points value reused when a suggestion is selected
- `entryDate`: tracked day key
- `entryTime`: display time used with recency ordering
- `mealType`: optional stored meal type reused when a suggestion is selected
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

**Behavioral Rules**

- Meal records remain the single source of truth for suggestion lookup.
- No new persisted suggestion entity is added for this slice.
- The most recent matching meal record is the source used to populate points
  and meal type after suggestion selection.

## Meal Suggestion

**Purpose**: Derived, non-persisted suggestion row shown while the user edits
the meal name in the shared modal.

**Fields**

- `displayName`: visible meal name shown in the suggestion row
- `normalizedName`: trimmed and lowercased key used to collapse duplicates
- `sourceMealId`: id of the most recent matching meal behind the suggestion
- `sourcePoints`: points value copied into the form when selected
- `sourceMealType`: optional meal type copied into the form when selected
- `lastUsedAt`: recency value derived from meal ordering fields for sorting

**Validation Rules**

- Suggestions appear only when the current typed text has at least three
  characters and the user has paused briefly.
- Matching is prefix-only against the start of the meal name.
- Duplicate normalized names collapse into one suggestion.
- The rendered list contains no more than five suggestions.
- Suggestions are ordered by most recent use first.

## Meal Form Session

**Purpose**: Active shared add/edit modal state that combines user drafts,
suggestion visibility, and the selected source meal values.

**Fields**

- `mode`: `add` or `edit`
- `initialMealName`: original meal name in edit mode
- `mealNameDraft`: current typed meal name
- `pointsDraft`: current typed points string
- `mealTypeDraft`: current selected meal type or unset
- `hasEditedMealName`: whether the user has changed the meal name in edit mode
- `debouncedMealName`: stabilized meal name text used for lookup
- `visibleSuggestions`: bounded list of derived `MealSuggestion` rows

**Behavioral Rules**

- Add mode may surface suggestions once the threshold and debounce rules are
  met.
- Edit mode does not surface suggestions until `hasEditedMealName` becomes
  true.
- Selecting a suggestion updates `mealNameDraft`, `pointsDraft`, and
  `mealTypeDraft`, then still allows manual edits before save.
- If the chosen source meal has no meal type, `mealTypeDraft` remains unset.

## E2E Seed Meal

**Purpose**: Test-only seed representation used to preload repeated meal data
for Playwright acceptance coverage.

**Fields Used**

- Existing meal seed fields remain unchanged
- Repeated `mealName` values with different recency, points, or meal type to
  prove duplicate collapse and applied-value rules

**Behavioral Rules**

- Seeded duplicate names should be sufficient to prove dedupe, ordering, and
  most-recent-value hydration.
- Existing typed and untyped meal support remains valid while suggestion
  coverage is added.
