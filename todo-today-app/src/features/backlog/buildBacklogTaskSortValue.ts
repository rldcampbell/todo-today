import { copy } from "@/copy"
import type { BacklogSortField } from "@/features/backlog/backlog-types"
import type { Task } from "@/features/tasks/task-types"
import { formatRelativeDueDate } from "@/utils/dates"

export type BacklogTaskSortValue = {
  label: string
  value: string
}

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
})

const formatTimestamp = (value: string | null) => {
  if (!value) {
    return copy("backlog.sort.emptyTimestamp")
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return shortDateFormatter.format(date)
}

export const buildBacklogTaskSortValue = (
  task: Task,
  sortField: BacklogSortField,
): BacklogTaskSortValue | null => {
  switch (sortField) {
    case "alphabetical":
      return null
    case "completedAt":
      return {
        label: copy("backlog.sort.fields.completedAt"),
        value: formatTimestamp(task.completedAt),
      }
    case "dueDate":
      return {
        label: copy("backlog.sort.fields.dueDate"),
        value:
          formatRelativeDueDate(task.dueDate) ??
          copy("backlog.sort.emptyDueDate"),
      }
    case "updatedAt":
      return {
        label: copy("backlog.sort.fields.updatedAt"),
        value: formatTimestamp(task.updatedAt),
      }
    case "createdAt":
    default:
      return {
        label: copy("backlog.sort.fields.createdAt"),
        value: formatTimestamp(task.createdAt),
      }
  }
}
