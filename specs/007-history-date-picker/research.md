# Research: History Date Picker

## Decision: Replace the History chip stack with one in-flow calendar picker

**Rationale**:

- The current History screen already keeps a single `selectedDate` state, so a
  single picker matches the actual interaction model better than rendering one
  press target per summary row.
- A calendar-style picker lets users reach both tracked dates and empty dates
  without scrolling a long list of summary cards.
- This directly serves the clarified product behavior: default to today, keep
  empty dates selectable, and make tracked dates visually stronger.

**Alternatives considered**:

- Keep the existing summary-card list and restyle it: rejected because it does
  not solve the scaling and scanning problem that motivated the feature.
- Use only the existing previous/later `DateNavigator`: rejected because it is
  navigation, not a picker, and it makes jumping to non-adjacent dates slow.

## Decision: Build the picker from existing React Native primitives and date helpers

**Rationale**:

- The repo already has date formatting and shifting helpers in `src/lib/date.ts`
  plus a small date navigation component in `src/components/date-navigator.tsx`.
- This slice is UI-local and does not need a new package or platform-specific
  native bridge to meet the spec.
- Reusing current primitives keeps the implementation lean, license-safe, and
  easier to test in Playwright than adding a new third-party calendar surface.

**Alternatives considered**:

- Add a calendar dependency: rejected because the feature is small, the repo
  favors lean extensions, and a dependency would add review and maintenance
  cost for behavior that can be expressed in-app.
- Use a platform-native date picker only: rejected because the History flow
  needs visible tracked-versus-empty emphasis, which a generic native picker
  would not reliably expose across web, iOS, and Android.

## Decision: Highlight tracked dates, but keep empty dates selectable

**Rationale**:

- Clarification established that empty dates must stay reachable so users can
  add meals to those days later.
- Stronger styling for tracked dates resolves the original usability concern
  without blocking valid forward use.
- This produces stable acceptance criteria: tracked dates are more prominent,
  empty dates can still be selected, and today is still the default landing
  date.

**Alternatives considered**:

- Hide empty dates entirely: rejected because users want to navigate to empty
  days before adding meals there.
- Disable empty dates: rejected because it prevents the intended add-later
  workflow.

## Decision: Keep the selected date visible in one stable History layout

**Rationale**:

- The clarified spec requires History to stay on today by default and keep
  add-meal controls available even when the chosen day is empty.
- A stable layout with one selected date, one picker, one summary area, and
  the existing `MealEditor` keeps context intact after selection, edits, and
  deletions.
- Reusing the current correction flow reduces rework in both UI code and E2E
  coverage.

**Alternatives considered**:

- Auto-open add meal when an empty date is picked: rejected because the user
  wanted the selected date to remain visible with controls available, not a
  forced modal jump.
- Split empty-day handling into a separate screen: rejected because it creates
  a second History flow for a small feature slice.

## Decision: Extend existing History Playwright coverage and helpers

**Rationale**:

- `e2e/specs/history-regression.spec.ts` already covers date selection,
  summaries, edits, deletes, and meal suggestion behavior from History.
- The constitution prefers extending current acceptance coverage for small
  behavior changes.
- Reusing the current `HistoryPage` object keeps assertions centralized while
  adding only the new picker hooks needed for this feature.

**Alternatives considered**:

- Add a dedicated date-picker E2E suite: rejected because the new behavior is
  part of the existing History journey, not a separate user flow.
- Rely on manual UI checking only: rejected because the feature changes a core
  user-facing interaction and needs durable acceptance proof.
