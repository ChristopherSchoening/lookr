# Quickstart: History Date Picker

## Goal

Replace the History day-card selector with one date picker that opens on today,
keeps empty dates selectable for future meal entry, emphasizes dates that
already have meals, and preserves the existing edit/add/delete correction flow.

## Implementation Outline

1. Update [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>)
   to:
   - remove the current summary-card selection list
   - default History selection to today
   - wire one date picker into the current `selectedDate` state
   - keep `MealEditor` in the same flow for tracked and empty dates
2. Extend or replace [src/components/date-navigator.tsx](/home/tanome/dev/lookr/src/components/date-navigator.tsx)
   with a picker surface that:
   - shows a visible month/date selection model
   - highlights tracked dates more strongly than empty dates
   - keeps empty dates selectable
   - preserves stable test hooks for Playwright
3. Update [src/context/app-data.tsx](/home/tanome/dev/lookr/src/context/app-data.tsx)
   only as needed to expose the derived tracked-date information already
   available from meals and summaries.
4. Reuse existing date helpers in [src/lib/date.ts](/home/tanome/dev/lookr/src/lib/date.ts)
   and add only the smallest new helper logic needed for month/grid behavior.
5. Extend [e2e/helpers/history-page.ts](/home/tanome/dev/lookr/e2e/helpers/history-page.ts)
   and [e2e/specs/history-regression.spec.ts](/home/tanome/dev/lookr/e2e/specs/history-regression.spec.ts)
   instead of adding a parallel suite.

## Verification

Run after implementation:

```bash
npm run lint
npm run typecheck
npm run e2e:coverage
```

Targeted acceptance checks during development:

```bash
npm run e2e:us2
```

## Manual Review

- Open History on a day where today has no meals and confirm the picker still
  lands on today
- Confirm dates with meals stand out more clearly than empty dates
- Pick a tracked date and confirm summary plus meals update in place
- Pick an empty date and confirm the selected date stays visible with add-meal
  controls available
- Delete the last meal from a tracked date and confirm History refreshes
  without stale tracked styling or stale summary details

## Story Checks

### User Story 1

- Open History with several logged days
- Confirm the old per-date card list is gone
- Open the date picker and jump directly to a tracked date
- Confirm today is selected when History first opens
- Confirm that tracked day's meals and summary render immediately

### User Story 2

- Compare tracked dates and empty dates in the picker
- Confirm tracked dates are more prominent
- Select an empty date and confirm it is still reachable
- Confirm the UI does not imply meals already exist on that day

### User Story 3

- From the picker, select a tracked date and edit one meal
- Delete another meal from the same or another selected date
- Confirm History stays on the selected date and refreshes totals correctly
- Select an empty date and confirm add-meal controls stay available there

## Verification Log

- `npm run lint`: pass on 2026-04-12
- `npm run typecheck`: pass on 2026-04-12
- `npm run e2e:us2`: pass on 2026-04-12
- `npm run e2e:coverage`: pass on 2026-04-12
- Web review notes: Playwright covered today-default entry, tracked-date
  selection, empty-date state, suggestion flow, legacy meal-type edits, and
  refresh after deleting the last meal on a selected date.
- iOS review notes: manual review still needed in Expo client or simulator for
  picker spacing, month navigation touch targets, and empty-day layout.
- Android review notes: manual review still needed in Expo client or emulator
  for picker spacing, month navigation touch targets, and empty-day layout.
