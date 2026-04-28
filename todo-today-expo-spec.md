# To-day Expo / React Native Implementation Spec

## 1. Purpose

This document translates the product / UX spec into a concrete Expo / React Native implementation plan.

It is intentionally implementation-specific:

- project structure
- navigation approach
- persistence layer
- state architecture
- screen routing
- gesture handling
- build and release workflow

The product source of truth remains [todo-today-ios-spec.md](/Users/robert.campbell/Projects/rldc/html-apps/todo-today/todo-today-ios-spec.md).

Code style and module-structure conventions are defined in [todo-today-code-style.md](/Users/robert.campbell/Projects/rldc/html-apps/todo-today/todo-today-code-style.md).

## 2. Chosen Technical Direction

### 2.1 Stack

Use:

- Expo managed workflow
- React Native
- TypeScript
- Expo Router
- `expo-sqlite`
- `react-native-gesture-handler`
- `react-native-reanimated`

### 2.2 Why This Stack

This app is a strong fit for Expo / React Native because:

- the UI is mostly tabs, lists, sheets, toggles, forms, and gestures
- the product is local-first
- the implementation should stay readable to someone already somewhat familiar with Expo
- the app may later expand beyond iPhone if needed

### 2.3 iOS-First Position

This is still an iPhone-first app.

Implementation should favor:

- iOS interaction patterns
- iOS spacing and typography choices
- iOS sheet and tab conventions

The codebase should avoid assumptions that make Android impossible later, but Android polish is not a v1 goal.

## 3. Project Bootstrap

### 3.1 Project Creation

Create the app with `create-expo-app` using the current stable Expo SDK at project start.

At the time of writing, Expo documents `create-expo-app` with the `default@sdk-55` template.

### 3.2 Development Mode

Start with the standard Expo development flow, but plan to use a development build rather than relying on Expo Go long-term.

Reason:

- Expo documents development builds as the path for production-grade apps
- the app will rely on gesture-heavy behavior and native-feeling interaction
- future native configuration should not be blocked by Expo Go limitations

### 3.3 Initial Dependencies

Expected initial dependencies:

- `expo-router`
- `expo-sqlite`
- `react-native-gesture-handler`
- `react-native-reanimated`

Additional dependencies should be kept minimal in v1.

## 4. Implementation Principles

### 4.1 Keep the Code Followable

Do not introduce heavy state libraries or large UI kits in v1 unless they solve a clear problem.

The code should be understandable with:

- React components
- custom hooks
- a small data access layer
- a small domain layer

Implementation should also follow these structure preferences:

- split hooks and non-trivial logic into unit-testable pieces
- prefer folders plus `index.ts` barrel exports for non-trivial hooks/modules
- prefer one helper function per file unless that is clear overkill
- use explicit type imports and exports
- keep function boundaries functional, while allowing imperative internals
- for non-trivial hooks, keep the hook thin and extract derivation logic into pure helpers that can be unit tested directly
- keep unit test files adjacent to the module they cover using the same base filename plus `.test.ts`
- prefer `const myFunc = ...` style function expressions over function declarations

### 4.2 SQLite as Source of Truth

Use SQLite as the single persisted app data store.

Reason:

- Expo provides `expo-sqlite` officially
- data persists across app restarts
- the app is local-first
- `Current` vs `Archived` is best expressed as query logic rather than duplicated state

### 4.3 Derived Views Over Stored Flags

Do not store `Current` or `Archived` as explicit status flags.

Instead:

- store task facts
- derive `Current` and `Archived` from task data and the local day key

This reduces state drift and makes rollover rules easier to reason about.

## 5. App Structure

Use Expo Router with file-based routing.

Recommended structure:

