# Tasks: Meal Entry Counts

**Input**: Design documents from `/home/tanome/dev/lookr/specs/009-meal-entry-counts/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Required. The specification requires automated proof for counted add, grouped history display, and grouped edit/delete behavior. Extend existing Playwright coverage before adding new suites.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after shared foundations are complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or only defines verification.
- **[Story]**: User story label for story phases only.
- Every task includes an exact repository path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project harness and constraints before feature work.

- [x] T001 [P] Verify required scripts for `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, `npm run e2e:us1`, and `npm run e2e:us2` in `/home/tanome/dev/lookr/package.json`
- [x] T002 [P] Confirm `meal_entries` keeps no count column or migration for this feature in `/home/tanome/dev/lookr/src/lib/db.ts`
- [x] T003 [P] Review stable meal editor and history selectors from the UI contract against `/home/tanome/dev/lookr/specs/009-meal-entry-counts/contracts/ui-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and app contracts needed before story implementation.

**Critical**: No user story implementation starts until this phase is complete.

- [x] T004 Add `MealEditorInput` count support and grouped meal edit/delete callback types in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T005 Add app data context method signatures for counted add and grouped update/delete operations in `/home/tanome/dev/lookr/src/context/app-data.tsx`
- [x] T006 [P] Add `CombinedHistoryRow` and meal count related types in `/home/tanome/dev/lookr/src/lib/types.ts`
- [x] T007 [P] Add counted-meal and grouped-history seed fixtures in `/home/tanome/dev/lookr/e2e/fixtures/seed-states.ts`

**Checkpoint**: Shared contracts are ready. User stories can now proceed.

---

## Phase 3: User Story 1 - Add One Meal More Than Once (Priority: P1) MVP

**Goal**: A user can save one meal with a whole-number count so multiple separate identical meal entries are created in one action.

**Independent Test**: Add a 4-point meal with count 3 on Home, then verify consumed points increase by 12, remaining points decrease by 12, and the E2E snapshot contains three separate matching `meal_entries`.

### Verification for User Story 1

- [x] T008 [P] [US1] Extend `DashboardPage.addMeal` and add count fill/assert helpers using `meal-count-input` in `/home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts`
- [x] T009 [P] [US1] Add counted meal add and invalid count assertions to dashboard Playwright coverage in `/home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts`
- [x] T010 [US1] Add 009 feature scenario entries for counted add validation to `/home/tanome/dev/lookr/playwright/coverage.manifest.json`

### Implementation for User Story 1

- [x] T011 [US1] Add count state, default value `1`, reset behavior, and `meal-count-input` rendering to `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T012 [US1] Add count parser and validation for blank, zero, negative, decimal, non-numeric, and above-99 values in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T013 [US1] Pass validated count from add mode to `onAdd` while preserving count `1` behavior in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T014 [US1] Insert counted saves as N separate exact meal rows with one shared visible time in `/home/tanome/dev/lookr/src/context/app-data.tsx`
- [x] T015 [US1] Ensure snapshot row count and dashboard totals reflect separate counted entries through existing summary math in `/home/tanome/dev/lookr/src/context/app-data.tsx`

**Checkpoint**: User Story 1 is functional and testable on its own.

---

## Phase 4: User Story 2 - See Combined Exact Meals In History (Priority: P2)

**Goal**: A history day displays exact same-day duplicate meals as one row with a visible count and multiplied point value.

**Independent Test**: Seed one history day with three exact 5-point lunch entries and non-exact variants, then verify one combined row shows count 3 and 15 pt while variants remain separate.

### Verification for User Story 2

- [x] T016 [P] [US2] Add history helper assertions for combined row count badges and multiplied points in `/home/tanome/dev/lookr/e2e/helpers/history-page.ts`
- [x] T017 [P] [US2] Add grouped duplicate and non-exact variant Playwright assertions in `/home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts`
- [x] T018 [US2] Add 009 feature scenario entries for grouped history display to `/home/tanome/dev/lookr/playwright/coverage.manifest.json`

### Implementation for User Story 2

