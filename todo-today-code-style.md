# To-day Code Style and Structure Spec

## 1. Purpose

This document defines the code style and module-structure philosophy for the To-day codebase.

It is intended to keep the code:

- readable
- testable
- explicit
- low-surprise
- easy to refactor without broad coupling

This spec applies most directly to the Expo / React Native app, but the general philosophy should be used across the repo.

## 2. Core Philosophy

### 2.1 Optimize for Clarity

Write code that a human can follow without reverse-engineering hidden conventions.

Prefer:

- descriptive names
- explicit imports and exports
- small units with clear responsibility
- direct control flow

Avoid:

- clever compression
- broad “god” modules
- unnecessary abstraction
- packing unrelated helpers together

### 2.2 Unit-Testable Pieces by Default

Hooks, selectors, domain helpers, and transformation logic should be split into pieces that can be tested in isolation.

If logic can be extracted cleanly from UI code, it generally should be.

For hooks specifically:

- the hook should primarily gather dependencies and expose the public API
- non-trivial derivation inside the hook should usually be extracted into pure helper functions
- those helpers should be the primary unit-test target

This is one of the main reasons to split logic out of hooks in the first place.

### 2.3 Functional at the Boundary, Imperative Inside

Public helpers and hooks should behave like functional black boxes:

- inputs in
- outputs out
- no mutation of input arguments
- no hidden external side effects unless that is the point of the function

Inside a function, clear imperative code is preferred over strained functional purity.

Allowed:

- local mutation of local variables
- stepwise transformation inside a function
- early returns
- explicit branching

Not allowed:

- mutating input objects, arrays, or parameters
- hidden cross-module state changes

### 2.4 Explicit Types

Type usage should be intentional and visible.

Prefer:

- `import type`
- `export type`
- named interfaces and type aliases at module boundaries

Avoid:

- mixed type/value imports when a separate type import is clearer
- implicit type re-exports

## 3. Module Structure

### 3.1 One Helper Per File by Default

For standalone helpers, prefer one file per helper function.

Good:

- `utils/ids/createId.ts`
- `features/tasks/task-selectors/countIncompleteTasks.ts`

Only group multiple helpers in one file when splitting them would be obvious overkill.

### 3.2 Folder-First for Non-Trivial Hooks or Feature Modules

If a hook or function is more than trivial, give it a folder and expose the public API through `index.ts`.

Preferred pattern:

```text
useToday/
  useToday.ts
  index.ts
```

If the hook/module grows:

```text
useToday/
  useToday.ts
  mapTodayTasks.ts
  index.ts
```

This keeps public entry points stable while internals evolve.

### 3.3 Barrel Exports Are for Public API Only

Use `index.ts` to export the intended public surface of a folder.

Do not use barrels to re-export large unrelated trees.

Barrels should be:

- local
- deliberate
- small

### 3.4 Keep Route Files Thin

Expo Router route files should do as little as possible:

- read params
- select the correct screen/component
- return the screen

Business logic does not belong in route files.

### 3.5 Tests Live Next to the Code They Cover

Test files should sit alongside the module they test.

Preferred pattern:

```text
buildTodayState.ts
buildTodayState.test.ts
```

Use the same base filename with `.test.ts` or `.test.tsx` appended.

Do not create separate test-only folders for ordinary unit tests unless there is a very unusual reason.

## 4. Hooks

### 4.1 Hook Responsibilities

Hooks should:

- expose data plus actions
- hide persistence/query details from screens
- keep screens mostly declarative

Hooks should not become a dumping ground for unrelated feature logic.

### 4.2 Hook Layout

For non-trivial hooks:

- folder
- main hook file
- helper files as needed
- `index.ts` barrel

The preferred pattern is:

- hook file gathers dependencies
- extracted helper files contain testable derivation logic
- tests target the extracted helpers first

### 4.3 Hook Return Shapes

Hook return values should be explicit objects with named fields, not positional tuples, unless tuple semantics are genuinely standard and clearer.

## 5. Functions and Control Flow

### 5.1 Prefer Named Functions Over Inline Complexity

If inline logic becomes hard to scan, extract it.

Especially extract:

- data normalization
- selectors
- derived state mapping
- validation logic
- date rules

### 5.2 Prefer Function Expressions at Declaration Boundaries

Default to function expressions assigned to `const`:

```ts
const myFunc = () => {}
```

Prefer that over function declarations:

```ts
function myFunc() {}
```

This applies to:

- exported helpers
- hooks
- components
- local helper functions inside modules
- test helpers

Reason:

- the declaration style stays uniform across hooks, helpers, and components
- assignment boundaries are explicit
- lint can enforce it consistently

