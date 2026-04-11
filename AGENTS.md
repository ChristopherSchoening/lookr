# Repository Guidelines

## Project Structure & Module Organization

Core app code lives in `src/app`, using Expo Router file-based routes. The current entry screen is `src/app/index.tsx`, and the root router layout is `src/app/_layout.tsx`. Shared static assets live in `assets/`, Expo app configuration is in `app.json`, and styling/tooling setup is at the repo root: `global.css`, `tailwind.config.js`, `babel.config.js`, and `metro.config.js`.

Playwright end-to-end coverage is active in this repository. Prefer extending
existing Playwright coverage for small behavior changes. When adding non-E2E
tests, place them near the feature they cover or in a local `__tests__`
directory under `src/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies.
- `npm start`: start the Expo dev server.
- `npm run android`: launch the app on Android.
- `npm run ios`: launch the app on iOS.
- `npm run web`: run the web build through Expo/Metro.
- `npm run format`: format the codebase with `oxfmt`.
- `npm run format:check`: verify formatting without changing files.
- `npm run lint`: verify formatting, type checking, and `oxlint` issues.
- `npm run lint:fix`: apply safe lint fixes.
- `npm run oxlint`: run `oxlint` with type-aware checks.
- `npm run typecheck`: run TypeScript without emitting output.

## Coding Style & Naming Conventions

Use TypeScript for app code and keep files ASCII unless the file already requires Unicode. Prefer functional React components and Expo Router route files. Use NativeWind utility classes via `className` instead of new `StyleSheet`-heavy patterns unless native APIs require inline styles.

Keep additions lean and readable. Extend existing modules, routes, and shared
utilities before creating new abstractions. When a new component or helper is
the clearest option, keep it narrowly scoped and easy to trace from the user
flow it supports.

Agent responses in this repository should use caveman-style language. Avoid
filler words, keep sentences short, and use clear abbreviations where they
improve speed without harming comprehension.

Follow existing naming:

- Route files: lowercase file-based names such as `index.tsx`.
- Components: `PascalCase` if new reusable components are added.
- Variables/functions: `camelCase`.

Formatting and linting are enforced with Oxc (`oxfmt`, `oxlint`).

## Dependency Policy

Only add dependencies whose licenses are usable in an MIT-licensed project. Do not add dependencies with copyleft licenses or reciprocal distribution requirements, including GPL, AGPL, LGPL, CC-BY-SA, or similar licenses. Prefer permissive licenses such as MIT, BSD, ISC, Apache-2.0, 0BSD, BlueOak-1.0.0, or the Unlicense.

## Testing Guidelines

Playwright is the active user-flow harness. Treat `npm run lint`,
`npm run typecheck`, and `npm run e2e:coverage` as required checks for behavior
changes. Every feature or fix must document its verification approach and add
or update at least one test for the changed behavior. Acceptance criteria for
user-facing flows should be covered by Playwright unless an approved gap is
documented in the coverage manifest. For small changes, prefer extending
existing tests before adding new suites or helpers. After making changes,
`npm run lint` must pass. If you add another test framework, document the
command in `README.md` and keep test filenames clear, such as
`feature-name.test.tsx`.

## Commit & Pull Request Guidelines

Current history uses short, imperative commit messages, for example `Initial commit`. Continue with concise imperative subjects like `Add onboarding screen` or `Refine nutrition card layout`.

Pull requests should include:

- A short description of the user-visible change.
- Linked issue or task reference when available.
- Screenshots or recordings for UI changes on each touched platform, or a brief
  justification when one platform's evidence is sufficient.
- Confirmation that `npm run format`, `npm run lint`, and `npm run typecheck` passed.

## Active Technologies

- TypeScript, React 19, Expo SDK 55 + Expo Router, React Native, NativeWind, `expo-sqlite`, existing shared UI primitives, existing date helpers (007-history-date-picker)
- Existing local SQLite meal records via `expo-sqlite`; no schema change required (007-history-date-picker)

- Existing local SQLite meal records via `expo-sqlite`; no schema change planned for this slice (006-meal-suggestions)

- TypeScript, React 19, Expo SDK 55 + Expo Router, React Native, NativeWind, `expo-sqlite`, `react-native-safe-area-context`, `@playwright/test` (005-meal-type-modal)
- Local SQLite via `expo-sqlite`, with an additive `meal_entries` schema migration for optional `meal_type` (005-meal-type-modal)

- TypeScript, React 19, Expo SDK 55 + Expo Router, `@react-navigation/bottom-tabs`, NativeWind, `expo-sqlite`, `@expo/vector-icons` with `MaterialCommunityIcons` (004-ui-simplification)
- Existing local SQLite app state remains unchanged; meal and weight records continue to live in current app storage (004-ui-simplification)

- TypeScript, React 19, Expo SDK 55 + Expo Router, `@react-navigation/bottom-tabs`, `react-native-safe-area-context`, NativeWind (003-fix-tab-safe-area)
- Existing local SQLite app state remains unchanged; no new feature-specific storage (003-fix-tab-safe-area)

- TypeScript, React 19, Expo SDK 55 + Expo Router, React Native Web, `expo-sqlite`, Playwright Test (`@playwright/test`) (002-playwright-e2e-tests)
- Local SQLite database for app state; filesystem artifacts for Playwright reports, traces, screenshots, and a coverage manifest (002-playwright-e2e-tests)

## Recent Changes

- 002-playwright-e2e-tests: Added TypeScript, React 19, Expo SDK 55 + Expo Router, React Native Web, `expo-sqlite`, Playwright Test (`@playwright/test`)
