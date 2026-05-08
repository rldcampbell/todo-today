import type { SQLiteDatabase } from "expo-sqlite"

type SelectTaskForDayWithOrderParams = {
  dayKey: string
  taskId: string
  todayOrder: number
  updatedAt: string
}

export const selectTaskForDayWithOrder = async (
  db: SQLiteDatabase,
  { dayKey, taskId, todayOrder, updatedAt }: SelectTaskForDayWithOrderParams,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        updated_at = ?,
        selected_for_day = ?,
        today_order = ?
      WHERE id = ?
        AND completed_at IS NULL
    `,
    updatedAt,
    dayKey,
    todayOrder,
    taskId,
  )
}