```text
todo-today-app/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      today.tsx
      backlog.tsx
    task/
      new.tsx
      [id].tsx
  src/
    components/
      today/
      backlog/
      task-sheet/
        TaskCategoryField.tsx
      common/
    db/
      app-state/
        index.ts
        loadAppStateEntries.ts
        upsertAppStateValue.ts
      client.ts
      migrations.ts
      mappers.ts
      tasks/
        index.ts
        loadTasks.ts
        createTask.ts
        updateTask.ts
        deleteTask.ts
        normalizeTodayOrdersForDay.ts
    features/
      tasks/
        task-types.ts
        createEmptyTaskDraft.ts
        buildTaskRecordValues.ts
        buildTaskCompletionValues.ts
        buildTaskSelectionValues.ts
        getNextTodayOrder.ts
        mapTaskToDraft.ts
        mapTaskToRecordValues.ts
        validateTaskDraft.ts
        getTaskDescriptionPreview.ts
        isTaskArchived.ts
        task-selectors/
          index.ts
          countIncompleteTasks.ts
          filterVisibleTodayTasks.ts
          selectTaskCategories.ts
          selectTodayTasks.ts
        recurrence/
          index.ts
          describeRecurrence.ts
          getNextRecurringDueDate.ts
        getRecurringTaskRolloverPatch.ts
        rollover.ts
      backlog/
        backlog-types.ts
        backlog-selectors/
          index.ts
          filterTasksForBacklog.ts
          sortBacklogTasks.ts
      app-state/
        app-preferences-types.ts
        defaultAppPreferences.ts
        hydrateAppPreferences.ts
      today/
        today-types.ts
    hooks/
      useTasks/
        index.ts
        useTasks.ts
      useTask/
        index.ts
        useTask.ts
      useTaskActions/
        index.ts
        useTaskActions.ts
      useToday/
        index.ts
        useToday.ts
      useBacklog/
        index.ts
        useBacklog.ts
    providers/
      AppProvider.tsx
      DatabaseProvider.tsx
      TasksProvider.tsx
    theme/
      colors.ts
      spacing.ts
      typography.ts
    utils/
      dates/
        index.ts
        advanceDateByRecurrence.ts
        formatRelativeDueDate.ts
        getLocalDateString.ts
        getLocalDayKey.ts
        isBeforeToday.ts
      links.ts
      ids.ts
```

Notes:

- `app/` contains routing only
- business logic lives under `src/features/`
- database access stays under `src/db/`
- presentation components stay under `src/components/`

## 6. Navigation Model

### 6.1 Router

Use Expo Router for:

- bottom tab navigation
- modal / sheet presentation
- simple deep-linkable route structure

### 6.2 Tabs

Use JavaScript tabs in Expo Router for v1.

Reason:

- stable and well-documented
- easy to configure
- predictable with current Expo Router patterns

Do not use Expo Router native tabs in v1 because Expo documents them as beta / subject to change.

### 6.3 Route Map

Recommended route map:

- `/(tabs)/today`
- `/(tabs)/backlog`
- `/task/new`
- `/task/[id]`

### 6.4 Task Sheet Presentation

Use a stack-presented modal screen for task create/edit.

Preferred iOS behavior:

- sheet-style modal
- large enough to feel like a task form, not a tiny popup

If the current Expo Router modal presentation options support a sheet presentation cleanly, use that. Otherwise use a standard modal presentation with app-level styling that still feels sheet-like.

## 7. Data Model

### 7.1 SQLite Tables

Use one primary `tasks` table plus a simple key-value table for persisted UI state.

