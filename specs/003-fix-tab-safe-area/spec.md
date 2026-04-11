# Feature Specification: Android Tab Bar Safe Area

**Feature Branch**: `003-fix-tab-safe-area`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "the navigation tabs are behind the android navigation bar. they should start above the navigation bar"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reach Tabs Above System Navigation (Priority: P1)

An Android user can always see and tap the app's bottom navigation tabs without the system navigation bar covering any part of them.

**Why this priority**: If the tabs sit behind the system navigation area, core navigation breaks and users may miss or fail to tap primary app destinations.

**Independent Test**: Can be fully tested on Android by opening the app on a device with system navigation enabled and confirming the full tab bar sits above the system navigation area in portrait mode.

**Acceptance Scenarios**:

1. **Given** an Android user opens the app on a screen with bottom tabs, **When** the screen finishes rendering, **Then** the full tab bar is visible above the system navigation bar.
2. **Given** an Android user views the bottom tabs, **When** they tap any tab, **Then** the tap target is fully reachable and not blocked by the system navigation bar.

---

### User Story 2 - Keep Navigation Stable Across Common Android Layout Changes (Priority: P2)

An Android user continues to see correctly positioned tabs when moving between app screens or when the device layout changes in normal use.

**Why this priority**: A partial fix on only one screen or one layout state would still leave navigation unreliable in day-to-day use.

**Independent Test**: Can be fully tested on Android by moving across tab destinations and confirming the tab bar remains above the system navigation area after each navigation change.

**Acceptance Scenarios**:

1. **Given** an Android user switches between bottom-tab destinations, **When** each destination loads, **Then** the tab bar remains fully above the system navigation bar.
2. **Given** an Android user returns to a previously visited tab destination, **When** the layout redraws, **Then** the tab bar position remains unchanged and unobstructed.

---

### User Story 3 - Preserve Expected Layout on iOS and Web (Priority: P3)

A user on iOS and web keeps the current expected bottom-tab layout while the Android overlap issue is corrected.

**Why this priority**: The fix should solve the Android problem without creating a new spacing or layout regression elsewhere.

**Independent Test**: Can be fully tested by checking the same bottom-tab screens on iOS and web and confirming the tab bar still appears in its expected position.

**Acceptance Scenarios**:

1. **Given** a user opens the same tabbed screen on iOS or web, **When** the screen renders, **Then** the tab bar spacing remains consistent with the existing intended layout.

---

### Edge Cases

- What happens on Android devices with different system navigation styles or inset sizes? The tab bar must still remain fully above the reserved system navigation area.
- What happens after repeated navigation between tabs? The tab bar must not drift downward or become partially covered after redraws.
- What happens on screens with limited vertical space? The tab bar must remain visible and tappable even when the content area becomes tighter.
- What happens on iOS and web after the fix? The tab bar must not gain unintended extra bottom spacing or clipped content.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST place the bottom navigation tabs fully above the Android system navigation bar on every screen that uses the shared tab navigation.
- **FR-002**: The system MUST ensure no portion of any bottom-tab label, icon, or tap target is obscured by the Android system navigation area.
- **FR-003**: Users MUST be able to activate each bottom navigation tab on Android without interference from the system navigation bar.
- **FR-004**: The system MUST preserve the corrected tab position when the user switches between tab destinations.
- **FR-005**: The system MUST apply the correction consistently anywhere the existing shared bottom-tab navigation is shown.
- **FR-006**: The system MUST avoid introducing new bottom spacing regressions on iOS and web while fixing the Android overlap.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In manual Android verification, 100% of bottom-tab screens show the full tab bar above the system navigation area.
- **SC-002**: In manual Android verification, 100% of bottom tabs remain fully tappable across the shared tab destinations.
- **SC-003**: After moving between all tab destinations on Android, the tab bar position remains visually unchanged and unobstructed in 100% of checks.
- **SC-004**: On iOS and web, no unintended bottom-tab spacing regression is observed in the touched navigation flow during manual verification.

## Assumptions

- The overlap issue applies to the existing shared bottom-tab navigation rather than to one intentionally different screen-specific layout.
- Android is the primary affected platform, and the requested change is to correct placement there without redesigning the navigation structure.
- Manual verification on Android and a quick regression check on iOS and web are sufficient for acceptance until broader automated coverage exists.
- The intended behavior is for the app-controlled tab bar to respect the reserved system navigation area on devices with varying bottom insets.
