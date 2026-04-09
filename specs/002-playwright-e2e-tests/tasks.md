# Tasks: Requirements E2E Coverage

**Input**: Design documents from `/specs/002-playwright-e2e-tests/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Verification tasks are REQUIRED for every user story that changes
user-visible behavior, business rules, or shared workflows. This feature adds a
new automated harness, so each user story includes Playwright verification plus
explicit manual acceptance checks for the web surface.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- App code remains under `src/`
- End-to-end automation lives under `e2e/`
- Coverage traceability lives under `playwright/`
- Feature planning artifacts live under `specs/002-playwright-e2e-tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the Playwright workspace, package scripts, and contributor-facing entry points

- [x] T001 Add Playwright dependency and E2E package scripts in /home/tanome/dev/lookr/package.json
- [x] T002 Create Playwright runner configuration in /home/tanome/dev/lookr/playwright.config.ts
- [x] T003 [P] Create E2E directory scaffolding and shared placeholders in /home/tanome/dev/lookr/e2e/fixtures/.gitkeep, /home/tanome/dev/lookr/e2e/helpers/.gitkeep, /home/tanome/dev/lookr/e2e/specs/.gitkeep, and /home/tanome/dev/lookr/e2e/support/.gitkeep
- [x] T004 [P] Document local Playwright setup and run commands in /home/tanome/dev/lookr/README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create deterministic test state control, stable selectors, and coverage-traceability infrastructure that all stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add web-only E2E state reset and seed support in /home/tanome/dev/lookr/src/lib/db.ts
- [x] T006 [P] Expose test-state control and runtime guards in /home/tanome/dev/lookr/src/context/app-data.tsx
- [x] T007 [P] Add stable E2E selectors and test-friendly semantics in /home/tanome/dev/lookr/src/app/(tabs)/index.tsx, /home/tanome/dev/lookr/src/app/(tabs)/history.tsx, /home/tanome/dev/lookr/src/app/(tabs)/progress.tsx, and /home/tanome/dev/lookr/src/components/meal-editor.tsx
- [x] T008 Create shared Playwright fixtures and app helpers in /home/tanome/dev/lookr/e2e/fixtures/app-fixtures.ts and /home/tanome/dev/lookr/e2e/helpers/app-helpers.ts
- [x] T009 Create the initial coverage manifest and scenario mapping in /home/tanome/dev/lookr/playwright/coverage.manifest.json
- [x] T010 Document the “new in-scope requirements require E2E coverage” delivery rule in /home/tanome/dev/lookr/README.md and /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Verify Core Tracking Flows Before Release (Priority: P1) 🎯 MVP

**Goal**: Prove the daily point budget, meal logging, and daily balance flows work end to end on the web surface

**Independent Test**: Run the US1 Playwright spec from a clean state and confirm first-use setup, meal creation, remaining-points updates, and regression failure reporting all work without relying on US2 or US3 scenarios

### Verification for User Story 1 ⚠️

- [x] T011 [P] [US1] Add Playwright regression scenarios for first-use setup and meal logging in /home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts
- [x] T012 [US1] Add manual web acceptance steps and expected outcomes for core tracking in /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md

### Implementation for User Story 1

- [x] T013 [P] [US1] Add reusable dashboard page actions for setup and meal entry in /home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts
- [x] T014 [P] [US1] Add named clean and over-limit seed states in /home/tanome/dev/lookr/e2e/fixtures/seed-states.ts
- [x] T015 [US1] Implement failure diagnostics and spec-reference annotations for US1 flows in /home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts and /home/tanome/dev/lookr/playwright/coverage.manifest.json
- [x] T016 [US1] Add a focused US1 Playwright script for local iteration in /home/tanome/dev/lookr/package.json

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Protect History, Editing, and Progress Workflows (Priority: P2)

**Goal**: Extend the regression suite to cover editing meals, reviewing history, and recording weight progress

**Independent Test**: Run only the US2 Playwright scenarios against seeded history/progress data and confirm meal edits, meal deletion, history review, and weight recording work without depending on US3 coverage artifacts

### Verification for User Story 2 ⚠️

- [x] T017 [P] [US2] Add Playwright regression scenarios for meal edit/delete and history review in /home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts
- [x] T018 [P] [US2] Add Playwright regression scenarios for weight entry and progress review in /home/tanome/dev/lookr/e2e/specs/progress-regression.spec.ts
- [x] T019 [US2] Add manual web acceptance steps for history and progress verification in /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md

### Implementation for User Story 2

