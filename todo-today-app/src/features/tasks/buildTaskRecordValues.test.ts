import { buildTaskRecordValues } from '@/features/tasks/buildTaskRecordValues';
import type { Task, TaskDraft } from '@/features/tasks/task-types';
const createTask = (overrides: Partial<Task>): Task => {
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
    selectedForDay: null,
    todayOrder: null,
    ...overrides,
  };
};
const createDraft = (overrides: Partial<TaskDraft>): TaskDraft => {
  return {
    title: 'Task title',
    description: '',
    category: '',
    dueDate: '',
    recurrenceEnabled: false,
    recurrenceInterval: 1,
    recurrenceUnit: 'week',
    selectedForToday: false,
    completed: false,
    ...overrides,
  };
};
describe('buildTaskRecordValues', () => {
  it('assigns the next today order for a newly selected task', () => {
    const values = buildTaskRecordValues({
      taskId: 'new-task',
      draft: createDraft({
        selectedForToday: true,
      }),
      tasks: [
        createTask({
          id: 'a',
          selectedForDay: '2026-04-28',
          todayOrder: 0,
        }),
        createTask({
          id: 'b',
          selectedForDay: '2026-04-28',
          todayOrder: 1,
        }),
      ],
      nowIso: '2026-04-28T12:00:00.000Z',
      dayKey: '2026-04-28',
    });
    expect(values.selectedForDay).toBe('2026-04-28');
    expect(values.todayOrder).toBe(2);
  });
  it('preserves completion time and today order when editing an existing selected task', () => {
    const existingTask = createTask({
      id: 'existing',
      completedAt: '2026-04-28T10:00:00.000Z',
      selectedForDay: '2026-04-28',
      todayOrder: 4,
    });
    const values = buildTaskRecordValues({
      taskId: existingTask.id,
      draft: createDraft({
        title: 'Updated title',
        selectedForToday: true,
        completed: true,
      }),
      tasks: [existingTask],
      nowIso: '2026-04-28T12:00:00.000Z',
      dayKey: '2026-04-28',
      existingTask,
    });
    expect(values.completedAt).toBe('2026-04-28T10:00:00.000Z');
    expect(values.todayOrder).toBe(4);
  });
  it('does not allow an archived completed task to remain selected for today', () => {
    const existingTask = createTask({
      id: 'archived',
      completedAt: '2026-04-20T10:00:00.000Z',
    });
    const values = buildTaskRecordValues({
      taskId: existingTask.id,
      draft: createDraft({
        selectedForToday: true,
        completed: true,
      }),
      tasks: [existingTask],
      nowIso: '2026-04-28T12:00:00.000Z',
      dayKey: '2026-04-28',
      existingTask,
    });
    expect(values.selectedForDay).toBeNull();
    expect(values.todayOrder).toBeNull();
  });
});
