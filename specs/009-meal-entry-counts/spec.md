# Feature Specification: Meal Entry Counts

**Feature Branch**: `009-meal-entry-counts`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "when adding meals there should be an option for adding it multiple times in one go. in the meal history multiple exact entries shoud be combined - a number should indicate the amount and the amount should multiply the meals value in the ui."

## Clarifications

### Session 2026-04-25

- Q: How should saving a meal with count greater than 1 be represented in storage? → A: Save multiple separate meal entries; history grouping counts exact matches.
- Q: When editing a combined history row, how should count changes be applied? → A: Editing count adjusts duplicate entries to equal the new count.
- Q: What maximum meal count should be allowed per save or edit? → A: Maximum count 99 per save/edit.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add One Meal More Than Once (Priority: P1)

A user logging food can set how many identical copies of the meal they want to add before saving, so repeated servings or repeated identical meals do not require separate manual entries.

**Why this priority**: This is the main user value. It reduces repeated logging work while preserving the same totals users expect from separate entries.

**Independent Test**: Can be fully tested by adding a meal with a count greater than one and confirming the logged meal contributes the meal value multiplied by that count.

**Acceptance Scenarios**:

1. **Given** a user is adding a meal with a value of 4, **When** they set the count to 3 and save, **Then** the app records three separate identical meal entries and shows a total contribution of 12 wherever meal totals are shown.
2. **Given** a user is adding a meal, **When** they leave the count at 1 and save, **Then** the meal behaves the same as a normal single meal entry.
3. **Given** a user is adding a meal, **When** they try to use a count below 1, above 99, or a non-whole number, **Then** the app prevents saving that count and guides the user back to a valid whole-number count.

**Automated Proof**: Extend meal logging flow coverage to add one meal with a count greater than one and verify the multiplied value in the visible totals.

---

### User Story 2 - See Combined Exact Meals In History (Priority: P2)

A user reviewing meal history sees repeated exact meals as one combined row with a visible count, so the history stays compact without hiding the amount eaten.

**Why this priority**: This keeps the history readable after repeat logging and makes the repeated amount clear at a glance.

**Independent Test**: Can be fully tested by creating multiple exact meal entries for the same history day and confirming the history shows one row with the correct count and multiplied value.

**Acceptance Scenarios**:

1. **Given** a history day contains three exact entries for "Lunch" with a value of 5, **When** the user opens that day in history, **Then** the history shows one "Lunch" row with a count of 3 and a displayed value of 15.
2. **Given** a history day contains meals with the same name but different values, types, or notes, **When** the user opens that day in history, **Then** those meals remain separate rows because they are not exact matches.
3. **Given** a history day contains a mix of single meals and repeated exact meals, **When** the user opens that day in history, **Then** single meals show without a repeat count and repeated meals show with their count.

**Automated Proof**: Extend history flow coverage to verify exact repeated meals combine into one row with count and multiplied value.

---

### User Story 3 - Manage Combined History Entries (Priority: P3)

A user can still edit or remove meals from history when exact meals are combined, with the action applying clearly to the displayed combined amount.

**Why this priority**: History already supports meal correction. Combining rows must not make corrections confusing or impossible.

**Independent Test**: Can be fully tested by opening a combined history row, changing or removing it, and confirming the visible count, value, and day totals update consistently.

**Acceptance Scenarios**:

1. **Given** a combined history row represents four exact meal entries, **When** the user removes that row, **Then** all four represented entries are removed from the day totals.
2. **Given** a combined history row represents multiple exact meal entries, **When** the user edits the meal details or count, **Then** the app updates the represented entries so the row and totals match the edited grouped amount.

**Automated Proof**: Extend history edit or remove coverage to include one combined row.

### Edge Cases

- Count must default to 1 for all meal-add flows so existing logging behavior remains unchanged unless the user chooses a larger count.
- Counts above 99 must be rejected before saving or editing.
- Existing repeated exact meals already in history must display as combined rows after the feature is available.
- Exact matching must only combine entries from the same history day; repeated meals across different days remain on their own days.
- Exact matching must not combine meals when any user-visible meal detail differs, including name, value, meal type, date, or notes.
- Day totals, progress totals, and any visible meal-value summaries must use the multiplied value, not the base single-meal value.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users MUST be able to choose a whole-number meal count when adding a meal.
- **FR-002**: The meal count MUST default to 1 and preserve the current single-meal add behavior when the user does not change it.
- **FR-003**: The system MUST reject invalid meal counts, including zero, negative values, blank values, and non-whole numbers.
- **FR-004**: The system MUST reject meal counts above 99 for both adding meals and editing combined history rows.
- **FR-005**: Saving a meal with a count greater than 1 MUST create that many separate exact meal entries.
- **FR-006**: Meal history MUST combine exact meal entries from the same history day into one visible row.
- **FR-007**: A combined history row MUST show the count derived from the number of exact separate meal entries represented by that row when the count is greater than 1.
- **FR-008**: A combined history row MUST display the meal value multiplied by the count, while single entries continue to show their normal value.
- **FR-009**: Meal history MUST keep entries separate when any user-visible meal detail differs, including name, value, meal type, date, or notes.
- **FR-010**: Editing or removing a combined history row MUST update the represented meal count and all affected visible totals consistently.
- **FR-011**: Editing the count for a combined history row MUST add or remove duplicate exact meal entries until the represented entry count equals the new whole-number count.
- **FR-012**: Existing repeated exact meal entries MUST be combined in history without requiring users to recreate them.
- **FR-013**: Automated coverage MUST verify adding a counted meal, viewing combined history rows, and preserving separate rows for non-exact meals.

### Key Entities

- **Meal Entry**: One logged meal instance with user-visible details such as name, value, meal type, date, and notes. Counted saves create multiple separate Meal Entry records rather than storing a count on one record.
- **Combined History Row**: A history display item representing one or more exact meal entries on the same day, with a count and multiplied value.
- **Meal Count**: A positive whole number chosen by the user to represent how many exact copies of a meal are added or displayed together.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can add three identical meals in one save action in under 15 seconds.
- **SC-002**: A history day with 10 exact repeated meal entries shows one combined row with count 10 and the correct multiplied value.
- **SC-003**: In user-flow validation, 100% of counted meal totals match the same result as adding the meal one at a time.
- **SC-004**: Users reviewing a day with repeated exact meals can identify both the count and multiplied value without opening a detail view.
- **SC-005**: Existing single-meal logging remains unchanged for count 1 in all covered add-meal flows.

## Assumptions

- Counts are positive whole numbers because the user asked to add the same meal multiple times, not partial servings.
- Exact entries means entries on the same history day with the same user-visible meal details: name, value, meal type, date, and notes.
- Counted meal behavior applies to existing add-meal flows, including suggested or manually entered meals if both are available.
- Combined history rows should reduce visual repetition but still preserve accurate totals and correction workflows.
- Counts above 99 are treated as invalid to prevent accidental bulk logging.
