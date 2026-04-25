# Quickstart: Meal Entry Counts

## Implementation Notes

1. Extend `src/components/meal-editor.tsx` with a count input that defaults to `1`, validates whole numbers `1-99`, and shows a clear error for invalid count.
2. Extend the app data add/update contract in `src/context/app-data.tsx` so add can create multiple identical meal rows and grouped edit can reconcile represented row IDs to the requested count.
3. Keep `src/lib/db.ts` schema unchanged. Use repeated `addMeal` calls or a small DB helper to insert duplicate rows with the same visible meal details.
4. Derive combined history rows for the selected day in `src/app/(tabs)/history.tsx` or a narrow nearby helper. Use exact same-day visible details as the grouping key.
5. Render count only when greater than 1, and render displayed points as base points multiplied by count.
6. Update Playwright helpers and seed states before adding broad new helpers.

## Verification

Run quality checks:

```bash
npm run lint
npm run typecheck
npm run e2e:coverage
```

Run focused user-flow checks:

```bash
npm run e2e:us1
npm run e2e:us2
```

## Manual Acceptance

1. On Home, add a meal with count `3` and points `4`; verify consumed points increase by `12`, remaining points decrease by `12`, and the meal count summary shows three logged meals.
2. On Home, try blank, zero, negative, decimal, non-numeric, and above-99 counts; verify the modal stays open and asks for a whole-number count from `1` to `99`.
3. In History, select a day with exact duplicate meals; verify one row shows count `3` and `15 pt` for three 5-point entries.
4. In History, verify same-name meals with different points, times, or meal types remain separate history rows without count badges.
5. Edit a combined history row count and details; verify row count, row value, and day summary update.
6. Delete a combined history row; verify all represented entries leave the day total.

## Validation Result

2026-04-25 implementation validation passed with:

- `npm run format`
- `npm run lint`
- `npm run typecheck`
- `npm run e2e:coverage`
- `npm run e2e:us1`
- `npm run e2e:us2`
