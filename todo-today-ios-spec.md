# To-day iPhone App Product / UX Spec

## 1. Product Definition

To-day is a calm daily commitment app for iPhone.

The core model is:

- `Backlog` is memory.
- `Today` is an explicit daily selection state.
- Nothing becomes a commitment until the user chooses it for today.

This product is intentionally anti-pressure. It should support daily planning without guilt language, overdue punishment, forced carry-over, scores, or streaks.

## 2. Product Principles

### 2.1 Explicit Commitment

Tasks do not appear in `Today` automatically. The user must actively choose them.

### 2.2 Fresh Day

Each day begins clean. `Today` is cleared silently at day rollover.

### 2.3 Backlog as Memory

The backlog stores tasks, whether or not they are selected for today. Selecting a task for `Today` does not move it out of the backlog.

### 2.4 Due Dates as Signals

Due dates help with awareness and sorting, but they do not create obligation and do not force tasks into `Today`.

### 2.5 Calm Interface

The app should feel quiet, deliberate, and low-friction. The design should reduce pressure rather than amplify it.

## 3. Design Goals

- Keep `Today` visually quiet and low-pressure.
- Make daily selection easy without auto-scheduling.
- Let `Backlog` serve both as the task library and the selection surface.
- Preserve useful user context, such as filters and sort choices.
- Make the app feel native to iPhone interaction patterns.

## 4. Non-Goals for v1

- No automatic carry-over into `Today`
- No productivity scoring, streaks, or gamification
- No parent/child tasks or subtasks
- No separate category management area
- No bulk add/remove for filtered backlog results
- No configurable rollover time
- No curated quotes or text on the empty `Today` screen
- No time-of-day due times
- No rich text editor for descriptions

## 5. Primary Navigation

The app has two primary destinations in a bottom tab bar:

- `Today`
- `Backlog`

The `Today` tab shows a badge count for incomplete tasks currently selected for today.

## 6. Core Concepts

### 6.1 Backlog

The backlog is the single task store for all non-deleted tasks.

- Tasks remain in the backlog whether or not they are selected for today.
- A task may exist with only a title.
- The backlog is both a planning surface and an organizing surface.

### 6.2 Today

`Today` is not a separate task store. It is a daily ordered selection of backlog tasks.

- Selection is explicit.
- Selection is date-scoped.
- Order is manual.

### 6.3 Current and Archived

The backlog has two modes:

- `Current`
- `Archived`

`Current` contains tasks still relevant to the active day cycle:

- incomplete non-recurring tasks
- incomplete recurring tasks

`Archived` contains non-recurring tasks completed before today.

Archived tasks remain editable, but must be restored before they can be selected for `Today`.

## 7. Task Model

Each task includes:

- `title` required
- `title` max 120 characters in v1
- `description` optional, multiline plain text
- `category` optional, one value only in v1
- `due date` optional, date only
- `recurrence` optional
- `created at`
- `updated at`
- `completed at` optional

### 7.1 Description

- Plain text only in v1
- Line breaks are preserved
- Links should be detected and tappable

### 7.2 Category

- One category only in v1
- Categories are task-driven
- Users should be able to reuse an existing category or create a new one while editing a task

### 7.3 Recurrence

Recurrence is represented as:

- `Every X [days | weeks | months | years]`

Rules:

- recurrence requires a due date
- the due date acts as the first recurrence anchor
- the due date remains user-editable even when recurrence exists
- turning recurrence off keeps the current due date as a normal due date
- turning recurrence off should preserve the last interval/unit so toggling it back on restores the previous rule
- due dates should be chosen through a picker rather than free-text entry
- internally, due dates are stored as local `YYYY-MM-DD` values

## 8. Persistence Requirements

Data must persist across app relaunches.

The app should persist:

- tasks
- current `Today` selection for the active day
- `Today` completed-visibility preference

Persistence mechanism is an implementation decision and is out of scope for this spec.

## 9. Day Rollover

Day rollover is silent in v1.

When a new day begins and the app next becomes active:

1. `Today` selection is cleared.
2. Incomplete non-recurring tasks remain in `Current`.
3. Non-recurring tasks completed before today move to `Archived`.
4. Recurring tasks that are completed at rollover:
   - remain in `Current`
   - have their due date advanced by the recurrence interval
   - have their completion state reset

This means recurring completion does not advance the due date immediately on check. It advances only at rollover if the task is still complete.

## 10. Today Screen

### 10.1 Purpose

`Today` is the clean action list for the day.

### 10.2 Empty State

- No text in v1
- No large prompt or call-to-action
- The screen should still feel calm and intentional

### 10.3 Row Content

By default, each task row shows:

- task title
- first line of description, if present
- completion state

It does not show by default:

- category
- due date
- recurrence

### 10.4 Primary Interactions

- tapping a task opens its detail/edit sheet
- a leading control marks complete / not complete
- quick add is exposed as a floating `+`
- tasks added to `Today` appear at the bottom of the incomplete portion of the list
- ordering is manual
- completed tasks automatically sink below incomplete tasks
- press-and-hold drag reordering is supported within the incomplete group and within the completed group
- reordering should settle live while dragging rather than waiting for a separate release action
- drag start and row-position changes should use light haptic feedback where the platform supports it

