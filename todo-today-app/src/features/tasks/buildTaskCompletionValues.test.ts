import { buildTaskCompletionValues } from '@/features/tasks/buildTaskCompletionValues';
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
    todayOrder: 2,
    ...overrides,
  };
};

describe('buildTaskCompletionValues', () => {
  it('sets completedAt when completing an incomplete task', () => {
    const values = buildTaskCompletionValues({
      task: createTask(),
      completed: true,
      nowIso: '2026-04-28T12:00:00.000Z',
    });

    expect(values.completedAt).toBe('2026-04-28T12:00:00.000Z');
    expect(values.selectedForDay).toBe('2026-04-28');
    expect(values.todayOrder).toBe(2);
  });

  it('preserves the original completedAt when a completed task is saved again as completed', () => {
    const values = buildTaskCompletionValues({
      task: createTask({
        completedAt: '2026-04-28T10:15:00.000Z',
      }),
      completed: true,
      nowIso: '2026-04-28T12:00:00.000Z',
    });

    expect(values.completedAt).toBe('2026-04-28T10:15:00.000Z');
  });

  it('clears completedAt when restoring a task', () => {
    const values = buildTaskCompletionValues({
      task: createTask({
        completedAt: '2026-04-20T10:15:00.000Z',
        selectedForDay: null,
        todayOrder: null,
      }),
      completed: false,
      nowIso: '2026-04-28T12:00:00.000Z',
    });

    expect(values.completedAt).toBeNull();
    expect(values.selectedForDay).toBeNull();
    expect(values.todayOrder).toBeNull();
  });
});
