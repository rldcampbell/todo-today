import { copy } from "@/copy"
import { normalizeTaskTitle } from "@/features/tasks/normalizeTaskTitle"
import type { TaskDraft } from "@/features/tasks/task-types"
import { parseDayKey } from "@/utils/dates"

export const validateTaskDraft = (draft: TaskDraft) => {
  if (normalizeTaskTitle(draft.title).length === 0) {
    return copy("task.validation.titleRequired")
  }

  const normalizedDueDate = draft.dueDate.trim()

  if (normalizedDueDate.length > 0 && !parseDayKey(normalizedDueDate)) {
    return copy("task.validation.invalidDueDate")
  }

  if (draft.recurrenceEnabled && normalizedDueDate.length === 0) {
    return copy("task.validation.recurrenceNeedsDueDate")
  }

  return null
}