- [x] T020 [P] [US2] Add reusable history and progress page actions in /home/tanome/dev/lookr/e2e/helpers/history-page.ts and /home/tanome/dev/lookr/e2e/helpers/progress-page.ts
- [x] T021 [P] [US2] Add seeded history and progress fixtures in /home/tanome/dev/lookr/e2e/fixtures/seed-states.ts
- [x] T022 [US2] Update coverage mappings for edit/history/progress acceptance scenarios in /home/tanome/dev/lookr/playwright/coverage.manifest.json
- [x] T023 [US2] Add a focused US2 Playwright script for local iteration in /home/tanome/dev/lookr/package.json

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Trace Test Coverage Back to Specifications (Priority: P3)

**Goal**: Make coverage status auditable so maintainers can see which spec scenarios are covered or deferred and update that mapping whenever requirements change

**Independent Test**: Review the manifest and supporting docs, then run a traceability-focused check that confirms every in-scope acceptance scenario from the active specs has a covered or deferred entry and that Playwright scenario identifiers map back to spec references

### Verification for User Story 3 ⚠️

- [x] T024 [P] [US3] Add a coverage-manifest validation script in /home/tanome/dev/lookr/e2e/support/validate-coverage-manifest.ts
- [x] T025 [US3] Add manual review steps for spec-to-test traceability in /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md

### Implementation for User Story 3

- [x] T026 [P] [US3] Normalize acceptance-scenario identifiers and coverage notes in /home/tanome/dev/lookr/playwright/coverage.manifest.json
- [x] T027 [P] [US3] Add an E2E coverage validation package script in /home/tanome/dev/lookr/package.json
- [x] T028 [US3] Document the traceability workflow for future requirements in /home/tanome/dev/lookr/README.md and /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/contracts/e2e-coverage-contract.md

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, artifact cleanup, and release-ready evidence across all stories

- [x] T029 [P] Run repository quality checks and web E2E commands from /home/tanome/dev/lookr/package.json
- [x] T030 Capture web E2E evidence and failure-artifact expectations in /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md
- [x] T031 Validate the full quickstart workflow and update any drift in /home/tanome/dev/lookr/specs/002-playwright-e2e-tests/quickstart.md and /home/tanome/dev/lookr/README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can run in parallel with US1 once the harness exists
- **User Story 3 (Phase 5)**: Depends on Foundational completion and should land after initial scenario files and manifest structure exist
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational - reuses shared fixtures but remains independently testable
- **User Story 3 (P3)**: Depends on the manifest and scenario IDs introduced by US1/US2, but does not block MVP delivery of US1

### Within Each User Story

- Verification tasks MUST be defined before implementation begins
- Playwright scenario files and validation checks come before final story sign-off
- Seed-state and page-helper tasks come before final scenario wiring
- Coverage manifest updates happen in the same story phase as the related scenario additions
- Manual acceptance and web UX review happen before story completion

### Parallel Opportunities

- `T003` and `T004` can run in parallel during setup
- `T006` and `T007` can run in parallel after the reset strategy in `T005` is defined
- `T008`, `T009`, and `T010` can proceed in parallel once foundational test-state direction is set
- `T013` and `T014` can run in parallel for US1
- `T017` and `T018` can run in parallel for US2
- `T020` and `T021` can run in parallel for US2
- `T024`, `T026`, and `T027` can run in parallel for US3

---

## Parallel Example: User Story 2

```bash
# Launch independent regression scenario work together:
Task: "Add Playwright regression scenarios for meal edit/delete and history review in /home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts"
Task: "Add Playwright regression scenarios for weight entry and progress review in /home/tanome/dev/lookr/e2e/specs/progress-regression.spec.ts"

# Launch supporting fixture/helper work together:
Task: "Add reusable history and progress page actions in /home/tanome/dev/lookr/e2e/helpers/history-page.ts and /home/tanome/dev/lookr/e2e/helpers/progress-page.ts"
Task: "Add seeded history and progress fixtures in /home/tanome/dev/lookr/e2e/fixtures/seed-states.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run the US1-only Playwright path plus `npm run lint` and `npm run typecheck`
5. Demo the web core-tracking regression slice if needed

### Incremental Delivery

1. Complete Setup + Foundational → harness and state controls ready
2. Add User Story 1 → validate core tracking regression coverage
3. Add User Story 2 → validate history and progress coverage
4. Add User Story 3 → validate traceability and ongoing requirement-governance workflow
5. Finish with Polish → run all quality gates and full E2E coverage

### Parallel Team Strategy

With multiple developers:

1. One developer handles setup/configuration while another prepares docs updates in Phase 1
2. Foundational work splits between app test hooks/selectors and E2E helper/manifest infrastructure
3. After foundation:
   - Developer A: User Story 1 core dashboard scenarios
   - Developer B: User Story 2 history/progress scenarios
   - Developer C: User Story 3 manifest validation and traceability workflow

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- `[US1]`, `[US2]`, and `[US3]` labels preserve story-to-task traceability required by the constitution
- Every new in-scope requirement must add E2E coverage or an explicit manifest deferral in the same change set
- Stop at each checkpoint to validate the story independently before moving on
