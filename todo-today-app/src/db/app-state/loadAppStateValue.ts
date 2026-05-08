import type { SQLiteDatabase } from "expo-sqlite"

type AppStateValueRow = {
  value: string
}

export const loadAppStateValue = async (db: SQLiteDatabase, key: string) => {
  const row = await db.getFirstAsync<AppStateValueRow>(
    "SELECT value FROM app_state WHERE key = ?",
    key,
  )

  return row?.value ?? null
}
