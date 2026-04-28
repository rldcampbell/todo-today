import type { SQLiteDatabase } from 'expo-sqlite';

export async function deleteTask(db: SQLiteDatabase, taskId: string) {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', taskId);
}
