# Tasks: History Date Picker

**Input**: Design documents from `/specs/007-history-date-picker/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Verification tasks are REQUIRED for every user story or fix that
changes user-visible behavior, business rules, or shared workflows. Include
automated checks when the project supports them and explicit manual acceptance
steps for all affected stories. Acceptance criteria for user-facing flows MUST
have traceable end-to-end coverage or an approved documented gap.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
Implementation tasks SHOULD favor extending existing files or modules when that
keeps the design readable; introduce new files only when they improve clarity
or reuse enough to justify the added surface area.
Small changes SHOULD extend existing tests before adding new test files,
helpers, or suites.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align feature docs, current History flow, and existing test touchpoints before implementation starts

- [x] T001 Review and align feature docs in `specs/007-history-date-picker/spec.md`, `specs/007-history-date-picker/plan.md`, `specs/007-history-date-picker/contracts/history-date-picker-contract.md`, and `specs/007-history-date-picker/quickstart.md`
- [x] T002 Inspect current History selection and correction flow in `src/app/(tabs)/history.tsx`, `src/components/date-navigator.tsx`, `src/context/app-data.tsx`, `e2e/helpers/history-page.ts`, and `e2e/specs/history-regression.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared date-selection plumbing and test hooks required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add month-grid and date-range helper utilities for History picker behavior in `src/lib/date.ts`
- [x] T004 Add derived tracked-date lookup support for History picker state in `src/context/app-data.tsx`
- [x] T005 Refactor `DateNavigator` into a selectable date-picker surface with stable test IDs in `src/components/date-navigator.tsx`
- [x] T006 [P] Extend History Playwright page helpers for date-picker interactions and empty-day assertions in `e2e/helpers/history-page.ts`
- [x] T007 [P] Update History fixture expectations and seeded date coverage in `e2e/fixtures/seed-states.ts` and `e2e/specs/history-regression.spec.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Pick Logged Days Faster (Priority: P1) 🎯 MVP

**Goal**: Replace the tracked-day card list with one picker that opens on today and jumps cleanly to tracked dates

**Independent Test**: Open History with several logged days, confirm the old tracked-day card selector is gone, confirm today is selected on entry, then pick a tracked date and verify its summary and meals render in place.

### Verification for User Story 1 ⚠️

- [x] T008 [P] [US1] Extend tracked-date picker acceptance coverage in `e2e/specs/history-regression.spec.ts`
- [x] T009 [US1] Document manual picker-entry and tracked-date review steps in `specs/007-history-date-picker/quickstart.md`

### Implementation for User Story 1

- [x] T010 [US1] Replace the History tracked-day card selector with the new date picker in `src/app/(tabs)/history.tsx`
- [x] T011 [US1] Wire today-default selection and selected-date display behavior in `src/app/(tabs)/history.tsx` and `src/components/date-navigator.tsx`
- [x] T012 [US1] Render tracked-date summary and meal list updates from picker selection in `src/app/(tabs)/history.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Avoid Empty-Day Selection Mistakes (Priority: P2)

**Goal**: Keep empty dates selectable while making tracked dates visually easier to spot

**Independent Test**: Open the picker on a month with tracked and empty dates, confirm tracked dates are more prominent, pick an empty date, and confirm the selected date remains reachable without implying meals already exist there.

### Verification for User Story 2 ⚠️

- [x] T013 [P] [US2] Extend tracked-versus-empty date emphasis coverage in `e2e/specs/history-regression.spec.ts`
- [x] T014 [US2] Document manual visual review steps for tracked-date emphasis and empty-date selection in `specs/007-history-date-picker/quickstart.md`

### Implementation for User Story 2

