import { buildTaskMetadataLabels } from '@/features/tasks/buildTaskMetadataLabels';
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

describe('buildTaskMetadataLabels', () => {
  it('builds category, due date, and recurrence labels', () => {
    const labels = buildTaskMetadataLabels(
      createTask({
        category: 'Home',
        dueDate: '1999-01-15',
        recurrence: {
          interval: 2,
          unit: 'week',
        },
        recurrenceEnabled: true,
      }),
    );

    expect(labels).toEqual(['Home', '15 Jan 1999', 'Every 2 weeks']);
  });

  it('can omit the due date when another surface shows it separately', () => {
    const labels = buildTaskMetadataLabels(
      createTask({
        category: 'Home',
        dueDate: '1999-01-15',
      }),
      {
        includeDueDate: false,
      },
    );

    expect(labels).toEqual(['Home']);
  });
});
