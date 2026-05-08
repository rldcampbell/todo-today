import type { SQLiteDatabase } from "expo-sqlite"

type TodayOrderRow = {
  max_order: number | null
}

export const getNextTodayOrderForDay = async (
  db: SQLiteDatabase,
  dayKey: string,
) => {
  const row = await db.getFirstAsync<TodayOrderRow>(
    `
      SELECT MAX(today_order) AS max_order
      FROM tasks
      WHERE selected_for_day = ?
    `,
    dayKey,
  )

  return row?.max_order === null || row?.max_order === undefined
    ? 0
    : row.max_order + 1
}
