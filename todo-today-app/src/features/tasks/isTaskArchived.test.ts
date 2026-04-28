import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import type { Task } from '@/features/tasks/task-types';
const createTask = (overrides: Partial<Task>): Task => {
  return {
    id: 'task-1',
    title: 'Task',
    description: null,
    category: null,
    dueDate: null,
    recurrence: null,
    recurrenceEnabled: false,
    createdAt: '2026-04-28T09:00:00.000Z',
    updatedAt: '2026-04-28T09:00:00.000Z',
    completedAt: null,
    selectedForDay: null,
    todayOrder: null,
    ...overrides,
  };
};
describe('isTaskArchived', () => {
  it('returns true for a non-recurring task completed before the current day', () => {
    const task = createTask({
      completedAt: '2026-04-20T10:00:00.000Z',
    });
    expect(isTaskArchived(task, '2026-04-28')).toBe(true);
  });
  it('returns false for a recurring completed task', () => {
    const task = createTask({
      recurrence: {
        interval: 1,
        unit: 'week',
      },
      recurrenceEnabled: true,
      completedAt: '2026-04-20T10:00:00.000Z',
    });
    expect(isTaskArchived(task, '2026-04-28')).toBe(false);
  });
  it('returns true for a task with a stored recurrence that is currently disabled', () => {
    const task = createTask({
      recurrence: {
        interval: 1,
        unit: 'week',
      },
      recurrenceEnabled: false,
      completedAt: '2026-04-20T10:00:00.000Z',
    });
    expect(isTaskArchived(task, '2026-04-28')).toBe(true);
  });
  it('returns false for a task completed today', () => {
    const task = createTask({
      completedAt: '2026-04-28T10:00:00.000Z',
    });
    expect(isTaskArchived(task, '2026-04-28')).toBe(false);
  });
});
