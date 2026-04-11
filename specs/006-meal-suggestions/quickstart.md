# Quickstart: Meal Name Suggestions

## Goal

Add fast prior-meal suggestions to the existing shared meal modal so users can
reuse regular meals without re-entering points and meal type.

## Implementation Outline

1. Update [src/components/meal-editor.tsx](/home/tanome/dev/lookr/src/components/meal-editor.tsx)
   to:
   - derive distinct prefix-matching suggestions from existing meal records
   - debounce suggestion refresh after meal-name edits
   - suppress suggestions on initial edit open until the name changes
   - render up to five suggestions ordered by most recent use
   - populate meal name, points, and meal type when a suggestion is selected
2. Update [src/lib/types.ts](/home/tanome/dev/lookr/src/lib/types.ts) only if a
   small shared suggestion type or helper contract materially improves clarity.
3. Keep [src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx)
   and tab routes stable unless a tiny prop or helper adjustment is required to
   keep the shared editor readable.
4. Extend [e2e/fixtures/seed-states.ts](/home/tanome/dev/lookr/e2e/fixtures/seed-states.ts)
   with duplicate-name meal history that proves dedupe, most-recent-first
   ordering, and value hydration.
5. Extend [e2e/helpers/dashboard-page.ts](/home/tanome/dev/lookr/e2e/helpers/dashboard-page.ts)
   and [e2e/helpers/history-page.ts](/home/tanome/dev/lookr/e2e/helpers/history-page.ts)
   with suggestion-specific helpers only where current helpers cannot express
   the assertions clearly.
6. Extend [e2e/specs/dashboard-core.spec.ts](/home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts)
   and [e2e/specs/history-regression.spec.ts](/home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts)
   instead of creating a parallel suggestion suite.

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

- Open Home and start adding a meal
- Type one or two characters and confirm no suggestions appear
- Type three or more characters from a repeated meal name, pause, and confirm
  suggestions appear
- Confirm the list is deduped, ordered by most recent use, and capped at five
- Select one suggestion and confirm meal name, points, and meal type populate
- Open History, edit an existing meal, and confirm suggestions do not appear
  until the meal name is changed
- After suggestion selection, change the populated values and confirm save still
  uses the final manual edits

## Story Checks

### Home

- Seed repeated meals with the same normalized name
- Open add meal
- Type fewer than three characters and confirm no suggestion list
- Type a matching prefix, pause, and confirm up to five suggestions appear
- Select the top suggestion and confirm the form populates the latest saved
  points and meal type

### History

- Open edit for an existing meal
- Confirm no suggestion list appears before the name changes
- Change the meal name to a known prefix, pause, and confirm suggestions appear
- Select a suggestion and confirm populated values can still be edited before
  save

### Dedupe And Empty State

- Seed duplicate historical names with different casing or surrounding spaces
- Confirm only one suggestion row appears for that normalized name
- Type an unmatched prefix and confirm no stale suggestions remain

## Verification Log

- `npm run lint`: PASS on 2026-04-12
- `npm run typecheck`: PASS on 2026-04-12
- `npm run e2e:us1`: PASS on 2026-04-12
- `npm run e2e:us2`: PASS on 2026-04-12
- `npm run e2e:coverage`: PASS on 2026-04-12 (`Coverage manifest valid for 001-points-tracking: 9 acceptance scenarios mapped.`)
- Touched-platform evidence: Web Playwright coverage exercises the shared Expo
  Router modal used by Home and History. One web evidence path is sufficient
  here because suggestion behavior lives in the shared `MealEditor` component
  and is platform-consistent by design.
- Final manual acceptance notes: Suggestion rows stay secondary below the meal
  name field, hide before the three-character threshold, and clear to an empty
  inline state instead of leaving stale rows visible.
