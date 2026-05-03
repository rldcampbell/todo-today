import type { Task } from "@/features/tasks/task-types"

export const hasActiveRecurrence = (task: Task) => {
  return Boolean(task.recurrenceEnabled && task.recurrence)
}
