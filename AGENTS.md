# Repository Guidelines

## Project Structure & Module Organization

Core app code lives in `src/app`, using Expo Router file-based routes. The current entry screen is `src/app/index.tsx`, and the root router layout is `src/app/_layout.tsx`. Shared static assets live in `assets/`, Expo app configuration is in `app.json`, and styling/tooling setup is at the repo root: `global.css`, `tailwind.config.js`, `babel.config.js`, and `metro.config.js`.

This repository does not have a test suite yet. When adding tests, place them near the feature they cover or in a local `__tests__` directory under `src/`.

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

Follow existing naming:

- Route files: lowercase file-based names such as `index.tsx`.
- Components: `PascalCase` if new reusable components are added.
- Variables/functions: `camelCase`.

Formatting and linting are enforced with Oxc (`oxfmt`, `oxlint`).

## Dependency Policy

Only add dependencies whose licenses are usable in an MIT-licensed project. Do not add dependencies with copyleft licenses or reciprocal distribution requirements, including GPL, AGPL, LGPL, CC-BY-SA, or similar licenses. Prefer permissive licenses such as MIT, BSD, ISC, Apache-2.0, 0BSD, BlueOak-1.0.0, or the Unlicense.

## Testing Guidelines

There is no configured test runner yet. Until one is added, treat `npm run lint` and `npm run typecheck` as required checks. After making changes, `npm run lint` must pass. If you add a test framework, document the command in `README.md` and keep test filenames clear, such as `feature-name.test.tsx`.

## Commit & Pull Request Guidelines

Current history uses short, imperative commit messages, for example `Initial commit`. Continue with concise imperative subjects like `Add onboarding screen` or `Refine nutrition card layout`.

Pull requests should include:

- A short description of the user-visible change.
- Linked issue or task reference when available.
- Screenshots or recordings for UI changes on at least one platform.
- Confirmation that `npm run format`, `npm run lint`, and `npm run typecheck` passed.
