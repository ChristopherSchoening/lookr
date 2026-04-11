# Implementation Plan: Android Tab Bar Safe Area

**Branch**: `003-fix-tab-safe-area` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fix-tab-safe-area/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Fix the shared bottom-tab layout so Android tabs sit fully above the system
navigation bar without breaking the current floating visual style or adding
extra bottom spacing on iOS and web. The implementation will keep scope tight
by extending the existing tab layout and root app shell, using safe-area-aware
bottom spacing and focused manual validation on the touched platforms plus the
repo quality checks.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, `@react-navigation/bottom-tabs`, `react-native-safe-area-context`, NativeWind  
**Storage**: Existing local SQLite app state remains unchanged; no new feature-specific storage  
**Testing**: `npm run lint`, `npm run typecheck`, manual Android verification of the tab bar, and smoke regression on iOS and web tab layout  
**Target Platform**: Android phones and emulators are the primary affected surface; shared tab layout must remain correct on iOS and web  
**Project Type**: Expo cross-platform mobile app with shared file-based tab routing  
**Performance Goals**: Bottom tabs render in the correct visible position on first paint and remain stable during tab switches with no noticeable layout jump  
**Constraints**: Keep the fix in the shared tab shell, preserve the current floating tab-bar look, avoid new dependencies, and keep added code lean and extension-first  
**Scale/Scope**: One shared tab layout file, one root app shell if safe-area context must be provided explicitly, and three tab screens that consume the shared layout

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Verification strategy defined before implementation begins, including
  automated checks and manual acceptance for each affected user story
- UX consistency review defined for all touched platforms, including any
  intentional platform-specific deviations with rationale
- Required repository quality commands identified and scheduled in the plan
- Story-to-task traceability preserved so each user story can be validated
  independently
- Complexity exceptions documented only when a simpler alternative was rejected
- Implementation approach keeps added code lean, readable, modular, and
  extension-first, with new abstractions justified explicitly

Status: PASS WITH EXCEPTION

- Verification strategy: `npm run lint` and `npm run typecheck` remain required
  repo checks; manual acceptance covers Android tab visibility/tappability,
  Android tab-switch stability, and smoke regression on iOS/web spacing.
- UX consistency: Android gets the safe-area correction because it is the
  affected platform; iOS and web must preserve the existing intended tab layout
  with no extra bottom gap.
- Required quality commands: `npm run lint` and `npm run typecheck` will be run
  after implementation; manual platform review is required because native tab
  placement is user-visible and not covered by current automation.
- Approved exception: Native UI automation is not added in this slice because
  the feature is a small shared tab-shell layout fix and the repository has no
  native UI harness today. Scope is limited to `003-fix-tab-safe-area`, reason
  is avoiding a disproportionate automation build-out for a one-file UX fix,
  and owner is the current feature implementer.
- Traceability: The implementation will map cleanly to the three spec stories
  through shared-tab layout changes plus platform verification steps.
- Complexity: No exception needed. Extending the existing tab layout and root
  shell is simpler than adding new wrappers per screen or a new navigation
  abstraction.
- Lean code: Prefer one shared inset calculation in the tab layout and add a
  root safe-area provider only if needed for consistent inset values.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-tab-safe-area/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
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
├── design/
│   └── tokens.ts
└── lib/
    ├── date.ts
    ├── db.ts
    └── types.ts
```

**Structure Decision**: Keep the existing single Expo app structure. The fix
should extend [src/app/(tabs)/\_layout.tsx](</home/tanome/dev/lookr/src/app/(tabs)/_layout.tsx>)
as the shared tab shell and may extend [src/app/\_layout.tsx](/home/tanome/dev/lookr/src/app/_layout.tsx)
to provide safe-area context consistently. No new product-level modules are
needed.

## Phase 0: Research Summary

- Use live safe-area inset values for bottom-tab spacing instead of a fixed
  `marginBottom` and `paddingBottom`.
- Keep the fix centralized in the shared tab layout rather than adding
  per-screen spacing overrides.
- Provide safe-area context explicitly at the app root if needed so the shared
  tab layout can read reliable inset values on Android, iOS, and web.
- Validate with manual Android review plus smoke checks on iOS and web because
  current automation does not cover native tab positioning.

## Phase 1: Design Summary

- Model the fix as a shared tab-bar layout contract with platform-specific
  bottom inset input and stable visual output.
- No persistence or domain data changes are required.
- One UI contract document captures expected tab-bar placement, visibility, and
  tap-target behavior across Android, iOS, and web.
- Agent context updated after artifact generation.

## Post-Design Constitution Check

Status: PASS WITH EXCEPTION

- Testing remains explicit and focused: repo quality checks plus concise manual
  platform validation tied to each story.
- UX consistency is preserved by correcting Android overlap while keeping the
  shared tab visual language and guarding against non-Android spacing drift.
- The approved native-automation exception remains limited to this feature
  slice and does not relax the requirement to run the named quality commands
  and capture platform review evidence.
- No unjustified abstractions or dependencies were introduced in the design.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
