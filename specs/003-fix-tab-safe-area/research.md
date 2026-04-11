# Research: Android Tab Bar Safe Area

## Decision 1: Drive tab-bar bottom spacing from safe-area inset data

- Decision: Replace the shared tab bar's fixed bottom offset strategy with
  bottom spacing derived from the current safe-area inset.
- Rationale: The current layout hard-codes `marginBottom: 12` and
  `paddingBottom: 12`, which cannot adapt to Android devices where the system
  navigation area is taller than that fixed gap. Inset-aware spacing is the
  smallest reliable way to keep the full floating tab bar above the system
  navigation area.
- Alternatives considered:
  - Increase the fixed bottom margin: rejected because Android inset sizes vary
    by device and navigation mode, so a single number will still fail on some
    devices or over-space others.
  - Remove the floating tab style entirely: rejected because the spec only asks
    for position correction, not a visual redesign.

## Decision 2: Keep the fix in the shared tab layout, not in each tab screen

- Decision: Implement the position correction in `src/app/(tabs)/_layout.tsx`
  where the shared `Tabs` screen options already define tab-bar styling.
- Rationale: All three tab destinations consume the same bottom-tab shell. A
  centralized fix satisfies the requirement that every shared-tab screen
  behaves consistently and avoids repeated padding logic in route components.
- Alternatives considered:
  - Add bottom padding to each tab screen container: rejected because it would
    spread navigation concerns into screen content and risks inconsistent
    spacing between routes.
  - Add a new navigation wrapper component: rejected because the current layout
    file already owns the relevant behavior and can be extended directly.

## Decision 3: Provide explicit safe-area context at the root if the shared layout needs hook-based insets

- Decision: Plan for `src/app/_layout.tsx` to wrap the app tree in
  `SafeAreaProvider` if the shared tab layout uses hook-based inset values.
- Rationale: The project already uses `SafeAreaView` but does not define an
  explicit provider in the root shell. If the implementation reads live inset
  values through `react-native-safe-area-context`, adding the provider at the
  root keeps that context reliable and shared across screens.
- Alternatives considered:
  - Assume a provider exists elsewhere: rejected because the current repo code
    does not show one.
  - Avoid inset hooks entirely: rejected because the layout still needs a
    device-aware bottom value rather than another hard-coded constant.

## Decision 4: Preserve non-Android layout by applying only the minimum inset-aware adjustment

- Decision: Keep the current tab-bar look and adjust only the bottom-positioning
  values needed to respect platform insets.
- Rationale: The spec requires fixing Android without creating a new spacing
  regression on iOS or web. A minimal adjustment in the shared tab style keeps
  the visual design stable while still accommodating larger Android bottom
  insets.
- Alternatives considered:
  - Introduce separate tab-bar designs per platform: rejected because that adds
    complexity and weakens UX consistency without solving a broader product
    need.
  - Move to screen-level safe-area padding everywhere: rejected because it
    changes content layout and exceeds the requested scope.

## Decision 5: Validate natively by manual platform review plus repo quality checks

- Decision: Use `npm run lint`, `npm run typecheck`, Android manual verification,
  and a quick iOS/web spacing smoke review as the acceptance strategy.
- Rationale: The issue is a native visual placement bug. The repository has no
  automated native UI harness today, so focused manual review is the smallest
  trustworthy verification path that still satisfies the constitution.
- Alternatives considered:
  - Add new native UI automation for this bug: rejected because it is far larger
    than the requested fix.
  - Rely on code inspection only: rejected because safe-area bugs are visual and
    device-dependent.
