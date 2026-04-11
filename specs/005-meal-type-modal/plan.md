# Implementation Plan: Meal Type Modal Editing

**Branch**: `005-meal-type-modal` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-meal-type-modal/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add optional meal type support to the existing meal flow, move meal creation
into a dedicated modal, reuse that same modal for editing existing meals, and
preserve all legacy untyped meal records through an additive SQLite migration.
The implementation stays lean by extending the current meal data model, shared
`MealEditor` component, Home and History tab flows, and existing Playwright
coverage instead of introducing new route-level feature modules.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, React Native, NativeWind, `expo-sqlite`, `react-native-safe-area-context`, `@playwright/test`  
**Storage**: Local SQLite via `expo-sqlite`, with an additive `meal_entries` schema migration for optional `meal_type`  
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus targeted Playwright updates in `dashboard-core.spec.ts` and `history-regression.spec.ts`  
**Target Platform**: iOS, Android, and web through the shared Expo tab application
**Project Type**: Expo cross-platform mobile app with file-based routes and Playwright web acceptance coverage  
**Performance Goals**: Modal open, add, edit, and delete flows stay at current interaction speed with no noticeable added delay or layout jank on touched meal surfaces  
**Constraints**: Keep old meal rows valid without forced backfill, reuse one modal for add and edit, keep meal type secondary in the UI, extend existing tests before adding new suites, and avoid new dependencies for this slice  
**Scale/Scope**: Two touched tab routes, one shared meal component, the current app-data/database layer, and the existing Playwright meal flows plus seeded legacy-data coverage

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Verification strategy defined before implementation begins, including
  automated checks and manual acceptance for each affected user story
- Acceptance criteria mapped to concrete automated proof, with end-to-end
  coverage called out for user-facing flows
- Every feature or fix updates or adds at least one test; small changes prefer
  extending existing tests before adding new suites
- UX consistency review defined for all touched platforms, including any
  intentional platform-specific deviations with rationale
- Required repository quality commands identified and scheduled in the plan
- Story-to-task traceability preserved so each user story can be validated
  independently
- Complexity exceptions documented only when a simpler alternative was rejected
- Implementation approach keeps added code lean, readable, modular, and
  extension-first, with new abstractions justified explicitly

Status: PASS

- Verification strategy: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` stay required. Existing Playwright meal specs will be
  extended to cover add-modal behavior, shared edit-modal behavior, typed and
  untyped saves, and legacy untyped meals.
- Acceptance proof mapping: User Story 1 maps to
  `e2e/specs/dashboard-core.spec.ts`, User Story 2 maps to
  `e2e/specs/history-regression.spec.ts`, and User Story 3 maps to the same
  meal specs with seeded legacy rows lacking `mealType`.
- UX consistency: Home and History already share the same meal component, so
  the modal flow, validation, dismissal behavior, and small meal-type
  indicator must match on Android, iOS, and web.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation, plus concise manual review of
  modal presentation and meal-type emphasis on touched platforms.
- Complexity: No exception needed. Extending the existing SQLite layer,
  app-data context, meal component, and current Playwright files is simpler
  than adding new routes, stores, or duplicate form components.
- Lean code: Prefer evolving `MealEditor` in place. Add a small helper or UI
  primitive only if it clearly reduces repetition between add/edit state or
  meal-type indicator rendering.

## Project Structure

### Documentation (this feature)

```text
specs/005-meal-type-modal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── meal-modal-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (tabs)/
│       ├── index.tsx
│       └── history.tsx
├── components/
│   ├── meal-editor.tsx
│   └── ui.tsx
├── context/
│   └── app-data.tsx
└── lib/
    ├── db.ts
    └── types.ts

e2e/
├── fixtures/
│   └── seed-states.ts
├── helpers/
│   ├── app-helpers.ts
│   ├── dashboard-page.ts
│   └── history-page.ts
└── specs/
    ├── dashboard-core.spec.ts
    └── history-regression.spec.ts
```

**Structure Decision**: Keep the existing single Expo app structure and extend
the current meal feature files in place. The shared meal flow already spans
[src/components/meal-editor.tsx](/home/tanome/dev/lookr/src/components/meal-editor.tsx),
[src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx),
and [src/lib/db.ts](/home/tanome/dev/lookr/src/lib/db.ts), so adding a second
feature module would increase indirection without helping this slice.

## Phase 0: Research Summary

- Persist `mealType` directly on the existing meal record as an optional field
  so typed and untyped meals share one canonical model.
- Use an additive SQLite migration to add nullable `meal_type`, preserving
  older rows without user repair or backfill.
- Reuse one shared modal form for both add and edit flows by evolving the
  existing `MealEditor` component instead of creating duplicate forms.
- Render meal type as a small secondary indicator on all meal displays so the
  saved classification is visible without overtaking meal name or points.
- Extend the current Playwright specs, helpers, and seeded state to prove typed
  saves, untyped saves, edit behavior, and legacy migration behavior.

## Phase 1: Design Summary

- `MealEntry` and E2E seed state gain an optional `mealType` field with four
  allowed values and unset support for legacy rows.
- Database bootstrapping adds nullable `meal_type` and threads it through list,
  insert, update, and seed flows without changing summary math.
- `MealEditor` becomes a shared modal-backed add/edit surface and owns meal
  type selection, clearing, validation, dismissal, and small indicator output.
- Home and History keep current routing and data ownership while wiring the
  updated modal entry points into the shared meal component.
- Existing Playwright meal specs remain the acceptance proof and add migration
  coverage by seeding legacy meals with no type.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered: both touched user-facing
  stories map to existing Playwright specs, and migration proof is added
  through seeded legacy meals rather than a manual-only claim.
- UX consistency stays strong because Home and History continue to share the
  same meal component and modal contract across supported platforms.
- Required repo checks are identified and remain narrow:
  `npm run lint`, `npm run typecheck`, and `npm run e2e:coverage`.
- No unjustified dependency or abstraction is introduced. The plan extends
  existing files instead of adding a new state layer, modal stack, or test
  suite.
- Story-to-task traceability stays straightforward because each user story maps
  to the current meal data layer, shared UI component, and one existing E2E
  spec file.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
