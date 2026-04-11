# UI Contract: Meal Name Suggestions

## Scope

This contract defines the visible suggestion behavior for the shared meal modal
used by Home and History.

## Suggestion Trigger Contract

### Entry Rules

- Add mode may show suggestions while the user types in the meal name field
- Edit mode must not show suggestions on initial open for the existing meal
  name
- Edit mode may show suggestions only after the user changes the meal name
- Suggestions require at least three typed characters
- Suggestions refresh only after a short typing pause

### Matching Rules

- Matching is prefix-only from the start of the stored meal name
- Matching ignores capitalization differences and extra surrounding spaces when
  collapsing duplicates
- Only distinct normalized meal names may appear in the rendered list
- Suggestions are ordered by most recent use first
- At most five suggestions may be shown at one time

### Empty And Quiet States

- No suggestion list is shown before the three-character threshold
- No stale suggestion list remains visible when the current text has no matches
- No suggestion list appears in edit mode until the meal name changes

## Suggestion Selection Contract

- Selecting a suggestion updates the current meal name field to the suggestion
  name
- Selecting a suggestion populates the current points field from the most
  recent matching meal behind that suggestion
- Selecting a suggestion populates the current meal type when the source meal
  has one
- Selecting a suggestion whose source meal has no meal type leaves meal type
  unset
- After selection, the user may still edit meal name, points, and meal type
  before saving

## Acceptance-Oriented Test Hooks

- Existing meal modal test IDs should stay stable where practical
- Additional test IDs may be added only where needed to prove:
  - suggestion list visibility
  - suggestion row ordering
  - suggestion row selection
  - edit-mode suppression before meal-name changes
  - no-results behavior after an unmatched prefix
