# Quickstart: Daily Limit Adherence

## Goal

Let users edit the daily points limit, make that new limit apply to the whole
current day and all future days, and keep past adherence judged by the limit
that was active on each past date.

## Implementation Outline

1. Update [src/lib/db.ts](/home/tanome/dev/lookr/src/lib/db.ts) to:
   - add an additive migration for dated daily-limit history
   - persist a history row whenever the profile limit is created or updated
   - expose reads for historical limit changes alongside the current profile
2. Extend [src/lib/types.ts](/home/tanome/dev/lookr/src/lib/types.ts) with the
   smallest new types needed for dated limit history and derived effective-limit
   summaries.
3. Update [src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx)
   to:
   - load limit-history rows during refresh
   - resolve the effective limit for each day
   - derive `DailySummary` values from meals plus historical limits
   - keep Progress adherence counts aligned with that shared derivation
4. Update [src/app/(tabs)/index.tsx](</home/tanome/dev/lookr/src/app/(tabs)/index.tsx>)
   so users can edit an existing daily limit and see current-day metrics update
   immediately.
5. Update [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>)
   and [src/app/(tabs)/progress.tsx](</home/tanome/dev/lookr/src/app/(tabs)/progress.tsx>)
   to consume the revised summary data without adding a parallel calculation
   path.
6. Extend [e2e/fixtures/seed-states.ts](/home/tanome/dev/lookr/e2e/fixtures/seed-states.ts),
   existing Playwright page objects, and:
   - [e2e/specs/dashboard-core.spec.ts](/home/tanome/dev/lookr/e2e/specs/dashboard-core.spec.ts)
   - [e2e/specs/history-regression.spec.ts](/home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts)
   - [e2e/specs/progress-regression.spec.ts](/home/tanome/dev/lookr/e2e/specs/progress-regression.spec.ts)

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

- Set an initial daily limit, log meals today, then change the limit and confirm
  Home updates remaining points right away and rejects invalid values
- Review a past tracked day that was within its old limit, change today's limit,
  and confirm that past day still shows its original adherence result
- Edit a meal on a past day and confirm that day's totals recalculate against
  the limit active on that past date
- Open Progress after a same-day limit change and confirm today's adherence
  status and the aggregate adherence count both update together
- Check iOS, Android, and web for consistent validation and summary messaging
  around limit edits

## Story Checks

### User Story 1

- Start with an existing daily limit
- Change the limit from Home
- Confirm today's limit metric, remaining points, and status refresh
- Confirm the save message appears and the current-day status updates without
  leaving Home
- Try `0`, blank, and non-numeric input and confirm validation blocks save

### User Story 2

- Seed past tracked days under an older limit
- Change the current limit
- Confirm past days keep their original within/over result
- Edit a meal on one past day and confirm recalculation uses that past day's
  historical limit
- Delete one past meal and confirm that day still uses the older historical
  limit instead of today's new limit

### User Story 3

- Open Progress before and after a same-day limit change
- Confirm current day counts immediately under the new limit
- Confirm aggregate adherence matches visible day-level history
- Confirm adherence wording still matches the shared effective-limit rule

## Verification Log

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run e2e:coverage`: PASS
- `npm run e2e:us1`: PASS
- `npm run e2e:us2`: PASS
- Web review notes: Playwright coverage extended for same-day limit edits,
  historical-limit preservation, and Progress adherence refresh
- iOS review notes: no simulator capture in this terminal session; manual review
  still needed for limit-edit field behavior, same-day summary refresh, and
  cross-screen consistency
- Android review notes: no simulator capture in this terminal session; manual
  review still needed for limit-edit field behavior, same-day summary refresh,
  and cross-screen consistency
