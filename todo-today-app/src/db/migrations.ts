import type { SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from '@/db/client';
export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const versionRow = await db.getFirstAsync<{
    user_version: number;
  }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) {
    return;
  }
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      due_date TEXT,
      recurrence_interval INTEGER,
      recurrence_unit TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT,
      selected_for_day TEXT,
      today_order INTEGER
    );

    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_selected_for_day_order
      ON tasks (selected_for_day, today_order);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed_at
      ON tasks (completed_at);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date
      ON tasks (due_date);
    CREATE INDEX IF NOT EXISTS idx_tasks_category
      ON tasks (category);
  `);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
