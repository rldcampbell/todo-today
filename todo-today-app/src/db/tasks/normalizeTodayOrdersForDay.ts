import type { SQLiteDatabase } from 'expo-sqlite';
type TodayOrderRow = {
  id: string;
};
export const normalizeTodayOrdersForDay = async (
  db: SQLiteDatabase,
  dayKey: string,
) => {
  const rows = await db.getAllAsync<TodayOrderRow>(
    `
      SELECT id
      FROM tasks
      WHERE selected_for_day = ?
      ORDER BY
        CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END ASC,
        CASE WHEN today_order IS NULL THEN 1 ELSE 0 END ASC,
        today_order ASC,
        updated_at ASC,
        created_at ASC,
        id ASC
    `,
    dayKey,
  );
  for (const [index, row] of rows.entries()) {
    await db.runAsync(
      'UPDATE tasks SET today_order = ? WHERE id = ?',
      index,
      row.id,
    );
  }
};
