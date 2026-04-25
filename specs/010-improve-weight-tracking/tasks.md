# Tasks: Improve Weight Tracking

**Input**: Design documents from `/specs/010-improve-weight-tracking/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/weight-context-api.md ✅, quickstart.md ✅

**Tests**: All three user stories have acceptance scenarios mapped to Playwright automation in `e2e/specs/progress-regression.spec.ts`. Verification tasks are defined before implementation and run before story sign-off.

**Organization**: Tasks grouped by user story. Each story is independently implementable and testable via direct URL navigation (`/progress`, `/progress/details`).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Exact file paths in every description

---

## Phase 1: Setup

**Purpose**: Install new dependency and establish directory-based routing for the progress tab

- [X] T001 Install react-native-svg via `npx expo install react-native-svg`
- [X] T002 Create `src/app/(tabs)/progress/_layout.tsx` as a Stack navigator (converts `progress.tsx` flat file to directory-based routing; existing e2e navigation to `/progress` continues to work)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: DB migration, type changes, and context update that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update `src/lib/db.ts` — add migration v4 (`ALTER TABLE user_profile ADD COLUMN target_weight REAL`), add `updateWeight(id, { entryDate, weight })` function, add `saveTargetWeight(weight: number | null)` function, update `loadProfile` to read and return `target_weight` as `targetWeight`, extend `E2ESeedState.profile` with optional `targetWeight?: number | null` field
- [X] T004 [P] Update `src/lib/types.ts` — add `targetWeight: number | null` to `UserProfile` type
- [X] T005 Update `src/context/app-data.tsx` — expose `updateWeight` and `saveTargetWeight` methods in context value, include `targetWeight` from loaded profile (depends on T003, T004)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Review Weight Overview (Priority: P1) 🎯 MVP

**Goal**: Progress page shows a concise weight-only overview; non-weight sections removed; entry point to detail view present

**Independent Test**: Navigate to `/progress` with seeded weight data → confirm latest weight, goal, change, remaining, trend, and date shown; confirm no adherence or daily-limit sections; confirm "View details" button present. Navigate to `/progress` with no weight data → confirm empty state shown without broken UI.

### Verification for User Story 1 ⚠️

> **Define these before implementation; run before story sign-off**

- [X] T006 [P] [US1] Add weight overview assertion helpers (`assertLatestWeight`, `assertGoalWeight`, `assertWeightChange`, `assertDetailsButton`, `assertEmptyState`) to `e2e/helpers/progress-page.ts`
- [X] T007 [US1] Extend `e2e/specs/progress-regression.spec.ts` with US1 scenarios: weight-only overview with seeded data, empty state without weight entries, absence of non-weight sections (adherence, daily limit)

### Implementation for User Story 1

- [X] T008 [US1] Rework `src/app/(tabs)/progress/index.tsx` (migrated from `progress.tsx`) — remove non-weight sections (daily limit card, adherence); compute `WeightOverview` (latestWeight, targetWeight, weightChange, remaining, trendDirection, latestEntryDate) from `AppDataContext`; render weight overview card with all six stats (FR-001, FR-002, FR-003)
- [X] T009 [US1] Add empty state to `src/app/(tabs)/progress/index.tsx` for when `weights` array is empty — show prompt to add weight entries or open details; no misleading values shown (FR-014)
- [X] T010 [US1] Add "View details" button in `src/app/(tabs)/progress/index.tsx` that navigates to `/progress/details` using expo-router (FR-004)

**Checkpoint**: US1 fully functional and independently testable — run `npm run e2e:us2` to verify

---

## Phase 4: User Story 2 — Manage Weight Log Entries (Priority: P2)

**Goal**: Detail view lists all entries; user can edit (with validation), delete (with confirmation), and add entries via existing logging flow

**Independent Test**: Navigate to `/progress/details` → verify full entry list with date+weight per row; edit entry weight to 85.0 → confirm list + overview both show 85.0; try saving weight 25 → error shown, original unchanged; try duplicate date → error shown; delete entry → confirmation prompt → entry removed; tap add-entry → existing logging flow opens → save → returns to details with new entry.

### Verification for User Story 2 ⚠️

> **Define these before implementation; run before story sign-off**

- [X] T011 [P] [US2] Create `e2e/helpers/weight-details-page.ts` page object with methods: `getEntries()`, `editEntry(index)`, `saveEdit(weight, date)`, `assertEditError(message)`, `deleteEntry(index)`, `confirmDelete()`, `tapAddEntry()`
- [X] T012 [US2] Extend `e2e/specs/progress-regression.spec.ts` with US2 scenarios: full entry list visible, valid edit updates list and overview, weight-out-of-range rejected with feedback, duplicate-date rejected with feedback, delete with confirmation, add-entry opens logging flow and returns to details

### Implementation for User Story 2

- [X] T013 [US2] Create `src/app/(tabs)/progress/details.tsx` — render full weight log list from `AppDataContext.weights` sorted DESC by `entryDate`; each row shows date and weight with edit and delete actions (FR-005)
- [X] T014 [US2] Add inline edit form in `src/app/(tabs)/progress/details.tsx` — fields for weight (validated 30–300 kg; show "Weight must be between 30 and 300 kg" on violation) and date (validated `YYYY-MM-DD`); call `context.updateWeight` on save; catch SQLite UNIQUE constraint error and show "An entry for this date already exists" (FR-006, FR-007, FR-007a, FR-007b, FR-008)
- [X] T015 [US2] Add delete action in `src/app/(tabs)/progress/details.tsx` — show confirmation dialog before calling `context.deleteWeight(id)`; on confirm, entry removed from list, overview, and graph data (FR-008a, FR-008b)
- [X] T016 [US2] Add add-entry button in `src/app/(tabs)/progress/details.tsx` that navigates to the existing weight logging flow; after successful save, return user to `/progress/details` (FR-008c)

**Checkpoint**: US1 + US2 both independently functional — run `npm run e2e` progress subset to verify

---

## Phase 5: User Story 3 — Inspect Weight Trend Graph (Priority: P3)

**Goal**: Detail view includes a line chart plotting weight entries over time with target horizontal line, correct y-range formula, real date x-axis, and landscape-capable layout

**Independent Test**: Navigate to `/progress/details` with seeded entries and target weight → chart SVG present; target line shown; y-axis starts at `targetWeight - 5` (or lower) and ends at `highestLogged + 5` (or higher); entries plotted at proportional date positions; single entry renders without implying trend; no entries → no chart shown, empty state message shown.

### Verification for User Story 3 ⚠️

> **Define these before implementation; run before story sign-off**

- [X] T017 [P] [US3] Extend `e2e/specs/progress-regression.spec.ts` with US3 scenarios: chart SVG present when entries exist, target line rendered, y-axis range label verification, single entry renders cleanly, no entries shows empty log state without chart, landscape layout readable without label overlap

### Implementation for User Story 3

- [X] T018 [US3] Create `src/components/weight-chart.tsx` — pure component accepting `WeightChartProps` (`entries: WeightEntry[]` sorted ASC, `targetWeight: number | null`, `yMin: number`, `yMax: number`, `testID?: string`); render via `react-native-svg`: smooth curve `Path` for log entries, horizontal `Line` for target, `Text` labels for y-axis ticks, x-axis date labels at proportional positions relative to elapsed calendar days between first and last entry (FR-009, FR-010, FR-013a)
- [X] T019 [US3] Integrate `WeightChart` into `src/app/(tabs)/progress/details.tsx` — compute `yMin`/`yMax` per data-model.md formula, sort entries ASC by `entryDate`, pass to `WeightChart`; when `entries.length === 0` hide chart and show empty state message; when `targetWeight` is null show UI note indicating target is needed for target-based scaling (FR-011, FR-012, FR-014)
- [X] T020 [US3] Add landscape-capable chart layout in `src/app/(tabs)/progress/details.tsx` — wrap chart in a horizontal `ScrollView` or use a fixed aspect-ratio container (wider than tall) so chart labels and plotted values remain readable on both portrait phone screens and landscape orientation (FR-013)

**Checkpoint**: All three user stories independently functional — run full `npm run e2e` suite

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T021 Run `npm run lint` (oxfmt + tsc + oxlint) and fix all type errors and lint violations across all changed files
- [X] T022 Run `npm run e2e` full suite; confirm all `progress-regression.spec.ts` scenarios pass (US1 + US2 + US3); fix any failures before sign-off
- [ ] T023 Complete quickstart.md acceptance validation checklist — manually verify all 11 acceptance rows (US1 overview, US1 empty state, US2 edit, US2 invalid edit, US2 delete, US2 add-entry, US3 chart visible, US3 target line, US3 range, US3 single entry, US3 no entries, US3 landscape)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **User Stories (Phase 3–5)**: All depend on Foundational completion; can proceed in priority order (US1 → US2 → US3); US2 and US3 both render in `details.tsx` so sequential delivery is natural
- **Polish (Phase 6)**: Depends on all desired stories complete

### User Story Dependencies

- **US1 (P1)**: No dependency on US2/US3 — independently testable via `/progress`
- **US2 (P2)**: No dependency on US3 — independently testable via `/progress/details` (chart not yet present)
- **US3 (P3)**: Adds `WeightChart` component into the `details.tsx` built in US2; US2 must be complete first

### Within Each User Story

- Verification tasks defined first; implementation follows; verification run at sign-off
- Prefer extending existing files (`progress-page.ts`, `progress-regression.spec.ts`) before adding new ones
- Models/types before services/context before screens before e2e

### Parallel Opportunities

- T003 and T004 (db.ts + types.ts) can run in parallel — different files
- T006 and T011 (e2e helper files) can run in parallel — different new files
- T017 (US3 e2e verification tasks) can be written in parallel with T018 (WeightChart component)
- T021 (lint) and T022 (e2e) can run in parallel after all implementation tasks complete

---

## Parallel Example: US1

```bash
# Define verification helpers in parallel:
Task: "Add weight overview assertion helpers to e2e/helpers/progress-page.ts"   # T006
Task: "Extend progress-regression.spec.ts with US1 scenarios"                    # T007

