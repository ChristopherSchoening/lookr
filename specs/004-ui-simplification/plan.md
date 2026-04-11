# Implementation Plan: Simplified Tracking UI

**Branch**: `004-ui-simplification` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-ui-simplification/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Simplify the three existing tabs so users see only the core tracking actions
and summaries: rename Dashboard to Home, add tab icons, remove the rounded tab
bar shell and stray white top-card backgrounds, keep History as the correction
surface for meals, and trim Progress to weight, adherence, trend, and latest
change since the immediately previous tracked weight. The implementation will
stay lean by extending the existing tab layout, screen files, shared UI
primitives, and Playwright coverage instead of adding new feature modules. For
tab icons, use Expo's built-in `@expo/vector-icons` with the
`MaterialCommunityIcons` set because it is already part of the Expo stack,
license-compatible for this MIT project, and large enough for future
navigation and action needs without adding another dependency.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, `@react-navigation/bottom-tabs`, NativeWind, `expo-sqlite`, `@expo/vector-icons` with `MaterialCommunityIcons`  
**Storage**: Existing local SQLite app state remains unchanged; meal and weight records continue to live in current app storage  
**Testing**: `npm run lint`, `npm run typecheck`, `npm run e2e:coverage`, `npm run e2e:us1`, and `npm run e2e:us2`, plus targeted Playwright updates in `dashboard-core.spec.ts`, `history-regression.spec.ts`, and `progress-regression.spec.ts`  
**Target Platform**: iOS, Android, and web through the shared Expo tab app  
**Project Type**: Expo cross-platform mobile app with shared file-based tab routing and Playwright web acceptance coverage  
**Performance Goals**: Touched tabs render their core content on first paint with no added perceptible layout jank and keep the current lightweight interaction speed for meal and weight edits  
**Constraints**: Keep scope to the three existing tabs and shared UI shell, avoid speculative new abstractions, use a permissive-license icon source, preserve cross-platform behavior, and extend existing Playwright coverage rather than adding parallel suites  
**Scale/Scope**: Four touched route files, shared UI primitives and helpers as needed, existing E2E page objects/specs, and one permissive icon choice for current and future tab needs

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
  `npm run e2e:coverage` remain required checks. Existing Playwright coverage
  will be extended for Home, History, and Progress acceptance paths.
- Approved exception: The white-rectangle artifact check remains manual visual
  proof for this slice because the current Playwright harness validates flow
  content and structure but does not reliably prove this styling artifact
  across touched platforms. Scope is limited to the top-card surface cleanup in
  `004-ui-simplification`, and owner is the current feature implementer.
- Acceptance proof mapping: User Story 1 maps to
  `e2e/specs/dashboard-core.spec.ts`, User Story 2 maps to
  `e2e/specs/history-regression.spec.ts`, and User Story 3 maps to
  `e2e/specs/progress-regression.spec.ts`.
- UX consistency: The same tab naming, icon treatment, reduced copy, and top
  surface cleanup apply across Android, iOS, and web because the screens share
  one routed tab shell.
- Required quality commands: `npm run lint`, `npm run typecheck`, and
  `npm run e2e:coverage` after implementation. Manual visual review is still
  needed for the touched UI on the touched platforms because styling changes
  are user-visible.
- Complexity: No exception needed. Extending the existing tab screens, shared
  layout, and Playwright helpers is simpler than introducing a new UI layer or
  a separate icon package.
- Lean code: Prefer editing current screen files and shared UI primitives.
  Add a new helper only if it clearly reduces repeated tab-icon or card-surface
  logic across multiple touched screens.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-simplification/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tab-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── history.tsx
│       └── progress.tsx
├── components/
│   ├── date-navigator.tsx
│   ├── meal-editor.tsx
│   └── ui.tsx
├── context/
│   └── app-data.tsx
└── lib/
    ├── date.ts
    ├── db.ts
    └── types.ts

e2e/
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
shared tab layout in [src/app/(tabs)/\_layout.tsx](</home/tanome/dev/lookr/src/app/(tabs)/_layout.tsx>),
update the three existing tab screens in place, and reuse the existing shared
UI and Playwright files instead of creating parallel feature folders.

## Phase 0: Research Summary

- Use Expo's built-in `@expo/vector-icons` rather than adding a new icon
  dependency because it is already part of Expo and keeps scope lean.
- Use the `MaterialCommunityIcons` set for tab icons because it is broad, fits
  product-style navigation well, and remains license-compatible for this MIT
  project through the permissive licenses of the wrapper package and icon set.
- Keep canonical tab icons stable across platforms:
  `home-variant-outline` for Home, `history` for History, and `chart-line` for
  Progress.
- Simplify screen content by removing `AppHeader`/`SectionTitle` copy blocks
  where they are not essential, while preserving the existing meal and weight
  workflows.
- Remove the stray white rectangle by normalizing top-card styling in the
  touched tabs and shared surface primitives instead of layering one-off
  background patches per screen.

## Phase 1: Design Summary

- Model the work as a shared tab-shell update plus three screen-level
  content-simplification passes.
- No persistence schema changes are required; meal edits, meal deletion, and
  weight tracking continue to use existing data structures and context actions.
- One UI contract document captures tab naming, icon mapping, content trimming,
  and top-surface behavior across Home, History, and Progress.
- Existing Playwright page objects and specs are extended to cover renamed
  labels, icon-bearing navigation, removed placeholder copy, History correction
  actions, and the reduced Progress surface.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS

- Testing remains explicit and acceptance-covered with reused Playwright specs
  for all three stories plus required repo quality commands.
- UX consistency stays centralized in the shared tab shell and current route
  files, with no intentional platform-specific deviations introduced.
- No unjustified dependency or abstraction is added. The icon choice reuses the
  Expo stack already in the project and avoids a new package solely for tabs.
- The approved manual-only exception for the white-rectangle artifact remains
  narrow and limited to visual proof on touched platforms.
- Story-to-task traceability remains straightforward because each story maps to
  one touched tab flow and one existing Playwright spec.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
