# To-day v1 Product Spec

## Product Definition

To-day is a calm daily commitment app.

The core model is:

- `Backlog` is memory.
- `Today` is an explicit daily selection state.
- Nothing becomes a commitment until the user chooses it for today.

This is a phone-first product. The HTML prototype should behave like an iPhone-style app in a browser, even where the exact native gestures are approximated.

## Design Goals

- Keep `Today` visually quiet and low-pressure.
- Make it easy to choose tasks for the day without auto-scheduling them.
- Let the backlog serve both as a selection surface and as the task library.
- Treat due dates as signals, not obligations.
- Preserve user context with persistent filters and sort choices where helpful.
- Support lightweight planning without productivity scoring, guilt language, or forced carryover.

## Non-Goals for v1

- No automatic carry-over into `Today`.
- No scores, streaks, or gamification.
- No parent/child tasks or subtasks.
- No separate category management UI.
- No bulk select/deselect for filtered backlog views.
- No configurable rollover time.
- No quotes or curated text on the empty `Today` screen.
- No time-of-day due times.

## Navigation

The primary navigation is a bottom tab bar with icons and labels:

- `Today`
- `Backlog`

The `Today` tab shows a badge count for incomplete tasks currently selected for today.

## Core Concepts

### Backlog

The backlog is the single task store for all non-deleted tasks.

- Tasks stay in the backlog whether or not they are selected for today.
- Selecting a task for `Today` does not move it out of the backlog.
- A task can exist with only a title.

### Today

`Today` is not a separate task store. It is a daily ordered selection of backlog tasks.

- Selection is explicit.
- Selection resets silently when a new day begins.
- Task order in `Today` is manual.

### Current and Archived

Backlog has two modes:

- `Current`
- `Archived`

`Current` contains tasks still relevant to the active day cycle:

- incomplete non-recurring tasks
- non-recurring tasks completed today
- recurring tasks, including recurring tasks completed today

`Archived` contains non-recurring tasks completed before today.

Archived tasks remain editable, but must be restored before they can be selected for `Today`.

## Data Model

### Task

Each task has:

- `id`
- `title` required
- `description` optional, multiline plain text
- `category` optional, single value only
- `dueDate` optional, date-only
- `recurrence` optional
- `createdAt`
- `updatedAt`
- `completedAt` optional

### Recurrence

Recurrence is represented as:

- `Every X [days|weeks|months|years]`

Rules:

- recurrence requires a due date
- the user-set due date is the first recurrence anchor
- due date remains user-editable even when recurrence exists
- turning recurrence off keeps the current due date as a normal due date

### Today State

The app stores a date-scoped ordered selection for `Today`:

- current day identifier
- ordered task ids selected for today

The app also persists UI state such as:

- `Today` hide/show completed preference
- backlog search
- backlog category filter
- backlog status mode
- backlog sort settings

## Day Rollover Rules

Day rollover is silent in v1.

When a new day begins and the app loads:

1. `Today` selection is cleared.
2. Incomplete non-recurring tasks remain in `Current`.
3. Non-recurring tasks completed before today become `Archived`.
4. Recurring tasks that are completed at rollover:
   - stay in `Current`
   - have their due date advanced by the recurrence interval
   - have their completion state reset

This means recurring completion does not advance the due date immediately on check. The advance happens only at rollover if the recurring task is still complete at that point.

## Today View

### Purpose

`Today` is the clean action list for the day.

### Empty State

- No text in v1.
- The screen should feel calm visually.
- No large call-to-action in the empty state.

### Content

By default, each row shows:

- task title
- first line of description, if present
- completion state

It does not show by default:

- category
- due date
- recurrence

### Interactions

- tap row opens the task sheet
- checkbox on the left marks complete / not complete
- quick add uses a floating `+` in the lower-right
- tasks added to `Today` appear at the bottom of the incomplete portion of the list
- reordering is manual
- completed tasks automatically sink below incomplete tasks
- drag/drop reorder is allowed within the incomplete group and within the completed group

### Completed Task Behavior

- completed tasks stay in the same list
- they change styling
- there is no separate `Completed` divider
- there are no summary counts at the top in v1

`Today` includes a simple `Hide completed` / `Show completed` control:

- default is `Show completed`
- the setting persists
- if `Hide completed` is active, completing a task removes it from the visible list immediately

### Removal from Today

