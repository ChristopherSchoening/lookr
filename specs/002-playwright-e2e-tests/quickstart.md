# Quickstart: Requirements E2E Coverage

## Goal

Stand up the Playwright web regression harness, prove it can run against the
current Expo web app, and establish the coverage workflow for future
requirements.

## Prerequisites

1. Install project dependencies with `npm install`.
2. Install Playwright browsers after adding the test dependency.
3. Ensure the Expo web app can start locally.

## First Implementation Slice

1. Add Playwright test dependency, config, and package scripts for:
   - full E2E run
   - headed/local debug run
   - story- or spec-filtered run
2. Create deterministic state-management support for tests:
   - clean reset path
   - optional named seed states for history and progress flows
3. Add baseline helpers and fixtures under `e2e/` for:
   - launching against the local web server
   - navigating to dashboard, history, and progress views
   - referencing stable selectors and expected text
4. Create the initial regression specs covering:
   - first-use daily point limit setup
   - meal creation and daily remaining-points update
   - meal edit/delete with same-day recalculation
   - history review for tracked days
   - weight entry and progress review
   - at least one meaningful edge-case flow, such as going over the daily limit
5. Add `playwright/coverage.manifest.json` and populate it from
   `specs/001-points-tracking/spec.md`.
6. Update contributor-facing docs so new in-scope requirements must add E2E
   coverage or an explicit manifest deferral.

## Verification

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm run e2e:coverage`.
4. Run the Playwright web regression suite locally with `npm run e2e`.
5. Run at least one focused Playwright scenario in debug-friendly mode with
   `npm run e2e:headed`, `npm run e2e:us1`, or `npm run e2e:us2`.
6. Perform a concise manual smoke review of the web flow to confirm the
   automated selectors and expected states match the actual user experience.

## Manual Acceptance

### User Story 1: Core Tracking

1. Start the app on web with `npm run web`.
2. Confirm the dashboard prompts for a daily point limit on a clean profile.
3. Save a daily point limit and add two meals for today.
4. Confirm consumed and remaining points update immediately.
5. Move to yesterday, add a meal, then return to today and confirm the totals
   remain isolated to each day.
6. Add enough points to exceed the daily budget and confirm the over-limit
   warning appears without deleting the meal.

### User Story 2: History and Progress

1. Open the History tab after logging meals on at least two dates.
2. Confirm each recent day shows consumed points, the daily budget, and the
   remaining or over-limit state.
3. Edit one meal entry for a prior day and confirm only that day’s totals
   change.
4. Delete one prior-day meal and confirm the recalculated totals remain
   accurate.
5. Open the Progress tab and save a new weight entry for today.
6. Confirm the latest weight, trend bars, and adherence metric update without
   losing prior history.

### User Story 3: Coverage Traceability

1. Open `playwright/coverage.manifest.json`.
2. Confirm every acceptance scenario in `specs/001-points-tracking/spec.md` has
   exactly one `covered` or `deferred` entry.
3. Run `npm run e2e:coverage` and confirm the validator reports a passing
   manifest.
4. Verify Playwright test titles and annotations include the related regression
   scenario identifiers and acceptance-scenario references.

## Expected Failure Evidence

- Failed Playwright runs should retain a trace, screenshot, and video under
  `test-results/playwright/`.
- The HTML report should be written to `playwright-report/`.
- Scenario failures should also attach an `app-state` artifact describing the
  seeded profile, meals, and weight records at the point of failure.

## Expected Evidence

- Passing Playwright run output for the full web suite
- Coverage manifest updated for each in-scope acceptance scenario
- Trace, screenshot, or HTML report artifacts available for failed runs
- Documentation note that new in-scope requirements require E2E coverage
