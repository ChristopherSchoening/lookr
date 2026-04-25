# Quickstart: Improve Weight Tracking

**Branch**: `010-improve-weight-tracking`

## Running the App

```bash
npm start           # Expo dev server (QR code for mobile)
npm run web         # Web mode only (used by Playwright)
```

## Running Tests

```bash
npm run e2e         # full Playwright suite
npm run e2e:us2     # progress regression subset (fastest feedback for this feature)
npm run lint        # oxfmt format check + tsc type check + oxlint
```

## Implementation Sequence

1. **Add `react-native-svg`**
   ```bash
   npx expo install react-native-svg
   ```

2. **DB migration v4** in `src/lib/db.ts`
   - Add `ALTER TABLE user_profile ADD COLUMN target_weight REAL;` in the migration block
   - Add `updateWeight(id, { entryDate, weight })` function
   - Add `saveTargetWeight(weight | null)` function
   - Update `loadProfile` to read and return `target_weight`

3. **Update `UserProfile` type** in `src/lib/types.ts`
   - Add `targetWeight: number | null`

4. **Update `AppDataContext`** in `src/context/app-data.tsx`
   - Expose `updateWeight` and `saveTargetWeight`
   - Include `targetWeight` from loaded profile

5. **Restructure progress tab routing**
   - Create `src/app/(tabs)/progress/` directory
   - Add `src/app/(tabs)/progress/_layout.tsx` (Stack navigator)
   - Rename + rework `progress.tsx` → `progress/index.tsx` (weight-only overview + navigation to details)
   - Remove non-weight sections (daily limit card, adherence) from overview; keep weight overview card and "View details" button

6. **Build detail view** at `src/app/(tabs)/progress/details.tsx`
   - Full log entry list (all entries, not just 6)
   - Edit entry inline or via editor; validate weight (30–300) and date (no duplicate)
   - Delete with confirmation prompt
   - Add-entry button that opens the logging flow and returns here

7. **Build `WeightChart` component** at `src/components/weight-chart.tsx`
   - react-native-svg line chart: weight log curve + target horizontal line
   - Real date x-axis (proportional to elapsed days)
   - y-range from data-model.md formula
   - Landscape-capable layout (parent handles orientation or chart uses ScrollView/aspect ratio)

8. **Extend e2e coverage**
   - Add `e2e/helpers/weight-details-page.ts` (page object for detail view)
   - Extend `e2e/specs/progress-regression.spec.ts` with US1/US2/US3 scenarios
   - Update `e2e/helpers/progress-page.ts` with weight overview assertion helpers

## Acceptance Validation Checklist

| Story | Key manual check |
|-------|-----------------|
| US1 — Overview | Progress page shows weight overview only (latest, goal, change, remaining, trend, date); no adherence or daily limit sections visible |
| US1 — Empty state | No weight entries → overview shows add/details prompt; no broken UI |
| US2 — Edit entry | Open details, tap edit on an entry, change weight to 85.0, save → list + overview both show 85.0 |
| US2 — Invalid edit | Try to save weight of 25 → error message; try duplicate date → error message; original value unchanged |
| US2 — Delete entry | Tap delete → confirmation shown → confirm → entry removed from list and overview |
| US2 — Add entry | Tap add-entry in details → existing weight logging flow opens → save → returns to details with new entry |
| US3 — Chart visible | Details view shows line chart with weight entries plotted over time |
| US3 — Target line | Chart shows horizontal target line when target weight is set |
| US3 — Range | y-axis starts at target−5 (or lower if needed), ends at highest+5 (or higher if needed) |
| US3 — Single entry | One entry: chart shows the point and target line without implying a trend |
| US3 — No entries | Details view shows empty log state; no chart shown |
| US3 — Landscape | Graph is readable in landscape orientation; labels do not overlap plotted values |

## Key File Locations

| File | Role |
|------|------|
| `src/app/(tabs)/progress/index.tsx` | Weight-only overview screen |
| `src/app/(tabs)/progress/details.tsx` | Detail view: log list + chart |
| `src/components/weight-chart.tsx` | SVG line chart component |
| `src/lib/db.ts` | DB functions; migration v4 |
| `src/lib/types.ts` | `UserProfile` with `targetWeight` |
| `src/context/app-data.tsx` | Context: `updateWeight`, `saveTargetWeight` |
| `e2e/specs/progress-regression.spec.ts` | All progress e2e coverage |
| `e2e/helpers/weight-details-page.ts` | Detail view page object |
| `specs/010-improve-weight-tracking/data-model.md` | Y-range formula + validation rules |
