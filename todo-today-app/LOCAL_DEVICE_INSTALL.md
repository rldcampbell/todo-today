# Local iPhone Install

This project supports two local iPhone installs from the same codebase:

| Path                | Home screen name | Bundle identifier        | URL scheme       | Needs Metro |
| ------------------- | ---------------- | ------------------------ | ---------------- | ----------- |
| Development build   | `To-day Dev`     | `com.rldc.todotoday.dev` | `todo-today-dev` | Yes         |
| Release-trial build | `To-day`         | `com.rldc.todotoday`     | `todo-today`     | No          |

The variants are controlled by `APP_VARIANT` in `app.config.js`. The scripts in
`package.json` set the right value for each path.

This path is for building from your own Mac to a physically attached iPhone using
Xcode and your Apple Account Personal Team.

## Prerequisites

- macOS with Xcode installed
- your Apple Account signed into Xcode
- the iPhone connected to the Mac
- Developer Mode enabled on the iPhone if prompted

## First-Time Setup

From `todo-today-app/`:

```bash
yarn install
```

### Install the development app

Use this for fast iteration while you are coding:

```bash
yarn ios:device:dev
```

This installs `To-day Dev` on the phone. If Xcode asks for signing setup, open:

```text
ios/todo-today-app.xcworkspace
```

Then in Xcode:

1. select the app target
2. open `Signing & Capabilities`
3. set `Team` to your Personal Team
4. confirm the bundle identifier is `com.rldc.todotoday.dev`
5. choose your attached iPhone as the run destination
6. build/run once from Xcode

### Install the release-trial app

Use this when you want a normal app you can carry around away from your Mac:

```bash
yarn ios:device:release
```

This installs `To-day` on the phone. If Xcode asks for signing setup, use the
same Xcode steps above, but confirm the bundle identifier is
`com.rldc.todotoday`.

Because the two variants use different bundle identifiers, iOS treats them as
separate apps. They can be installed side by side and they keep separate local
SQLite data.

## Day-to-Day Development

Start Metro for the development app:

```bash
yarn start:dev-client
```

Then open `To-day Dev` on the phone.

For ordinary JavaScript, TypeScript, style, and UI changes, you should usually
see updates through Metro / Fast Refresh without rebuilding the native app.

Rebuild the development app only when native inputs change, for example:

- adding or updating a native dependency
- changing Expo plugins
- changing `app.config.js`
- changing iOS signing / native project settings

Use:

```bash
yarn ios:device:dev
```

## Release-Trial Updates

The release-trial app has the JavaScript bundle embedded, so it does not need
Metro and works away from your Mac.

After JavaScript or native changes, rebuild and reinstall it:

```bash
yarn ios:device:release
```

Use this when you want the latest version as the real app on your phone.

## Prebuild Commands

The generated `ios/` folder is not committed. It represents whichever variant
you most recently prebuilt or ran.

Normal prebuilds:

```bash
yarn prebuild:ios:dev
yarn prebuild:ios
```

Clean prebuilds when the native project gets confused:

```bash
yarn prebuild:ios:clean:dev
yarn prebuild:ios:clean
```

After a clean prebuild, reopen the Xcode workspace and confirm signing for the
variant you are building.

## Troubleshooting

If the wrong app name or bundle identifier appears, run the matching prebuild
command and build again.

If Xcode complains that a bundle identifier is unavailable, choose another unique
reverse-DNS identifier and update the matching value in `app.config.js`.

If `To-day Dev` cannot find Metro, make sure:

- `yarn start:dev-client` is running
- the phone and Mac are on the same network
- the dev app uses the `todo-today-dev` scheme

## Scope and Limitations

- this is a local install path, not proper distribution
- Apple documents the free path as testing on your personal devices, not broad
  distribution
- free Personal Team provisioning is temporary and may need periodic rebuilds
- if you later want stable multi-person testing, use a paid Apple Developer
  Program account + TestFlight
