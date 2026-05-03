import { selectTaskCategories } from "@/features/tasks/task-selectors/selectTaskCategories"
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
    updatedAt: "2026-04-28T09:00:00.000Z",
    completedAt: null,
    selectedForDay: null,
    todayOrder: null,
    ...overrides,
  }
}

describe("selectTaskCategories", () => {
  it("returns unique sorted category values", () => {
    const categories = selectTaskCategories([
      createTask({ category: "Home" }),
      createTask({ category: "Admin" }),
      createTask({ category: "Home" }),
      createTask({ category: null }),
    ])

    expect(categories).toEqual(["Admin", "Home"])
  })
})
