import { validateTaskDraft } from "@/features/tasks/validateTaskDraft"
import type { TaskDraft } from "@/features/tasks/task-types"

const createDraft = (overrides: Partial<TaskDraft> = {}): TaskDraft => {
  return {
    title: "Task",
    description: "",
    category: "",
    dueDate: "",
    recurrenceEnabled: false,
    recurrenceInterval: 1,
    recurrenceUnit: "week",
    selectedForToday: false,
    completed: false,
    ...overrides,
  }
}

describe("validateTaskDraft", () => {
  it("requires a title", () => {
    expect(validateTaskDraft(createDraft({ title: "   " }))).toBe(
      "Title is required.",
    )
  })

  it("rejects invalid due dates", () => {
    expect(validateTaskDraft(createDraft({ dueDate: "2026-02-30" }))).toBe(
      "Due date must be a valid date.",
    )
  })

  it("requires a due date for recurrence", () => {
    expect(
      validateTaskDraft(createDraft({ recurrenceEnabled: true, dueDate: "" })),
    ).toBe("Recurring items need a due date.")
  })

  it("accepts a valid day key due date", () => {
    expect(validateTaskDraft(createDraft({ dueDate: "2026-04-28" }))).toBeNull()
  })
})
