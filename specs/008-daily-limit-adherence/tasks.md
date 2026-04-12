# Tasks: Daily Limit Adherence

**Input**: Design documents from `/specs/008-daily-limit-adherence/`
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

**Purpose**: Align feature docs, current data flow, and existing acceptance touchpoints before implementation starts

- [ ] T001 Review and align feature docs in `specs/008-daily-limit-adherence/spec.md`, `specs/008-daily-limit-adherence/plan.md`, `specs/008-daily-limit-adherence/data-model.md`, `specs/008-daily-limit-adherence/contracts/daily-limit-adherence-contract.md`, and `specs/008-daily-limit-adherence/quickstart.md`
- [ ] T002 Inspect current limit, summary, and adherence flow in `src/lib/db.ts`, `src/context/app-data.tsx`, `src/app/(tabs)/index.tsx`, `src/app/(tabs)/history.tsx`, `src/app/(tabs)/progress.tsx`, `e2e/fixtures/seed-states.ts`, `e2e/helpers/dashboard-page.ts`, `e2e/helpers/history-page.ts`, `e2e/helpers/progress-page.ts`, `e2e/specs/dashboard-core.spec.ts`, `e2e/specs/history-regression.spec.ts`, and `e2e/specs/progress-regression.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared storage, types, and derived summary plumbing required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add the additive `daily_point_limit_history` schema migration and history-table read/write helpers in `src/lib/db.ts`
- [ ] T004 [P] Add dated limit history types and summary typing updates in `src/lib/types.ts`
- [ ] T005 Build effective-limit lookup and per-day summary derivation from limit history in `src/context/app-data.tsx`
- [ ] T006 [P] Extend seeded app state and E2E snapshot support for limit-history scenarios in `src/lib/db.ts` and `e2e/fixtures/seed-states.ts`
- [ ] T007 [P] Extend shared Playwright page helpers for limit-edit and historical summary assertions in `e2e/helpers/dashboard-page.ts`, `e2e/helpers/history-page.ts`, and `e2e/helpers/progress-page.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Update Daily Point Limit (Priority: P1) 🎯 MVP

**Goal**: Let users edit the daily points limit and see the new limit apply to the whole current day and future days

**Independent Test**: Start with an existing daily point limit, change it, confirm the current day's remaining points and status refresh immediately, then move to another day and confirm the new limit is used.

### Verification for User Story 1 ⚠️

- [ ] T008 [P] [US1] Extend current-day limit update acceptance coverage in `e2e/specs/dashboard-core.spec.ts`
- [ ] T009 [US1] Document manual timed limit-edit, same-day refresh, and invalid-input checks in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 1

- [ ] T010 [US1] Add editable daily-limit UI for existing profiles in `src/app/(tabs)/index.tsx`
- [ ] T011 [US1] Wire limit-save validation and current-day refresh through shared app data in `src/app/(tabs)/index.tsx` and `src/context/app-data.tsx`
- [ ] T012 [US1] Ensure same-day and future-day summaries consume the updated effective limit in `src/context/app-data.tsx` and `src/app/(tabs)/index.tsx`
- [ ] T013 [US1] Verify current-day budget displays stay consistent after a same-day limit change in `src/app/(tabs)/index.tsx`, `src/app/(tabs)/history.tsx`, and `src/app/(tabs)/progress.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Preserve Historical Adherence (Priority: P2)

**Goal**: Keep past days judged by the limit active on those dates, even after later limit changes

**Independent Test**: Seed tracked days under an older limit, change today's limit, confirm past days keep their original within/over result, then edit a past day and confirm recalculation still uses that past day's historical limit.

### Verification for User Story 2 ⚠️

- [ ] T014 [P] [US2] Extend historical-limit History acceptance coverage in `e2e/specs/history-regression.spec.ts`
- [ ] T015 [P] [US2] Extend historical-limit fixture coverage in `e2e/fixtures/seed-states.ts`
- [ ] T016 [US2] Document manual historical-adherence review steps in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 2

- [ ] T017 [US2] Show History day summaries from historical effective limits in `src/app/(tabs)/history.tsx` and `src/context/app-data.tsx`
- [ ] T018 [US2] Recalculate edited or deleted past-day meals against the limit active on that past date in `src/context/app-data.tsx` and `src/lib/db.ts`
- [ ] T019 [US2] Keep empty-day and mixed-history adherence behavior stable after later limit changes in `src/context/app-data.tsx` and `src/app/(tabs)/history.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Keep Progress Metrics Consistent (Priority: P3)

