# Research: Meal Type Modal Editing

## Decision: Add meal type as an optional persisted field on the existing meal record

**Rationale**:

- The current app already stores meals in a single `meal_entries` SQLite table
  and exposes them through one `MealEntry` type plus one shared app-data
  context.
- Optional meal type fits the existing data model cleanly because older rows
  can remain valid with a null or unset value.
- This keeps add, edit, summaries, and E2E seeding on one canonical meal
  record rather than introducing a second lookup table or derived display-only
  metadata.

**Alternatives considered**:

- Compute meal type from meal name keywords: rejected because users explicitly
  choose the type and keyword guesses would be wrong for many meals.
- Store meal type only in UI state: rejected because the spec requires type to
  remain visible after save and across edits.

## Decision: Apply the schema change as an additive SQLite migration

**Rationale**:

- The current database bootstraps schema inside `getDb()` and already relies on
  idempotent startup SQL.
- Adding one nullable `meal_type` column is the smallest safe change for
  existing installs because pre-existing rows stay readable without backfill.
- An additive migration aligns with the feature requirement that existing data
  must still work after rollout.

**Alternatives considered**:

- Rebuild the table and copy rows: rejected because it adds migration risk
  without any feature benefit for one optional field.
- Force a default meal type for older rows: rejected because it changes user
  data semantics and violates the clarified requirement that untyped meals stay
  valid.

## Decision: Reuse one shared modal form for add and edit flows

**Rationale**:

- `src/components/meal-editor.tsx` already owns both add and edit state, so it
  is the natural place to keep one form definition and switch between create
  and update mode.
- One shared modal keeps validation, button labels, and save behavior aligned
  across Home and History.
- This satisfies the spec requirement without creating a second form component
  or separate screen route.

**Alternatives considered**:

- Separate add modal and edit modal components: rejected because they would
  duplicate fields, validation, and test flows for a small feature slice.
- Keep inline add and modal-only edit: rejected because it breaks the spec's
  shared-modal requirement and weakens cross-screen consistency.

## Decision: Use a small secondary meal-type indicator in every meal card

**Rationale**:

- The clarification requires type to appear in all meal displays, but not as a
  dominant label.
- A compact badge or pill near meal metadata preserves the existing visual
  hierarchy where meal name and points remain primary.
- This works across Home and History without changing list structure or adding
  new screens.

**Alternatives considered**:

- Show type only inside the modal: rejected by clarification because users want
  confirmation in all meal displays.
- Render type as a large heading-level label: rejected because it would crowd
  already compact meal cards.

## Decision: Extend current Playwright helpers and seeded state instead of adding new suites

**Rationale**:

- The repo already has meal-focused acceptance coverage in
  `dashboard-core.spec.ts` and `history-regression.spec.ts`.
- Current E2E state seeding flows through `src/lib/db.ts`, so adding optional
  meal type there lets tests cover migration and display behavior with minimal
  new machinery.
- Reusing the existing helpers matches the constitution rule for small behavior
  changes.

**Alternatives considered**:

- Add a new dedicated meal-type suite: rejected because the changed behavior
  belongs to existing Home and History stories.
- Rely on manual migration checks only: rejected because the feature directly
  changes persisted user data.
