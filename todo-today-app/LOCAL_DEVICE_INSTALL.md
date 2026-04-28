# Local iPhone Install

This project is set up for the free local-device path:

- `expo-dev-client` is installed
- the app has a stable iOS bundle identifier
- the repo provides `prebuild` and `run:ios` scripts
- generated native folders stay out of git

This path is for building from your own Mac to a physically attached iPhone using
Xcode and your Apple Account Personal Team.

There are two distinct modes:

- `Development build`: installed as its own app, but meant to connect to Metro
- `Local release-trial build`: installed as its own app with the JS bundle embedded,
  so it can run away from your network without a dev server

## Prerequisites

- macOS with Xcode installed
- your Apple Account signed into Xcode
- the iPhone connected to the Mac
- Developer Mode enabled on the iPhone if prompted

## One-Time Setup

From `todo-today-app/`:

```bash
yarn install
yarn prebuild:ios
```

Then open the generated workspace in Xcode:

```text
ios/todo-today-app.xcworkspace
```

In Xcode:

1. select the app target
2. open `Signing & Capabilities`
3. set `Team` to your Personal Team
4. if Xcode complains about the identifier, change the bundle identifier to another
   unique reverse-DNS value
5. choose your attached iPhone as the run destination
6. build/run once from Xcode

Notes:

- the repo default bundle identifier is `com.rldc.todotoday`
- if you change it in Xcode and want that to survive a clean prebuild, also update
  `app.json`

## Day-to-Day Development

Start the Metro server for the dev client:

```bash
yarn start:dev-client
```

Then either:

- launch the installed app directly on the iPhone, or
- rebuild from the CLI when native code or provisioning needs it:

```bash
yarn ios:device
```

## Standalone Local Release-Trial Build

Use this when you want the app to behave like a real installed app for day-to-day
trial use.

### Build from the CLI

```bash
yarn ios:device:release
```

This builds the iOS app with the `Release` configuration and installs it on the
selected physical device.

### Or build from Xcode

In Xcode:

1. open `Product > Scheme > Edit Scheme`
2. select `Run`
3. set `Build Configuration` to `Release`
4. choose the attached iPhone as the run destination
5. run the app

Result:

- the app is installed as a standalone app on the phone
- it does not require Expo Go
- it does not require Metro / a dev server to launch and run
- after you change JavaScript or native code, you must rebuild and reinstall

### When to use each mode

- use `yarn start:dev-client` + `yarn ios:device` when actively developing
- use `yarn ios:device:release` when you want to live with the app away from your Mac

## Clean Rebuild

If the native project gets out of sync:

```bash
yarn prebuild:ios:clean
```

Then reopen the workspace in Xcode and confirm signing again.

## Scope and Limitations

- this is a local install path, not proper distribution
- Apple documents the free path as testing on your personal devices, not broad
  distribution
- free Personal Team provisioning is temporary and may need periodic rebuilds
- if you later want stable multi-person testing, use a paid Apple Developer Program
  account + TestFlight
