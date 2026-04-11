# Research: Simplified Tracking UI

## Decision: Use `@expo/vector-icons` with `MaterialCommunityIcons` for tab icons

**Rationale**:

- Expo documents `@expo/vector-icons` as part of the Expo package and available
  by default in Expo apps, so it fits the current stack without extra install
  or bundling work.
- The npm package for `@expo/vector-icons` is MIT-licensed, which fits this
  repository's MIT-only dependency policy.
- Material Design Icons from Pictogrammers are distributed under a permissive
  Apache 2.0 license for icons and fonts, which also fits the repository
  policy.
- `MaterialCommunityIcons` offers a very broad catalog, making it a practical
  default for current tabs and future navigation/action needs without another
  icon package migration.

**Alternatives considered**:

- `Ionicons` via `@expo/vector-icons`: also workable and already available, but
  the set is smaller for future app needs.
- A separate icon dependency such as Lucide or Phosphor: rejected because the
  current Expo stack already provides a permissive icon wrapper and adding a
  second icon package would increase scope with little benefit for this slice.

## Decision: Keep icon mapping explicit in the shared tab layout

**Rationale**:

- Tab icon ownership belongs in the shared tab shell where labels already live.
- One explicit mapping keeps names stable across platforms and avoids repeated
  icon choices inside screen files.
- It makes Playwright assertions and future tab additions simpler because the
  navigation contract stays centralized.

**Alternatives considered**:

- Inline icon selection inside each screen: rejected because tab metadata is a
  layout concern, not a screen-content concern.
- Dynamic icon lookup tables in a new module: rejected for now because three
  tabs do not justify a new abstraction.

## Decision: Canonical tab icons are `home-variant-outline`, `history`, and `chart-line`

**Rationale**:

- Each icon matches the tab meaning directly and stays recognizable at small
  tab-bar sizes.
- The names are generic enough to remain valid if screen copy changes slightly
  later.

**Alternatives considered**:

- Filled home and chart icons: rejected because outline variants better match
  a lightweight tab treatment and help active-state tinting stand out.
- More literal food or scale icons: rejected because the tabs represent broad
  destinations rather than one single action.

## Decision: Simplify existing screens in place

**Rationale**:

- The current code already keeps the three tabs in dedicated route files with
  shared UI primitives and data hooks.
- Editing the current screens preserves flow ownership and keeps traceability
  direct from spec to implementation.
- It also aligns with the constitution requirement to keep scope coherent and
  extend existing modules first.

**Alternatives considered**:

- Introduce new reusable feature sections before simplifying content: rejected
  because the current change is mostly subtraction and cleanup, not a new
  product surface.
- Replace the shared UI primitives wholesale: rejected because the issue is
  content and styling choice, not a broken UI framework.

## Decision: Extend existing Playwright coverage instead of adding new suites

**Rationale**:

- The repo already has story-aligned specs and page objects for dashboard,
  history, and progress flows.
- Reusing those files keeps acceptance coverage close to the changed behavior
  and satisfies the constitution's test-reuse rule for small changes.

**Alternatives considered**:

- Add a new UI-refresh suite: rejected because it would duplicate navigation
  setup and make future flow maintenance harder.

## Sources

- Expo Docs: `@expo/vector-icons` is part of the Expo package and includes
  popular icon sets. https://docs.expo.dev/guides/icons/
- npm: `@expo/vector-icons` package license is MIT.
  https://www.npmjs.com/package/%40expo/vector-icons
- Pictogrammers license docs: Material Design Icons are Apache 2.0 licensed.
  https://pictogrammers.com/docs/general/license/
