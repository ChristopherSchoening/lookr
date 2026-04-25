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

1. On Home, add a meal with count `3` and points `4`; verify consumed points increase by `12` and the meal count summary shows three logged meals.
2. In History, select a day with exact duplicate meals; verify one row shows count `3` and `12 pt`.
3. Add same-name meals with different points or types; verify they remain separate history rows.
4. Edit a combined history row count; verify row count, row value, and day summary update.
5. Delete a combined history row; verify all represented entries leave the day total.
