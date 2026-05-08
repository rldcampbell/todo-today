import type { SQLiteDatabase } from "expo-sqlite"
import type { RolloverReviewTaskState } from "@/features/tasks/rolloverReview"

type RolloverReviewTaskStateRow = {
  completed_at: string | null
  id: string
}

export const loadRolloverReviewTaskStates = async (
  db: SQLiteDatabase,
  reviewDayKey: string,
): Promise<RolloverReviewTaskState[]> => {
  const rows = await db.getAllAsync<RolloverReviewTaskStateRow>(
    `
      SELECT id, completed_at
      FROM tasks
      WHERE selected_for_day = ?
      ORDER BY
        today_order IS NULL,
        today_order ASC,
        created_at ASC
    `,
    reviewDayKey,
  )

  return rows.map((row) => ({
    completedAt: row.completed_at,
    id: row.id,
  }))
}