- [x] T015 [US2] Add tracked-date, empty-date, selected-date, and today visual states to the picker in `src/components/date-navigator.tsx`
- [x] T016 [US2] Feed tracked-date and empty-date state from app data into History picker rendering in `src/app/(tabs)/history.tsx` and `src/context/app-data.tsx`
- [x] T017 [US2] Ensure empty dates stay selectable without disabled treatment in `src/components/date-navigator.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Keep Meal Corrections Flow Intact (Priority: P3)

**Goal**: Preserve edit, add, and delete meal corrections after switching to the new picker, including empty-day behavior

**Independent Test**: Select a tracked date from the picker, edit and delete meals, confirm totals refresh in place, then select an empty date and confirm the chosen date stays visible with add-meal controls available.

### Verification for User Story 3 ⚠️

- [x] T018 [P] [US3] Extend correction-flow and empty-day acceptance coverage in `e2e/specs/history-regression.spec.ts`
- [x] T019 [US3] Document manual correction-flow and empty-day review steps in `specs/007-history-date-picker/quickstart.md`

### Implementation for User Story 3

- [x] T020 [US3] Keep `MealEditor` corrections wired to the selected picker date in `src/app/(tabs)/history.tsx`
- [x] T021 [US3] Add empty-day state with add-meal availability for selected dates without meals in `src/app/(tabs)/history.tsx` and `src/components/meal-editor.tsx`
- [x] T022 [US3] Refresh picker emphasis, summary state, and empty-day transitions after add, edit, and delete actions in `src/app/(tabs)/history.tsx` and `src/context/app-data.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cross-story cleanup

- [x] T023 [P] Capture touched-platform review notes for web, iOS, and Android History picker behavior in `specs/007-history-date-picker/quickstart.md`
- [x] T024 Run full verification commands and record outcomes in `specs/007-history-date-picker/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if staffed
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 because the picker structure and selected-date behavior must exist before tracked-versus-empty emphasis can be finalized
- **User Story 3 (P3)**: Depends on User Story 1 and User Story 2 because correction flows must be validated against the final picker and empty-day presentation

### Within Each User Story

- Verification tasks MUST be defined before implementation begins
- Each feature or fix MUST add or update at least one test tied to the changed behavior
- Acceptance criteria for user-facing work MUST map to end-to-end coverage
- Small changes SHOULD extend existing tests before creating parallel coverage
- Prefer extending existing code before adding parallel modules or abstractions
- Picker state and test hooks before route-level integration
- Core selection behavior before visual emphasis tuning
- Correction-flow refresh handling before final sign-off
- Manual acceptance and UX consistency review before sign-off

### Parallel Opportunities

- `T006` and `T007` can run in parallel after `T003` to `T005`
- In US1, `T008` and `T009` can run in parallel before `T010` to `T012`
- In US2, `T013` and `T014` can run in parallel before `T015` to `T017`
- In US3, `T018` and `T019` can run in parallel before `T020` to `T022`
- `T023` and `T024` can run in parallel after implementation is complete

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together:
Task: "Extend tracked-date picker acceptance coverage in e2e/specs/history-regression.spec.ts"
Task: "Document manual picker-entry and tracked-date review steps in specs/007-history-date-picker/quickstart.md"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 verification work together:
Task: "Extend tracked-versus-empty date emphasis coverage in e2e/specs/history-regression.spec.ts"
Task: "Document manual visual review steps for tracked-date emphasis and empty-date selection in specs/007-history-date-picker/quickstart.md"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 verification work together:
Task: "Extend correction-flow and empty-day acceptance coverage in e2e/specs/history-regression.spec.ts"
Task: "Document manual correction-flow and empty-day review steps in specs/007-history-date-picker/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run tracked-date picker checks independently
5. Demo or ship the MVP slice if ready

### Incremental Delivery

1. Complete Setup + Foundational → picker plumbing and test hooks ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish with Phase 6 verification and touched-platform review notes

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 picker structure and today-default behavior
   - Developer B: User Story 2 tracked-versus-empty visual emphasis
   - Developer C: User Story 3 correction-flow refresh and empty-day handling
3. Merge stories in priority order and finish with shared verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify planned checks run before marking a story complete
- Keep new code concise and readable; split modules only when it reduces complexity for the story being delivered
- Extend existing Playwright coverage and helpers before creating new test files
- Commit after each task or logical group
