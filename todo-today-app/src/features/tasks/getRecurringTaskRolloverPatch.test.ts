import { getRecurringTaskRolloverPatch } from "@/features/tasks/getRecurringTaskRolloverPatch"
describe("getRecurringTaskRolloverPatch", () => {
  it("advances due date and clears completion for a recurring task completed before today", () => {
    const patch = getRecurringTaskRolloverPatch(
      {
        dueDate: "2026-04-20",
        recurrence: {
          interval: 1,
          unit: "week",
        },
        completedAt: "2026-04-20T10:00:00.000Z",
      },
      "2026-04-28",
      "2026-04-28T12:00:00.000Z",
    )
    expect(patch).toEqual({
      dueDate: "2026-04-27",
      completedAt: null,
      selectedForDay: null,
      todayOrder: null,
      updatedAt: "2026-04-28T12:00:00.000Z",
    })
  })
  it("does nothing for a recurring task completed today", () => {
    const patch = getRecurringTaskRolloverPatch(
      {
        dueDate: "2026-04-28",
        recurrence: {
          interval: 1,
          unit: "month",
        },
        completedAt: "2026-04-28T10:00:00.000Z",
      },
      "2026-04-28",
      "2026-04-28T12:00:00.000Z",
    )
    expect(patch).toBeNull()
  })
})
