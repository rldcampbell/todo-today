import type { SQLiteDatabase } from 'expo-sqlite';
import { clearTaskCategory } from '@/db/tasks/clearTaskCategory';

describe('clearTaskCategory', () => {
  it('clears the category from matching tasks and marks them updated', async () => {
    const db = {
      runAsync: jest.fn().mockResolvedValue(undefined),
    } as unknown as SQLiteDatabase;

    await clearTaskCategory(db, 'Home', '2026-04-28T09:00:00.000Z');

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE tasks'),
      '2026-04-28T09:00:00.000Z',
      'Home',
    );
  });
});