**Goal**: Keep Progress adherence totals aligned with the same effective-limit rule used by Home and History

**Independent Test**: Open Progress with tracked days before and after a limit change, confirm the adherence total matches the visible day-level history, then change today's limit and confirm today's classification updates immediately.

### Verification for User Story 3 ⚠️

- [ ] T020 [P] [US3] Extend adherence-boundary acceptance coverage in `e2e/specs/progress-regression.spec.ts`
- [ ] T021 [US3] Document manual Progress consistency review steps in `specs/008-daily-limit-adherence/quickstart.md`

### Implementation for User Story 3

- [ ] T022 [US3] Update Progress adherence aggregation to use per-day effective limits in `src/app/(tabs)/progress.tsx` and `src/context/app-data.tsx`
- [ ] T023 [US3] Ensure current day enters adherence immediately after same-day limit changes in `src/context/app-data.tsx` and `src/app/(tabs)/progress.tsx`
- [ ] T024 [US3] Keep Home, History, and Progress summary wording consistent with shared effective-limit status in `src/app/(tabs)/index.tsx`, `src/app/(tabs)/history.tsx`, and `src/app/(tabs)/progress.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cross-story cleanup

- [ ] T025 [P] Capture touched-platform screenshots or recordings, or explicit justification when notes are sufficient, for web, iOS, and Android limit-edit and adherence behavior in `specs/008-daily-limit-adherence/quickstart.md`
- [ ] T026 [P] Confirm the UI/data contract stays aligned with implemented hooks and surfaces in `specs/008-daily-limit-adherence/contracts/daily-limit-adherence-contract.md` and `specs/008-daily-limit-adherence/quickstart.md`
- [ ] T027 Run full verification commands and record outcomes in `specs/008-daily-limit-adherence/quickstart.md`

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
- **User Story 2 (P2)**: Depends on User Story 1 because editable current-limit behavior and effective-limit derivation must exist before historical result preservation can be validated end to end
- **User Story 3 (P3)**: Depends on User Story 2 because Progress totals must match the finalized historical day-evaluation rule used by History

### Within Each User Story

- Verification tasks MUST be defined before implementation begins
- Each feature or fix MUST add or update at least one test tied to the changed behavior
- Acceptance criteria for user-facing work MUST map to end-to-end coverage
- Small changes SHOULD extend existing tests before creating parallel coverage
- Prefer extending existing code before adding parallel modules or abstractions
- Shared derivation before route-specific UI wiring
- Route behavior before final wording polish
- Manual acceptance and UX consistency review before sign-off

### Parallel Opportunities

- `T004`, `T006`, and `T007` can run in parallel after `T003`
- In US1, `T008` and `T009` can run in parallel before `T010` to `T012`
- In US2, `T014`, `T015`, and `T016` can run in parallel before `T017` to `T019`
- In US3, `T020` and `T021` can run in parallel before `T022` to `T024`
- `T025`, `T026`, and `T027` can run in parallel after implementation is complete

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together:
Task: "Extend current-day limit update acceptance coverage in e2e/specs/dashboard-core.spec.ts"
Task: "Document manual limit-edit and same-day refresh checks in specs/008-daily-limit-adherence/quickstart.md"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 verification work together:
Task: "Extend historical-limit History acceptance coverage in e2e/specs/history-regression.spec.ts"
Task: "Extend historical-limit fixture coverage in e2e/fixtures/seed-states.ts"
Task: "Document manual historical-adherence review steps in specs/008-daily-limit-adherence/quickstart.md"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 verification work together:
Task: "Extend adherence-boundary acceptance coverage in e2e/specs/progress-regression.spec.ts"
Task: "Document manual Progress consistency review steps in specs/008-daily-limit-adherence/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run limit-edit checks independently
5. Demo or ship the MVP slice if ready

### Incremental Delivery

1. Complete Setup + Foundational → historical-limit plumbing and test hooks ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish with Phase 6 verification and touched-platform review notes

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 limit-edit UI and same-day refresh
   - Developer B: User Story 2 historical History summaries and past-day recalculation
   - Developer C: User Story 3 Progress adherence aggregation and wording consistency
3. Merge stories in priority order and finish with shared verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify planned checks run before marking a story complete
- Keep new code concise and readable; add new helpers only when they reduce effective-limit duplication cleanly
- Extend existing Playwright coverage and helpers before creating new test files
- Commit after each task or logical group
