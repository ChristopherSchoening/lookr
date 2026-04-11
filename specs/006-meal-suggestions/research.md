# Research: Meal Name Suggestions

## Decision: Derive suggestions from the already loaded meal list inside the shared meal editor

**Rationale**:

- `MealEditor` already receives the relevant `meals` array for the active day
  view and has the current draft values for meal name, points, and meal type.
- Existing app state already loads all meals through `AppDataProvider`, so this
  slice can reuse in-memory data without adding a new storage path.
- Keeping lookup local makes the feature easier to test and avoids changing the
  persistence layer for a purely assistive UI behavior.

**Alternatives considered**:

- Add a dedicated database query for suggestions: rejected because the current
  dataset is already loaded and the feature does not need a second data access
  path.
- Add a new suggestion table: rejected because suggestions are derived from
  existing meals and do not justify new storage.

## Decision: Collapse duplicate suggestions by normalized meal name and keep the most recent matching meal as the source record

**Rationale**:

- The spec requires no duplicate suggestions and explicitly says applied points
  and meal type must come from the most recent matching meal.
- Normalizing with trimmed whitespace and lowercased comparison is enough to
  treat visually duplicate names as one suggestion without mutating stored data.
- Reusing the most recent matching meal keeps the suggestion row aligned with
  what users most likely want to repeat.

**Alternatives considered**:

- Show every historical meal row as a separate suggestion: rejected because it
  violates the duplicate-free requirement and would add noise.
- Collapse duplicates but use the oldest row: rejected because it conflicts
  with the clarified recency rule.

## Decision: Apply a short local debounce and a three-character threshold before rendering suggestions

**Rationale**:

- The spec already fixes the minimum input length at three characters and
  requires a small debounce.
- Delaying refresh until the user pauses avoids distracting list churn during
  active typing.
- A local debounce keeps behavior deterministic for acceptance tests and does
  not require background work outside the component.

**Alternatives considered**:

- Refresh on every keystroke after three characters: rejected because it makes
  the UI noisier and ignores the clarified debounce requirement.
- Require a longer threshold such as four characters: rejected because it would
  diverge from the approved spec.

## Decision: Keep edit mode quiet until the user changes the meal name field

**Rationale**:

- Edit mode often exists to adjust points or meal type, not to rename the meal.
- Suppressing suggestions on initial open avoids unnecessary UI noise and keeps
  the current edit experience stable.
- This rule is easy to express in one shared modal and easy to prove in E2E.

**Alternatives considered**:

- Show suggestions immediately on edit open: rejected because it adds noise to
  a common non-rename path.
- Disable suggestions in edit mode completely: rejected because rename flows
  still benefit from reuse.

## Decision: Extend existing Playwright meal helpers and specs with targeted suggestion assertions

**Rationale**:

- `dashboard-core.spec.ts` and `history-regression.spec.ts` already cover the
  touched meal flows and should stay the acceptance proof.
- Shared page helpers can absorb small suggestion-specific helpers without
  adding a new suite.
- Seed fixtures can easily add repeated meal names to prove dedupe and ordering.

**Alternatives considered**:

- Create a dedicated meal-suggestions suite: rejected because the changed
  behavior belongs to existing Home and History stories.
- Rely on manual checks for debounce and ordering: rejected because the
  constitution requires automated proof for user-facing acceptance criteria.
