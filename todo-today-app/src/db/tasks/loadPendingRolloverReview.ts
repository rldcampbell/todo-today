import type { SQLiteDatabase } from "expo-sqlite"
import { mapTaskRow, type TaskRow } from "@/db/mappers"
import type { PendingRolloverReview } from "@/features/tasks/rolloverReview"

type ReviewDayRow = {
  day_key: string
}

export const loadPendingRolloverReview = async (
  db: SQLiteDatabase,
  currentDayKey: string,
): Promise<PendingRolloverReview | null> => {
  const reviewDayRow = await db.getFirstAsync<ReviewDayRow>(
    `
      SELECT selected_for_day AS day_key
      FROM tasks
      WHERE selected_for_day IS NOT NULL
        AND selected_for_day < ?
        AND completed_at IS NULL
      ORDER BY selected_for_day DESC
      LIMIT 1
    `,
    currentDayKey,
  )

  if (!reviewDayRow) {
    return null
  }

  const taskRows = await db.getAllAsync<TaskRow>(
    `
      SELECT *
      FROM tasks
      WHERE selected_for_day = ?
      ORDER BY
        today_order IS NULL,
        today_order ASC,
        created_at ASC
    `,
    reviewDayRow.day_key,
  )

  return {
    dayKey: reviewDayRow.day_key,
    tasks: taskRows.map(mapTaskRow),
  }
}
