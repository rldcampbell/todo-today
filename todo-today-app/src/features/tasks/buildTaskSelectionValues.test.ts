import { buildTaskSelectionValues } from "@/features/tasks/buildTaskSelectionValues"
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

describe("buildTaskSelectionValues", () => {
  it("assigns the next today order when selecting a new task for today", () => {
    const values = buildTaskSelectionValues({
      task: createTask({
        id: "new-task",
      }),
      selectedForToday: true,
      tasks: [
        createTask({
          id: "a",
          selectedForDay: "2026-04-28",
          todayOrder: 0,
        }),
        createTask({
          id: "b",
          selectedForDay: "2026-04-28",
          todayOrder: 1,
        }),
      ],
      dayKey: "2026-04-28",
      nowIso: "2026-04-28T12:00:00.000Z",
    })

    expect(values.selectedForDay).toBe("2026-04-28")
    expect(values.todayOrder).toBe(2)
  })

  it("preserves the existing today order when the task is already selected", () => {
    const task = createTask({
      selectedForDay: "2026-04-28",
      todayOrder: 4,
    })

    const values = buildTaskSelectionValues({
      task,
      selectedForToday: true,
      tasks: [task],
      dayKey: "2026-04-28",
      nowIso: "2026-04-28T12:00:00.000Z",
    })

    expect(values.selectedForDay).toBe("2026-04-28")
    expect(values.todayOrder).toBe(4)
  })

  it("clears today selection when deselecting a task", () => {
    const values = buildTaskSelectionValues({
      task: createTask({
        selectedForDay: "2026-04-28",
        todayOrder: 1,
      }),
      selectedForToday: false,
      tasks: [],
      dayKey: "2026-04-28",
      nowIso: "2026-04-28T12:00:00.000Z",
    })

    expect(values.selectedForDay).toBeNull()
    expect(values.todayOrder).toBeNull()
  })

  it("does not allow an archived task to be selected for today", () => {
    const values = buildTaskSelectionValues({
      task: createTask({
        completedAt: "2026-04-20T10:00:00.000Z",
      }),
      selectedForToday: true,
      tasks: [],
      dayKey: "2026-04-28",
      nowIso: "2026-04-28T12:00:00.000Z",
    })

    expect(values.selectedForDay).toBeNull()
    expect(values.todayOrder).toBeNull()
  })
})
