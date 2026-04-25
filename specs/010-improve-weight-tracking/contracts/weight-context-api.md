# Internal Contract: Weight Context API

**Type**: Internal — React context and component prop contracts (no external API surface)

This project is a mobile app with no external API. Contracts here define the internal data-flow boundaries that must remain stable across implementation tasks so that screens and components can be built in parallel.

---

## AppDataContextValue — weight-related additions

Changes to the context type in `src/context/app-data.tsx`:

### Updated type: UserProfile

```typescript
// src/lib/types.ts
export type UserProfile = {
  dailyPointsLimit: number;
  targetWeight: number | null; // NEW
  updatedAt: string;
};
```

### New context methods

| Method             | Signature                                                                     | Behavior                                                                                           |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `updateWeight`     | `(id: number, input: { entryDate: string; weight: number }) => Promise<void>` | UPDATE entry by id. Unique constraint rejects duplicate dates — caller catches and shows feedback. |
| `saveTargetWeight` | `(weight: number \| null) => Promise<void>`                                   | Persist or clear target weight in user_profile. Calls `refresh()` after write.                     |

### Unchanged weight methods

| Method         | Signature                                                         | Notes                                                                                        |
| -------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `saveWeight`   | `(input: { entryDate: string; weight: number }) => Promise<void>` | Upsert by entryDate — used by the existing logging flow reused in add-entry action (FR-008c) |
| `deleteWeight` | `(id: number) => Promise<void>`                                   | DELETE by id — used in detail view delete action (FR-008a)                                   |
| `weights`      | `WeightEntry[]`                                                   | Sorted DESC by entryDate; unchanged                                                          |

---

## WeightChart Component Contract

```typescript
// src/components/weight-chart.tsx
import type { WeightEntry } from '@/lib/types';

type WeightChartProps = {
  entries: WeightEntry[]; // sorted ASC by entryDate; caller is responsible for ordering
  targetWeight: number | null; // renders a horizontal target line when set
  yMin: number; // caller computes range per data-model.md formula
  yMax: number;
  testID?: string;
};
```

- Component is pure: reads no context directly
- Renders via `react-native-svg` primitives; visible as `<svg>` in Playwright DOM
- `testID` applies to the outermost `Svg` element for e2e selection
- No interactive elements inside the chart; edit/delete actions live in the detail list, not in the chart

---

## E2E Seed Extension

```typescript
// Addition to E2ESeedState in src/lib/db.ts
profile?: {
  dailyPointsLimit: number;
  targetWeight?: number | null;  // NEW — optional; existing seeds remain valid without it
  updatedAt?: string;
} | null;
```

Seed functions that provide `targetWeight` will insert it into `user_profile` during `seedE2EState`. Seeds without `targetWeight` remain compatible (column defaults to NULL).

---

## Screen Navigation Contract

| Route               | Screen                           | Entry point                       |
| ------------------- | -------------------------------- | --------------------------------- |
| `/progress`         | Weight overview (index.tsx)      | Progress tab tap                  |
| `/progress/details` | Weight detail view (details.tsx) | "View details" button on overview |

Back navigation from `/progress/details` → `/progress` uses the expo-router Stack back action. No custom back handler needed.

The add-entry action in the detail view navigates to the existing weight logging flow (currently embedded in progress/index.tsx). After a successful save, the user is returned to `/progress/details`. The exact navigation implementation (router.back or router.push to details) is left to the implementation task.
