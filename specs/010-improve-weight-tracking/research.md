# Research: Improve Weight Tracking

**Branch**: `010-improve-weight-tracking` | **Date**: 2026-04-25

## Chart Library Selection

**Decision**: `react-native-svg` with a custom `WeightChart` component

**Rationale**:
- No charting library is currently installed. `react-native-svg` is the foundational SVG layer for React Native; it renders natively on iOS/Android and as a real `<svg>` element on web, making it Playwright-compatible without any shims.
- The chart requirements are narrow: two data series (log entry curve + target horizontal line), real calendar-date x-axis with proportional gaps, and a specific y-range formula. A 3rd-party chart library would add configuration surface that fights these exact requirements rather than simplifying them.
- A custom component using `react-native-svg` primitives (`Svg`, `Path`, `Line`, `Text`) keeps the component directly testable via `testID`, avoids dependency version conflicts with Expo 55, and adds only one new package.
- `react-native-svg` is in the Expo SDK package list and installs cleanly with `npx expo install react-native-svg`.

**Alternatives considered**:
- `react-native-chart-kit`: wraps `react-native-svg` but limits x-axis to evenly spaced index points — incompatible with FR-013a (real date scale with proportional gaps between entries). Rejected.
- `victory-native` v4: powerful, but large dependency surface; requires `react-native-reanimated` bindings on top of what is already installed; overkill for a two-line chart. Rejected.
- HTML Canvas (`react-native-canvas`): web-only; no viable mobile path. Rejected.

## Target Weight Storage

**Decision**: Add nullable `target_weight REAL` column to `user_profile` table (DB migration v4)

**Rationale**:
- Target weight is a global user setting, directly analogous to `daily_points_limit` which already lives in `user_profile`. The table is a singleton (id = 1), so adding a nullable column is a clean, zero-join extension.
- Migration is additive: `ALTER TABLE user_profile ADD COLUMN target_weight REAL;`. Existing rows default to NULL — no data loss for current users.
- Keeps the E2E seed/snapshot/reset approach consistent — `E2ESeedState.profile` gains an optional `targetWeight` field.

**Alternatives considered**:
- Separate `weight_goals` table: warranted if multiple concurrent goals or goal history were required; spec says "one active target weight" — a separate table is over-engineered for this scope. Rejected.
- AsyncStorage: inconsistent with all other user data stored in SQLite; would break the unified snapshot/seed infrastructure used in e2e tests. Rejected.

## Navigation Pattern for the Detail View

**Decision**: Nested Stack within the progress tab — `src/app/(tabs)/progress/` with `_layout.tsx` (Stack), `index.tsx` (overview), `details.tsx` (detail view)

**Rationale**:
- This is the expo-router idiomatic approach for drill-down navigation inside a tab. The tab retains its own navigation stack, and the OS back button / swipe-back gesture work without extra configuration.
- Playwright tests can navigate directly by URL path: `/progress` for the overview and `/progress/details` for the detail view, which makes each user story independently testable.
- Restructuring `progress.tsx` → `progress/index.tsx` is a file rename plus content change; it does not break any existing e2e tests that navigate to `/progress`.

**Alternatives considered**:
- Root-level modal (`src/app/weight-details.tsx`): modal dismissal semantics are wrong for a drill-down list view; it would appear above the tab bar on iOS, losing tab context. Rejected.
- In-page conditional render (state toggle in `progress.tsx`): would make the file significantly larger, prevent independent URL-based navigation in tests, and mix two distinct screens in one component. Rejected.

## Weight Entry Edit Flow

**Decision**: Add a new `updateWeight(id, { entryDate, weight })` DB function; unique constraint at DB level enforces FR-007a at write time

**Rationale**:
- Current `saveWeight` is an upsert by `entryDate` (not by `id`). Editing an entry that changes its date requires updating by `id`, which `saveWeight` cannot do without a date collision on the old row.
- The `weight_entries` table already has `entry_date TEXT NOT NULL UNIQUE`, so the DB itself enforces the one-entry-per-date rule. When `updateWeight` is called with a date already used by a different entry, SQLite returns a UNIQUE constraint error — the app catches this and shows clear user feedback, satisfying FR-007a.
- Validation of weight range (30–300 kg) and date format remains at the app layer before the DB write, satisfying FR-007b.
