import type { SQLiteDatabase } from "expo-sqlite"

export const clearTaskCategory = async (
  db: SQLiteDatabase,
  category: string,
  updatedAt: string,
) => {
  await db.runAsync(
    `
      UPDATE tasks
      SET category = NULL,
          updated_at = ?
      WHERE category = ?
    `,
    updatedAt,
    category,
  )
}
