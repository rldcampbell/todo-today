import type { SQLiteDatabase } from "expo-sqlite"
import type { TaskRecordValues } from "@/db/tasks/types"
export const createTask = async (
  db: SQLiteDatabase,
  values: TaskRecordValues,
) => {
  await db.runAsync(
    `
      INSERT INTO tasks (
        id,
        title,
        description,
        category,
        due_date,
        recurrence_interval,
        recurrence_unit,
        recurrence_enabled,
        created_at,
        updated_at,
        completed_at,
        selected_for_day,
        today_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    values.id,
    values.title,
    values.description,
    values.category,
    values.dueDate,
    values.recurrenceInterval,
    values.recurrenceUnit,
    values.recurrenceEnabled ? 1 : 0,
    values.createdAt,
    values.updatedAt,
    values.completedAt,
    values.selectedForDay,
    values.todayOrder,
  )
}
