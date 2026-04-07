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

2. Start the development server:

```bash
npm start
```

3. Run on a target platform:

```bash
npm run android
npm run ios
npm run web
```

## Available Scripts

```bash
npm start
npm run android
npm run ios
npm run web
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

## Project Structure

- App routes: [src/app](/home/tanome/dev/lookr/src/app)
- Root layout: [src/app/_layout.tsx](/home/tanome/dev/lookr/src/app/_layout.tsx)
- Main screen: [src/app/index.tsx](/home/tanome/dev/lookr/src/app/index.tsx)
- Expo config: [app.json](/home/tanome/dev/lookr/app.json)

## Quality Checks

Before committing, run:

```bash
npm run format
npm run lint
npm run typecheck
```
