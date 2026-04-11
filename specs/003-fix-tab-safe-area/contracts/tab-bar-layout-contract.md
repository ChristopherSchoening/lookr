# UI Contract: Shared Tab Bar Safe Area

## Scope

This contract defines the expected visible behavior of the shared bottom-tab bar
used by Dashboard, History, and Progress.

## Inputs

- Shared tab layout render on `android`, `ios`, or `web`
- Platform bottom safe-area inset
- Existing floating tab-bar design tokens and dimensions
- Shared root layout mounted inside `SafeAreaProvider`

## Behavioral Contract

1. The shared tab bar must render fully above any reserved bottom system UI on
   Android.
2. No tab icon, label, or tap target may be clipped or obscured by the Android
   system navigation area.
3. The resolved bottom offset must be `max(android bottom inset, 12)` on
   Android and `12` on iOS and web.
4. The shared tab bar must keep its existing floating shell dimensions: `84`
   height, `10` top padding, `12` bottom padding, `12` horizontal offset, and
   `28` border radius.
5. Shared scroll content must keep enough bottom clearance to avoid ending
   under the floating tab bar after the Android inset correction.
6. The resolved bottom spacing must remain stable when switching between
   Dashboard, History, and Progress.
7. The fix must remain centralized in the shared tab layout rather than screen-
   specific content padding.
8. iOS and web must keep the existing intended floating tab-bar presentation
   unless a documented platform-specific exception is added later.

## Verification Contract

- Android:
  - first render shows full tab bar above system navigation
  - each tab remains tappable
  - bottom offset resolves from safe-area data, not a fixed `marginBottom`
  - repeated tab switches preserve the same visible position
- Non-Android:
  - no new bottom gap or clipping appears in the shared tab flow
