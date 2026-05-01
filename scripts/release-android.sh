#!/bin/sh
set -e

for cmd in gh node npm git npx; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "Error: '$cmd' not found in PATH" >&2; exit 1; }
done

BUMP="${1:?Usage: release-android.sh <major|minor|patch>}"

case "$BUMP" in
  major|minor|patch) ;;
  *) echo "Error: bump type must be major, minor, or patch" >&2; exit 1 ;;
esac

npm version "$BUMP" --no-git-tag-version

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

node -e "
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('app.json', 'utf8'));
cfg.expo.version = '$VERSION';
fs.writeFileSync('app.json', JSON.stringify(cfg, null, 2) + '\n');
"

git add package.json package-lock.json app.json
git commit -m "Release $TAG"
git tag "$TAG"
git push
git push origin "$TAG"

APK="android/app/build/outputs/apk/release/app-release.apk"

echo "Building APK for $TAG..."
npx expo prebuild --platform android --no-install
./android/gradlew -p android assembleRelease

echo "Creating GitHub release $TAG..."
gh release create "$TAG" "$APK" \
  --title "$TAG" \
  --notes "Android APK for $TAG"
