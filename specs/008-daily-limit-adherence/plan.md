# Implementation Plan: Daily Limit Adherence

**Branch**: `008-daily-limit-adherence` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-daily-limit-adherence/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Let users update the daily points limit from Progress while keeping past
adherence judged by the limit active on each past date. The lean path is to
extend the current SQLite profile storage with dated limit history, derive
per-day summaries from that history inside existing app-data logic, keep Home
focused on current-day budget display, update shared History and Progress flows
in place, and extend current Playwright coverage instead of adding new routes,
new stores, or parallel test suites.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, React Native, NativeWind, `expo-sqlite`, existing shared UI primitives, existing date helpers  
**Storage**: Existing local SQLite via `expo-sqlite`, with an additive history table for dated daily point limit changes plus the current `user_profile` row retained for latest-limit reads  
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus targeted Playwright updates in `e2e/specs/dashboard-core.spec.ts`, `e2e/specs/history-regression.spec.ts`, and `e2e/specs/progress-regression.spec.ts`  
**Target Platform**: iOS, Android, and web through the shared Expo Router tab app  
**Project Type**: Expo cross-platform mobile app with shared file-based tab routing and Playwright web acceptance coverage  
**Performance Goals**: Current-day and history summaries should refresh without perceptible lag after a limit change, meal edit, or day switch during normal single-user local usage  
**Constraints**: Keep behavior consistent across platforms, preserve local-only storage, treat same-day limit changes as applying to the whole current day, keep past adherence tied to historical effective limits, avoid new dependencies, and extend existing acceptance coverage rather than adding parallel suites  
**Scale/Scope**: One additive SQLite migration, one shared app-data derivation layer, three touched tab screens, existing types/helpers, existing E2E fixtures/page objects/specs, and one feature-specific UI/data contract

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
  `npm run e2e:coverage` remain required checks. Existing Playwright flows will
  be extended for limit editing, historical adherence preservation, and
  progress-count consistency.
- Acceptance proof mapping: User Story 1 maps to
  `e2e/specs/progress-regression.spec.ts` for editing and
  `e2e/specs/dashboard-core.spec.ts` for Home display and absence checks; User
  Story 2 maps to `e2e/specs/history-regression.spec.ts`; User Story 3 maps to
  `e2e/specs/progress-regression.spec.ts`.
- UX consistency: Home, History, and Progress all use the same derived
  day-summary logic from shared app data, so one historical-limit rule drives
  all platforms.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation, plus targeted Playwright runs
  for touched specs during development.
- Complexity: No exception needed. Extending current SQLite storage, app data,
  and the existing screens is simpler than adding a new state layer or
  separate adherence snapshots table.
- Lean code: Prefer edits in `src/lib/db.ts`, `src/context/app-data.tsx`,
  `src/lib/types.ts`, touched tab screens, and current Playwright helpers and
  fixtures. Add a small helper or type only if it removes repeated
  effective-limit lookup logic cleanly.

## Project Structure

### Documentation (this feature)

```text
specs/008-daily-limit-adherence/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── daily-limit-adherence-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (tabs)/
│       ├── history.tsx
│       ├── index.tsx
│       └── progress.tsx
├── context/
│   └── app-data.tsx
└── lib/
    ├── db.ts
    ├── date.ts
    └── types.ts

e2e/
├── fixtures/
│   └── seed-states.ts
├── helpers/
│   ├── dashboard-page.ts
│   ├── history-page.ts
│   └── progress-page.ts
└── specs/
    ├── dashboard-core.spec.ts
    ├── history-regression.spec.ts
    └── progress-regression.spec.ts
```

**Structure Decision**: Keep the existing single Expo app structure. Extend the
current shared storage and derived state in
[src/lib/db.ts](/home/tanome/dev/lookr/src/lib/db.ts),
[src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx),
and [src/lib/types.ts](/home/tanome/dev/lookr/src/lib/types.ts), then update
the current Home, History, and Progress routes in place. Acceptance coverage
stays in the existing Playwright specs and helpers instead of adding a new test
suite or feature module.

## Phase 0: Research Summary

- Store dated daily-limit changes in an additive SQLite history table rather
  than only overwriting the single profile row, because past-day adherence now
  depends on the effective limit for each date.
- Keep the current `user_profile` row as the latest-limit cache and append one
  history row per saved limit change so first-load profile reads stay simple.
- Derive day summaries by resolving an effective limit per date in shared
  app-data logic instead of persisting separate adherence snapshots, because
  past-day edits must still recalculate against the historical limit active on
  that past date.
- Reuse existing screen structure and shared summary consumers on Home,
  History, and Progress so one day-summary rule drives all visible adherence
  behavior.
- Extend existing Playwright fixtures, helpers, and specs to prove same-day
  limit changes, historical adherence preservation, and progress consistency.

## Phase 1: Design Summary

- Add a persisted `daily_point_limit_history` entity and load it beside profile,
  meals, and weights during refresh.
- Extend `DailySummary`-like derivation so each date resolves its own effective
  limit and status from historical limit changes plus meal totals.
- Keep Home focused on current-day budget display without exposing daily limit
  editing after setup.
- Put existing daily limit editing in Progress, with current-day metrics and
  adherence totals refreshing immediately after save.
- Keep History summary cards and Progress adherence metrics driven by the same
  per-date effective-limit derivation, including recalculation of edited past
  days against the limit active on those dates.
- One contract document captures visible limit-editing behavior, historical
  adherence rules, and acceptance-oriented hooks across Home, History, and
  Progress.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered through targeted extensions to
  the current Playwright specs plus required repo quality commands.
- UX consistency remains centralized in shared app-data derivation and shared
  Expo routes with no intentional platform-specific divergence.
- No new dependency or parallel state layer is required; the plan stays
  extension-first and lean by adding one bounded schema slice and deriving the
  rest from existing records.
- Story-to-task traceability stays direct because each user story maps to one
  touched acceptance spec and a small set of existing source files.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
