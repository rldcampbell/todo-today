import type { SQLiteDatabase } from "expo-sqlite"

type UpdateRecurringTaskAfterRolloverParams = {
  dueDate: string | null
  taskId: string
  updatedAt: string
}

export const updateRecurringTaskAfterRollover = async (
  db: SQLiteDatabase,
  { dueDate, taskId, updatedAt }: UpdateRecurringTaskAfterRolloverParams,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        due_date = ?,
        updated_at = ?,
        completed_at = NULL,
        selected_for_day = NULL,
        today_order = NULL
      WHERE id = ?
    `,
    dueDate,
    updatedAt,
    taskId,
  )
}
