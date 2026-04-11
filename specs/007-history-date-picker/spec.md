# Feature Specification: History Date Picker

**Feature Branch**: `007-history-date-picker`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "the history tab should contain a date picker instead of a chip for every date with entries. picking dates without meal entries should not be possible or at least it should be easy to identify dates with meal entries over dates without"

## Clarifications

### Session 2026-04-12

- Q: Should users be able to pick dates without meal entries? → A: Yes. Empty dates stay selectable so users can add meals to them later, but tracked dates should be highlighted more strongly.
- Q: Which date should History select by default on open? → A: Default to today, even when today has no meals.
- Q: What should History show when the selected date has no meals? → A: Show the selected date plus an empty-day state, with add-meal controls still available.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Pick Logged Days Faster (Priority: P1)

A user opens the History tab and uses one date picker control instead of scanning a long stack of day cards, so they can jump to a tracked day faster.

**Why this priority**: Picking a day is the first step in the History flow. If day selection is slow or cluttered, edit and review work is slower too.

**Independent Test**: Can be fully tested by opening History with multiple logged days, opening the date picker, selecting a tracked date, and confirming that day's meals and summary load.

**Acceptance Scenarios**:

1. **Given** the user has logged meals on multiple dates, **When** they open the History tab, **Then** History shows a date picker for choosing a day instead of one selectable chip or card per logged date.
2. **Given** the user opens the History date picker, **When** they choose a date that has meal entries, **Then** the History view updates to show the summary and meals for that selected date.
3. **Given** the user opens the History tab, **When** today has no meal entries, **Then** the date picker defaults to today rather than jumping to the most recent tracked date.
4. **Given** the currently selected date is shown, **When** the user returns to the History tab during the same session, **Then** that selected date remains clearly shown in the date picker.

**Automated Proof**: Extend existing Playwright History coverage in `e2e/specs/history-regression.spec.ts` to assert date-picker selection of tracked days and removal of the old per-date selection surface.

---

### User Story 2 - Avoid Empty-Day Selection Mistakes (Priority: P2)

A user can quickly tell which dates actually contain meal entries while still being able to move to an empty day to add meals later, so the History flow stays focused without blocking future logging.

**Why this priority**: The feature is only useful if users can easily reach logged days and avoid confusion from empty dates.

**Independent Test**: Can be fully tested by opening the picker around dates with and without logged meals and confirming empty dates remain selectable while tracked dates are visually emphasized more strongly.

**Acceptance Scenarios**:

1. **Given** the user opens the History date picker, **When** dates with meal entries and dates without meal entries are shown together, **Then** dates with meal entries are easier to identify than dates without meal entries.
2. **Given** the user opens the History date picker, **When** they choose a date with no meal entries, **Then** that date can still be selected so meals can be added there later.
3. **Given** the date picker shows both tracked dates and empty dates, **When** the user views the picker, **Then** empty dates remain visibly lower emphasis than dates with meal entries.

**Automated Proof**: Extend Playwright History coverage to verify tracked dates are visually preferred and that empty dates remain selectable but clearly differentiated.

---

### User Story 3 - Keep Meal Corrections Flow Intact (Priority: P3)

A user still edits, adds, or removes meals for the chosen day after switching to the new date picker, so the History tab remains the place for corrections.

**Why this priority**: Date selection is only one part of the History flow. The change must not break the existing correction workflow.

**Independent Test**: Can be fully tested by selecting a tracked date through the picker and then editing or deleting a meal from that day.

**Acceptance Scenarios**:

1. **Given** the user selects a tracked date through the History date picker, **When** the date view updates, **Then** the meal correction controls for that day remain available.
2. **Given** the user edits or removes a meal after choosing a date through the picker, **When** the change is saved, **Then** the selected date stays in context and the refreshed History totals match the updated meals.
3. **Given** the user selects a date with no meal entries, **When** the empty-day view appears, **Then** the selected date remains visible and add-meal controls stay available for that date.

