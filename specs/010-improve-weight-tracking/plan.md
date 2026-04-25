# Implementation Plan: Improve Weight Tracking

**Branch**: `010-improve-weight-tracking` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-improve-weight-tracking/spec.md`

## Summary

Rework the progress screen into a weight-only overview with navigation to a new detail view. The detail view lists all weight log entries (editable and deletable with confirmation), provides an add-entry action reusing the existing logging flow, and displays a line-curve chart of weight entries over time with the target weight shown as a reference line. Target weight is added to the user profile (DB migration v4). Navigation uses a nested expo-router Stack within the progress tab.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: React Native 0.83.4, Expo 55, expo-router ~55.0.11, nativewind 4, expo-sqlite ~55.0.14, react-native-reanimated 4.2.1, react-native-svg (to be added via `npx expo install react-native-svg`)
**Storage**: expo-sqlite — SQLite (`lookr.db`), schema currently at DB version 3; target weight column added in migration v4
**Testing**: Playwright e2e (web mode only), `npm run e2e`; `npm run lint` (oxfmt + tsc + oxlint); progress coverage extended in `e2e/specs/progress-regression.spec.ts`
**Target Platform**: iOS 15+, Android, Web (Playwright tests run on Expo web)
**Project Type**: Mobile-first React Native app (Expo managed workflow)
**Performance Goals**: Chart renders without jank for up to 100 weight entries; UI remains responsive on phone hardware
**Constraints**: Chart must render on web (react-native-svg renders as `<svg>` on web — Playwright-compatible); offline-capable; no new tab routes — detail view is a stack push within the existing progress tab
**Scale/Scope**: Personal fitness app; single user; small dataset (tens to low hundreds of weight entries)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- ✅ Verification strategy defined before implementation: all 3 user stories have acceptance scenarios mapped to Playwright automation in `progress-regression.spec.ts`; manual acceptance steps identified in quickstart.md
- ✅ Acceptance criteria mapped to concrete automated proof: each spec "Automated Proof" note names the exact test extension and file; end-to-end coverage is the default proof for all user-facing scenarios
- ✅ Every change adds or extends at least one test; new suites added only where existing `progress-regression.spec.ts` cannot cleanly express the new scenarios
- ✅ UX consistency review: single-platform app (React Native/Expo); web mode used for testing only; no intentional platform deviations introduced
- ✅ Quality commands identified: `npm run lint`, `npm run e2e` (full suite), `npm run e2e:us2` (progress subset)
- ✅ Story-to-task traceability: each implementation task below maps to a user story and FR
- ✅ No complexity exceptions required
- ✅ Implementation is extension-first: `progress.tsx` restructured (not duplicated); new abstractions (`weight-chart.tsx`, `weight-details-page.ts`) justified — no existing component satisfies the SVG chart need

**Post-design re-check**: Pass — design introduces one new package (`react-native-svg`), one new screen (`details.tsx`), one new component (`weight-chart.tsx`), and one new e2e helper. Each is individually justified against a simpler alternative in research.md.

## Project Structure

### Documentation (this feature)

```text
specs/010-improve-weight-tracking/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── weight-context-api.md   # Internal data-flow contracts
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── _layout.tsx                 # unchanged
│   └── (tabs)/
│       ├── _layout.tsx             # unchanged
│       ├── index.tsx               # unchanged
│       ├── history.tsx             # unchanged
│       └── progress/
│           ├── _layout.tsx         # NEW — Stack navigator for progress tab drill-down
│           ├── index.tsx           # MOVED/REWORKED from progress.tsx — weight-only overview
│           └── details.tsx         # NEW — detail view: log list, edit, delete, add, chart
├── components/
│   ├── ui.tsx                      # unchanged
│   └── weight-chart.tsx            # NEW — SVG line chart via react-native-svg
├── context/
│   └── app-data.tsx                # UPDATED — add targetWeight, updateWeight, saveTargetWeight
└── lib/
    ├── db.ts                       # UPDATED — DB migration v4, updateWeight, saveTargetWeight
    └── types.ts                    # UPDATED — add targetWeight to UserProfile

e2e/
├── specs/
│   └── progress-regression.spec.ts    # UPDATED — extend with US1/US2/US3 weight scenarios
└── helpers/
    ├── progress-page.ts               # UPDATED — add weight overview assertion methods
    └── weight-details-page.ts         # NEW — helper for detail view interactions
```

**Structure Decision**: Nested Stack within the progress tab (`progress/` directory). expo-router idiomatic for drill-down navigation inside a tab; provides native back button; allows independent Playwright navigation to `/progress` and `/progress/details`; keeps tab stack state isolated.

## Complexity Tracking

> No constitution violations — section left blank intentionally.
