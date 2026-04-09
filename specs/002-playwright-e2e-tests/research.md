# Research: Requirements E2E Coverage

## Decision 1: Use Playwright CLI as the committed E2E harness

- Decision: Add `@playwright/test` and use the Playwright CLI plus
  `playwright.config.ts` as the required regression harness.
- Rationale: The repo needs a committed, deterministic, CI-friendly harness.
  Playwright CLI provides browser automation, trace capture, retries, and
  project configuration without depending on external MCP availability.
- Alternatives considered:
  - Playwright MCP only: rejected because no Playwright MCP is available in the
    current environment, and release automation cannot depend on optional agent
    tooling.
  - Manual browser smoke testing only: rejected because it violates the
    constitution's requirement to define automated verification before
    implementation.
  - Another E2E framework: rejected because Playwright matches the requested
    direction and has first-party support for reliable web automation.

## Decision 2: Automate the Expo web surface only in v1

- Decision: Run E2E coverage against the Expo web application surface only.
- Rationale: The active spec explicitly narrows automated scope to web for the
  first release. Playwright is a browser-driven tool, and the app already has a
  web runtime through `expo start --web`.
- Alternatives considered:
  - Add native mobile automation now: rejected because it expands scope beyond
    the clarified spec and would introduce different tools and infrastructure.
  - Leave target surface unspecified: rejected because it would make tasks,
    coverage expectations, and release criteria ambiguous.

## Decision 3: Seed deterministic test state through a dedicated test path, not UI-only bootstrapping

- Decision: Plan for a dedicated E2E state reset and seed mechanism that can
  establish known local data before or during a test run.
- Rationale: The product uses local SQLite-backed state. Reliable end-to-end
  tests need a clean starting state and repeatable records for meal and weight
  flows; relying solely on long UI setup sequences would be slower and more
  brittle.
- Alternatives considered:
  - Pure UI bootstrapping in every test: rejected because it duplicates setup
    cost and makes focused story-level runs harder to maintain.
  - Shared persistent browser profile: rejected because it risks state leakage
    and nondeterministic failures between runs.

## Decision 4: Maintain explicit spec-to-test traceability in a coverage manifest

- Decision: Add a versioned coverage manifest that maps active spec acceptance
  scenarios to Playwright scenarios or explicit deferrals.
- Rationale: The feature spec requires maintainers to know which acceptance
  scenarios are automated and what remains deferred. A manifest is easier to
  audit than inferring coverage from test filenames alone.
- Alternatives considered:
  - Rely on comments in test files only: rejected because coverage status becomes
    fragmented and harder to review when specifications change.
  - Track coverage in external documentation only: rejected because it invites
    drift away from the committed test suite.

## Decision 5: Treat new in-scope requirements as E2E-blocking by default

- Decision: Document a planning rule that new or materially changed in-scope
  requirements must add or update E2E coverage before the work is considered
  complete, unless explicitly marked deferred in the coverage manifest.
- Rationale: This directly implements the user's requirement and keeps the
  constitution's test-first and traceability principles enforceable.
- Alternatives considered:
  - Recommend E2E coverage without enforcing it: rejected because coverage gaps
    would remain a process preference instead of a delivery rule.
  - Apply the rule only to P1 stories: rejected because the feature spec already
    requires explicit coverage status across in-scope scenarios.
