# lookr

`lookr` is a React Native weight-loss app scaffold built with Expo, TypeScript, Expo Router, and NativeWind.

## Stack

- Expo SDK 55
- React Native 0.83
- TypeScript
- Expo Router
- NativeWind with Tailwind utility classes
- Oxc for linting and formatting (`oxlint`, `oxfmt`)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Install the Playwright browser used by the web regression suite:

```bash
npx playwright install chromium
```

3. Start the development server:

```bash
npm start
```

4. Run on a target platform:

```bash
npm run android
npm run ios
npm run web
```

5. Build and install a standalone app locally:

**Prerequisites for Android local builds:**

- Install JDK 17 (required for React Native 0.83).
- Set the `JAVA_HOME` environment variable to point to your JDK 17 installation.
- Android Studio / Android SDK must be installed.
- Ensure the Android SDK location is configured. You can do this by setting the `ANDROID_HOME` environment variable, or by creating `android/local.properties` with the path to your SDK (e.g., `sdk.dir=/home/tanome/Android/Sdk`).

```bash
npx expo run:android --variant release
```

To install an already built release APK to a USB-connected phone with Developer Mode and USB Debugging enabled:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run e2e
npm run e2e:headed
npm run e2e:us1
npm run e2e:us2
npm run e2e:coverage
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run typecheck
```

## Styling

This project uses NativeWind instead of traditional CSS modules or React Native `StyleSheet`-first styling.

- Tailwind entry file: [global.css](/home/tanome/dev/lookr/global.css)
- Tailwind config: [tailwind.config.js](/home/tanome/dev/lookr/tailwind.config.js)
- NativeWind wiring: [babel.config.js](/home/tanome/dev/lookr/babel.config.js), [metro.config.js](/home/tanome/dev/lookr/metro.config.js)

## Engineering Constraints

Keep new code lean, readable, and modular. Prefer extending existing screens,
components, and utilities before adding new files or abstractions. When a new
module is necessary, keep its responsibility narrow and justify the added
surface area in the relevant spec or plan.

## Project Structure

- App routes: [src/app](/home/tanome/dev/lookr/src/app)
- Root layout: [src/app/\_layout.tsx](/home/tanome/dev/lookr/src/app/_layout.tsx)
- Main screen: [src/app/index.tsx](/home/tanome/dev/lookr/src/app/index.tsx)
- Expo config: [app.json](/home/tanome/dev/lookr/app.json)

## Quality Checks

Before committing, run:

```bash
npm run format
npm run lint
npm run typecheck
npm run e2e:coverage
```

For user-facing changes, also verify the touched flow behaves consistently on
the platforms you changed and capture screenshots or recordings when the UI
meaningfully changes.

Each feature or fix must add or update at least one test tied to the changed
behavior. For small behavior changes, extend the closest existing test before
adding a new test file or helper.

For web regression coverage changes, also run the relevant Playwright slice:

```bash
npm run e2e
# or a focused story slice
npm run e2e:us1
npm run e2e:us2
```

## E2E Coverage Rule

The web Playwright harness is the release gate for the active requirements in
[`specs/001-points-tracking/spec.md`](/home/tanome/dev/lookr/specs/001-points-tracking/spec.md).

- User-facing acceptance criteria must have a traceable Playwright proof or a
  documented deferred reason in the coverage manifest.
- New or materially changed in-scope acceptance scenarios must update
  [`playwright/coverage.manifest.json`](/home/tanome/dev/lookr/playwright/coverage.manifest.json)
  in the same change set.
- Covered scenarios should land with Playwright automation. If a scenario is not
  automated yet, it must be marked as `deferred` with a reason in the manifest.
- `npm run e2e:coverage` validates that every active acceptance scenario has a
  traceable manifest entry before work is treated as complete.

## TODO

- a way to save the data to maybe a file or something (to prevent data loss)
- theme setting should show theme of the system (maybe fixed already)
- points calculator
- points (daily limit) calculator
