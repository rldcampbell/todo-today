import { buildBacklogTaskSortValue } from "@/features/backlog/buildBacklogTaskSortValue"
import type { Task } from "@/features/tasks/task-types"

const createTask = (overrides: Partial<Task> = {}): Task => {
  return {
    id: "task-1",
    title: "Task",
    description: null,
    category: null,
    dueDate: null,
    recurrence: null,
    recurrenceEnabled: false,
    createdAt: "2026-04-28T09:00:00.000Z",
    updatedAt: "2026-04-29T09:00:00.000Z",
    completedAt: "2026-04-30T09:00:00.000Z",
    selectedForDay: null,
    todayOrder: null,
    ...overrides,
  }
}

describe("buildBacklogTaskSortValue", () => {
  it("returns no extra value when sorting alphabetically", () => {
    expect(buildBacklogTaskSortValue(createTask(), "alphabetical")).toBeNull()
  })

  it("formats created, updated, and completed sort values", () => {
    const task = createTask()

    expect(buildBacklogTaskSortValue(task, "createdAt")).toEqual({
      label: "Created",
      value: "28 Apr",
    })
    expect(buildBacklogTaskSortValue(task, "updatedAt")).toEqual({
      label: "Edited",
      value: "29 Apr",
    })
    expect(buildBacklogTaskSortValue(task, "completedAt")).toEqual({
      label: "Completed",
      value: "30 Apr",
    })
  })

  it("labels tasks without due dates when sorting by due date", () => {
    expect(buildBacklogTaskSortValue(createTask(), "dueDate")).toEqual({
      label: "Due",
      value: "No date",
    })
  })
})
