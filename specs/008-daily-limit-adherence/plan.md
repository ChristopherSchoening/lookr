# Implementation Plan: Daily Limit Adherence

**Branch**: `008-daily-limit-adherence` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-daily-limit-adherence/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Let users set and update the daily points limit from Progress while keeping
past adherence judged by the limit active on each past date. Home must never
show the daily limit setting; when setup is missing, Home shows a compact path
to Progress setup, and after setup it only shows current-day budget feedback.
The implementation path is to keep dated daily-limit history in local SQLite,
derive per-day summaries from that history in shared app data, move the
initial/edit limit UI from Home to Progress, support positive whole-number and
decimal limits, and extend existing Playwright coverage.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55
**Primary Dependencies**: Expo Router, React Native, NativeWind, `expo-sqlite`, existing shared UI primitives, existing date helpers, existing Playwright helpers
**Storage**: Existing local SQLite via `expo-sqlite`; keep `user_profile` as latest-limit cache and `daily_point_limit_history` as dated effective-limit history, with saved limit values treated as positive numbers that may include decimals
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, plus targeted Playwright updates in `e2e/specs/dashboard-core.spec.ts`, `e2e/specs/history-regression.spec.ts`, and `e2e/specs/progress-regression.spec.ts`
**Target Platform**: iOS, Android, and web through the shared Expo Router tab app
**Project Type**: Expo cross-platform mobile app with shared file-based tab routing and Playwright web acceptance coverage
**Performance Goals**: Current-day and history summaries refresh without perceptible lag after a limit save, meal edit, or day switch during normal single-user local usage; users can set or change the limit from Progress in under 1 minute
**Constraints**: Keep behavior consistent across platforms, preserve local-only storage, treat same-day limit changes as applying to the whole current day, keep past adherence tied to historical effective limits, accept positive whole-number or decimal limits without rounding, avoid new dependencies, and extend existing acceptance coverage rather than adding parallel suites
**Scale/Scope**: One storage/validation adjustment for numeric limits, one shared app-data derivation path, three touched tab screens, existing types/helpers, existing E2E fixtures/page objects/specs, and one feature-specific UI/data contract

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
  be extended for Progress setup/edit, Home absence/prompt behavior, historical
  adherence preservation, decimal-limit validation, and progress-count
  consistency.
- Acceptance proof mapping: User Story 1 maps to
  `e2e/specs/progress-regression.spec.ts` for Progress setup/edit and decimal
  validation, plus `e2e/specs/dashboard-core.spec.ts` for Home prompt,
  budget-display, and absence checks. User Story 2 maps to
  `e2e/specs/history-regression.spec.ts`. User Story 3 maps to
  `e2e/specs/progress-regression.spec.ts`.
- UX consistency: Home, History, and Progress all consume the same derived
  day-summary logic from shared app data, so one historical-limit rule drives
  all platforms. Home remains a daily status surface; Progress owns limit setup
  and edits.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation, plus targeted Playwright runs
  for touched specs during development.
- Complexity: No exception needed. Moving existing limit UI to Progress and
  preserving the shared derivation path is simpler than introducing another
  settings route or parallel state layer.
- Lean code: Prefer edits in `src/app/(tabs)/index.tsx`,
  `src/app/(tabs)/progress.tsx`, `src/context/app-data.tsx`, `src/lib/db.ts`,
  `src/lib/types.ts`, current Playwright helpers, and existing fixtures. Add a
  helper only if it removes repeated numeric-limit validation or effective-limit
  lookup logic cleanly.

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

- Keep dated daily-limit changes in SQLite history rather than only overwriting
  the single profile row, because past-day adherence depends on the effective
  limit for each date.
- Keep the current `user_profile` row as the latest-limit cache and append one
  history row per saved limit so first-load reads stay simple.
- Store and derive daily point limits as positive numbers, not whole-number-only
  values, so decimal limits are accepted consistently in profile, history,
  current-day budget, and adherence calculations.
- Derive day summaries by resolving an effective limit per date in shared
  app-data logic instead of persisting separate adherence snapshots.
- Put both initial daily limit setup and later edits in Progress. Home only
  displays current-day budget feedback after setup and a prompt/action to
  Progress before setup.
- Extend existing Playwright fixtures, helpers, and specs to prove Progress
  setup/edit, Home absence/prompt behavior, same-day refresh, decimal-limit
  acceptance, historical adherence preservation, and progress consistency.

## Phase 1: Design Summary

- Keep or adjust the persisted `daily_point_limit_history` entity so saved limit
  values preserve positive decimals, then load it beside profile, meals, and
  weights during refresh.
- Extend `DailySummary` derivation so each date resolves its own positive
  numeric effective limit and status from historical limit changes plus meal
  totals.
- Move initial setup and existing-limit editing from Home to Progress, keeping
  validation and save feedback in Progress.
- Keep Home focused on current-day budget display; when no limit exists, show a
  brief action that routes the user to Progress setup without exposing the
  setting on Home.
- Keep History summary cards and Progress adherence metrics driven by the same
  per-date effective-limit derivation, including recalculation of edited past
  days against the limit active on those dates.
- Update existing Playwright helper ownership so Progress helpers perform limit
  setup/edit, while dashboard helpers assert Home prompt, budget display, and
  absence of the setting.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered through targeted extensions to
  current Playwright specs plus required repo quality commands.
- UX consistency remains centralized in shared app-data derivation and shared
  Expo routes with no intentional platform-specific divergence.
- No new dependency, route, or parallel state layer is required. The plan stays
  extension-first by moving existing UI ownership and reusing current storage
  and summary derivation.
- Story-to-task traceability stays direct because each user story maps to one
  touched acceptance spec and a small set of existing source files.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
