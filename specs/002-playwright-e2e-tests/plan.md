# Implementation Plan: Requirements E2E Coverage

**Branch**: `002-playwright-e2e-tests` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-playwright-e2e-tests/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a Playwright-based end-to-end regression harness for the existing web app so
the points-tracking requirements in `specs/` are verified through user-visible
flows before release. The implementation will add a deterministic web-only test
environment, spec-to-test traceability artifacts, and a standing rule that new
in-scope requirements must ship with corresponding E2E coverage or an explicit
documented exclusion.

## Technical Context

**Language/Version**: TypeScript, React 19, Expo SDK 55  
**Primary Dependencies**: Expo Router, React Native Web, `expo-sqlite`, Playwright Test (`@playwright/test`)  
**Storage**: Local SQLite database for app state; filesystem artifacts for Playwright reports, traces, screenshots, and a coverage manifest  
**Testing**: `npm run lint`, `npm run typecheck`, Playwright CLI end-to-end regression suite against the web surface  
**Target Platform**: Web browser automation for the Expo web app; development targets remain iOS, Android, and web, but this feature automates web only  
**Project Type**: Expo cross-platform application with a web runtime used as the E2E automation surface  
**Performance Goals**: Full web regression suite completes within 15 minutes; individual story-focused runs remain practical for local iteration  
**Constraints**: Must preserve MIT-compatible dependencies, keep tests deterministic from a clean state, avoid coupling release acceptance to unavailable MCP tooling, and keep new requirements blocked unless covered by E2E or explicitly deferred  
**Scale/Scope**: One active product spec, three primary user-story coverage areas, and a small local-state app with a single persisted user profile plus meal and weight histories

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

Status: PASS

- Verification strategy: Story-mapped Playwright scenarios plus `npm run lint`
  and `npm run typecheck`; manual acceptance limited to smoke review of the web
  E2E flows and explicit deferred native validation.
- UX consistency: This feature validates the existing shared workflow on the web
  surface only. The spec already documents that native automation is deferred,
  which is the sole intentional platform-specific deviation.
- Required quality commands: `npm run lint`, `npm run typecheck`, and the new
  Playwright regression commands will be included in implementation tasks.
- Traceability: The plan includes a maintained coverage manifest mapping spec
  acceptance scenarios to E2E scenarios and deferred cases.
- Complexity: No exception needed; Playwright CLI is the simplest viable
  committed harness. MCP-based tooling is optional and not a release dependency.

## Project Structure

### Documentation (this feature)

```text
specs/002-playwright-e2e-tests/
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
│   ├── meal-editor.tsx
│   ├── date-navigator.tsx
│   └── ui.tsx
├── context/
│   └── app-data.tsx
└── lib/
    ├── db.ts
    ├── date.ts
    └── types.ts

e2e/
├── fixtures/
├── helpers/
├── specs/
└── support/

playwright/
└── coverage.manifest.json

playwright.config.ts
```

**Structure Decision**: Keep the existing single Expo app structure and add a
top-level `e2e/` test workspace plus `playwright.config.ts` and a coverage
manifest under `playwright/`. This keeps automation isolated from product code
while making the traceability artifact easy to review and update when specs
change.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
