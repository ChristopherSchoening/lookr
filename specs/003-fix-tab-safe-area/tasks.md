# Tasks: Android Tab Bar Safe Area

**Input**: Design documents from `/specs/003-fix-tab-safe-area/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Verification tasks are REQUIRED for this feature because it changes a
user-visible shared navigation workflow. Use the repo quality commands plus the
manual acceptance checks already defined in `specs/003-fix-tab-safe-area/quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
Implementation tasks SHOULD favor extending existing files or modules when that
keeps the design readable; introduce new files only when they improve clarity
or reuse enough to justify the added surface area.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the shared navigation touch points and align execution docs
before code changes begin

- [x] T001 Review the current shared tab shell and root app shell in `src/app/(tabs)/_layout.tsx` and `src/app/_layout.tsx`
- [x] T002 Align the implementation and manual acceptance notes for this feature in `specs/003-fix-tab-safe-area/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared safe-area foundation needed by all tab-layout work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update the app shell to provide safe-area context in `src/app/_layout.tsx`
- [x] T004 Capture the chosen shared tab-bar inset rules in `specs/003-fix-tab-safe-area/contracts/tab-bar-layout-contract.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in sequence

---

## Phase 3: User Story 1 - Reach Tabs Above System Navigation (Priority: P1) 🎯 MVP

**Goal**: Make the Android bottom tabs fully visible and tappable above the
system navigation bar on first render

**Independent Test**: Start the app on Android, open a tabbed screen, confirm
the full tab bar is visible above system navigation, then tap Dashboard,
History, and Progress successfully.

### Verification for User Story 1 ⚠️

- [x] T005 [US1] Record the Android first-render and tappable-tab manual acceptance steps in `specs/003-fix-tab-safe-area/quickstart.md`

### Implementation for User Story 1

- [x] T006 [US1] Replace fixed bottom tab-bar spacing with inset-aware spacing in `src/app/(tabs)/_layout.tsx`
- [x] T007 [US1] Update shared screen bottom clearance to stay compatible with the inset-aware tab bar in `src/components/ui.tsx`
- [x] T008 [US1] Verify the final US1 behavior against the Android visibility and tap-target contract in `specs/003-fix-tab-safe-area/contracts/tab-bar-layout-contract.md`

**Checkpoint**: User Story 1 should now deliver a visible and tappable Android tab bar

---

## Phase 4: User Story 2 - Keep Navigation Stable Across Common Android Layout Changes (Priority: P2)

**Goal**: Keep the corrected Android tab position stable while users move across
the shared tab destinations

**Independent Test**: On Android, switch between Dashboard, History, and
Progress at least twice and confirm the tab bar never drifts under system
navigation after redraws.

### Verification for User Story 2 ⚠️

- [x] T009 [US2] Record the repeated-tab-switch Android acceptance steps in `specs/003-fix-tab-safe-area/quickstart.md`

### Implementation for User Story 2

- [x] T010 [US2] Stabilize the resolved bottom offset across tab destination changes in `src/app/(tabs)/_layout.tsx`
- [x] T011 [US2] Recheck the stability expectations in `specs/003-fix-tab-safe-area/contracts/tab-bar-layout-contract.md` against the implemented tab-shell behavior

**Checkpoint**: User Stories 1 and 2 should now both work on Android

---

## Phase 5: User Story 3 - Preserve Expected Layout on iOS and Web (Priority: P3)

**Goal**: Keep iOS and web spacing aligned with the current intended floating
tab-bar layout while the Android fix remains in place

**Independent Test**: Open the same shared tab flow on iOS and web and confirm
the tab bar keeps its expected floating spacing with no extra bottom gap or
clipping on either platform.

### Verification for User Story 3 ⚠️

- [x] T012 [US3] Record the iOS and web smoke acceptance steps in `specs/003-fix-tab-safe-area/quickstart.md`

### Implementation for User Story 3

- [x] T013 [US3] Add any required platform guard or minimum-offset logic for iOS and web layouts in `src/app/(tabs)/_layout.tsx`
- [x] T014 [US3] Confirm the iOS and web spacing expectations in `specs/003-fix-tab-safe-area/contracts/tab-bar-layout-contract.md` match the implemented behavior

**Checkpoint**: All three user stories should now be functional and independently verifiable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish verification evidence and repo-wide quality checks

- [x] T015 Update the implementation summary and verification evidence in `specs/003-fix-tab-safe-area/quickstart.md`
- [x] T016 [P] Run `npm run lint` from repository root and record the result in `specs/003-fix-tab-safe-area/quickstart.md`
- [x] T017 [P] Run `npm run typecheck` from repository root and record the result in `specs/003-fix-tab-safe-area/quickstart.md`
- [x] T018 Capture Android, iOS, and web tab-bar verification evidence or document why visual evidence is unnecessary in `specs/003-fix-tab-safe-area/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 because the same shared tab shell must first produce the corrected Android position
- **User Story 3 (Phase 5)**: Depends on User Story 1 and should run after User Story 2 if the same tab-shell logic is still being tuned
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and delivers the MVP fix
- **User Story 2 (P2)**: Builds on the shared tab-shell fix from US1
- **User Story 3 (P3)**: Builds on the shared tab-shell fix from US1 and confirms it does not regress iOS or web

### Within Each User Story

- Write or refresh manual acceptance notes before sign-off
- Extend the existing shared tab shell before adding any new abstraction
- Keep root safe-area setup in place before tab-shell tuning
- Recheck the UI contract after each story's implementation task
- Complete story-specific validation before moving to the next story

### Parallel Opportunities

- `T016` and `T017` can run in parallel after implementation is complete

---

## Parallel Example: Polish

```bash
Task: "Run npm run lint from repository root and record the result in specs/003-fix-tab-safe-area/quickstart.md"
Task: "Run npm run typecheck from repository root and record the result in specs/003-fix-tab-safe-area/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate Android tab visibility and tappability

### Incremental Delivery

1. Finish setup and safe-area foundation
2. Deliver US1 for visible and tappable Android tabs
3. Add US2 for stable tab placement across tab switches
4. Add US3 for iOS/web spacing protection
5. Finish repo quality checks and evidence capture

### Suggested MVP Scope

- User Story 1 only

## Notes

- [P] tasks use different work items and do not depend on each other
- All tasks keep scope inside existing shared navigation files unless a small
  support edit in `src/components/ui.tsx` becomes necessary
- Manual acceptance is part of completion for every story because native layout
  automation is not present in this repo yet
