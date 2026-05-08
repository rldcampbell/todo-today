import type { SQLiteDatabase } from "expo-sqlite"

type CompleteTaskForRolloverReviewParams = {
  completedAt: string
  taskId: string
  updatedAt: string
}

export const completeTaskForRolloverReview = async (
  db: SQLiteDatabase,
  { completedAt, taskId, updatedAt }: CompleteTaskForRolloverReviewParams,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        updated_at = ?,
        completed_at = ?,
        selected_for_day = NULL,
        today_order = NULL
      WHERE id = ?
        AND completed_at IS NULL
    `,
    updatedAt,
    completedAt,
    taskId,
  )
}
