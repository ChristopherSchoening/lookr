# Data Model: Requirements E2E Coverage

## Active Feature Specification

- Purpose: Defines the user-visible behaviors that require release-acceptance
  E2E verification.
- Key fields:
  - `featureId`: spec directory identifier such as `001-points-tracking`
  - `featureName`: human-readable feature title
  - `stories`: ordered user stories with priorities
  - `acceptanceScenarios`: scenario identifiers and Given/When/Then text
- Relationships:
  - One active feature specification owns many acceptance scenarios.
  - Acceptance scenarios map to zero or more regression scenarios, with zero
    allowed only when explicitly deferred.

## Regression Scenario

- Purpose: Represents one Playwright scenario or serial flow that verifies a
  user-visible behavior derived from the active specification.
- Key fields:
  - `id`: stable scenario identifier used in tests and coverage mapping
  - `storyId`: owning user story identifier
  - `title`: human-readable scenario name
  - `specScenarioRefs`: one or more acceptance scenario references
  - `seedState`: named starting-state fixture required before execution
  - `surface`: automated surface, fixed to `web` for v1
  - `status`: `active` or `deferred`
  - `deferReason`: required when status is `deferred`
- Validation rules:
  - Every active regression scenario must reference at least one acceptance
    scenario.
  - Every in-scope P1 acceptance scenario must map to an active regression
    scenario or an explicit documented exclusion.
  - `surface` must remain `web` in v1.

## Coverage Record

- Purpose: Versioned traceability artifact connecting specification intent to
  executable regression coverage.
- Key fields:
  - `specVersion`: date or commit-aligned marker for the source spec snapshot
  - `entries`: collection of coverage mappings
  - `lastReviewedAt`: last review timestamp for coverage alignment
- Entry fields:
  - `acceptanceScenarioRef`
  - `regressionScenarioId`
  - `coverageStatus`: `covered` or `deferred`
  - `notes`
- Validation rules:
  - Every in-scope acceptance scenario must have exactly one current coverage
    status entry.
  - Deferred entries must include a reason.
  - Covered entries must point to an executable regression scenario identifier.

## Known Starting State

- Purpose: Defines a deterministic application baseline for test execution.
- Key fields:
  - `profileState`: absent or seeded daily point limit
  - `mealEntries`: list of preloaded meal records by date
  - `weightEntries`: list of preloaded weight records by date
  - `selectedDate`: optional starting view date for scenario setup
- State transitions:
  - `clean` -> `seeded` before scenario execution
  - `seeded` -> `mutated` during scenario steps
  - `mutated` -> `clean` after reset or fresh browser context setup
- Validation rules:
  - Each test must start from either a clean or explicitly seeded known state.
  - No scenario may rely on leftover state from a previous scenario.
