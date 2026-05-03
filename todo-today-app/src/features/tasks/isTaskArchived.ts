import { hasActiveRecurrence } from "@/features/tasks/hasActiveRecurrence"
import { getLocalDayKey } from "@/utils/dates"
import type { Task } from "@/features/tasks/task-types"
export const isTaskArchived = (task: Task, dayKey = getLocalDayKey()) => {
  if (!task.completedAt) {
    return false
  }
  if (hasActiveRecurrence(task)) {
    return false
  }
  const completedDayKey = getLocalDayKey(new Date(task.completedAt))
  return completedDayKey < dayKey
}
