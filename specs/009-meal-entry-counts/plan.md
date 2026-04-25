# Implementation Plan: Meal Entry Counts

**Branch**: `009-meal-entry-counts` | **Date**: 2026-04-25 | **Spec**: [spec.md](/home/tanome/dev/lookr/specs/009-meal-entry-counts/spec.md)
**Input**: Feature specification from `/home/tanome/dev/lookr/specs/009-meal-entry-counts/spec.md`

**Note**: This file is produced by the `/speckit.plan` command.

## Summary

Add a whole-number meal count to the shared meal add/edit modal. Counted saves create multiple separate `meal_entries` rows, preserving existing storage and summary math. History displays exact same-day duplicate meals as one combined row with visible count and multiplied points, while edit/delete actions apply to all represented rows and keep day totals accurate.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Expo SDK 55, React Native 0.83, Expo Router
**Primary Dependencies**: React Native, Expo Router, NativeWind, `expo-sqlite`, existing shared UI primitives, existing Playwright helpers
**Storage**: Existing local SQLite `meal_entries`; no schema change. Counted meals are stored as separate rows.
**Testing**: Playwright (`npm run e2e:coverage`, focused specs), TypeScript (`npm run typecheck`), Oxc formatting/linting (`npm run lint`)
**Target Platform**: Expo app on web, iOS, and Android; automated user-flow proof on React Native Web through Playwright
**Project Type**: Mobile app with web E2E harness
**Performance Goals**: Adding or editing up to 99 entries stays responsive in normal local SQLite use; history grouping runs over in-memory meals for one selected day without perceptible delay.
**Constraints**: Count must be integer 1-99; single-count behavior stays unchanged; future-date meal restrictions stay enforced; no copyleft dependencies; no new schema for count.
**Scale/Scope**: Shared meal editor, dashboard meal totals, history grouped display/edit/delete, and Playwright coverage for counted add and grouped history behavior.

## Constitution Check

_GATE: Pass before Phase 0 research. Re-check after Phase 1 design._

- Verification strategy defined before implementation begins: extend Playwright dashboard and history flows, then run `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, and focused Playwright specs.
- Acceptance criteria mapped to concrete automated proof:
  - US1 add counted meal: dashboard flow adds count 3 and asserts consumed/remaining totals and underlying snapshot row count.
  - US2 combined history rows: history flow seeds exact duplicates and asserts one visible row with count and multiplied points, plus separate rows for non-exact details.
  - US3 manage combined row: history edit/delete flow updates a combined row count and removes all represented rows.
- Every feature updates tests. Existing `dashboard-core.spec.ts`, `history-regression.spec.ts`, page helpers, seed states, and coverage manifest are extended before adding new suites.
- UX consistency review covers shared `MealEditor`, so dashboard and history modal behavior stays aligned across platforms. No intentional platform-specific variation.
- Required quality commands: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus focused `npm run e2e:us1` and `npm run e2e:us2` when implementation changes land.
- Story-to-task traceability: each story has distinct implementation and verification work in the future `tasks.md`.
- Complexity exceptions: none.
- Implementation is extension-first: update shared `MealEditor`, app data helpers, and history route rather than adding a parallel logging flow. New helper types/functions are allowed only where they make grouped row handling traceable.

## Project Structure

### Documentation (this feature)

```text
/home/tanome/dev/lookr/specs/009-meal-entry-counts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
/home/tanome/dev/lookr/
├── src/
│   ├── app/
│   │   └── (tabs)/
│   │       ├── index.tsx
│   │       └── history.tsx
│   ├── components/
│   │   └── meal-editor.tsx
│   ├── context/
│   │   └── app-data.tsx
│   └── lib/
│       ├── db.ts
│       └── types.ts
├── e2e/
│   ├── fixtures/
│   │   └── seed-states.ts
│   ├── helpers/
│   │   ├── dashboard-page.ts
│   │   └── history-page.ts
│   └── specs/
│       ├── dashboard-core.spec.ts
│       └── history-regression.spec.ts
└── playwright/
    └── coverage.manifest.json
```

**Structure Decision**: Keep work inside the existing Expo app. `MealEditor` remains the shared surface for add/edit controls. App data remains the state boundary around SQLite writes and refreshes. History grouping can be prepared in the history screen or a narrowly scoped helper near the history flow if keeping it inline becomes hard to read.

## Complexity Tracking

No constitution violations or complexity exceptions.

## Phase 0 Research

See [research.md](/home/tanome/dev/lookr/specs/009-meal-entry-counts/research.md).

Research resolved storage, grouping identity, edit/delete semantics, validation, and test strategy. No open clarification items remain.

## Phase 1 Design

See [data-model.md](/home/tanome/dev/lookr/specs/009-meal-entry-counts/data-model.md), [quickstart.md](/home/tanome/dev/lookr/specs/009-meal-entry-counts/quickstart.md), and [ui-contract.md](/home/tanome/dev/lookr/specs/009-meal-entry-counts/contracts/ui-contract.md).

Post-design Constitution Check remains passing:

- Tests map all acceptance scenarios to Playwright proof.
- No new dependency, database migration, or speculative abstraction is introduced.
- UI behavior is centralized in the shared meal editor and reviewed through dashboard/history flows.
- Verification commands are concrete and already present in `package.json`.
