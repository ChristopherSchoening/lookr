# Data Model: Android Tab Bar Safe Area

## Shared Tab Bar Layout State

- Purpose: Represents the computed layout inputs and outputs that keep the
  shared bottom-tab bar visible above platform system UI.
- Key fields:
  - `platform`: runtime surface such as `android`, `ios`, or `web`
  - `bottomInset`: safe-area inset reserved by the platform at the bottom edge
  - `visualOffset`: fixed design spacing kept between the tab bar and the safe
    area boundary
  - `tabBarHeight`: total rendered height of the floating tab bar
  - `resolvedBottomOffset`: final bottom offset applied to the tab bar
- Validation rules:
  - `resolvedBottomOffset` must always be greater than or equal to
    `bottomInset`.
  - `tabBarHeight` must remain large enough that labels, icons, and tap targets
    stay fully visible.
  - Non-Android platforms may resolve to the prior visual offset when their
    bottom inset does not require extra spacing.

## Safe Area Context Availability

- Purpose: Represents whether the app shell provides the inset data needed by
  the shared tab layout.
- Key fields:
  - `providerMounted`: whether the root layout wraps the app in safe-area
    context
  - `insetsReadable`: whether the shared tab layout can access current inset
    values during render
- Validation rules:
  - If hook-based inset access is used, `providerMounted` must be true.
  - `insetsReadable` must be true on Android, iOS, and web for consistent tab
    layout behavior.

## Manual Verification Record

- Purpose: Captures the acceptance evidence required for the user-visible layout
  change.
- Key fields:
  - `platform`
  - `scenario`: visible tabs, tappable tabs, repeated tab switching, or
    non-Android spacing smoke review
  - `result`: `pass` or `fail`
  - `notes`: short observation when needed
- Relationships:
  - One implementation change produces many manual verification records across
    touched platforms and scenarios.
- Validation rules:
  - Android must include checks for visible placement and tappable tabs.
  - At least one non-Android smoke review must confirm no unintended spacing
    regression in the shared tab flow.
