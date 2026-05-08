import type { Task } from "@/features/tasks/task-types"
import { parseDayKey } from "@/utils/dates"

export type RolloverReviewDecision = "backlog" | "today" | "done"

export type RolloverReviewDecisions = Record<string, RolloverReviewDecision>

export type PendingRolloverReview = {
  dayKey: string
  tasks: Task[]
}

export type RolloverReviewTaskState = {
  completedAt: string | null
  id: string
}

export type RolloverReviewTaskAction =
  | {
      taskId: string
      type: "clearSelection"
    }
  | {
      completedAt: string
      taskId: string
      type: "complete"
      updatedAt: string
    }
  | {
      dayKey: string
      taskId: string
      todayOrder: number
      type: "selectForToday"
      updatedAt: string
    }

export const getIncompleteRolloverReviewTasks = (
  review: PendingRolloverReview,
) => {
  return review.tasks.filter((task) => !task.completedAt)
}

export const getRolloverReviewCompletionIso = (dayKey: string) => {
  const day = parseDayKey(dayKey)

  if (!day) {
    throw new Error(`Invalid rollover review day: ${dayKey}`)
  }

  const nextDay = new Date(day)
  nextDay.setDate(nextDay.getDate() + 1)
  nextDay.setMilliseconds(nextDay.getMilliseconds() - 1000)

  return nextDay.toISOString()
}

export const buildRolloverReviewTaskActions = ({
  completedAt,
  currentDayKey,
  decisions,
  startingTodayOrder,
  taskStates,
  updatedAt,
}: {
  completedAt: string
  currentDayKey: string
  decisions: RolloverReviewDecisions
  startingTodayOrder: number
  taskStates: RolloverReviewTaskState[]
  updatedAt: string
}): RolloverReviewTaskAction[] => {
  const actions: RolloverReviewTaskAction[] = []
  let nextTodayOrder = startingTodayOrder

  for (const taskState of taskStates) {
    if (taskState.completedAt) {
      actions.push({
        taskId: taskState.id,
        type: "clearSelection",
      })
      continue
    }

    const decision = decisions[taskState.id] ?? "backlog"

    if (decision === "done") {
      actions.push({
        completedAt,
        taskId: taskState.id,
        type: "complete",
        updatedAt,
      })
      continue
    }

    if (decision === "today") {
      actions.push({
        dayKey: currentDayKey,
        taskId: taskState.id,
        todayOrder: nextTodayOrder,
        type: "selectForToday",
        updatedAt,
      })
      nextTodayOrder += 1
      continue
    }

    actions.push({
      taskId: taskState.id,
      type: "clearSelection",
    })
  }

  return actions
}
