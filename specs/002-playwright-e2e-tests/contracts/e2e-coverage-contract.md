# Contract: E2E Coverage Manifest

## Purpose

Define the minimum committed contract between the active product specification
and the Playwright regression suite so maintainers can audit coverage and update
it whenever in-scope requirements change.

## Artifact

- File: `playwright/coverage.manifest.json`
- Owner: Feature maintainer updating the related spec or E2E suite

## Required Shape

```json
{
  "specs": [
    {
      "featureId": "001-points-tracking",
      "featureTitle": "Points Tracking Weight Loss",
      "surface": "web",
      "scenarios": [
        {
          "storyId": "US1",
          "acceptanceScenarioRef": "US1-AS1",
          "coverageStatus": "covered",
          "regressionScenarioId": "dashboard-initial-setup"
        },
        {
          "storyId": "US2",
          "acceptanceScenarioRef": "US2-AS1",
          "coverageStatus": "deferred",
          "deferReason": "Explain why automation is deferred"
        }
      ]
    }
  ]
}
```

## Rules

1. `surface` MUST be `web` for this feature's first release.
2. Every in-scope acceptance scenario from active specs MUST appear in the
   manifest exactly once.
3. `coverageStatus` MUST be either `covered` or `deferred`.
4. Covered scenarios MUST include `regressionScenarioId`.
5. Deferred scenarios MUST include `deferReason`.
6. New or materially changed in-scope requirements MUST update this manifest in
   the same change set as the related implementation and E2E work.
7. Release approval MUST treat a missing manifest entry as a coverage failure.

## Review Expectations

- Reviewers can trace any Playwright failure back to the related
  `acceptanceScenarioRef`.
- Reviewers can distinguish intentional deferrals from missing work without
  reading test code.
- Contributors update the manifest, focused Playwright scenarios, and this
  contract together whenever a new in-scope acceptance scenario is introduced or
  materially changed.
