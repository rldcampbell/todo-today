import { getNextRecurringDueDate } from "@/features/tasks/recurrence"
import { getLocalDayKey } from "@/utils/dates"
import type { RecurrenceRule } from "@/features/tasks/task-types"
export interface RecurringTaskRolloverCandidate {
  dueDate: string | null
  recurrence: RecurrenceRule
  completedAt: string
}
export interface RecurringTaskRolloverPatch {
  dueDate: string | null
  completedAt: null
  selectedForDay: null
  todayOrder: null
  updatedAt: string
}
export const getRecurringTaskRolloverPatch = (
  task: RecurringTaskRolloverCandidate,
  dayKey: string,
  nowIso: string,
): RecurringTaskRolloverPatch | null => {
  const completedDayKey = getLocalDayKey(new Date(task.completedAt))
  if (completedDayKey >= dayKey) {
    return null
  }
  return {
    dueDate: getNextRecurringDueDate(task.dueDate, task.recurrence),
    completedAt: null,
    selectedForDay: null,
    todayOrder: null,
    updatedAt: nowIso,
  }
}
