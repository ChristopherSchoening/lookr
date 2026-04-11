# Feature Specification: Meal Name Suggestions

**Feature Branch**: `006-meal-suggestions`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "when entering a name when adding meals it should be searched for previously added meals to easily add meals that are eaten regularly (suggestions should not be duplicated). the search should be efficient (require at least 3 characters and performed after a small debounce). when selecting a previously had meal then the points for it and the type are also applied to the edit/add form."

## Clarifications

### Session 2026-04-11

- Q: How should meal name matching work for suggestions? → A: Match only from the start of the meal name.
- Q: How should matching suggestions be ordered? → A: Sort suggestions by most recent use first.
- Q: How many suggestions should be shown at once? → A: Show up to 5 suggestions.
- Q: When should suggestions appear in edit mode? → A: Show suggestions only after the user changes the meal name.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reuse Frequent Meals Faster (Priority: P1)

A user starts typing a meal name in the meal form and gets a short list of matching meals they have logged before, so regular meals can be added without retyping full details.

**Why this priority**: Repeated meal entry is a common task. Faster reuse reduces friction in the core logging flow.

**Independent Test**: Can be fully tested by logging prior meals, opening the meal form, typing at least three characters from a known meal name, and confirming matching suggestions appear only after a brief pause.

**Acceptance Scenarios**:

1. **Given** a user has previously logged meals, **When** they type fewer than three characters into the meal name field, **Then** no prior-meal suggestions are shown.
2. **Given** a user has previously logged meals, **When** they type at least three characters that match the start of one or more prior meal names and then pause briefly, **Then** matching suggestions are shown for reuse.
3. **Given** a user has multiple prior meals with the same meal name, **When** matching suggestions are shown, **Then** that meal name appears only once in the suggestion list.
4. **Given** multiple matching meal suggestions exist, **When** suggestions are shown, **Then** the most recently used matching meal appears first.
5. **Given** more than five matching meal suggestions exist, **When** suggestions are shown, **Then** only the first five matching suggestions are displayed.

**Automated Proof**: Extend existing Playwright meal add or edit coverage to assert the minimum character threshold, delayed suggestion display, and duplicate-free suggestion list.

---

### User Story 2 - Apply Saved Meal Details From a Suggestion (Priority: P2)

A user selects a suggested prior meal and the meal form fills in the saved points and meal type from that earlier meal, so they can confirm or adjust rather than entering everything again.

**Why this priority**: Suggestions only save meaningful effort if choosing one also restores the values most users expect to repeat.

**Independent Test**: Can be fully tested by selecting a displayed suggestion and verifying the meal name, points, and meal type populate the current form before save.

**Acceptance Scenarios**:

1. **Given** the user opens the edit form for an existing meal, **When** they do not change the current meal name, **Then** no prior-meal suggestions are shown just from opening edit mode.
2. **Given** a matching prior meal suggestion is shown, **When** the user selects it, **Then** the current meal form updates to the suggested meal name.
3. **Given** a selected suggestion has saved points, **When** the suggestion is applied, **Then** those points populate the current meal form.
4. **Given** a selected suggestion has a saved meal type, **When** the suggestion is applied, **Then** that meal type populates the current meal form.
5. **Given** a user selects a suggestion and then changes the populated values, **When** they continue editing, **Then** the form remains editable before save.

**Automated Proof**: Extend Playwright meal form coverage to assert suggestion selection hydrates the form with the prior meal values and still allows manual edits.

---

### User Story 3 - Keep Suggestions Relevant and Predictable (Priority: P3)

A user sees only meaningful prior-meal matches, with no noisy duplicates and no automatic updates while they are still actively typing.

**Why this priority**: Suggestion quality matters. If the list is noisy or jumps too early, it slows the user instead of helping.

**Independent Test**: Can be fully tested by entering text quickly, pausing, and confirming suggestions appear only after the pause and reflect distinct prior meal names.

**Acceptance Scenarios**:

1. **Given** a user types continuously in the meal name field, **When** they have not yet paused briefly, **Then** the suggestion list does not refresh mid-typing.
2. **Given** prior meals exist with the same name but different capitalization or spacing, **When** a matching search is performed against the start of meal names, **Then** the suggestion list still shows one distinct suggestion for that meal name.
3. **Given** no prior meal names match the typed text, **When** the user pauses after typing at least three characters, **Then** no stale or unrelated suggestions are shown.

