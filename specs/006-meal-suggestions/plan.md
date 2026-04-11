# Implementation Plan: Meal Name Suggestions

**Branch**: `006-meal-suggestions` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-meal-suggestions/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add reusable prior-meal suggestions to the existing shared meal modal so users
can type three or more characters, pause briefly, pick one of up to five
distinct prefix matches ordered by most recent use, and have the current form
populate meal name, points, and optional meal type. Keep the slice lean by
deriving suggestions from already-loaded meal data inside the existing meal
editor flow and by extending the current Playwright meal specs instead of
adding new storage, routes, or test suites.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, React Native, NativeWind, `expo-sqlite`, `react-native-safe-area-context`, `@playwright/test`  
**Storage**: Existing local SQLite meal records via `expo-sqlite`; no schema change planned for this slice  
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus targeted Playwright updates in `dashboard-core.spec.ts`, `history-regression.spec.ts`, and shared page helpers  
**Target Platform**: iOS, Android, and web through the shared Expo tab application  
**Project Type**: Expo cross-platform mobile app with file-based routes and Playwright web acceptance coverage  
**Performance Goals**: Suggestions feel immediate after a short pause, avoid visible jank while typing, and never appear before the three-character threshold  
**Constraints**: Prefix-only matching, max five suggestions, most-recent-first ordering, no duplicate suggestions after normalization, edit mode must stay quiet until the meal name changes, extend existing tests before adding new suites, and avoid new dependencies  
**Scale/Scope**: One shared meal editor component, one existing meal data source, current Home and History flows, and the current Playwright meal acceptance specs plus seed fixtures

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
  `npm run e2e:coverage` stay required. Existing Playwright meal specs and page
  helpers will be extended to prove threshold behavior, debounce-safe
  appearance, duplicate collapsing, suggestion ordering, value hydration, and
  edit-mode suppression.
- Acceptance proof mapping: User Story 1 maps primarily to
  `e2e/specs/dashboard-core.spec.ts`, User Story 2 maps to
  `e2e/specs/history-regression.spec.ts`, and User Story 3 maps to the same
  specs plus duplicate-heavy seeded state in `e2e/fixtures/seed-states.ts`.
- UX consistency: Home and History already share `MealEditor`, so suggestion
  trigger rules, ordering, empty states, and applied-value behavior must match
  across Android, iOS, and web without a platform fork.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation, plus concise manual review that
  the suggestion list stays secondary and does not obscure name, points, or
  meal type controls.
- Complexity: No exception needed. Using the existing `meals` prop as the
  source of truth is simpler than adding a new suggestion table, remote search,
  or separate form component.
- Lean code: Prefer evolving `MealEditor` in place and add only a small local
  helper for suggestion normalization or debounce timing if it clearly improves
  readability.

## Project Structure

### Documentation (this feature)

```text
specs/006-meal-suggestions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── meal-suggestions-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (tabs)/
│       ├── history.tsx
│       └── index.tsx
├── components/
│   └── meal-editor.tsx
├── context/
│   └── app-data.tsx
└── lib/
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
the current meal flow in place. The shared modal already lives in
[src/components/meal-editor.tsx](/home/tanome/dev/lookr/src/components/meal-editor.tsx),
with data supplied from [src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx),
so adding a new feature module or data source would add indirection without
benefit for this slice.

## Phase 0: Research Summary

- Derive suggestions in `MealEditor` from the already loaded `meals` array
  instead of adding a new database query path or storage structure.
- Normalize candidate names by trimming outer whitespace and lowercasing for
  duplicate collapse while preserving the latest stored display name for the
  visible suggestion row.
- Use a small debounce on the meal-name draft so the list refreshes after the
  user pauses rather than on every keystroke.
- In edit mode, keep the existing meal name quiet on first open and only start
  suggestion lookup after the user changes the field.
- Reuse and extend the current Playwright meal specs and page helpers to prove
  ordering, duplicate collapse, and populated-form behavior.

## Phase 1: Design Summary

- `MealEntry` stays the canonical stored record; no schema change is needed for
  suggestion lookup because the feature reuses existing meal name, points, meal
  type, and recency data already present in memory.
- Add a derived `MealSuggestion` view-model in the meal editor layer that
  stores normalized matching identity plus the selected source meal fields used
  to populate the form.
- `MealEditor` gains local draft, debounce, edit-mode change detection, and a
  bounded suggestion list rendered inside the existing modal below the meal
  name field.
- Home and History keep current routing and data ownership while benefiting
  from the same shared suggestion behavior through the existing meal editor.
- Existing Playwright meal specs remain the acceptance proof and add seeded
  duplicate-name scenarios plus helper methods for suggestion visibility and
  selection.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered: the changed user-facing flow
  stays mapped to existing Playwright specs rather than new manual-only claims.
- UX consistency stays strong because both touched flows still share one modal
  component and one suggestion contract across supported platforms.
- Required repo checks remain narrow and routine:
  `npm run lint`, `npm run typecheck`, and `npm run e2e:coverage`.
- No unjustified dependency, route, or persistence layer is added. The plan
  extends the current meal editor and test helpers instead of introducing a
  parallel reuse system.
- Story-to-task traceability stays straightforward because each user story maps
  to the shared meal editor plus one existing acceptance spec file.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
