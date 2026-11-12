#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export ANDROID_HOME="/home/antigravity/android-sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

PROXY_PORT=$(echo $HTTP_PROXY | sed 's/.*://' | sed 's/\/.*//')
export JAVA_OPTS="-Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=$PROXY_PORT -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=$PROXY_PORT -Djavax.net.ssl.trustStore=/home/antigravity/cacerts.jks -Djavax.net.ssl.trustStorePassword=changeit"
export GRADLE_OPTS="$JAVA_OPTS"

export CMAKE_BUILD_PARALLEL_LEVEL=2
export NODE_ENV=production

echo "Running typecheck and tests..."
npm run typecheck
npm test -- --runInBand

echo "Writing android/local.properties..."
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

echo "Building release APK..."
./android/gradlew --stop
./android/gradlew -p android :app:assembleRelease --max-workers=2 \
  -PreactNativeArchitectures=arm64-v8a \
  -Pkotlin.compiler.execution.strategy=in-process

sha="$(git rev-parse --short HEAD)"
mkdir -p builds
cp android/app/build/outputs/apk/release/app-release.apk "builds/kartlarim-$sha.apk"
echo "Build complete: builds/kartlarim-$sha.apk"
sha256sum "builds/kartlarim-$sha.apk"
ls -lh "builds/kartlarim-$sha.apk"
