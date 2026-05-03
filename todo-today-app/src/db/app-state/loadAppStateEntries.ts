import type { SQLiteDatabase } from "expo-sqlite"

type AppStateRow = {
  key: string
  value: string
}

export const loadAppStateEntries = async (db: SQLiteDatabase) => {
  const rows = await db.getAllAsync<AppStateRow>(`
    SELECT key, value
    FROM app_state
  `)

  const entries: Record<string, string> = {}

  for (const row of rows) {
    entries[row.key] = row.value
  }

  return entries
}
