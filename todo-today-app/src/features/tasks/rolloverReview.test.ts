import {
  buildRolloverReviewTaskActions,
  getIncompleteRolloverReviewTasks,
  getRolloverReviewCompletionIso,
  type PendingRolloverReview,
} from "@/features/tasks/rolloverReview"
import { getLocalDayKey } from "@/utils/dates"
import type { Task } from "@/features/tasks/task-types"

const buildTask = (values: Partial<Task>): Task => ({
  id: "task",
  title: "Task",
  description: null,
  category: null,
  dueDate: null,
  recurrence: null,
  recurrenceEnabled: false,
  createdAt: "2026-05-07T09:00:00.000Z",
  updatedAt: "2026-05-07T09:00:00.000Z",
  completedAt: null,
  selectedForDay: "2026-05-07",
  todayOrder: 0,
  ...values,
})

describe("rolloverReview", () => {
  it("filters the tasks that still need a rollover decision", () => {
    const review: PendingRolloverReview = {
      dayKey: "2026-05-07",
      tasks: [
        buildTask({ id: "a" }),
        buildTask({
          id: "b",
          completedAt: "2026-05-07T10:00:00.000Z",
        }),
      ],
    }

    expect(
      getIncompleteRolloverReviewTasks(review).map((task) => task.id),
    ).toEqual(["a"])
  })

  it("marks retrospective completions at the end of the review day", () => {
    const completedAt = new Date(getRolloverReviewCompletionIso("2026-05-07"))

    expect(getLocalDayKey(completedAt)).toBe("2026-05-07")
    expect(completedAt.getHours()).toBe(23)
    expect(completedAt.getMinutes()).toBe(59)
    expect(completedAt.getSeconds()).toBe(59)
  })

  it("builds review actions with backlog as the default decision", () => {
    expect(
      buildRolloverReviewTaskActions({
        completedAt: "2026-05-07T22:59:59.000Z",
        currentDayKey: "2026-05-08",
        decisions: {},
        startingTodayOrder: 2,
        taskStates: [
          {
            id: "a",
            completedAt: null,
          },
          {
            id: "b",
            completedAt: "2026-05-07T10:00:00.000Z",
          },
        ],
        updatedAt: "2026-05-08T09:00:00.000Z",
      }),
    ).toEqual([
      {
        taskId: "a",
        type: "clearSelection",
      },
      {
        taskId: "b",
        type: "clearSelection",
      },
    ])
  })

  it("builds review actions for completed and carried-over tasks", () => {
    expect(
      buildRolloverReviewTaskActions({
        completedAt: "2026-05-07T22:59:59.000Z",
        currentDayKey: "2026-05-08",
        decisions: {
          a: "today",
          b: "done",
          c: "today",
        },
        startingTodayOrder: 3,
        taskStates: [
          {
            id: "a",
            completedAt: null,
          },
          {
            id: "b",
            completedAt: null,
          },
          {
            id: "c",
            completedAt: null,
          },
        ],
        updatedAt: "2026-05-08T09:00:00.000Z",
      }),
    ).toEqual([
      {
        dayKey: "2026-05-08",
        taskId: "a",
        todayOrder: 3,
        type: "selectForToday",
        updatedAt: "2026-05-08T09:00:00.000Z",
      },
      {
        completedAt: "2026-05-07T22:59:59.000Z",
        taskId: "b",
        type: "complete",
        updatedAt: "2026-05-08T09:00:00.000Z",
      },
      {
        dayKey: "2026-05-08",
        taskId: "c",
        todayOrder: 4,
        type: "selectForToday",
        updatedAt: "2026-05-08T09:00:00.000Z",
      },
    ])
  })
})
