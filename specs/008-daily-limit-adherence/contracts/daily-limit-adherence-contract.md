# UI and Data Contract: Daily Limit Adherence

## Scope

This contract defines the visible and derived behavior for updating the daily
point limit while preserving historical adherence by effective date.

## Home Contract

### Limit Editing

- Users can save an initial daily point limit when no profile exists
- Users can also edit the existing daily point limit after setup
- Invalid limit input shows a clear validation message and does not save

### Same-Day Refresh

- Saving a new limit updates the whole current day immediately
- Meals already logged earlier today are judged against the new limit
- Home remaining points, consumed points context, and status text refresh from
  the new effective limit without requiring navigation away

## History Contract

### Historical Day Evaluation

- Each past day shows totals against the daily limit active on that date
- Later limit changes do not relabel a past day as within or over
- If a user edits a past day's meals, that day recalculates against the limit
  active on that past date

### Empty-Day Handling

- Empty days remain outside adherence counts unless existing product rules
  already include them
- A later limit change does not turn an empty day into a tracked adhered day

## Progress Contract

### Adherence Count

- Adherence counts only tracked days under existing app rules
- Current day is included immediately when it has tracked meals and is judged
  against the current effective limit
- Past tracked days keep their historical within/over result after later limit
  changes

### Cross-Screen Consistency

- Progress adherence totals must match the same per-day outcomes visible in
  History
- Home, History, and Progress must all consume one shared effective-limit rule
  from app data rather than separate calculations

## Persistence Contract

### Effective Limit Resolution

- The current profile still exposes the latest saved limit
- A dated limit-change history determines which limit applies for any given day
- The latest change on or before a date is the effective limit for that date
- Multiple changes on the same date resolve to the latest saved row for that
  date

## Acceptance-Oriented Test Hooks

- Existing `daily-limit-input`, `daily-limit-metric`, `remaining-points-value`,
  and summary status hooks remain the anchor for Home checks
- History assertions continue through existing day summary hooks and meal edit
  flows; new hooks should be added only if historical-limit visibility cannot
  be proven otherwise
- Existing `adherence-metric` stays the anchor for Progress checks
- Seed fixtures must support at least one scenario with an older limit, a later
  limit change, tracked days on both sides of the change, and a same-day update
