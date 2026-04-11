# Quickstart: Simplified Tracking UI

## Goal

Implement the UI cleanup for the three existing tabs without changing the
underlying meal or weight storage model.

## Implementation Outline

1. Update [src/app/(tabs)/\_layout.tsx](</home/tanome/dev/lookr/src/app/(tabs)/_layout.tsx>)
   to:
   - rename `Dashboard` to `Home`
   - add `MaterialCommunityIcons` tab icons through `@expo/vector-icons`
   - remove the rounded tab-bar shell styling
2. Update [src/app/(tabs)/index.tsx](</home/tanome/dev/lookr/src/app/(tabs)/index.tsx>)
   to keep only the core Home content and remove placeholder/filler copy.
3. Update [src/app/(tabs)/history.tsx](</home/tanome/dev/lookr/src/app/(tabs)/history.tsx>)
   to keep History focused on review and correction, while removing excess copy
   and keeping edit/delete visible in that flow.
4. Update [src/app/(tabs)/progress.tsx](</home/tanome/dev/lookr/src/app/(tabs)/progress.tsx>)
   to keep only weight, adherence, trend/history, and change-since-last-track
   content.
5. Adjust [src/components/ui.tsx](/home/tanome/dev/lookr/src/components/ui.tsx)
   only if the white top-card rectangle comes from shared surface styling.
6. Extend existing Playwright coverage and helpers rather than creating new
   suites.

## Verification

Run after implementation:

```bash
npm run lint
npm run typecheck
npm run e2e:coverage
```

Targeted Playwright flows to update and run during development:

```bash
npm run e2e:us1
npm run e2e:us2
```

## Manual Review

- Check the tab bar on web and one native platform for:
  - `Home` label
  - icons on all tabs
  - no rounded outer shell
- Check Home for reduced content, no `Dashboard` label, and no placeholder copy
- Check History for meal edit and delete in place with the cleaned summary list
- Check Progress for weight, adherence, trend, logbook, and change-since-last-track only
- Check the top card on each touched tab for removal of the white rectangle

## Story Checks

### Home

- Open Home and confirm only the daily points card, day picker, and meal area remain
- Confirm `Manual in now, calculator later.` is gone

### History

- Open History with seeded meals
- Pick a day, edit one meal, delete one meal, and confirm totals update

### Progress

- Open Progress with seeded weights
- Confirm `Change since last track` uses the previous saved entry, not the oldest one
