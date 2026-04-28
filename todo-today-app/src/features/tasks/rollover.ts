import type { SQLiteDatabase } from 'expo-sqlite';
import { getRecurringTaskRolloverPatch } from '@/features/tasks/getRecurringTaskRolloverPatch';
import { getLocalDayKey } from '@/utils/dates';
const LAST_ROLLOVER_DAY_KEY = 'last_rollover_day';
type AppStateRow = {
  value: string;
};
type SelectedTaskRow = {
  id: string;
  selected_for_day: string;
};
type RecurringRolloverRow = {
  id: string;
  due_date: string | null;
  recurrence_interval: number;
  recurrence_unit: 'day' | 'week' | 'month' | 'year';
  completed_at: string;
};
const getLastRolloverDay = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<AppStateRow>(
    'SELECT value FROM app_state WHERE key = ?',
    LAST_ROLLOVER_DAY_KEY,
  );
  return row?.value ?? null;
};
const setLastRolloverDay = async (db: SQLiteDatabase, dayKey: string) => {
  await db.runAsync(
    `
      INSERT INTO app_state (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    LAST_ROLLOVER_DAY_KEY,
    dayKey,
  );
};
const clearStaleTodaySelection = async (
  db: SQLiteDatabase,
  currentDayKey: string,
) => {
  const rows = await db.getAllAsync<SelectedTaskRow>(`
      SELECT id, selected_for_day
      FROM tasks
      WHERE selected_for_day IS NOT NULL
    `);
  for (const row of rows) {
    if (row.selected_for_day === currentDayKey) {
      continue;
    }
    await db.runAsync(
      `
        UPDATE tasks
        SET
          selected_for_day = NULL,
          today_order = NULL
        WHERE id = ?
      `,
      row.id,
    );
  }
};
const rolloverRecurringCompletedTasks = async (
  db: SQLiteDatabase,
  currentDayKey: string,
  nowIso: string,
) => {
  const rows = await db.getAllAsync<RecurringRolloverRow>(`
      SELECT
        id,
        due_date,
        recurrence_interval,
        recurrence_unit,
        completed_at
      FROM tasks
      WHERE recurrence_enabled = 1
        AND recurrence_interval IS NOT NULL
        AND recurrence_unit IS NOT NULL
        AND completed_at IS NOT NULL
    `);
  for (const row of rows) {
    const patch = getRecurringTaskRolloverPatch(
      {
        dueDate: row.due_date,
        recurrence: {
          interval: row.recurrence_interval,
          unit: row.recurrence_unit,
        },
        completedAt: row.completed_at,
      },
      currentDayKey,
      nowIso,
    );
    if (!patch) {
      continue;
    }
    await db.runAsync(
      `
        UPDATE tasks
        SET
          due_date = ?,
          updated_at = ?,
          completed_at = NULL,
          selected_for_day = NULL,
          today_order = NULL
        WHERE id = ?
      `,
      patch.dueDate,
      patch.updatedAt,
      row.id,
    );
  }
};
export const runDayRollover = async (db: SQLiteDatabase, now = new Date()) => {
  const currentDayKey = getLocalDayKey(now);
  const lastRolloverDay = await getLastRolloverDay(db);
  if (lastRolloverDay === currentDayKey) {
    return;
  }
  const nowIso = now.toISOString();
  await db.withExclusiveTransactionAsync(async (transaction) => {
    await clearStaleTodaySelection(transaction, currentDayKey);
    await rolloverRecurringCompletedTasks(transaction, currentDayKey, nowIso);
    await setLastRolloverDay(transaction, currentDayKey);
  });
};
