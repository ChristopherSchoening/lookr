# Quickstart: Android Tab Bar Safe Area

## Goal

Correct the shared bottom-tab bar so Android users always see and tap tabs above
the system navigation bar, while keeping the current tab presentation stable on
iOS and web.

## Prerequisites

1. Install dependencies with `npm install`.
2. Have an Android emulator or device ready for manual verification.
3. Have iOS and web available for a quick spacing smoke review.

## First Implementation Slice

1. Inspect the shared tab shell in [src/app/(tabs)/\_layout.tsx](</home/tanome/dev/lookr/src/app/(tabs)/_layout.tsx>)
   and confirm which fixed bottom spacing values currently push the tab bar
   under Android system UI.
2. Update the shared tab layout to compute bottom spacing from safe-area data
   while preserving the existing floating tab-bar style.
3. If hook-based safe-area access is used, mount `SafeAreaProvider` in
   [src/app/\_layout.tsx](/home/tanome/dev/lookr/src/app/_layout.tsx).
4. Confirm the shared fix applies to all tab destinations without adding
   per-screen padding hacks.
5. Re-run the app on Android and confirm the tab bar stays above the system
   navigation bar after moving across Dashboard, History, and Progress tabs.

## Verification

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run the app on Android and confirm:
   - full tab bar visible on first render
   - all tab targets tappable
   - no drift after repeated tab switches
4. Run the touched tab flow on iOS and web and confirm no unintended extra
   bottom spacing appears.

## Evidence Notes

- Native UI automation is not present for this slice.
- Manual Android verification plus iOS and web smoke review are the approved
  acceptance path for this feature.
- CLI work can record repo quality results and acceptance steps, but Android and
  iOS visual confirmation still need a local device or simulator run.

## Manual Acceptance

### User Story 1: Reach Tabs Above System Navigation

1. Start the app on Android with `npm run android`.
2. Open any tabbed screen.
3. Confirm the full bottom tab bar sits above the system navigation bar.
4. Tap Dashboard, History, and Progress tabs and confirm each tap lands.
5. Note whether the bottom offset matches the safe-area gap instead of the old
   fixed 12px floating offset.

### User Story 2: Keep Navigation Stable Across Common Android Layout Changes

1. On Android, switch across all three tab destinations at least twice.
2. Confirm the tab bar does not slide under the system navigation bar after any
   redraw.
3. Confirm the bottom gap stays visually unchanged after each tab switch.

### User Story 3: Preserve Expected Layout on iOS and Web

1. Open the same tab flow on iOS.
2. Confirm the tab bar still keeps its intended floating spacing with no extra
   bottom gap.
3. Open the same tab flow on web.
4. Confirm the tab bar still keeps its intended floating spacing with no extra
   bottom gap.

## Expected Evidence

- Passing `npm run lint` output
- Passing `npm run typecheck` output
- Manual Android confirmation for visible and tappable tabs across all shared
  tab destinations
- Screenshot or recording showing Android tabs above the system navigation bar
- Screenshot or recording showing iOS tab spacing remains correct, or a
  documented justification for why visual evidence is unnecessary
- Screenshot or recording showing web tab spacing remains correct, or a
  documented justification for why visual evidence is unnecessary

## Implementation Summary

- Root app shell now mounts `SafeAreaProvider` so shared layout code can read
  bottom insets.
- Shared tab shell now resolves its floating bottom offset from safe-area data
  on Android while keeping the prior `12` bottom offset on iOS and web.
- Shared scroll screens now add matching bottom clearance so content does not
  end under the lifted floating tab bar.

## Verification Log

- `npm run lint`: pass on 2026-04-11
- `npm run typecheck`: pass on 2026-04-11
- Android manual verification: pending local emulator or device run
- iOS manual smoke verification: pending local simulator or device run
- Web manual smoke verification: pending local browser run

## Visual Evidence

- Android: not captured in this CLI-only session; run local device or emulator
  verification and attach screenshot or recording if needed.
- iOS: not captured in this CLI-only session; run local simulator or device
  verification if visual evidence is required.
- Web: not captured in this CLI-only session; run local browser verification if
  visual evidence is required.
