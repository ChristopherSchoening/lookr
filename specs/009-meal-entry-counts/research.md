# Research: Meal Entry Counts

## Decision: Store counted saves as separate meal rows

**Rationale**: The feature clarification requires count greater than 1 to create multiple separate `meal_entries`. Existing summaries already sum rows, so dashboard, history summary, progress adherence, and snapshot logic continue to use the same storage model.

**Alternatives considered**: Adding a `count` column was rejected because it conflicts with the clarification and would require migration plus changes to all summary code. Storing one synthetic row with multiplied points was rejected because edit/delete would no longer preserve exact meal instances.

## Decision: Validate count in the shared meal editor

**Rationale**: Dashboard and history both use `MealEditor`. A single count field and parser there keeps add/edit UX consistent, defaults count to 1, and blocks blank, zero, negative, decimal, and above-99 values before calling app data writes.

**Alternatives considered**: Validating only in the database layer was rejected because users need immediate feedback and edit flows need grouped count context. Adding separate dashboard/history controls was rejected because it would duplicate behavior.

## Decision: Group exact same-day meals for history display only

**Rationale**: Existing rows remain the source of truth. History can derive a `CombinedHistoryRow` from selected-day meals by matching user-visible details: `mealName`, `points`, `entryDate`, `entryTime`, `mealType`, and notes if notes are added to the model later. Combining is day-scoped because history already selects one day.

**Alternatives considered**: Global grouping across all meals was rejected because the feature says different days remain separate. Matching only name and points was rejected because type, date, time, or future visible details could differ.

## Decision: Edit/delete grouped rows through represented row IDs

**Rationale**: A combined row must keep a list of underlying meal IDs. Delete can remove each represented row. Edit can update existing represented rows and add or remove duplicates until the final count equals the requested count.

**Alternatives considered**: Editing only the first row was rejected because totals and visible count would no longer match the displayed grouped row. Recreating all rows on every edit was rejected because preserving existing rows where possible is simpler to audit and avoids unnecessary churn.

## Decision: Preserve current summary math

**Rationale**: Since counted meals are separate rows, `buildSummaries` can continue summing `meal.points`. The multiplied value appears naturally in dashboard/progress totals. History row display multiplies base points by grouped count for the compact row.

**Alternatives considered**: Adding summary-specific count math was rejected because it would double count duplicate rows.

## Decision: Extend existing Playwright coverage

**Rationale**: The constitution and repository guidance prefer extending active Playwright flows. Existing dashboard and history specs already exercise meal add, edit, delete, summaries, seed state, and app snapshots.

**Alternatives considered**: Adding a new test framework or separate suite was rejected because existing helpers can express the behavior clearly and faster.
