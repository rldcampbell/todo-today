# To-day Expo App

This is the Expo / React Native scaffold for the To-day iPhone-first task app.

Product and architecture references live one level up:

- `../todo-today-ios-spec.md`
- `../todo-today-expo-spec.md`

## Commands

```bash
npm install
npm run start
npm run start:go
npm run start:tunnel
npm run ios
npm run android
npm run web
npm run typecheck
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

This scaffold includes:

- bottom-tab routing for `Today` and `Backlog`
- modal routes for task create/edit
- SQLite provider and initial schema migration
- app-level state provider for `Today` and `Backlog` UI state
- placeholder `Today`, `Backlog`, and task-sheet screens
- explicit Expo Go scripts for LAN and tunnel startup

It does not yet include:

- persisted task CRUD
- backlog queries
- today selection logic
- completion, archive, rollover, or recurrence behavior
- drag reorder or swipe actions
