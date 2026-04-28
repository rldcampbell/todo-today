import type { SQLiteDatabase } from 'expo-sqlite';

export const upsertAppStateValue = async (
  db: SQLiteDatabase,
  key: string,
  value: string,
) => {
  await db.runAsync(
    `
      INSERT INTO app_state (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    key,
    value,
  );
};
