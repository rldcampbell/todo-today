import type { SQLiteDatabase } from "expo-sqlite"
import type { RecurrenceUnit } from "@/features/tasks/task-types"

type RecurringRolloverRow = {
  id: string
  due_date: string | null
  recurrence_interval: number
  recurrence_unit: RecurrenceUnit
  completed_at: string
}

export type RecurringRolloverTask = {
  completedAt: string
  dueDate: string | null
  id: string
  recurrence: {
    interval: number
    unit: RecurrenceUnit
  }
}

export const loadRecurringRolloverTasks = async (
  db: SQLiteDatabase,
): Promise<RecurringRolloverTask[]> => {
  const rows = await db.getAllAsync<RecurringRolloverRow>(`
    SELECT
      id,
      due_date,
      recurrence_interval,
      recurrence_unit,
      completed_at
    FROM tasks
    WHERE recurrence_enabled = 1
      AND recurrence_interval IS NOT NULL
      AND recurrence_unit IS NOT NULL
      AND completed_at IS NOT NULL
  `)

  return rows.map((row) => ({
    completedAt: row.completed_at,
    dueDate: row.due_date,
    id: row.id,
    recurrence: {
      interval: row.recurrence_interval,
      unit: row.recurrence_unit,
    },
  }))
}