# Implement in sequence within US1:
Task: "Rework progress/index.tsx as weight-only overview"                         # T008
Task: "Add empty state to progress/index.tsx"                                     # T009
Task: "Add View details button in progress/index.tsx"                             # T010
```

## Parallel Example: US3

```bash
# In parallel:
Task: "Create src/components/weight-chart.tsx"                                    # T018
Task: "Extend progress-regression.spec.ts with US3 scenarios"                    # T017

# After T018:
Task: "Integrate WeightChart into details.tsx with y-range formula"               # T019
Task: "Add landscape-capable chart layout in details.tsx"                         # T020
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Complete Phase 3: US1 (T006–T010)
4. **STOP and VALIDATE**: run `npm run e2e:us2`, check weight overview independently
5. Ship or demo weight-only overview

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → weight-only progress overview → validate → ship (MVP)
3. US2 → weight entry management → validate → ship
4. US3 → weight trend chart → validate → ship
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no incomplete-task dependencies
- [Story] label maps task to specific user story for traceability
- `npm run e2e:us2` = progress regression subset — fastest feedback for this feature
- `npm run lint` = oxfmt + tsc + oxlint; run before every sign-off
- Y-range formula is in `data-model.md` — reference it directly when implementing T018/T019
- WeightChart props contract is in `contracts/weight-context-api.md` — implement T018 to match exactly
- Commit after each task or logical group; stop at each checkpoint to validate independently
