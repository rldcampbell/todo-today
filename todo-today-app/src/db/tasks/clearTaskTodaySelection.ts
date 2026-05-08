import type { SQLiteDatabase } from "expo-sqlite"

export const clearTaskTodaySelection = async (
  db: SQLiteDatabase,
  taskId: string,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        selected_for_day = NULL,
        today_order = NULL
      WHERE id = ?
    `,
    taskId,
  )
}
