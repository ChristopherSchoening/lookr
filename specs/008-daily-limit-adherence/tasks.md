# Tasks: Daily Limit Adherence

**Input**: Design documents from `/specs/008-daily-limit-adherence/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by the feature specification and repository rules. Extend existing Playwright coverage for Home, History, and Progress flows, then run `npm run lint`, `npm run typecheck`, and `npm run e2e:coverage`.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as an independently valuable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed tasks
- **[Story]**: User story label, required only inside user story phases
- Every task includes concrete file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing app surfaces, data flow, and acceptance hooks before changing implementation.

- [x] T001 Review the feature requirements and acceptance proof map in `specs/008-daily-limit-adherence/spec.md`, `specs/008-daily-limit-adherence/plan.md`, `specs/008-daily-limit-adherence/data-model.md`, `specs/008-daily-limit-adherence/contracts/daily-limit-adherence-contract.md`, and `specs/008-daily-limit-adherence/quickstart.md`
- [x] T002 Inspect current daily-limit, summary, and adherence behavior in `src/lib/db.ts`, `src/context/app-data.tsx`, `src/app/(tabs)/index.tsx`, `src/app/(tabs)/history.tsx`, `src/app/(tabs)/progress.tsx`, `e2e/helpers/dashboard-page.ts`, `e2e/helpers/history-page.ts`, `e2e/helpers/progress-page.ts`, `e2e/specs/dashboard-core.spec.ts`, `e2e/specs/history-regression.spec.ts`, and `e2e/specs/progress-regression.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared data model, persistence, seeded state, and derived summary plumbing required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Add or update `DailyPointLimitHistoryEntry`, seeded history, and decimal-preserving daily-limit types in `src/lib/types.ts`
- [x] T004 Add the additive `daily_point_limit_history` schema migration, decimal-capable column handling, and latest-row-per-date rules in `src/lib/db.ts`
- [x] T005 Update profile save and seed reset helpers to write `user_profile` plus dated limit-history rows in `src/lib/db.ts`
- [x] T006 Add limit-history loading to app startup and E2E snapshot APIs in `src/lib/db.ts` and `src/context/app-data.tsx`
- [x] T007 Build shared effective-limit lookup and per-day `DailySummary` derivation from meals plus limit history in `src/context/app-data.tsx`
- [x] T008 [P] Extend seed fixtures for no-limit, same-day edit, historical-limit, mixed-history, and decimal-limit states in `e2e/fixtures/seed-states.ts`
- [x] T009 [P] Update shared Playwright helpers for Progress limit setup/edit, Home absence/prompt checks, History summary assertions, and adherence metrics in `e2e/helpers/progress-page.ts`, `e2e/helpers/dashboard-page.ts`, and `e2e/helpers/history-page.ts`

**Checkpoint**: Foundation ready. User story implementation can start.

---

## Phase 3: User Story 1 - Update Daily Point Limit From Progress (Priority: P1) MVP

**Goal**: Users set or edit the daily points limit from Progress, and the new limit applies to the whole current day plus future days. Home never exposes the setting.

**Independent Test**: Start with no limit and with an existing limit, use Progress to save valid whole-number and decimal limits, verify current-day budget refreshes, verify invalid input is rejected, and verify Home only shows budget feedback or a setup prompt.

### Verification for User Story 1

- [x] T010 [P] [US1] Extend Progress setup/edit, decimal-limit, invalid-input, and same-day refresh coverage in `e2e/specs/progress-regression.spec.ts`
- [x] T011 [P] [US1] Extend Home no-setting, setup-prompt, and current budget feedback coverage in `e2e/specs/dashboard-core.spec.ts`
- [x] T012 [US1] Record manual Progress setup/edit, invalid input, decimal input, same-day refresh, and Home absence review steps in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 1

- [x] T013 [US1] Remove daily-limit setup and edit form ownership from Home while keeping current-day budget status in `src/app/(tabs)/index.tsx`
- [x] T014 [US1] Add the no-limit Home prompt/action that routes to Progress setup without rendering limit input controls in `src/app/(tabs)/index.tsx`
- [x] T015 [US1] Add Progress-owned initial daily-limit setup and existing-limit edit UI using existing form primitives and test hooks in `src/app/(tabs)/progress.tsx`
- [x] T016 [US1] Validate positive finite whole-number and decimal limit input without rounding before save in `src/app/(tabs)/progress.tsx`
- [x] T017 [US1] Wire Progress limit saves through shared app data so `user_profile`, limit history, current-day summary, and save feedback refresh immediately in `src/app/(tabs)/progress.tsx` and `src/context/app-data.tsx`
- [x] T018 [US1] Ensure current-day and future-day budget displays use the updated effective limit in `src/context/app-data.tsx`, `src/app/(tabs)/index.tsx`, and `src/app/(tabs)/progress.tsx`

**Checkpoint**: User Story 1 is functional and testable as the MVP.

---

## Phase 4: User Story 2 - Preserve Historical Adherence (Priority: P2)

**Goal**: Past tracked days keep the adherence result from the limit active on those dates, even after later limit changes.

**Independent Test**: Seed days under an older limit, change today's limit, confirm older days keep their within/over labels, then edit or delete a past meal and confirm that day recalculates against its historical limit.

### Verification for User Story 2

- [x] T019 [P] [US2] Extend historical-limit preservation and past-meal edit coverage in `e2e/specs/history-regression.spec.ts`
- [x] T020 [P] [US2] Extend cross-screen historical-limit assertions after a Progress limit change in `e2e/specs/progress-regression.spec.ts`
- [x] T021 [US2] Record manual historical-adherence, past-meal edit, past-meal delete, and empty-day review steps in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 2

