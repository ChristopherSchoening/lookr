# Feature Specification: Meal Type Modal Editing

**Feature Branch**: `005-meal-type-modal`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "when adding a meal you should be able to optionally set a meal type (breakfast, lunch, dinner, snack). adding should be done in a seperate modal. use the same modal for editing existing meals. existing data should still work (migration)."

## Clarifications

### Session 2026-04-11

- Q: Where should saved meal type be shown outside the modal? → A: Show meal type in all meal displays, using a small indicator.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a Meal With Optional Type (Priority: P1)

A user starts a new meal entry and logs it in a dedicated modal that includes an optional meal type choice for breakfast, lunch, dinner, or snack, with the saved type later shown as a small indicator anywhere that meal is displayed.

**Why this priority**: Meal entry is the main tracking flow. Users need the new meal type field during creation without making the base add flow harder for users who do not want to set a type.

**Independent Test**: Can be fully tested by opening the add meal flow, confirming it appears in a separate modal, saving one meal with a selected type, and saving another meal without a type.

**Acceptance Scenarios**:

1. **Given** a user starts adding a meal, **When** the add flow opens, **Then** the meal form appears in a separate modal instead of inline on the screen.
2. **Given** a user is adding a meal in the modal, **When** they choose one of the supported meal types and save, **Then** the meal is stored with that type and shown back with the saved entry as a small indicator wherever that meal is displayed.
3. **Given** a user is adding a meal in the modal, **When** they leave meal type unset and save, **Then** the meal is still saved successfully.

**Automated Proof**: Extend existing Playwright meal logging coverage to assert the add flow opens in a modal and supports both typed and untyped meal saves.

---

### User Story 2 - Edit Meals In the Same Modal (Priority: P2)

A user opens an existing meal for editing and uses the same modal form to change meal details, including setting, changing, or clearing the meal type, while the saved type remains visible as a small indicator in meal displays.

**Why this priority**: Reusing the same editing surface keeps meal maintenance consistent and avoids users learning two different forms for the same data.

**Independent Test**: Can be fully tested by opening an existing meal, verifying the edit flow uses the same modal layout, then updating the meal type and saving the change.

**Acceptance Scenarios**:

1. **Given** a user chooses to edit an existing meal, **When** the edit flow opens, **Then** it uses the same modal form pattern as add meal.
2. **Given** a user edits a meal that already has a meal type, **When** they save a different meal type, **Then** the updated type is shown on the saved meal as a small indicator anywhere that meal appears.
3. **Given** a user edits a meal, **When** they clear the meal type and save, **Then** the meal remains valid and is saved without a type.

**Automated Proof**: Extend existing Playwright history or meal edit coverage to assert the shared modal is used for editing and that meal type changes persist.

---

### User Story 3 - Keep Existing Meals Working After Upgrade (Priority: P3)

A user with meals logged before this feature can still view, edit, and keep those meals even when they do not already have a meal type assigned.

**Why this priority**: Existing user data must survive the feature rollout. Breaking older meal records would make the change unsafe.

**Independent Test**: Can be fully tested by loading pre-existing meals without a meal type, confirming they still appear normally, and editing one through the shared modal without data loss.

**Acceptance Scenarios**:

1. **Given** a user has meals created before meal type support exists, **When** the app loads after the feature is introduced, **Then** those meals remain visible and usable without requiring manual repair.
2. **Given** a user edits an older meal that has no meal type, **When** the edit modal opens, **Then** the meal loads successfully with meal type left unset.
3. **Given** a user saves an older meal without choosing a type, **When** the save completes, **Then** the meal remains valid and no existing meal data is lost.

**Automated Proof**: Extend Playwright seeded-data coverage or add focused migration coverage for older meals without a type.

---

### Edge Cases

- What happens when a user closes the add or edit modal without saving? No partial meal changes should be applied.
- What happens when an older meal has no meal type? It should continue to display and edit correctly with meal type treated as unset.
- What happens when a user switches between meal types before saving? Only the final selected value should be stored.
- What happens when a user removes a previously selected meal type during editing? The meal should save successfully as untyped.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST open meal creation in a separate modal instead of requiring the user to add a meal inline on the base screen.
- **FR-002**: The system MUST let users optionally assign one meal type when creating a meal.
- **FR-003**: The supported meal type values MUST be breakfast, lunch, dinner, and snack.
- **FR-004**: The system MUST allow users to save a meal without selecting any meal type.
- **FR-005**: The system MUST use the same modal form pattern for editing an existing meal as for creating a new meal.
- **FR-006**: When editing an existing meal, the system MUST show the meal's current meal type if one is already set.
- **FR-007**: When editing an existing meal, the system MUST allow users to set, change, or clear the meal type before saving.
- **FR-008**: The system MUST preserve existing meal records created before meal type support so they remain viewable and editable after the feature is introduced.
- **FR-009**: Existing meals without a meal type MUST remain valid records and MUST NOT require users to backfill a type before viewing or saving them.
- **FR-010**: The system MUST keep all other stored meal details intact when older meal records are migrated to support optional meal type.
- **FR-011**: The system MUST show the saved meal type in all user-visible meal displays after add or edit actions succeed.
- **FR-012**: The system MUST present meal type as a small indicator so it confirms classification without overwhelming the main meal details.
- **FR-013**: The feature MUST extend existing meal management flows and automated coverage rather than creating a parallel add or edit workflow for the same records.

### Key Entities _(include if feature involves data)_

- **Meal Entry**: A logged meal record that stores the meal details users already track and now may also include an optional meal type.
- **Meal Type**: An optional meal classification assigned to a meal entry, limited to breakfast, lunch, dinner, or snack.
- **Meal Modal Session**: The temporary add or edit interaction where a user reviews meal fields, optionally sets a meal type, and either saves or cancels changes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In verification of the add flow, users can open the meal modal and save a new meal with a chosen type in one uninterrupted flow.
- **SC-002**: In verification of the add flow, users can save a new meal without a type and see the entry recorded successfully in 100% of test runs.
- **SC-003**: In verification of the edit flow, users can update the meal type of an existing meal from the shared modal in no more than 2 interactions after opening that meal for edit.
- **SC-004**: In verification with pre-existing meal data, 100% of seeded meals without a type remain viewable and editable after the feature is introduced.
- **SC-005**: In verification of meal details after save, the stored meal type shown to the user always matches the last selection made before saving across all meal displays.
- **SC-006**: In visual verification of touched meal displays, the meal type indicator remains secondary to the main meal details and does not obscure meal name, points, or primary actions.

## Assumptions

- Meal creation and meal editing already exist in the product, and this feature changes the interaction pattern and stored meal metadata without changing the broader meal tracking purpose.
- Users need only one optional meal type per meal entry, not multiple tags or custom categories.
- Existing meals may have no meal type after rollout, and leaving them untyped is acceptable product behavior.
- The user wants meal type echoed anywhere a meal is displayed, but as a small secondary indicator rather than a dominant label.
- Existing automated meal logging and meal editing coverage will be extended to prove the new modal and migration behavior.
