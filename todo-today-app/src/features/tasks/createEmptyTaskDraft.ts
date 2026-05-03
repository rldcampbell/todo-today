import type { TaskDraft } from "@/features/tasks/task-types"
export type TaskCreateSource = "today" | "backlog"

type CreateEmptyTaskDraftOptions = {
  source: TaskCreateSource
  category?: string | null
}

export const createEmptyTaskDraft = ({
  source,
  category = null,
}: CreateEmptyTaskDraftOptions): TaskDraft => {
  return {
    title: "",
    description: "",
    category: category ?? "",
    dueDate: "",
    recurrenceEnabled: false,
    recurrenceInterval: 1,
    recurrenceUnit: "week",
    selectedForToday: source === "today",
    completed: false,
  }
}
