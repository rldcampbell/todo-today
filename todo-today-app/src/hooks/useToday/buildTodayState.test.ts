import { buildTodayState } from '@/hooks/useToday/buildTodayState';
import type { Task } from '@/features/tasks/task-types';
const noop = () => {};
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
    selectedForDay: '2026-04-28',
    todayOrder: 0,
    ...overrides,
  };
};
describe('buildTodayState', () => {
  it('preserves all tasks while filtering visible tasks when completed items are hidden', () => {
    const incompleteTask = createTask({ id: 'a', title: 'Incomplete' });
    const completedTask = createTask({
      id: 'b',
      title: 'Complete',
      completedAt: '2026-04-28T10:00:00.000Z',
    });
    const otherDayTask = createTask({
      id: 'c',
      title: 'Tomorrow task',
      selectedForDay: '2026-04-29',
    });
    const state = buildTodayState({
      allTasks: [incompleteTask, completedTask, otherDayTask],
      hideCompleted: true,
      setHideCompleted: noop,
      isLoading: false,
      dayKey: '2026-04-28',
    });
    expect(state.allTasks).toEqual([incompleteTask, completedTask]);
    expect(state.rows).toEqual([
      expect.objectContaining({
        task: incompleteTask,
        canMoveUp: false,
        canMoveDown: false,
      }),
    ]);
    expect(state.incompleteCount).toBe(1);
  });
});
