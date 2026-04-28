import { mapTaskToDraft } from '@/features/tasks/mapTaskToDraft';
import type { Task } from '@/features/tasks/task-types';

const createTask = (overrides: Partial<Task> = {}): Task => {
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

describe('mapTaskToDraft', () => {
  it('keeps stored recurrence values even when recurrence is disabled', () => {
    const draft = mapTaskToDraft(
      createTask({
        recurrence: {
          interval: 1,
          unit: 'month',
        },
        recurrenceEnabled: false,
      }),
      '2026-04-28',
    );

    expect(draft.recurrenceEnabled).toBe(false);
    expect(draft.recurrenceInterval).toBe(1);
    expect(draft.recurrenceUnit).toBe('month');
  });
});
