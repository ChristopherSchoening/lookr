# Quickstart: Meal Type Modal Editing

## Goal

Add optional meal type support to the existing meal flow, move meal creation
into a shared modal, reuse that modal for editing, and keep older stored meals
working without forced backfill.

## Implementation Outline

1. Update [src/lib/types.ts](/home/tanome/dev/lookr/src/lib/types.ts) to add
   an optional meal type field and a canonical union for allowed values.
2. Update [src/lib/db.ts](/home/tanome/dev/lookr/src/lib/db.ts) to:
   - add an additive SQLite migration for optional `meal_type`
   - read and write `mealType` in list/add/update flows
   - extend E2E seed support for typed and untyped meals
3. Update [src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx)
   so add and update actions pass optional meal type through the existing data
   context.
4. Refactor [src/components/meal-editor.tsx](/home/tanome/dev/lookr/src/components/meal-editor.tsx)
   to:
   - open add flow in a modal
   - reuse the same modal for editing
   - validate and save optional meal type
   - show a small meal-type indicator on meal cards
5. Update [src/app/(tabs)/index.tsx](</home/tanome/dev/lookr/src/app/(tabs)/index.tsx>)
   and [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>)
   only as needed to wire the shared modal behavior into current Home and
   History flows.
6. Extend existing Playwright helpers, seed fixtures, and meal specs instead of
   adding parallel acceptance suites.

## Verification

Run after implementation:

```bash
npm run lint
npm run typecheck
npm run e2e:coverage
```

Targeted acceptance checks during development:

```bash
npm run e2e:us1
npm run e2e:us2
```

## Manual Review

- Open Home and confirm add meal starts in a modal, not inline
- Save one meal with type and one meal without type
- Confirm meal type appears as a small secondary indicator on saved meal cards
- Open History, edit a typed meal, then clear the type and save
- Seed or preserve an older untyped meal and confirm it still opens, edits, and
  saves without breakage

## Story Checks

### Home

- Start add meal from Home
- Confirm modal opens with meal name, points, and optional meal type
- Save one meal with type and one meal without type
- Confirm typed meal shows a small type indicator and untyped meal shows none
- Cancel once and confirm no partial meal saves

### History

- Open an existing meal from History
- Confirm edit uses the same modal layout as add
- Change meal type once, then clear it on another save
- Confirm saved meal card updates the small type indicator after each save

### Migration

- Load a legacy meal without a stored type
- Confirm no placeholder type appears
- Edit and save it without data loss
- Confirm legacy meal modal loads with `No type` selected

## Verification Log

- `npm run lint`: PASS
- `npm run typecheck`: PASS via `npm run lint`
- `npm run e2e:us1`: PASS
- `npm run e2e:us2`: PASS
- `npm run e2e:coverage`: PASS
- Touched-platform evidence: Web modal flows covered by Playwright in
  `e2e/specs/dashboard-core.spec.ts` and `e2e/specs/history-regression.spec.ts`.
  One web evidence path is sufficient here because Home and History share the
  same Expo Router codepath and shared `MealEditor` modal surface.
