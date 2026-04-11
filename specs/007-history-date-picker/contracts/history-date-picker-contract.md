# UI Contract: History Date Picker

## Scope

This contract defines the visible behavior for the History tab after replacing
the current tracked-day card selector with one date picker.

## Date Picker Contract

### Entry State

- History opens with today selected
- The selected date is visible in the picker and in the History content area
- The old list of one selectable summary card per tracked date is removed

### Date Availability

- Dates with meal entries remain selectable
- Dates without meal entries also remain selectable
- Empty dates do not appear disabled, but they render with lower visual
  emphasis than tracked dates
- Tracked dates render with stronger visual emphasis than empty dates

### Selected Date Styling

- The currently selected date has a distinct selected treatment regardless of
  whether it is tracked or empty
- Today may have an additional "today" cue, but that cue must not replace the
  selected-state treatment

## History Content Contract

### Tracked Date

- Selecting a tracked date updates the visible summary and meal list for that
  day
- Existing meal correction controls remain available from the same History flow

### Empty Date

- Selecting an empty date keeps the chosen date visible
- The History view shows an empty-day state for that date
- Add-meal controls remain available for that date
- The empty-day state must not imply that meals were previously logged there

### Refresh Behavior

- After adding, editing, or deleting meals, the picker and History details
  refresh from current app state
- If the selected date loses its last meal, the same selected date remains
  visible but moves to the empty-day presentation

## Acceptance-Oriented Test Hooks

- Existing `history-screen` test coverage remains the anchor for page load
- New or updated test IDs may be added only where needed to prove:
  - picker visibility
  - selected-date visibility
  - tracked-date emphasis
  - empty-date selection
  - empty-day state with add-meal controls
  - refresh after deleting the last meal on a selected date
