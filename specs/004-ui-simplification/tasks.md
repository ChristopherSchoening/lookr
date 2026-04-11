# Tasks: Simplified Tracking UI

**Input**: Design documents from `/specs/004-ui-simplification/`
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

- Expo app code lives in `src/`
- Acceptance coverage lives in `e2e/`
- Feature planning artifacts live in `specs/004-ui-simplification/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm feature artifacts and shared implementation targets before editing code

- [x] T001 Review icon, UI, and test decisions in /home/tanome/dev/lookr/specs/004-ui-simplification/research.md, /home/tanome/dev/lookr/specs/004-ui-simplification/contracts/tab-ui-contract.md, and /home/tanome/dev/lookr/specs/004-ui-simplification/quickstart.md
- [x] T002 Inspect current tab shell and touched screens in /home/tanome/dev/lookr/src/app/(tabs)/\_layout.tsx, /home/tanome/dev/lookr/src/app/(tabs)/index.tsx, /home/tanome/dev/lookr/src/app/(tabs)/history.tsx, /home/tanome/dev/lookr/src/app/(tabs)/progress.tsx, and /home/tanome/dev/lookr/src/components/ui.tsx
- [x] T003 [P] Inspect existing Playwright helpers and story coverage in /home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts, /home/tanome/dev/lookr/e2e/helpers/history-page.ts, /home/tanome/dev/lookr/e2e/helpers/progress-page.ts, /home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts, /home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts, and /home/tanome/dev/lookr/e2e/specs/progress-regression.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared tab-shell and shared-surface work that blocks all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Update shared tab metadata and shell styling in /home/tanome/dev/lookr/src/app/(tabs)/\_layout.tsx to use `Home`, `History`, and `Progress` labels, `MaterialCommunityIcons` icons, and a non-rounded tab bar
- [x] T005 [P] Normalize shared card or surface styling in /home/tanome/dev/lookr/src/components/ui.tsx to remove the stray white rectangle from top cards on touched tabs without regressing existing card tones
- [x] T006 [P] Extend shared Playwright navigation helpers for renamed Home navigation and tab-level assertions in /home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts, /home/tanome/dev/lookr/e2e/helpers/history-page.ts, and /home/tanome/dev/lookr/e2e/helpers/progress-page.ts

**Checkpoint**: Shared navigation and top-surface behavior are ready; user story implementation can now begin

---

## Phase 3: User Story 1 - Use a Cleaner Home Tab (Priority: P1) 🎯 MVP

**Goal**: Deliver a simplified Home tab with clear meal and points focus, no filler copy, and updated tab naming and icons

**Independent Test**: Open the main tab, confirm the tab label reads Home, icons render, the bar is not rounded, the primary content only shows core meal and points workflow, and no stray white card rectangle or placeholder copy remains

### Verification for User Story 1 ⚠️

- [x] T007 [P] [US1] Extend Home journey assertions for renamed tab label, visible icons, reduced content, and removed placeholder copy in /home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts
- [x] T008 [US1] Document manual acceptance checks for Home tab layout and content reduction in /home/tanome/dev/lookr/specs/004-ui-simplification/quickstart.md

### Implementation for User Story 1

- [x] T009 [US1] Simplify the Home screen content and naming in /home/tanome/dev/lookr/src/app/(tabs)/index.tsx to remove editorial copy, keep the meal workflow, and keep the points overview only
- [x] T010 [US1] Update Home-specific UI text, test IDs, and empty or status copy expectations in /home/tanome/dev/lookr/src/app/(tabs)/index.tsx and /home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts to align with the renamed Home experience
- [x] T011 [US1] Remove future-feature teaser content from /home/tanome/dev/lookr/src/app/(tabs)/index.tsx and verify shared surfaces no longer show the white rectangle on the Home top card

**Checkpoint**: User Story 1 should now be fully functional and testable on its own

---

## Phase 4: User Story 2 - Manage Meals From History (Priority: P2)

**Goal**: Keep History focused on day review and meal correction while removing clutter and preserving in-place edit/delete behavior

**Independent Test**: Open History with seeded meals, select a day, edit one meal, delete another, confirm totals update, and verify no future-feature or filler copy remains

### Verification for User Story 2 ⚠️

- [x] T012 [P] [US2] Extend History acceptance coverage for reduced copy, stable day summaries, and visible edit/delete correction flow in /home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts
- [x] T013 [US2] Document manual acceptance checks for History review, edit, delete, and cleaned layout in /home/tanome/dev/lookr/specs/004-ui-simplification/quickstart.md

### Implementation for User Story 2

- [x] T014 [US2] Simplify History header and summary copy in /home/tanome/dev/lookr/src/app/(tabs)/history.tsx while keeping day selection and correction flow intact
- [x] T015 [US2] Adjust History meal-management presentation in /home/tanome/dev/lookr/src/app/(tabs)/history.tsx and /home/tanome/dev/lookr/src/components/meal-editor.tsx so edit and delete actions remain obvious in the History flow without added clutter
- [x] T016 [US2] Update History Playwright helper expectations for revised labels, summaries, and correction flow in /home/tanome/dev/lookr/e2e/helpers/history-page.ts

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Review Only Core Progress Signals (Priority: P3)

**Goal**: Trim Progress to weight, adherence, trend/history, and latest change while removing non-essential explanation blocks

**Independent Test**: Open Progress with seeded weight data, verify only the core progress sections remain, confirm weight change since the previous track is shown, and confirm the white rectangle artifact is gone

### Verification for User Story 3 ⚠️

- [x] T017 [P] [US3] Extend Progress acceptance coverage for reduced content, retained adherence and trend signals, and removed filler copy in /home/tanome/dev/lookr/e2e/specs/progress-regression.spec.ts
- [x] T018 [US3] Document manual acceptance checks for Progress core metrics, trend visibility, and cleaned top-card layout in /home/tanome/dev/lookr/specs/004-ui-simplification/quickstart.md

### Implementation for User Story 3

- [x] T019 [US3] Simplify Progress screen sections and explanatory copy in /home/tanome/dev/lookr/src/app/(tabs)/progress.tsx to keep only weight logging, adherence, trend/history, and latest change since prior track
- [x] T020 [US3] Refine Progress labels, empty states, and change-summary presentation in /home/tanome/dev/lookr/src/app/(tabs)/progress.tsx so single-entry and multi-entry states remain understandable without filler text
- [x] T021 [US3] Update Progress Playwright helper expectations for retained metrics and reduced copy in /home/tanome/dev/lookr/e2e/helpers/progress-page.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, verification, and delivery evidence across all stories

- [x] T022 [P] Refresh feature documentation references if implementation changed acceptance wording in /home/tanome/dev/lookr/specs/004-ui-simplification/spec.md, /home/tanome/dev/lookr/specs/004-ui-simplification/plan.md, and /home/tanome/dev/lookr/specs/004-ui-simplification/contracts/tab-ui-contract.md
- [x] T023 Run required repo checks with `npm run lint`, `npm run typecheck`, and `npm run e2e:coverage` from /home/tanome/dev/lookr
- [x] T024 Run targeted acceptance flows with `npm run e2e:us1` and `npm run e2e:us2` from /home/tanome/dev/lookr
- [x] T025 Capture manual UI review evidence for touched platforms following /home/tanome/dev/lookr/specs/004-ui-simplification/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and defines the MVP
- **User Story 2 (P2)**: Starts after Phase 2 and can proceed independently from US1 once shared shell changes are done
- **User Story 3 (P3)**: Starts after Phase 2 and can proceed independently from US1/US2 once shared shell changes are done

### Within Each User Story

- Verification tasks are defined before implementation begins
- Existing Playwright coverage is extended before adding any new suite or helper
- Screen implementation lands before helper cleanup that depends on final copy
- Manual acceptance and UX consistency review happen before sign-off

### Parallel Opportunities

- T003 can run in parallel with T001-T002
- T005 and T006 can run in parallel after T004 starts, because they target different files
- T007 and T008 can run in parallel inside US1
- T012 and T013 can run in parallel inside US2
- T017 and T018 can run in parallel inside US3
- After Phase 2, US2 and US3 can be implemented in parallel if capacity exists

---

## Parallel Example: User Story 1

```bash
# Launch Home story verification work together:
Task: "Extend Home journey assertions in e2e/specs/dashboard-core.spec.ts"
Task: "Document manual acceptance checks in specs/004-ui-simplification/quickstart.md"

