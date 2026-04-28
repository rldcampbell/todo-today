import type { SQLiteDatabase } from 'expo-sqlite';
import type { TodayOrderUpdate } from '@/features/tasks/buildTodayOrderUpdates';

export const updateTodayOrders = async (
  db: SQLiteDatabase,
  updates: TodayOrderUpdate[],
) => {
  await db.withExclusiveTransactionAsync(async (transaction) => {
    for (const update of updates) {
      await transaction.runAsync(
        'UPDATE tasks SET today_order = ? WHERE id = ?',
        update.todayOrder,
        update.id,
      );
    }
  });
};
