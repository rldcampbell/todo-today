import type { SQLiteDatabase } from "expo-sqlite"

export const clearStaleTodaySelection = async (
  db: SQLiteDatabase,
  currentDayKey: string,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        selected_for_day = NULL,
        today_order = NULL
      WHERE selected_for_day IS NOT NULL
        AND selected_for_day <> ?
    `,
    currentDayKey,
  )
}