- [x] T019 [P] [US2] Add exact same-day grouping helper for `CombinedHistoryRow` in `/home/tanome/dev/lookr/src/app/(tabs)/history.tsx`
- [x] T020 [US2] Feed grouped rows into `MealEditor` for the selected history day in `/home/tanome/dev/lookr/src/app/(tabs)/history.tsx`
- [x] T021 [US2] Render count badges only for count greater than 1 with stable `meal-count-badge-*` test IDs in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T022 [US2] Render multiplied row points for grouped rows while single rows keep base points in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T023 [US2] Preserve separate rows when name, points, date, time, meal type, or future visible details differ in `/home/tanome/dev/lookr/src/app/(tabs)/history.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Manage Combined History Entries (Priority: P3)

**Goal**: A user can edit or delete a combined history row, and the action applies to all represented meal entries.

**Independent Test**: Open a combined history row, change its count and details, verify row count/value/day totals update, then delete the row and verify all represented entries are removed.

### Verification for User Story 3

- [x] T024 [P] [US3] Add history helper methods for editing count and deleting combined rows in `/home/tanome/dev/lookr/e2e/helpers/history-page.ts`
- [x] T025 [P] [US3] Add grouped edit count/details and grouped delete Playwright assertions in `/home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts`
- [x] T026 [US3] Add 009 feature scenario entries for grouped edit/delete behavior to `/home/tanome/dev/lookr/playwright/coverage.manifest.json`

### Implementation for User Story 3

- [x] T027 [US3] Open edit mode with grouped row count and representative meal details in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`
- [x] T028 [US3] Route grouped edit operations from history to the app data layer with represented meal IDs in `/home/tanome/dev/lookr/src/app/(tabs)/history.tsx`
- [x] T029 [US3] Reconcile grouped edits by updating existing represented rows and adding or deleting duplicate rows until requested count is reached in `/home/tanome/dev/lookr/src/context/app-data.tsx`
- [x] T030 [US3] Route grouped deletes from history to delete all represented meal IDs in `/home/tanome/dev/lookr/src/app/(tabs)/history.tsx`
- [x] T031 [US3] Implement grouped delete refresh and empty-day state updates in `/home/tanome/dev/lookr/src/context/app-data.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks, UX review, and documentation traceability.

- [x] T032 [P] Update manual acceptance notes for counted add, grouped display, grouped edit, and grouped delete in `/home/tanome/dev/lookr/specs/009-meal-entry-counts/quickstart.md`
- [x] T033 [P] Run `npm run lint` and record result for `/home/tanome/dev/lookr/package.json`
- [x] T034 [P] Run `npm run typecheck` and record result for `/home/tanome/dev/lookr/package.json`
- [x] T035 Run `npm run e2e:coverage` and confirm 009 scenarios are covered in `/home/tanome/dev/lookr/playwright/coverage.manifest.json`
- [x] T036 Run focused `npm run e2e:us1` and `npm run e2e:us2` for changed dashboard/history flows from `/home/tanome/dev/lookr/package.json`
- [x] T037 Review mobile-sized modal layout for count input and grouped badges in `/home/tanome/dev/lookr/src/components/meal-editor.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can be built after or alongside US1, but final validation needs counted or seeded duplicate rows.
- **User Story 3 (Phase 5)**: Depends on US2 grouped row representation.
- **Polish (Phase 6)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after Foundational. Suggested MVP.
- **US2 (P2)**: Independent through seed data after Foundational, but benefits from US1 counted rows in manual testing.
- **US3 (P3)**: Depends on grouped row identity from US2.

### Within Each User Story

- Verification tasks come before implementation tasks.
- Playwright helpers should be extended before specs that depend on them.
- Shared type and context signatures should be complete before component wiring.
- App data writes should be complete before relying on UI totals.

## Parallel Opportunities

- Setup tasks T001-T003 can run in parallel.
- Foundational tasks T006-T007 can run in parallel after T004-T005 are understood.
- US1 verification tasks T008-T009 can run in parallel before implementation.
- US2 verification tasks T016-T017 can run in parallel before implementation.
- US3 verification tasks T024-T025 can run in parallel before implementation.
- After Foundational, US1 and US2 can start in parallel if US2 uses seeded duplicates; US3 waits for US2 grouping.

## Parallel Example: User Story 1

```bash
Task: "Extend DashboardPage.addMeal and add count fill/assert helpers using meal-count-input in /home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts"
Task: "Add counted meal add and invalid count assertions to dashboard Playwright coverage in /home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add history helper assertions for combined row count badges and multiplied points in /home/tanome/dev/lookr/e2e/helpers/history-page.ts"
Task: "Add exact same-day grouping helper for CombinedHistoryRow in /home/tanome/dev/lookr/src/app/(tabs)/history.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "Add history helper methods for editing count and deleting combined rows in /home/tanome/dev/lookr/e2e/helpers/history-page.ts"
Task: "Route grouped edit operations from history to the app data layer with represented meal IDs in /home/tanome/dev/lookr/src/app/(tabs)/history.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 verification tasks T008-T010.
3. Complete US1 implementation tasks T011-T015.
4. Validate with `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, and focused `npm run e2e:us1`.

### Incremental Delivery

1. Deliver US1 counted add behavior.
2. Deliver US2 grouped history display using seeded duplicate meals.
3. Deliver US3 grouped edit/delete reconciliation.
4. Run full required checks after each delivered increment.

### Manual Acceptance Focus

1. Home: add a 4-point meal with count 3 and verify totals show 12 consumed points from that save.
2. History: select a day with exact duplicate meals and verify one row shows count 3 and multiplied points.
3. History: verify same-name meals with different points or meal type stay separate.
4. History: edit a combined row count and verify row count, row value, and day summary update.
5. History: delete a combined row and verify all represented entries leave the day total.