Function declarations should be treated as exceptions, not the default.

### 5.3 Imperative Is Fine Inside the Function

Within a function body, prefer the clearest implementation.

Examples of acceptable style:

- `let` variables for staged computation
- loops
- branching
- normalization in several steps

Do not contort logic into chained array methods or nested expressions if that makes it harder to read.

### 5.4 Guard Clauses Preferred

Prefer early returns and clear guard clauses over deep nesting.

## 6. Types

### 6.1 Shared Types Live Near the Feature

Feature types belong with the feature.

Examples:

- task types in `features/tasks`
- backlog types in `features/backlog`

Do not create a single global type dump.

### 6.2 Type Imports and Exports

Always use explicit type imports and exports where applicable:

```ts
import type { Task } from "@/features/tasks/task-types"
export type { TaskDraft }
```

### 6.3 Runtime and Type APIs Should Be Distinguishable

If a module exports both runtime values and types, the distinction should stay obvious at import sites.

## 7. App Copy

### 7.1 User-Facing Copy Lives in `src/copy`

Reusable user-facing app copy should live in `todo-today-app/src/copy/en.json`.

Use a flat JSON object with dot-notation keys:

```json
{
  "backlog.empty.current.title": "No items yet",
  "taskSheet.fields.title.placeholder": "Item title",
  "today.completedVisibility.show": "Show completed"
}
```

Use `copy("...")` from `@/copy` at call sites.

Copy keys should be:

- grouped by app area or domain concept
- named for their purpose rather than their current wording
- stable enough that changing text does not require changing call sites

Prefer:

- `backlog.empty.current.title`
- `taskSheet.delete.confirmBody`
- `today.swipeActions.removeAccessibilityLabel`

Avoid:

- keys named after the literal text, such as `noItemsYet`
- deeply nested JSON for copy keys
- hard-coded repeated UI copy in components or helpers

The copy helper derives its key type directly from `keyof typeof en`, so keeping the JSON flat preserves simple autocomplete and typechecking without recursive key types.

## 8. Components

### 8.1 Components Should Stay Lean

Components should mostly:

- compose UI
- call hooks
- wire events
- render view state

Non-visual logic should be extracted when it starts to distract from rendering.

### 8.2 Reuse Repeated UI Structure

If a repeated UI pattern appears more than once and has meaning, extract it.

Do not extract tiny one-off wrappers with no real semantic value.

### 8.3 Named Exports for Components

Prefer named exports for components.

Exception:

- Expo Router route entry files must continue to use default exports where the framework expects them

## 9. File Naming

### 9.1 Keep Names Literal

File names should describe what they contain.

Prefer:

- `createEmptyTaskDraft.ts`
- `countIncompleteTasks.ts`
- `TaskSheetScreen.tsx`

Avoid vague containers like:

- `helpers.ts`
- `misc.ts`
- `utils.ts`
- `service.ts`

unless the file truly represents a cohesive service boundary.

## 10. Testing Implications

The structure should make tests easy to add later.

That means:

- pure helpers separated from components
- selectors separated from screens
- date logic centralized
- normalization logic centralized

This spec does not mandate immediate test files for every helper, but code should be arranged so that adding them is straightforward.

When adding tests incrementally:

- start with pure helpers and hook-internal derivation helpers
- place those tests next to the module they exercise using the same base filename
- add component tests when the UI behavior is real enough to justify them
- do not wait for the whole feature to exist before testing stable pure logic

## 11. Linting and Enforcement

Where possible, lint rules should enforce:

- function expressions assigned to `const` as the default declaration style
- explicit type imports
- explicit type exports
- no mutation of input parameters
- unused variable detection
- basic consistency rules that support readability

Lint should not force stylistic cleverness.

Prettier owns mechanical formatting. Current project formatting preferences are:

- double quotes
- no semicolons where possible
- trailing commas where Prettier applies them

Declaration-style enforcement should come from ESLint rather than a formatter.

Use lint to enforce clarity, not novelty.

## 12. Practical Rule of Thumb

When deciding whether to split a file or extract a helper, ask:

1. Is this logic independently understandable?
2. Could it be unit tested on its own?
3. Would extracting it make the caller easier to read?
4. Is the resulting module name more precise than the current one?

If the answer is mostly yes, split it out.

## 13. Current Project Preference Summary

For this project specifically:

- prefer small named helpers
- prefer hook folders with `index.ts` for non-trivial hooks
- prefer one helper function per file unless that is obvious overkill
- prefer explicit type imports and exports
- prefer functional boundaries with imperative internals
- do not mutate input values
- keep reusable user-facing copy in `src/copy/en.json` with flat dot-notation keys
- keep route files thin
- keep screen components readable first
