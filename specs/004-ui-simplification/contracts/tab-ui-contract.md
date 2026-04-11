# UI Contract: Simplified Tab Experience

## Scope

This contract defines the visible behavior for the shared tab shell and the
three primary tabs touched by this feature: Home, History, and Progress.

## Shared Tab Shell

### Navigation Labels

- `index` route label is `Home`
- `history` route label is `History`
- `progress` route label is `Progress`

### Navigation Icons

- Home uses `MaterialCommunityIcons` `home-variant-outline`
- History uses `MaterialCommunityIcons` `history`
- Progress uses `MaterialCommunityIcons` `chart-line`

### Navigation Styling

- Tab bar outer shape is not rounded
- Active and inactive tint behavior remains consistent with the existing app
  palette unless adjusted globally during implementation
- Labels and icons are visible together on all supported platforms

## Home Tab

- Shows only the core daily tracking surface:
  - meal add/edit area
  - compact points overview
  - date selection only if needed for the current workflow
- Does not show editorial, promotional, or future-feature copy
- Does not show the old `Dashboard` label anywhere in the primary tab UI
- First visible card/surface does not show the stray white rectangle artifact

## History Tab

- Keeps the day-summary list and the existing correction surface
- Supports selecting a day, reviewing meals, editing a meal, and deleting a
  meal from the History flow
- Does not show copy advertising unavailable future features
- First visible card/surface does not show the stray white rectangle artifact

## Progress Tab

- Shows:
  - latest or current weight context
  - adherence
  - trend chart or trend history
  - weight change since the last prior tracked entry when available
  - weight logbook/history
- Does not show non-essential explanatory blocks or filler copy
- First visible card/surface does not show the stray white rectangle artifact

## Acceptance-Oriented Test Hooks

- Existing tab and screen test IDs remain stable where possible
- New or updated test IDs may be added only where needed to prove:
  - tab label rename
  - tab icon rendering
  - removed placeholder copy is absent
  - History edit/delete remains reachable
  - Progress retained metrics remain visible
