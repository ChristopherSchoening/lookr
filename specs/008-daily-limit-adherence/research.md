# Research: Daily Limit Adherence

## Decision: Add a dated daily-limit history table in SQLite

**Rationale**:

- The current storage keeps only one `daily_points_limit` value in
  `user_profile`, but the new feature needs a different effective limit for
  different dates.
- A history table lets the app answer "what limit applied on this date?" for
  Home, History, and Progress without changing meal rows.
- This stays local-first and additive, which matches the existing app storage
  model and keeps migration scope small.

**Alternatives considered**:

- Overwrite the profile row only: rejected because all past days would be
  recalculated against the newest limit.
- Copy the active limit onto every meal entry: rejected because same-day limit
  changes apply to the whole day and past-day meal edits would become harder to
  reason about.
- Persist adherence snapshots per day: rejected because edited past days must
  still recalculate against the historical limit active on that date.

## Decision: Keep `user_profile` as the latest-limit cache and append history rows on save

**Rationale**:

- Existing screens and setup flows already expect one current profile row with a
  `dailyPointsLimit` value.
- Keeping that row avoids unnecessary churn in app startup and first-use logic.
- Appending one dated history record per limit change adds the missing temporal
  behavior without forcing all current profile reads to become range queries.

**Alternatives considered**:

- Replace `user_profile` entirely with history-only reads: rejected because the
  current app and tests rely on a simple current-profile concept.
- Write only the history row and derive current profile from "latest row":
  rejected because it adds extra lookup complexity to every current-limit read
  without clear feature value.

## Decision: Preserve positive numeric limits, including decimals

**Rationale**:

- Clarification confirmed that daily point limits may be positive whole numbers
  or positive decimal values.
- The app already treats point values as numbers in TypeScript, so validation
  should reject blank, zero, negative, non-finite, and non-numeric input without
  rounding valid decimals.
- Preserving decimals in profile, history, current-day budget, and adherence
  calculations avoids mismatches where a saved value displays one way but
  history evaluates another way.

**Alternatives considered**:

- Force whole-number daily limits: rejected because the clarification chose a
  broader positive numeric rule.
- Accept decimals in the form but round before saving: rejected because it would
  silently change user intent and make decimal acceptance misleading.
- Add a decimal math dependency: rejected because current local single-user
  point arithmetic does not need new dependency surface.

## Decision: Resolve effective limits per date in shared app-data summary derivation

**Rationale**:

- Home, History, and Progress already rely on the same `DailySummary`-style
  aggregation from shared context.
- Centralizing effective-limit lookup in one derivation path prevents drift
  between screens and keeps cross-platform behavior aligned.
- This also cleanly supports the clarified rule that editing a past day later
  recalculates that day against the limit active on that past date.

**Alternatives considered**:

- Let each screen resolve historical limits on its own: rejected because it
  would duplicate logic and risk inconsistent adherence counts.
- Materialize per-day summaries into storage: rejected because the data can be
  derived cheaply from local records and would require more invalidation paths.

## Decision: Progress owns setup and editing; Home only prompts or displays budget state

**Rationale**:

- Clarification confirmed that Progress owns both first-time daily limit setup
  and later daily limit edits.
- Home should stay focused on today's meal logging and budget status. When a
  user has no saved limit, Home should provide a short path to Progress setup
  without embedding the setting.
- This keeps one owner for the daily limit form and reduces duplicated
  validation, save feedback, and test hooks across tabs.

**Alternatives considered**:

- Keep first-time setup on Home and only move later edits: rejected because it
  leaves two owners for the same setting.
- Let both Home and Progress set the initial limit: rejected because it
  duplicates the input and creates more acceptance states.
- Hide Home budget state without a setup prompt: rejected because new users
  would have no clear next action from Home.

## Decision: Same-day limit changes recalculate the whole current day immediately

**Rationale**:

- Clarification confirmed that when the user changes the limit today, the whole
  current day uses the new limit, including meals logged earlier that day.
- This rule is easiest to represent by treating the saved change date as the
  effective date for the full calendar day.
- It keeps the visible remaining-points state and adherence state aligned
  everywhere as soon as the save completes.

**Alternatives considered**:

- Apply the new limit only from save time onward: rejected by clarification and
  would require time-sliced same-day adherence logic.
- Ask the user whether to recalculate today each time: rejected because it adds
  interaction cost and test complexity for a small feature.

## Decision: Keep empty days out of adherence unless existing rules already include them

**Rationale**:

- Current Progress counts only summaries with `mealCount > 0`, which matches the
  spec assumption that empty days stay untracked unless current rules already
  treat them otherwise.
- Preserving this behavior avoids turning historical limit changes into a new
  source of fake adherence days.
- This keeps the feature focused on correct historical limit evaluation instead
  of redefining what "tracked day" means.

**Alternatives considered**:

- Count zero-meal days as adhered whenever the limit is non-negative: rejected
  because it changes product meaning beyond the requested feature.
- Count all calendar days after profile setup: rejected because the app today
  tracks adherence only from logged meal summaries.

## Decision: Extend existing Playwright fixtures and specs

**Rationale**:

- The touched behavior lives inside current Home, History, and Progress flows.
- The constitution says small behavior changes should extend nearby acceptance
  coverage before adding a new suite.
- Seed-state extensions can model multiple limit-change dates cleanly and keep
  assertions close to current user flows.

**Alternatives considered**:

- Add a dedicated historical-limit suite: rejected because the feature is not a
  new route or workflow.
- Rely on manual testing only: rejected because historical adherence rules are
  easy to regress silently without automated proof.
