# Quickstart: Daily Limit Adherence

## Goal

Let users set and edit the daily points limit from Progress, make that limit
apply to the whole current day and all future days, and keep past adherence
judged by the limit that was active on each past date. Home never shows the
daily limit setting; it either shows budget status after setup or sends users
to Progress setup when setup is incomplete.

## Implementation Outline

1. Update [src/lib/db.ts](/home/tanome/dev/lookr/src/lib/db.ts) to:
   - add an additive migration for dated daily-limit history
   - persist a history row whenever the profile limit is created or updated
   - expose reads for historical limit changes alongside the current profile
   - preserve positive decimal limits without rounding
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
   so Home never exposes the daily limit setting, shows a short path to
   Progress setup when setup is incomplete, and keeps current-day metrics
   visible after setup.
5. Update [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>)
   and [src/app/(tabs)/progress.tsx](</home/tanome/dev/lookr/src/app/(tabs)/progress.tsx>)
   so Progress owns daily limit setup and editing and both tabs consume revised
   summary data without adding a parallel calculation path.
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
npm run e2e -- e2e/specs/progress-regression.spec.ts e2e/specs/dashboard-core.spec.ts
npm run e2e:us2
```

## Manual Review

- Start without a daily limit and confirm Home shows a short action to Progress
  setup without showing the daily limit input
- Set an initial daily limit from Progress, log meals today, then change the
  limit from Progress and confirm Home updates remaining points right away
- Confirm Home never exposes the daily limit setting, and Progress rejects zero,
  negative, blank, and non-numeric values
- Save a positive decimal limit from Progress and confirm Home, History, and
  Progress use the decimal value consistently
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

- Start without a daily limit
- Confirm Home sends the user to Progress setup without showing the limit input
- Set the initial limit from Progress
- Change the limit from Progress
- Confirm today's limit metric, remaining points, and status refresh
- Confirm the save message appears and the current-day status updates without
  leaving Progress
- Confirm Home does not expose the daily limit setting before or after setup
- Try `0`, negative, blank, and non-numeric input and confirm validation blocks
  save
- Try a positive decimal input and confirm it saves without rounding

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

- Pending after implementation: `npm run lint`
- Pending after implementation: `npm run typecheck`
- Pending after implementation: `npm run e2e:coverage`
- Pending targeted run: `npm run e2e:us1`
- Pending targeted run: `npm run e2e:us2`
- Web review needed for Progress setup/edit, Home prompt/absence behavior,
  decimal limit handling, same-day refresh, historical-limit preservation, and
  Progress adherence refresh
- iOS review needed for the same touched flows unless a documented platform
  evidence gap is approved
- Android review needed for the same touched flows unless a documented platform
  evidence gap is approved
