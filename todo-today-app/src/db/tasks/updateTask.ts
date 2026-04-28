import type { SQLiteDatabase } from 'expo-sqlite';

import type { TaskRecordValues } from '@/db/tasks/types';

export async function updateTask(db: SQLiteDatabase, values: TaskRecordValues) {
  await db.runAsync(
    `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        category = ?,
        due_date = ?,
        recurrence_interval = ?,
        recurrence_unit = ?,
        updated_at = ?,
        completed_at = ?,
        selected_for_day = ?,
        today_order = ?
      WHERE id = ?
    `,
    values.title,
    values.description,
    values.category,
    values.dueDate,
    values.recurrenceInterval,
    values.recurrenceUnit,
    values.updatedAt,
    values.completedAt,
    values.selectedForDay,
    values.todayOrder,
    values.id
  );
}