- [x] T022 [US2] Sort and resolve daily limit history so the latest saved row on or before each date wins in `src/context/app-data.tsx`
- [x] T023 [US2] Render History day totals and within/over/empty status from the shared historical effective limit in `src/app/(tabs)/history.tsx`
- [x] T024 [US2] Recalculate edited or deleted past-day meals against the limit active on that past date through shared refresh behavior in `src/context/app-data.tsx` and `src/lib/db.ts`
- [x] T025 [US2] Preserve existing empty-day exclusion from adherence and avoid creating tracked adhered days from later limit changes in `src/context/app-data.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Keep Progress Metrics Consistent (Priority: P3)

**Goal**: Progress adherence totals match the same per-date effective-limit rule visible in History and reflected in Home.

**Independent Test**: Open Progress with days before and after a limit change, confirm adherence totals match visible day-level outcomes, then change today's limit and confirm today's classification and aggregate count refresh immediately.

### Verification for User Story 3

- [x] T026 [P] [US3] Extend adherence-boundary and same-day aggregate refresh coverage in `e2e/specs/progress-regression.spec.ts`
- [x] T027 [US3] Record manual Progress adherence total, visible History match, and same-day classification review steps in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 3

- [x] T028 [US3] Update Progress adherence aggregation to count tracked days using shared per-date effective limits in `src/app/(tabs)/progress.tsx` and `src/context/app-data.tsx`
- [x] T029 [US3] Include the current day in adherence immediately after a same-day limit change when it has tracked meals in `src/context/app-data.tsx` and `src/app/(tabs)/progress.tsx`
- [x] T030 [US3] Align Progress metric wording with History day outcomes and Home budget status in `src/app/(tabs)/progress.tsx`, `src/app/(tabs)/history.tsx`, and `src/app/(tabs)/index.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final contract alignment, quality checks, and platform review.

- [x] T031 [P] Confirm implemented UI hooks and data behavior match the contract in `specs/008-daily-limit-adherence/contracts/daily-limit-adherence-contract.md`
- [x] T032 [P] Update final verification log and platform review notes for web, iOS, and Android in `specs/008-daily-limit-adherence/quickstart.md`
- [x] T033 Run `npm run lint`, `npm run typecheck`, and `npm run e2e:coverage`, then record outcomes in `specs/008-daily-limit-adherence/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational and is the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational and integrates cleanly after User Story 1 UI ownership is in place
- **User Story 3 (Phase 5)**: Depends on Foundational and the finalized shared historical summary rule
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Can start after Foundational, but end-to-end validation should follow User Story 1 because the user changes limits from Progress.
- **User Story 3 (P3)**: Can start after Foundational, but final validation should follow User Story 2 because Progress totals must match historical day evaluation.

### Within Each User Story

- Define and update automated Playwright coverage before implementation sign-off.
- Keep shared effective-limit derivation in `src/context/app-data.tsx` as the single calculation path.
- Update UI routes only after shared data behavior is available.
- Extend existing helpers and specs before adding new files.
- Run manual acceptance and platform review before story sign-off.

### Parallel Opportunities

- `T008` and `T009` can run in parallel after `T003` through `T007` interfaces are understood.
- `T010` and `T011` can run in parallel for User Story 1 because they touch different specs.
- `T019` and `T020` can run in parallel for User Story 2 because they cover different acceptance surfaces.
- `T031` and `T032` can run in parallel after all implementation tasks complete.

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together:
Task: "Extend Progress setup/edit, decimal-limit, invalid-input, and same-day refresh coverage in e2e/specs/progress-regression.spec.ts"
Task: "Extend Home no-setting, setup-prompt, and current budget feedback coverage in e2e/specs/dashboard-core.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 verification work together:
Task: "Extend historical-limit preservation and past-meal edit coverage in e2e/specs/history-regression.spec.ts"
Task: "Extend cross-screen historical-limit assertions after a Progress limit change in e2e/specs/progress-regression.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 verification work:
Task: "Extend adherence-boundary and same-day aggregate refresh coverage in e2e/specs/progress-regression.spec.ts"
Task: "Record manual Progress adherence total, visible History match, and same-day classification review steps in specs/008-daily-limit-adherence/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate User Story 1 with Progress and Home acceptance checks.
5. Demo or ship the MVP slice if ready.

### Incremental Delivery

1. Complete Setup plus Foundational plumbing.
2. Add User Story 1 and validate Progress-owned setup/edit plus Home absence.
3. Add User Story 2 and validate historical preservation plus past edit behavior.
4. Add User Story 3 and validate Progress aggregate consistency.
5. Finish with Phase 6 quality checks and platform review notes.

### Parallel Team Strategy

1. Complete Setup and Foundational tasks together.
2. After Foundational, split work by story and file ownership:
   - Developer A: User Story 1 in `src/app/(tabs)/progress.tsx`, `src/app/(tabs)/index.tsx`, `e2e/specs/progress-regression.spec.ts`, and `e2e/specs/dashboard-core.spec.ts`
   - Developer B: User Story 2 in `src/context/app-data.tsx`, `src/app/(tabs)/history.tsx`, `e2e/specs/history-regression.spec.ts`, and `e2e/fixtures/seed-states.ts`
   - Developer C: User Story 3 in `src/app/(tabs)/progress.tsx`, `src/context/app-data.tsx`, and `e2e/specs/progress-regression.spec.ts`
3. Merge in priority order and run Phase 6 verification.

---

## Notes

- Suggested MVP scope: Phase 1, Phase 2, and User Story 1.
- Acceptance coverage stays in the existing Playwright specs and helpers.
- New abstractions should be added only when they remove repeated effective-limit or validation logic.
