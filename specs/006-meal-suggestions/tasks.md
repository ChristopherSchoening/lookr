# Tasks: Meal Name Suggestions

**Input**: Design documents from `/specs/006-meal-suggestions/`
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

**Purpose**: Align existing meal modal, helpers, and design artifacts before implementation starts

- [ ] T001 Review and align feature docs in `specs/006-meal-suggestions/spec.md`, `specs/006-meal-suggestions/plan.md`, `specs/006-meal-suggestions/research.md`, and `specs/006-meal-suggestions/quickstart.md`
- [ ] T002 Inspect current suggestion touchpoints in `src/components/meal-editor.tsx`, `e2e/helpers/dashboard-page.ts`, `e2e/helpers/history-page.ts`, `e2e/specs/dashboard-core.spec.ts`, and `e2e/specs/history-regression.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared suggestion plumbing required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add reusable suggestion types or helper contracts in `src/lib/types.ts`
- [ ] T004 Build shared meal-name normalization, dedupe, ordering, and debounce-ready suggestion state in `src/components/meal-editor.tsx`
- [ ] T005 [P] Extend repeated-meal E2E seed builders in `e2e/fixtures/seed-states.ts`
- [ ] T006 [P] Extend shared Playwright suggestion helpers in `e2e/helpers/dashboard-page.ts` and `e2e/helpers/history-page.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reuse Frequent Meals Faster (Priority: P1) 🎯 MVP

**Goal**: Show fast, deduped prior-meal suggestions in the shared meal form after a three-character prefix and short pause

**Independent Test**: Open add meal, type one or two characters and confirm no suggestions, then type a repeated three-character prefix, pause, and confirm up to five distinct prefix matches appear in most-recent-first order

### Verification for User Story 1 ⚠️

- [ ] T007 [P] [US1] Extend add-flow acceptance coverage for threshold, debounce-safe appearance, ordering, and max-five behavior in `e2e/specs/dashboard-core.spec.ts`
- [ ] T008 [US1] Document manual Home suggestion-list review steps in `specs/006-meal-suggestions/quickstart.md`

### Implementation for User Story 1

- [ ] T009 [US1] Render the suggestion list and quiet/empty states in `src/components/meal-editor.tsx`
- [ ] T010 [US1] Apply prefix-only matching, normalized duplicate collapse, and max-five slicing in `src/components/meal-editor.tsx`
- [ ] T011 [US1] Wire Home add-mode suggestion interactions through the existing modal in `src/components/meal-editor.tsx` and `src/app/(tabs)/index.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Apply Saved Meal Details From a Suggestion (Priority: P2)

**Goal**: Let users pick a prior-meal suggestion to populate meal name, points, and optional meal type while keeping the form editable

**Independent Test**: Open add or edit meal, trigger suggestions, pick one, confirm meal name, points, and meal type populate from the most recent matching meal, then change the populated values before save

### Verification for User Story 2 ⚠️

- [ ] T012 [P] [US2] Extend suggestion-selection acceptance coverage in `e2e/specs/dashboard-core.spec.ts` and `e2e/specs/history-regression.spec.ts`
- [ ] T013 [US2] Document manual populated-form and override review steps in `specs/006-meal-suggestions/quickstart.md`

### Implementation for User Story 2

- [ ] T014 [US2] Populate meal name, points, and meal type from the selected source meal in `src/components/meal-editor.tsx`
- [ ] T015 [US2] Preserve manual override behavior after suggestion selection in `src/components/meal-editor.tsx`
- [ ] T016 [US2] Extend suggestion helper methods for selecting and asserting populated values in `e2e/helpers/dashboard-page.ts` and `e2e/helpers/history-page.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Keep Suggestions Relevant and Predictable (Priority: P3)

**Goal**: Keep suggestions quiet in edit mode until the name changes and prevent stale or noisy results during repeated meal entry

**Independent Test**: Open edit mode for an existing meal and confirm no suggestion list appears before the name changes, then change the name to a known prefix and confirm deduped results appear; type an unmatched prefix and confirm stale suggestions disappear

### Verification for User Story 3 ⚠️

- [ ] T017 [P] [US3] Extend quiet-edit-mode and no-results acceptance coverage in `e2e/specs/history-regression.spec.ts` and `e2e/specs/dashboard-core.spec.ts`
- [ ] T018 [US3] Document manual edit-mode suppression and no-results review steps in `specs/006-meal-suggestions/quickstart.md`

### Implementation for User Story 3

- [ ] T019 [US3] Add edit-mode name-change gating and stale-result clearing in `src/components/meal-editor.tsx`
- [ ] T020 [US3] Seed duplicate-name and unmatched-prefix scenarios in `e2e/fixtures/seed-states.ts`
- [ ] T021 [US3] Keep suggestion UI secondary and aligned with the shared modal contract in `src/components/meal-editor.tsx` and `specs/006-meal-suggestions/contracts/meal-suggestions-contract.md`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cross-story cleanup

- [ ] T022 [P] Capture touched-platform suggestion-flow evidence and final manual acceptance notes in `specs/006-meal-suggestions/quickstart.md`
- [ ] T023 Run full verification commands and record outcomes in `specs/006-meal-suggestions/quickstart.md`

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
- **User Story 2 (P2)**: Depends on User Story 1 because suggestion selection assumes the list rendering, ordering, and trigger behavior already exist
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) and should land after US1 so quiet-state and stale-result checks validate the actual suggestion UI

### Within Each User Story

- Verification tasks MUST be defined before implementation begins
- Each feature or fix MUST add or update at least one test tied to the changed behavior
- Acceptance criteria for user-facing work MUST map to end-to-end coverage
- Small changes SHOULD extend existing tests before creating parallel coverage
- Prefer extending existing code before adding parallel modules or abstractions
- Shared modal state before route-specific wiring
- Suggestion rendering before selection hydration
- Story complete before moving to next priority
- Manual acceptance and UX consistency review before sign-off

### Parallel Opportunities

- `T005` and `T006` can run in parallel after `T003` and `T004`
- In US1, `T007` and `T008` can run in parallel before `T009` to `T011`
- In US2, `T012` and `T013` can run in parallel before `T014` to `T016`
- In US3, `T017` and `T018` can run in parallel before `T019` to `T021`
- `T022` and `T023` can run in parallel after implementation is complete

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together:
Task: "Extend add-flow acceptance coverage for threshold, debounce-safe appearance, ordering, and max-five behavior in e2e/specs/dashboard-core.spec.ts"
Task: "Document manual Home suggestion-list review steps in specs/006-meal-suggestions/quickstart.md"
```

---

## Parallel Example: User Story 2

```bash
# Launch User Story 2 verification work together:
Task: "Extend suggestion-selection acceptance coverage in e2e/specs/dashboard-core.spec.ts and e2e/specs/history-regression.spec.ts"
Task: "Document manual populated-form and override review steps in specs/006-meal-suggestions/quickstart.md"
```

---

## Parallel Example: User Story 3

```bash
# Launch User Story 3 verification work together:
Task: "Extend quiet-edit-mode and no-results acceptance coverage in e2e/specs/history-regression.spec.ts and e2e/specs/dashboard-core.spec.ts"
Task: "Document manual edit-mode suppression and no-results review steps in specs/006-meal-suggestions/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run add-flow suggestion checks independently
5. Demo or ship the MVP slice if ready

### Incremental Delivery

1. Complete Setup + Foundational → shared suggestion plumbing ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish with Phase 6 verification and evidence capture

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 suggestion rendering and ordering
   - Developer B: User Story 2 selection hydration and helper updates
   - Developer C: User Story 3 edit-mode suppression and no-results behavior
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