### `tasks`

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  due_date TEXT,
  recurrence_interval INTEGER,
  recurrence_unit TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  selected_for_day TEXT,
  today_order INTEGER
);
```

Field notes:

- dates are stored as ISO-like strings
- `due_date` is local date-only
- `completed_at` is a timestamp
- `selected_for_day` stores a local day key such as `YYYY-MM-DD`
- `today_order` is only meaningful when `selected_for_day` matches the current day

### `app_state`

```sql
CREATE TABLE app_state (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
```

Suggested keys:

- `today.hideCompleted`
- `backlog.search`
- `backlog.category`
- `backlog.status`
- `backlog.current.sortField`
- `backlog.current.sortDirection`
- `backlog.archived.sortField`
- `backlog.archived.sortDirection`

### 7.2 Why No Categories Table

Do not create a categories table in v1.

Reason:

- categories are task-driven in the product spec
- there is no standalone category management
- existing categories can be derived from distinct task category values

### 7.3 Indexes

Add a small set of indexes in v1:

- `tasks(selected_for_day, today_order)`
- `tasks(completed_at)`
- `tasks(due_date)`
- `tasks(category)`

## 8. Date and Time Rules

### 8.1 Local Day Key

Create one small date utility module that is the only place allowed to define:

- local day key generation
- local start-of-day comparisons
- relative due date labels
- recurrence date advancement

This avoids date logic being reimplemented inconsistently across screens and queries.

### 8.2 Storage Rules

- `due_date` should be stored as a local date string
- timestamps such as `created_at`, `updated_at`, and `completed_at` should be stored in ISO timestamp form
- comparisons for rollover and archive logic should always go through the shared date utility

## 9. Day Rollover Implementation

### 9.1 When Rollover Runs

Run rollover logic:

- on app bootstrap
- when the app returns to the foreground

### 9.2 Rollover Behavior

At rollover:

1. Clear `Today` selection by removing stale `selected_for_day` and `today_order` values.
2. Leave incomplete non-recurring tasks untouched.
3. Leave non-recurring completed tasks untouched at row level; they will naturally appear in `Archived` because the query rules change when the day changes.
4. For recurring tasks completed before the current local day:
   - advance the due date by the recurrence interval
   - clear `completed_at`
   - clear any stale `Today` selection

### 9.3 Important Constraint

Do not advance a recurring due date when the user taps complete.

Advance only during rollover if the recurring task is still complete then.

## 10. Query Model

### 10.1 Today Query

`Today` is a query over tasks where:

- `selected_for_day = currentDayKey`

Sorted by:

1. incomplete before complete
2. `today_order` within incomplete
3. `today_order` within complete

If `Hide completed` is enabled, completed rows are filtered out at selector level.

### 10.2 Current Query

`Current` should include:

- non-recurring tasks with `completed_at IS NULL`
- non-recurring tasks completed during the current local day
- recurring tasks whether incomplete or completed during the current local day

## 11. Persisted UI State

Persist app-level UI state through `app_state`, hydrated by `AppProvider`.

This includes:

- `Today` hide/show completed preference
- shared backlog search string
- shared backlog category filter
- current backlog status view
- current sort field/direction
- archived sort field/direction

The provider should update local React state immediately, then persist the matching `app_state` key asynchronously.

### 10.3 Archived Query

`Archived` should include:

- non-recurring tasks with `completed_at` before the current local day

Recurring tasks should never appear in `Archived`.

### 10.4 Search

Search matches:

- title
- description

Search does not match category.

### 10.5 Sorting

Current sorts:

- created date
- edited date
- alphabetical
- due date

Archived sorts:

- completed date
- created date
- edited date
- alphabetical
- due date

When sorting by due date, rows with no due date always go last.

## 12. State Architecture

### 12.1 Source of Truth

SQLite is the source of truth.

React state should hold:

- screen input state
- current query results
- modal draft state
- optimistic UI state only where clearly useful

### 12.2 Recommended Pattern

Use:

- a database provider
- a small app provider for bootstrapping and persisted UI preferences
- feature hooks that expose data plus actions

Do not start with Redux, MobX, or another global state framework.

### 12.3 Feature Hooks

Expected hooks:

- `useToday()`
- `useBacklog()`
- `useTask(id)`
- `useTaskActions()`

These hooks should hide SQL details from screen components.

## 13. Screen Implementation

### 13.1 Today Screen

Responsibilities:

- fetch tasks selected for the current day
- render clean ordered list
- support complete / uncomplete
- support remove from today
- support hide/show completed
- support reorder
- open task modal
- open quick add modal

Recommended component breakdown:

- `TodayScreen`
- `TodayList`
- `TodayTaskRow`
- `HideCompletedToggle`
- `FloatingAddButton`

### 13.2 Backlog Screen

Responsibilities:

- render `Current / Archived`
- keep search always visible
- expose compact sort/category/clear controls
- render selected-for-today state
- toggle selected-for-today from the row
- open task modal
- quick add from backlog

Recommended component breakdown:

- `BacklogScreen`
- `BacklogHeader`
- `BacklogSearchInput`
- `BacklogStatusControl`
- `BacklogFilterBar`
- `BacklogTaskList`
- `BacklogTaskRow`
- `FloatingAddButton`

### 13.3 Task Sheet

Responsibilities:

- create and edit tasks from the same form
- explicit save
- explicit cancel
- dirty-state confirmation
- mark complete / not complete
- restore archived task
- hard delete existing task with confirmation

Recommended component breakdown:

- `TaskSheetScreen`
- `TaskForm`
- `TaskCategoryField`
- `DueDateField`
- `RecurrenceField`
- `CompletionActions`
- `DeleteTaskAction`

## 14. Gestures and Interaction Handling

### 14.1 Swipe to Remove from Today

Use `react-native-gesture-handler` for row swipe behavior on `Today`.

Requirements:

- swipe action removes from `Today`
- removing from `Today` does not delete the task
- removing from `Today` does not reset completion

Completed tasks do not need a remove action exposed as prominently as incomplete tasks.

### 14.2 Drag Reordering

Use gesture and animation primitives from:

- `react-native-gesture-handler`
- `react-native-reanimated`

Implementation constraint:

- incomplete tasks may reorder only within the incomplete group
- completed tasks may reorder only within the completed group
- users must not drag across the incomplete / complete boundary

This may be enforced in one of two ways:

1. one combined list with guarded drop behavior
2. two internally separate reorderable sections with visually continuous styling

Either is acceptable as long as the UI still reads as one `Today` list.

### 14.3 Backlog Rows

Do not use swipe gestures in `Backlog` for v1.

Backlog rows should have:

- tap to edit
- trailing toggle for add/remove from `Today`

## 15. Task Form Rules

### 15.1 Create Defaults

Creating from `Today`:

- `selected for today = true`

Creating from `Backlog`:

- `selected for today = false`
- if a category filter is active, preselect that category

### 15.2 Recurrence Form

Represent recurrence as:

- off: `Does not repeat`
- on: `Every [number] [days|weeks|months|years]`

Rules:

- recurrence requires due date
- if recurrence is enabled without a due date, the form should block save and surface the requirement clearly

### 15.3 Description Rendering

Task descriptions remain plain text in storage.

Rendering rules:

- preserve line breaks
- detect URLs and render them as tappable links in read/display contexts

## 16. Styling Approach

### 16.1 General

Do not introduce a heavy styling framework in v1.

Use:

- React Native `StyleSheet`
- a small theme token layer

### 16.2 Visual Character

The implementation should reflect the product direction:

- calm planner feel
- warm neutral palette
- quiet surfaces
- restrained chrome

### 16.3 Safe Areas

All main screens and modals must respect iPhone safe areas.

## 17. Performance and UX Constraints

### 17.1 Lists

Use `FlatList` or `SectionList`-style virtualization for task lists rather than rendering long arrays in `ScrollView`.

### 17.2 Database Access

Avoid issuing ad hoc SQL inside presentational components.

All reads and writes should flow through the db / feature layers.

### 17.3 Updates

For v1, prioritize correctness and legibility over aggressive optimistic updates.

Where an interaction is simple and safe, immediate optimistic UI is fine, but database state should remain authoritative.

## 18. Testing Strategy

### 18.1 Priority

Test the domain rules more heavily than the styling.

Install the testing framework early, even before the full feature set is built.

Reason:

- pure helpers and hook-internal derivation logic can and should be tested before UI flows are complete
- this validates the intended module structure while the codebase is still small

Most important tests:

- rollover logic
- recurrence advancement
- `Current` vs `Archived` query logic
- task selection for `Today`
- reorder constraints
- form validation around recurrence and due date

### 18.2 Testing Layers

Recommended layers:

- unit tests for date and recurrence utilities
- unit tests for extracted hook-helper functions
- unit tests for selectors and rollover logic
- a small number of screen-level interaction tests for core flows

## 19. Delivery Workflow

### 19.1 Development

Local development should use:

- Expo dev server
- development builds on simulator / device once native-feeling work begins

### 19.2 Build and Distribution

Use:

- EAS Build for installable iOS binaries
- EAS Submit when the app is ready for TestFlight / App Store submission

### 19.3 Updates

Do not design v1 around over-the-air updates. They can be added later, but they are not part of the app architecture itself.

## 20. Explicit Non-Decisions

These do not need to be decided before implementation starts:

- exact animation curves
- exact tab icon set
- exact SQL helper style
- whether the task sheet uses one route file or separate wrapper components internally

Those can be settled while implementing, as long as they stay inside the architectural boundaries above.

## 21. Recommended First Build Order

Implement in this order:

1. Expo project bootstrap
2. Router with tabs and modal routes
3. SQLite setup and migrations
4. task model and date utilities
5. rollover service
6. `Today` screen basic list and complete/remove actions
7. `Backlog` screen with search, status, sort, and category
8. task create/edit sheet
9. reorder behavior
10. visual polish

## 22. Official References

- Expo `create-expo-app`: https://docs.expo.dev/more/create-expo/
- Expo Router introduction: https://docs.expo.dev/router/introduction/
- Expo Router tabs: https://docs.expo.dev/router/advanced/tabs/
- Expo Router modals: https://docs.expo.dev/router/advanced/modals/
- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo development builds: https://docs.expo.dev/develop/development-builds/introduction/
- Expo EAS Build: https://docs.expo.dev/build/introduction/
- Expo EAS Submit: https://docs.expo.dev/submit/introduction/
- Expo gesture handler reference: https://docs.expo.dev/versions/latest/sdk/gesture-handler/
- Expo reanimated reference: https://docs.expo.dev/versions/latest/sdk/reanimated/