- `Remove from Today` is a separate action from completion
- removing a task from `Today` does not delete it
- removing a task from `Today` does not reset completion
- in the product model, this is exposed via swipe on `Today`
- in the HTML prototype, this can be represented with a visible row action

Completed tasks are not meant to be manually "tidied away" by changing state. If the list feels cluttered, `Hide completed` is the supported v1 mechanism.

## Backlog View

### Purpose

`Backlog` has two equal jobs:

- choose tasks for today
- organise and edit the task library

### Structure

The top of the screen includes:

- always-visible search field
- prominent `Current / Archived` segmented control
- compact filter bar for sort, category, and clear

### Search and Filters

Search matches:

- title
- description

Search does not match category text.

Category behavior:

- one category filter at a time
- default is no category filter

Status behavior:

- `Current` and `Archived` are the only status modes in v1
- switching status does not clear search or category filter

Clear behavior:

- clears search
- clears category filter
- does not change status
- does not reset sort

### Persistence

Backlog state persists across app relaunches.

Shared across `Current` and `Archived`:

- search
- category filter

Remembered separately per status:

- sort field
- sort direction

### Row Design

Backlog rows are denser than `Today`, but still restrained.

By default, each row may show:

- title
- first line of description, if present
- category hint, if present
- due date hint, if present
- recurrence hint, if present
- selected-for-today state

Due dates use soft labels where applicable:

- `Today`
- `Tomorrow`
- `Before today`
- otherwise a normal date

Tasks selected for `Today` stay in their normal backlog position and simply show a selected state.

Tasks completed today remain in the normal `Current` list:

- with completed styling
- sorted below incomplete tasks

### Row Interactions

- tap row opens the task sheet
- trailing toggle adds/removes the task from `Today`
- no swipe actions in `Backlog` for v1
- completion is not a row-level backlog action

### Sorting

Available sort options in `Current`:

- created date-time
- edited date-time
- alphabetical
- due date

Available sort options in `Archived`:

- completed date-time
- created date-time
- edited date-time
- alphabetical
- due date

Sort direction supports ascending and descending.

Defaults:

- `Current`: created date-time, newest first
- `Archived`: completed date-time, newest first

When sorting by due date, tasks with no due date go at the bottom.

## Task Sheet

### Purpose

One shared create/edit/details surface is used across the app.

- almost full-screen sheet/modal
- same presentation pattern for create and edit
- opens immediately editable in v1

It can be opened from:

- floating `+` on `Today`
- floating `+` on `Backlog`
- tapping a task row in `Today`
- tapping a task row in `Backlog`

### Form Fields

All of these are part of the main form in v1:

- title
- description
- selected for today
- category
- due date
- recurrence

Description behavior:

- multiline plain text
- preserve line breaks
- auto-detect links

Category behavior:

- chooser based on existing categories
- ability to create a new category from the same control
- no separate category management UI

### Defaults

Creating from `Today`:

- `selected for today = true` by default

Creating from `Backlog`:

- `selected for today = false` by default
- if backlog is filtered to a specific category, that category is preselected

### Save and Dismissal

- explicit `Save`
- explicit `Close/Cancel`
- unsaved changes trigger a prompt:
  - `Discard`
  - `Keep editing`

### Completion and Restore

The sheet includes explicit:

- `Mark complete`
- `Mark not complete`

For archived tasks:

- they remain editable
- `Restore` is effectively `mark not complete`
- restore returns the task to `Current`

### Delete

- hard delete only
- available only in the task sheet for an existing task
- requires confirmation

## Recurring Task Behavior

Recurring tasks are not special list objects. They remain normal backlog tasks.

Behavior:

- they always remain in `Current`
- they can be selected for `Today` like any other task
- marking them complete changes same-day completion state only
- if still complete at rollover, due date advances by the recurrence interval and completion resets

This means recurrence acts as a rolling next-date rule without turning the task into an auto-scheduled obligation.

## Prototype Notes

The HTML prototype should follow the product model above, while making pragmatic adjustments where browser interactions differ from iPhone-native behavior.

Acceptable prototype approximations include:

- visible remove action instead of true swipe on `Today`
- web drag/drop or drag handle behavior instead of perfect press-and-hold reordering
- iPhone-style layout and sheet behavior presented inside a normal browser page

## Out of Scope for Later Versions

- configurable rollover time
- curated quotes on empty `Today`
- bulk add/remove for filtered backlog results
- subtasks and parent/child tasks
- separate category management
- more advanced rich text editing
