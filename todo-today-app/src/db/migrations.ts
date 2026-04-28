import type { SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from '@/db/client';
import { MAX_TASK_TITLE_LENGTH } from '@/features/tasks/task-constants';

const createAppStateTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
};

const createTaskIndexes = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_tasks_selected_for_day_order
      ON tasks (selected_for_day, today_order);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed_at
      ON tasks (completed_at);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date
      ON tasks (due_date);
    CREATE INDEX IF NOT EXISTS idx_tasks_category
      ON tasks (category);
  `);
};

const createLatestTasksTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL CHECK(length(title) <= ${MAX_TASK_TITLE_LENGTH}),
      description TEXT,
      category TEXT,
      due_date TEXT,
      recurrence_interval INTEGER,
      recurrence_unit TEXT,
      recurrence_enabled INTEGER NOT NULL DEFAULT 0 CHECK(recurrence_enabled IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT,
      selected_for_day TEXT,
      today_order INTEGER
    );
  `);
};

const migrateTasksToVersion2 = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    DROP INDEX IF EXISTS idx_tasks_selected_for_day_order;
    DROP INDEX IF EXISTS idx_tasks_completed_at;
    DROP INDEX IF EXISTS idx_tasks_due_date;
    DROP INDEX IF EXISTS idx_tasks_category;

    ALTER TABLE tasks RENAME TO tasks_v1;

    CREATE TABLE tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL CHECK(length(title) <= ${MAX_TASK_TITLE_LENGTH}),
      description TEXT,
      category TEXT,
      due_date TEXT,
      recurrence_interval INTEGER,
      recurrence_unit TEXT,
      recurrence_enabled INTEGER NOT NULL DEFAULT 0 CHECK(recurrence_enabled IN (0, 1)),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT,
      selected_for_day TEXT,
      today_order INTEGER
    );

    INSERT INTO tasks (
      id,
      title,
      description,
      category,
      due_date,
      recurrence_interval,
      recurrence_unit,
      recurrence_enabled,
      created_at,
      updated_at,
      completed_at,
      selected_for_day,
      today_order
    )
    SELECT
      id,
      substr(title, 1, ${MAX_TASK_TITLE_LENGTH}),
      description,
      category,
      due_date,
      recurrence_interval,
      recurrence_unit,
      CASE
        WHEN recurrence_interval IS NOT NULL AND recurrence_unit IS NOT NULL THEN 1
        ELSE 0
      END,
      created_at,
      updated_at,
      completed_at,
      selected_for_day,
      today_order
    FROM tasks_v1;

    DROP TABLE tasks_v1;
  `);

  await createTaskIndexes(db);
};

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const versionRow = await db.getFirstAsync<{
    user_version: number;
  }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  await db.execAsync('PRAGMA journal_mode = WAL');
  await createAppStateTable(db);

  if (currentVersion === 0) {
    await createLatestTasksTable(db);
    await createTaskIndexes(db);
  }

  if (currentVersion === 1) {
    await migrateTasksToVersion2(db);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