**Automated Proof**: Reuse and extend the current History regression flow in `e2e/specs/history-regression.spec.ts` so date-picker selection and meal correction are covered together.

---

### Edge Cases

- What happens when there is no meal history yet? History should still make it possible to choose a date for future meal entry without implying that any tracked day already exists, and it should keep add-meal controls available for the selected day.
- What happens when today has no meal entries but earlier dates do? The initial History selection should still land on today while making tracked dates easy to spot in the picker.
- What happens when only one date has meal entries? The date picker should still clearly show that one tracked date and let the user stay on it.
- What happens when meal entries are added or removed for the selected date while History is open? The picker state and visible History details should refresh so the selected date remains accurate.
- What happens when a previously selected date stops having any meal entries after deletions? History should keep that selected date visible, switch it to the empty-day state, and avoid showing stale tracked summaries.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST replace the current per-date History selection list with a date picker as the primary way to choose a day in the History tab.
- **FR-002**: The system MUST allow users to select any date that has one or more meal entries from the History date picker.
- **FR-003**: The system MUST update the History summary and meal list to match the currently selected date after a date is chosen from the picker.
- **FR-004**: The system MUST make dates with meal entries easier to identify than dates without meal entries within the History date picker.
- **FR-005**: The system MUST allow users to select dates without meal entries so they can add meals to those dates later.
- **FR-006**: The system MUST make dates without meal entries visually lower emphasis than dates with meal entries.
- **FR-007**: The system MUST keep the currently selected tracked date clearly visible after the user makes a selection.
- **FR-008**: When History opens, the system MUST default the selected date to today, even when today has no meal entries.
- **FR-009**: When no dates have meal entries, the system MUST avoid implying that any day is already tracked while still preserving access to date selection for future meal entry.
- **FR-010**: Meal edit, add, and delete actions from the selected History date MUST continue to work after this date selection change.
- **FR-010a**: When the selected date has no meal entries, the system MUST show an empty-day state for that date while keeping add-meal controls available in the same History flow.
- **FR-011**: After a meal change affects the selected date, the system MUST refresh the selected date's summary and meal list without losing the user's current History context.
- **FR-012**: If the selected date no longer has meal entries after a deletion, the system MUST keep that selected date visible and transition it to the empty-day state without showing stale tracked details.
- **FR-013**: The feature MUST extend the existing History flow and automated coverage rather than creating a separate History selection experience or parallel test suite.

### Key Entities _(include if feature involves data)_

- **Tracked Date**: A calendar date that has one or more meal entries and can be meaningfully selected in History.
- **Empty Date**: A calendar date with no meal entries that remains selectable for future meal logging but appears lower emphasis than tracked dates.
- **History Selection State**: The currently active date in the History tab that controls which summary and meals are shown for correction.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In verification of the History flow, users land on today on open in 100% of covered cases and can still reach a tracked day from the date picker without scanning a long list of date-specific selection cards.
- **SC-002**: In verification of the date picker, dates with meal entries are distinguishable from empty dates in 100% of covered cases.
- **SC-003**: In verification of supported picker behavior, users can still select an empty date for later meal entry in 100% of covered cases while tracked dates remain clearly more prominent.
- **SC-004**: In verification of History corrections, selecting a date through the picker still allows users to edit or remove meals for that day in 100% of covered cases.
- **SC-004a**: In verification of empty-day behavior, selecting a date with no meals still leaves the user on that chosen date with add-meal controls available in 100% of covered cases.
- **SC-005**: In verification after meal deletions, History never shows stale details for a date that no longer has meal entries.

## Assumptions

- The History tab remains the place where users review and correct logged meals for past days.
- The current History data source already knows which dates contain meal entries, so the new selection control can rely on that same source of truth.
- Empty dates remain selectable because users may want to navigate to a day before adding meals there later.
- History should open on today even when another date has the most recent logged meals.
- Existing Playwright History coverage will be extended instead of creating a new separate end-to-end suite for this change.
