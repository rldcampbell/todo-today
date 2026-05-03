# To-day Expo App

This is the Expo / React Native app for the To-day iPhone-first task app.

Product and architecture references live one level up:

- `../todo-today-ios-spec.md`
- `../todo-today-expo-spec.md`
- `../todo-today-code-style.md`
- `./LOCAL_DEVICE_INSTALL.md`

## Commands

```bash
yarn install
yarn start
yarn start:go
yarn start:dev-client
yarn start:tunnel
yarn ios
yarn ios:device
yarn ios:device:dev
yarn ios:device:release
yarn prebuild:ios
yarn prebuild:ios:dev
yarn prebuild:ios:clean
yarn prebuild:ios:clean:dev
yarn android
yarn web
yarn lint
yarn lint:fix
yarn test
yarn test:watch
yarn typecheck
```

## Structure

- `src/app/`: Expo Router routes only
- `src/components/`: screen and UI components
- `src/db/`: SQLite setup, migrations, and query helpers
- `src/features/`: domain types and feature logic
- `src/hooks/`: feature-facing hooks
- `src/providers/`: app and database providers
- `src/theme/`: color, spacing, and typography tokens
- `src/utils/`: date, id, and link helpers

## Current State

Implemented:

- bottom-tab `Today` / `Backlog` navigation
- SQLite-backed task persistence
- task create/edit/delete
- Today selection, completion, drag reorder, and swipe remove
- Current / Archived backlog views
- day rollover and recurring-task logic
- picker-backed due dates
- category reuse / create flow
- pure-unit test coverage for the main logic layer

## Local iPhone Install

For free local-device installs with Xcode Personal Team, including a standalone
local release-trial build, use the guidance in
[`LOCAL_DEVICE_INSTALL.md`](./LOCAL_DEVICE_INSTALL.md).