# Then implement Home updates:
Task: "Simplify the Home screen content in src/app/(tabs)/index.tsx"
Task: "Update Home-specific Playwright helper expectations in e2e/helpers/dashboard-page.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch History story verification work together:
Task: "Extend History acceptance coverage in e2e/specs/history-regression.spec.ts"
Task: "Document History manual acceptance checks in specs/004-ui-simplification/quickstart.md"

# Then split implementation by file ownership:
Task: "Simplify History header and summary copy in src/app/(tabs)/history.tsx"
Task: "Adjust meal-management presentation in src/components/meal-editor.tsx"
```

---

## Parallel Example: User Story 3

```bash
# Launch Progress story verification work together:
Task: "Extend Progress acceptance coverage in e2e/specs/progress-regression.spec.ts"
Task: "Document Progress manual acceptance checks in specs/004-ui-simplification/quickstart.md"

# Then split implementation by file ownership:
Task: "Simplify Progress sections in src/app/(tabs)/progress.tsx"
Task: "Update Progress helper expectations in e2e/helpers/progress-page.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run Home-focused verification and manual review
5. Demo or ship the Home slice if desired

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 and validate it independently
3. Add User Story 2 and validate it independently
4. Add User Story 3 and validate it independently
5. Finish with cross-cutting verification and manual UI evidence

### Parallel Team Strategy

1. One person handles Phase 2 shared shell work
2. After Phase 2:
   - Developer A: User Story 1 in `src/app/(tabs)/index.tsx` and `e2e/specs/dashboard-core.spec.ts`
   - Developer B: User Story 2 in `src/app/(tabs)/history.tsx`, `src/components/meal-editor.tsx`, and `e2e/specs/history-regression.spec.ts`
   - Developer C: User Story 3 in `src/app/(tabs)/progress.tsx` and `e2e/specs/progress-regression.spec.ts`
