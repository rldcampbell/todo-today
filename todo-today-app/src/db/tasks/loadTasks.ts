import type { SQLiteDatabase } from 'expo-sqlite';
import { mapTaskRow, type TaskRow } from '@/db/mappers';
import type { Task } from '@/features/tasks/task-types';
export const loadTasks = async (db: SQLiteDatabase): Promise<Task[]> => {
  const rows = await db.getAllAsync<TaskRow>(`
    SELECT *
    FROM tasks
    ORDER BY created_at DESC
  `);
  return rows.map(mapTaskRow);
};