**Automated Proof**: Extend Playwright meal suggestion coverage to assert delayed refresh behavior, normalized duplicate handling, and empty-state behavior for no matches.

---

### Edge Cases

- What happens when the user types one or two characters? The form should behave like normal text entry and show no prior-meal suggestions.
- What happens when prior meals share the same name but have different saved points or meal types? Only one suggestion should be shown for that meal name, and the selected values should come from the most recently logged matching meal.
- What happens when a prior meal has no saved meal type? Selecting that suggestion should populate the name and points while leaving meal type unset.
- What happens when the user opens edit mode for an existing meal but does not intend to rename it? No suggestion list should appear until the meal name is changed.
- What happens when the user selects a suggestion and then keeps typing? The field and related values should remain editable.
- What happens when there are no prior matches after the user pauses? The suggestion list should remain hidden or empty without disrupting manual entry.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST search previously logged meals while the user enters a meal name in the meal add and meal edit form.
- **FR-002**: The system MUST NOT begin searching for prior meals until the user has entered at least three characters in the meal name field.
- **FR-003**: The system MUST wait for a short typing pause before showing or refreshing prior-meal suggestions.
- **FR-004**: The system MUST show only prior meals whose names match the entered text from the start of the meal name.
- **FR-005**: The system MUST present each matching meal name only once in the suggestion list, even if that meal was logged multiple times before.
- **FR-006**: The system MUST treat visually duplicate meal names as the same suggestion when they differ only by capitalization or extra surrounding spaces.
- **FR-006a**: The system MUST order matching suggestions by most recent use first.
- **FR-006b**: The system MUST show no more than five matching suggestions at one time.
- **FR-007**: When a user selects a prior-meal suggestion, the system MUST apply that meal name to the current form.
- **FR-008**: When a user selects a prior-meal suggestion, the system MUST apply the saved points from that prior meal to the current form.
- **FR-009**: When a user selects a prior-meal suggestion, the system MUST apply the saved meal type from that prior meal to the current form when one exists.
- **FR-010**: When a user selects a prior-meal suggestion whose prior meal has no meal type, the system MUST leave the current meal type unset.
- **FR-011**: After a suggestion is applied, the system MUST allow the user to continue editing the meal name, points, and meal type before saving.
- **FR-012**: If multiple prior meals collapse into one suggestion, the system MUST use the most recently logged matching meal as the source of the applied points and meal type.
- **FR-013**: If no prior meals match the entered text after the user pauses, the system MUST show no suggestions rather than unrelated or stale results.
- **FR-013a**: In edit mode, the system MUST NOT show suggestions for the existing meal name until the user changes the meal name field.
- **FR-014**: The feature MUST extend the existing meal form workflow and automated user-flow coverage rather than creating a separate meal reuse flow.

### Key Entities _(include if feature involves data)_

- **Meal Entry**: A logged meal record containing the meal name, points, optional meal type, and the timing needed to determine which matching meal is most recent.
- **Meal Suggestion**: A distinct reusable prior meal name shown while entering a meal, backed by the most recently logged matching meal for value population.
- **Meal Form Session**: The active add or edit interaction where a user types a meal name, reviews suggestions, optionally applies one, and can still adjust the resulting values.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In verification of the meal form, users receive no prior-meal suggestions in 100% of test runs until at least three characters are entered.
- **SC-002**: In verification of repeated meal entry, users can surface matching prior meals after a brief typing pause and select one without leaving the current form.
- **SC-003**: In verification with repeated historical meals, each distinct prior meal name appears no more than once in the suggestion list.
- **SC-004**: In verification of suggestion selection, the applied points and meal type always match the most recently logged meal behind the selected suggestion in 100% of covered cases.
- **SC-005**: In verification of the assisted entry flow, users can reuse a prior meal and reach a ready-to-save form state in fewer interactions than manually re-entering meal name, points, and meal type.
- **SC-006**: In verification of manual override behavior, users remain able to change any populated value after selecting a suggestion in 100% of covered cases.

## Assumptions

- The existing product already has one shared meal form for add and edit actions, and this feature extends that same flow.
- Prior meal suggestions are based only on meals the current user has already logged in the app.
- When duplicate historical meal names exist, collapsing them into one suggestion backed by the most recent matching meal is acceptable product behavior.
- A short typing pause is sufficient for users to perceive suggestions as responsive without interrupting manual entry.
- Existing Playwright meal logging coverage will be extended instead of introducing a separate parallel test surface for this workflow.
