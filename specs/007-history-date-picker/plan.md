# Implementation Plan: History Date Picker

**Branch**: `007-history-date-picker` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-history-date-picker/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace the History tab's current tracked-day card list with one in-flow date
picker that defaults to today, keeps empty dates selectable for future meal
entry, and makes tracked dates visually stronger than empty dates. The work
will stay lean by extending the current History screen, existing date helpers,
the shared `MealEditor`, and the current Playwright History coverage instead of
adding a new dependency, new route, or parallel test suite.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, React Native, NativeWind, `expo-sqlite`, existing shared UI primitives, existing date helpers  
**Storage**: Existing local SQLite meal records via `expo-sqlite`; no schema change required  
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus targeted Playwright updates in `e2e/specs/history-regression.spec.ts` and `e2e/helpers/history-page.ts`  
**Target Platform**: iOS, Android, and web through the shared Expo Router tab app
**Project Type**: Expo cross-platform mobile app with shared file-based tab routing and Playwright web acceptance coverage  
**Performance Goals**: History should open on today and update selected-day content without perceptible lag or picker-induced layout jank during normal date changes  
**Constraints**: Keep empty dates selectable, emphasize tracked dates visually, preserve the existing History correction flow, avoid new dependencies, preserve cross-platform behavior, and extend existing Playwright coverage rather than adding parallel suites  
**Scale/Scope**: One touched routed screen, one existing date helper/component area, one app-data derivation surface, one Playwright page object/spec pair, and one History UI contract

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
  `npm run e2e:coverage` remain required checks. Existing Playwright History
  coverage will be extended for picker selection, empty-date handling, and
  correction-flow continuity.
- Acceptance proof mapping: User Stories 1, 2, and 3 all map to the existing
  `e2e/specs/history-regression.spec.ts` flow with helper updates in
  `e2e/helpers/history-page.ts`.
- UX consistency: The same History date-picker behavior and empty-day handling
  apply across iOS, Android, and web because the flow stays inside the shared
  Expo route and shared meal editor.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation, plus targeted `npm run e2e:us2`
  during development for the touched History journey.
- Complexity: No exception needed. Extending the current History screen and
  existing date helpers is simpler than adding a new dependency or a second
  History flow.
- Lean code: Prefer editing `src/app/(tabs)/history.tsx`,
  `src/components/date-navigator.tsx`, and existing History test files in
  place. Add a new helper only if it removes repeated calendar-grid logic
  cleanly.

## Project Structure

### Documentation (this feature)

```text
specs/007-history-date-picker/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── history-date-picker-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (tabs)/
│       └── history.tsx
├── components/
│   ├── date-navigator.tsx
│   ├── meal-editor.tsx
│   └── ui.tsx
├── context/
│   └── app-data.tsx
└── lib/
    ├── date.ts
    └── types.ts

e2e/
├── helpers/
│   └── history-page.ts
└── specs/
    └── history-regression.spec.ts
```

**Structure Decision**: Keep the existing single Expo app structure. Extend the
current History route in [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>),
reuse or expand the current date-navigation surface in
[src/components/date-navigator.tsx](/home/tanome/dev/lookr/src/components/date-navigator.tsx),
preserve the shared `MealEditor`, and extend the existing History Playwright
files instead of creating a new feature module.

## Phase 0: Research Summary

- Replace the tracked-day card list with one in-flow calendar picker rather
  than a restyled list or previous/next-only navigator.
- Build the picker from existing React Native primitives and current date
  helpers instead of adding a new dependency or relying on a platform-native
  picker that cannot clearly express tracked-date emphasis across platforms.
- Keep empty dates selectable, but give tracked dates stronger visual emphasis
  so users can still jump to an empty day for future meal entry.
- Keep one stable History layout: selected date visible, summary for tracked
  days, empty-day state for empty dates, and the current `MealEditor` flow
  still available in place.
- Extend `history-regression.spec.ts` and `history-page.ts` instead of adding a
  parallel acceptance suite.

## Phase 1: Design Summary

- Model the work around `HistorySelectionState`, `PickerDayCell`, existing
  `DailySummary`, and a derived tracked-date set built from current meal data.
- No persistence schema changes are required; the feature derives picker
  emphasis from current meals and summaries already in app state.
- One UI contract document captures the picker entry state, tracked-versus-
  empty emphasis, empty-day presentation, and refresh behavior after meal
  changes.
- Existing Playwright History coverage is extended to prove today-default
  behavior, tracked-date emphasis, empty-date selection, and continued
  correction flows after picker changes.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered through existing Playwright
  History coverage plus required repo quality commands.
- UX consistency remains centralized in the shared History route and meal
  editor with no intentional platform-specific divergence.
- No new dependency, route, or abstraction is required for this feature; the
  plan stays extension-first and aligned with the repo's lean-scope rules.
- Story-to-task traceability remains direct because all user stories stay
  inside one touched History flow and one existing acceptance spec.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
