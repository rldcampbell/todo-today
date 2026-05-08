import type { SQLiteDatabase } from "expo-sqlite"
import { loadAppStateValue, upsertAppStateValue } from "@/db/app-state"
import {
  clearStaleTodaySelection,
  clearTaskTodaySelection,
  completeTaskForRolloverReview,
  getNextTodayOrderForDay,
  loadPendingRolloverReview,
  loadRecurringRolloverTasks,
  loadRolloverReviewTaskStates,
  selectTaskForDayWithOrder,
  updateRecurringTaskAfterRollover,
} from "@/db/tasks"
import { getRecurringTaskRolloverPatch } from "@/features/tasks/getRecurringTaskRolloverPatch"
import {
  buildRolloverReviewTaskActions,
  getRolloverReviewCompletionIso,
  type PendingRolloverReview,
  type RolloverReviewDecisions,
} from "@/features/tasks/rolloverReview"
import { getLocalDayKey } from "@/utils/dates"
const LAST_ROLLOVER_DAY_KEY = "last_rollover_day"
export type DayRolloverResult =
  | { status: "current" }
  | { status: "completed" }
  | { status: "pendingReview"; review: PendingRolloverReview }
const getLastRolloverDay = async (db: SQLiteDatabase) => {
  return loadAppStateValue(db, LAST_ROLLOVER_DAY_KEY)
}
const setLastRolloverDay = async (db: SQLiteDatabase, dayKey: string) => {
  await upsertAppStateValue(db, LAST_ROLLOVER_DAY_KEY, dayKey)
}
const rolloverRecurringCompletedTasks = async (
  db: SQLiteDatabase,
  currentDayKey: string,
  nowIso: string,
) => {
  const tasks = await loadRecurringRolloverTasks(db)

  for (const task of tasks) {
    const patch = getRecurringTaskRolloverPatch(
      {
        dueDate: task.dueDate,
        recurrence: task.recurrence,
        completedAt: task.completedAt,
      },
      currentDayKey,
      nowIso,
    )
    if (!patch) {
      continue
    }

    await updateRecurringTaskAfterRollover(db, {
      dueDate: patch.dueDate,
      taskId: task.id,
      updatedAt: patch.updatedAt,
    })
  }
}
export const runDayRollover = async (
  db: SQLiteDatabase,
  now = new Date(),
): Promise<DayRolloverResult> => {
  const currentDayKey = getLocalDayKey(now)
  const lastRolloverDay = await getLastRolloverDay(db)
  if (lastRolloverDay === currentDayKey) {
    return { status: "current" }
  }

  const pendingReview = await loadPendingRolloverReview(db, currentDayKey)
  if (pendingReview) {
    return {
      status: "pendingReview",
      review: pendingReview,
    }
  }

  const nowIso = now.toISOString()
  await db.withExclusiveTransactionAsync(async (transaction) => {
    await clearStaleTodaySelection(transaction, currentDayKey)
    await rolloverRecurringCompletedTasks(transaction, currentDayKey, nowIso)
    await setLastRolloverDay(transaction, currentDayKey)
  })

  return { status: "completed" }
}
export const completePendingRolloverReview = async (
  db: SQLiteDatabase,
  {
    currentDayKey,
    decisions,
    reviewDayKey,
  }: {
    currentDayKey: string
    decisions: RolloverReviewDecisions
    reviewDayKey: string
  },
  now = new Date(),
) => {
  const nowIso = now.toISOString()
  const completedAt = getRolloverReviewCompletionIso(reviewDayKey)

  await db.withExclusiveTransactionAsync(async (transaction) => {
    const taskStates = await loadRolloverReviewTaskStates(
      transaction,
      reviewDayKey,
    )
    const nextTodayOrder = await getNextTodayOrderForDay(
      transaction,
      currentDayKey,
    )
    const actions = buildRolloverReviewTaskActions({
      completedAt,
      currentDayKey,
      decisions,
      startingTodayOrder: nextTodayOrder,
      taskStates,
      updatedAt: nowIso,
    })

    for (const action of actions) {
      if (action.type === "clearSelection") {
        await clearTaskTodaySelection(transaction, action.taskId)
      } else if (action.type === "complete") {
        await completeTaskForRolloverReview(transaction, action)
      } else {
        await selectTaskForDayWithOrder(transaction, action)
      }
    }

    await clearStaleTodaySelection(transaction, currentDayKey)
    await rolloverRecurringCompletedTasks(transaction, currentDayKey, nowIso)
    await setLastRolloverDay(transaction, currentDayKey)
  })
}
