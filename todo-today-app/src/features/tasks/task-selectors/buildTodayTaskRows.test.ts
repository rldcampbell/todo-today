import { buildTodayTaskRows } from '@/features/tasks/task-selectors/buildTodayTaskRows';
import type { Task } from '@/features/tasks/task-types';

const createTask = (overrides: Partial<Task> = {}): Task => {
  return {
    id: 'task-1',
    title: 'Task',
    description: null,
    category: null,
    dueDate: null,
    recurrence: null,
    createdAt: '2026-04-28T09:00:00.000Z',
    updatedAt: '2026-04-28T09:00:00.000Z',
    completedAt: null,
    selectedForDay: '2026-04-28',
    todayOrder: 0,
    ...overrides,
  };
};

describe('buildTodayTaskRows', () => {
  it('allows movement only within the incomplete group and completed group', () => {
    const rows = buildTodayTaskRows([
      createTask({ id: 'a', todayOrder: 0 }),
      createTask({ id: 'b', todayOrder: 1 }),
      createTask({
        id: 'c',
        todayOrder: 2,
        completedAt: '2026-04-28T10:00:00.000Z',
      }),
      createTask({
        id: 'd',
        todayOrder: 3,
        completedAt: '2026-04-28T11:00:00.000Z',
      }),
    ]);

    expect(rows).toEqual([
      expect.objectContaining({
        task: expect.objectContaining({ id: 'a' }),
        canMoveUp: false,
        canMoveDown: true,
      }),
      expect.objectContaining({
        task: expect.objectContaining({ id: 'b' }),
        canMoveUp: true,
        canMoveDown: false,
      }),
      expect.objectContaining({
        task: expect.objectContaining({ id: 'c' }),
        canMoveUp: false,
        canMoveDown: true,
      }),
      expect.objectContaining({
        task: expect.objectContaining({ id: 'd' }),
        canMoveUp: true,
        canMoveDown: false,
      }),
    ]);
  });
});
