import type { SQLiteDatabase } from 'expo-sqlite';
export const deleteTask = async (db: SQLiteDatabase, taskId: string) => {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', taskId);
};
