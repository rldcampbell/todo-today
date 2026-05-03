import type { Task } from "@/features/tasks/task-types"
import type { RecurrenceUnit } from "@/features/tasks/task-types"
export type TaskRow = {
  id: string
  title: string
  description: string | null
  category: string | null
  due_date: string | null
  recurrence_interval: number | null
  recurrence_unit: RecurrenceUnit | null
  recurrence_enabled: number
  created_at: string
  updated_at: string
  completed_at: string | null
  selected_for_day: string | null
  today_order: number | null
}
export const mapTaskRow = (row: TaskRow): Task => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    dueDate: row.due_date,
    recurrence:
      row.recurrence_interval && row.recurrence_unit
        ? {
            interval: row.recurrence_interval,
            unit: row.recurrence_unit,
          }
        : null,
    recurrenceEnabled: row.recurrence_enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    selectedForDay: row.selected_for_day,
    todayOrder: row.today_order,
  }
}