### 10.5 Completed Task Behavior

- completed tasks remain in the same list for the rest of the day
- they change styling rather than moving into a separate section
- there is no `Completed` divider in v1
- there is no summary block at the top in v1

`Today` includes a simple `Hide completed` / `Show completed` control:

- default is `Show completed`
- the preference persists
- if `Hide completed` is active, completing a task removes it from the visible list immediately

### 10.6 Removal from Today

`Remove from Today` is a separate action from completion.

- removing from `Today` does not delete the task
- removing from `Today` does not reset completion
- removal is intended primarily for incomplete tasks
- in v1 on mobile, the action is revealed by swiping the row
- hard-swipe auto-commit is not part of v1

## 11. Backlog Screen

### 11.1 Purpose

`Backlog` has two equal jobs:

- choose tasks for today
- organize and edit the task library

### 11.2 Structure

The top of the screen includes:

- always-visible search
- prominent `Current / Archived` segmented control
- compact controls for sort, category, and clear
- no separate `Today` tally in the backlog header; the bottom-tab badge is enough

### 11.3 Search and Filters

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

### 11.4 State Retention

Backlog view state is retained while the app remains open, but resets on app relaunch or full reload.

Shared across `Current` and `Archived`:

- search
- category filter

Remembered separately per status:

- sort field
- sort direction

The default state on fresh launch is:

- `Current`
- no search
- no category filter
- `Current` sorted by created date, newest first
- `Archived` sorted by completed date, newest first

### 11.5 Row Content

Backlog rows are denser than `Today`, but still restrained.

They may show:

- title
- first line of description, if present
- category hint, if present
- due date hint, if present
- recurrence hint, if present
- selected-for-today state

Due dates use soft labels where helpful:

- `Today`
- `Tomorrow`
- `Yesterday`
- otherwise `D MMM YYYY`

Tasks selected for `Today` stay in their normal backlog position and simply show a selected state.

### 11.6 Row Interactions

- tapping a row opens the task detail/edit sheet
- a separate trailing control adds or removes the task from `Today`
- there are no swipe actions in `Backlog` for v1
- completion is not a row-level backlog action

## 12. Sorting

Available sort options in `Current`:

- created date
- edited date
- alphabetical
- due date

Available sort options in `Archived`:

- completed date
- created date
- edited date
- alphabetical
- due date

Sort direction supports ascending and descending.

Defaults:

- `Current`: created date, newest first
- `Archived`: completed date, newest first

When sorting by due date, tasks with no due date appear at the bottom.

## 13. Task Detail / Edit Sheet

### 13.1 Purpose

The app uses one shared create/edit/details surface.

- it is presented as a large sheet
- the same presentation pattern is used for create and edit
- it opens immediately editable in v1

It can be opened from:

- quick add on `Today`
- quick add on `Backlog`
- tapping a task row on `Today`
- tapping a task row on `Backlog`

### 13.2 Form Fields

All of these appear on the main form in v1:

- title
- description
- selected for today
- category
- due date
- recurrence

Form details:

- title length is capped at 120 characters
- description grows to a sensible max height, then scrolls internally
- due date is edited through a picker rather than free text
- recurrence appears as an inline sentence-style control: `Every [number] [unit]`

### 13.3 Defaults

Creating from `Today`:

- `selected for today = true` by default

Creating from `Backlog`:

- `selected for today = false` by default
- if `Backlog` is filtered to a specific category, that category is preselected

### 13.4 Save and Dismissal

- explicit `Save`
- explicit `Close/Cancel`
- unsaved changes trigger a prompt:
  - `Discard`
  - `Keep editing`

### 13.5 Completion and Restore

The sheet includes explicit:

- `Mark complete`
- `Mark not complete`

Archived tasks:

- remain editable
- can be restored
- return to `Current` when restored

### 13.6 Delete

- delete is a hard delete
- it is available only in the sheet for an existing task
- it requires confirmation

## 14. Recurring Task Behavior

Recurring tasks are not special list objects. They remain normal backlog tasks.

Behavior:

- they always remain in `Current`
- they can be selected for `Today` like any other task
- marking them complete changes same-day completion state only
- if still complete at rollover, the due date advances by the recurrence interval and completion resets

This keeps recurrence as a rolling next-date rule rather than an auto-scheduling system.

## 15. Visual Direction

The intended feel is a calm planner rather than a high-energy productivity tool.

The UI should feel:

- quiet
- warm
- deliberate
- native to iPhone usage patterns

The UI should avoid:

- alarm styling
- aggressive red overdue treatment
- dashboard-like density on `Today`
- motivational productivity framing

## 16. Interaction Principles

- `Today` should be faster to use than `Backlog`
- primary actions should be obvious at row level
- editing should be accessible without making lists noisy
- state changes should be reversible where reasonable
- destructive actions should be deliberate
- the interface should minimize surprise

## 17. Out of Scope for Later Versions

- configurable rollover time
- curated quotes on empty `Today`
- bulk add/remove for filtered backlog results
- subtasks and parent/child tasks
- separate category management
- advanced rich text editing
- alternative planning views beyond `Today` and `Backlog`
