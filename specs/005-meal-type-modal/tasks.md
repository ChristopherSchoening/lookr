# Tasks: Meal Type Modal Editing

**Input**: Design documents from `/specs/005-meal-type-modal/`
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

**Purpose**: Align existing meal flows and fixtures with the feature plan before schema and UI work starts

- [x] T001 Review and align feature docs in `specs/005-meal-type-modal/spec.md`, `specs/005-meal-type-modal/plan.md`, and `specs/005-meal-type-modal/quickstart.md`
- [x] T002 Inspect current meal flow touchpoints in `src/components/meal-editor.tsx`, `src/context/app-data.tsx`, `src/lib/db.ts`, `e2e/specs/dashboard-core.spec.ts`, and `e2e/specs/history-regression.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared data and fixture plumbing required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update meal type definitions in `src/lib/types.ts`
- [x] T004 Update SQLite schema, read/write paths, and seed support for optional `mealType` in `src/lib/db.ts`
- [x] T005 Update meal add/update context signatures in `src/context/app-data.tsx`
- [x] T006 [P] Extend seed builders for typed and legacy untyped meals in `e2e/fixtures/seed-states.ts`
- [x] T007 [P] Extend shared Playwright meal helpers for modal and meal-type interactions in `e2e/helpers/dashboard-page.ts` and `e2e/helpers/history-page.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add a Meal With Optional Type (Priority: P1) 🎯 MVP

**Goal**: Let users add meals in a dedicated modal and optionally save a meal type

**Independent Test**: Open Home, start add meal in a modal, save one meal with a type and one meal without a type, and confirm both save correctly with meal type shown as a small indicator when present

### Verification for User Story 1 ⚠️

- [x] T008 [P] [US1] Extend Home add-flow acceptance coverage in `e2e/specs/dashboard-core.spec.ts`
- [x] T009 [US1] Document manual Home modal and meal-indicator review steps in `specs/005-meal-type-modal/quickstart.md`

### Implementation for User Story 1

- [x] T010 [US1] Replace inline add-meal form with modal-backed add flow in `src/components/meal-editor.tsx`
- [x] T011 [US1] Add optional meal type selector and save handling to Home add flow in `src/components/meal-editor.tsx`
- [x] T012 [US1] Wire Home meal add entry point and small meal-type indicator usage in `src/app/(tabs)/index.tsx` and `src/components/meal-editor.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Edit Meals In the Same Modal (Priority: P2)

**Goal**: Reuse the same modal for meal edits and let users set, change, or clear meal type

**Independent Test**: Open History, edit an existing meal through the shared modal, change the meal type once, clear it on another save, and confirm the updated small indicator appears correctly on saved meal cards

### Verification for User Story 2 ⚠️

- [x] T013 [P] [US2] Extend History edit-flow acceptance coverage in `e2e/specs/history-regression.spec.ts`
- [x] T014 [US2] Document manual History shared-modal and small-indicator review steps in `specs/005-meal-type-modal/quickstart.md`

### Implementation for User Story 2

- [x] T015 [US2] Reuse the shared modal for edit mode with preload, clear, and cancel behavior in `src/components/meal-editor.tsx`
- [x] T016 [US2] Update meal card rendering and edit triggers for meal type visibility in `src/components/meal-editor.tsx`
- [x] T017 [US2] Wire History edit entry points to the shared modal flow in `src/app/(tabs)/history.tsx` and `src/components/meal-editor.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Keep Existing Meals Working After Upgrade (Priority: P3)

**Goal**: Preserve legacy meals without a type so they remain viewable and editable after the schema change

**Independent Test**: Seed legacy untyped meals, load them in the app, confirm they render without placeholder text, then edit and save one through the shared modal without data loss

### Verification for User Story 3 ⚠️

- [x] T018 [P] [US3] Extend legacy migration acceptance coverage in `e2e/specs/dashboard-core.spec.ts` and `e2e/specs/history-regression.spec.ts`
- [x] T019 [US3] Document manual legacy-meal migration checks in `specs/005-meal-type-modal/quickstart.md`

### Implementation for User Story 3

- [x] T020 [US3] Harden database migration and legacy row mapping for unset `mealType` in `src/lib/db.ts`
- [x] T021 [US3] Preserve legacy edit and display behavior for untyped meals in `src/components/meal-editor.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cross-story cleanup

- [x] T022 [P] Capture touched-platform UI evidence for Home and History modal flows in `specs/005-meal-type-modal/quickstart.md`
- [x] T023 Run full verification commands and record outcomes in `specs/005-meal-type-modal/quickstart.md`

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
- **User Story 2 (P2)**: Depends on User Story 1 because the shared modal add flow establishes the modal structure reused by edit mode
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) and should land after US1 and US2 so migration checks validate the final shared modal and display behavior

### Within Each User Story

- Verification tasks MUST be defined before implementation begins
- Each feature or fix MUST add or update at least one test tied to the changed behavior
- Acceptance criteria for user-facing work MUST map to end-to-end coverage
- Small changes SHOULD extend existing tests before creating parallel coverage
- Prefer extending existing code before adding parallel modules or abstractions
- Data and test plumbing before modal integration
- Modal implementation before route wiring
- Manual acceptance and UX consistency review before sign-off

### Parallel Opportunities

- `T006` and `T007` can run in parallel after `T003` to `T005`
- In US1, `T008` and `T009` can run in parallel before `T010` to `T012`
- In US2, `T013` and `T014` can run in parallel before `T015` to `T017`
- In US3, `T018` and `T019` can run in parallel before `T020` and `T021`
- `T022` and `T023` can run in parallel after implementation is complete

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together:
Task: "Extend Home add-flow acceptance coverage in e2e/specs/dashboard-core.spec.ts"
Task: "Document manual Home modal and meal-indicator review steps in specs/005-meal-type-modal/quickstart.md"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 verification work together:
Task: "Extend History edit-flow acceptance coverage in e2e/specs/history-regression.spec.ts"
Task: "Document manual History shared-modal and small-indicator review steps in specs/005-meal-type-modal/quickstart.md"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 verification work together:
Task: "Extend legacy migration acceptance coverage in e2e/specs/dashboard-core.spec.ts and e2e/specs/history-regression.spec.ts"
Task: "Document manual legacy-meal migration checks in specs/005-meal-type-modal/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run Home modal add-flow checks independently
5. Demo or ship the MVP slice if ready

### Incremental Delivery

1. Complete Setup + Foundational → meal data and fixtures ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish with Phase 6 verification and evidence capture

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 modal add flow
   - Developer B: User Story 2 shared edit modal
   - Developer C: User Story 3 migration and legacy coverage
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
