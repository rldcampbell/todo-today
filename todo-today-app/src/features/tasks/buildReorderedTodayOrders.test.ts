import {
  buildReorderedTodayOrders,
  type TodayOrderUpdate,
} from '@/features/tasks/buildReorderedTodayOrders';
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

const expectOrder = (
  updates: TodayOrderUpdate[] | null,
  expectedIds: string[],
) => {
  expect(updates?.map((update) => update.id)).toEqual(expectedIds);
  expect(updates?.map((update) => update.todayOrder)).toEqual(
    expectedIds.map((_, index) => index),
  );
};

describe('buildReorderedTodayOrders', () => {
  it('moves an incomplete task upward within the incomplete group', () => {
    const updates = buildReorderedTodayOrders({
      tasks: [
        createTask({ id: 'a', todayOrder: 0 }),
        createTask({ id: 'b', todayOrder: 1 }),
        createTask({
          id: 'c',
          todayOrder: 2,
          completedAt: '2026-04-28T10:00:00.000Z',
        }),
      ],
      taskId: 'b',
      dayKey: '2026-04-28',
      direction: 'up',
    });

    expectOrder(updates, ['b', 'a', 'c']);
  });

  it('moves a completed task downward within the completed group', () => {
    const updates = buildReorderedTodayOrders({
      tasks: [
        createTask({ id: 'a', todayOrder: 0 }),
        createTask({
          id: 'b',
          todayOrder: 1,
          completedAt: '2026-04-28T10:00:00.000Z',
        }),
        createTask({
          id: 'c',
          todayOrder: 2,
          completedAt: '2026-04-28T11:00:00.000Z',
        }),
      ],
      taskId: 'b',
      dayKey: '2026-04-28',
      direction: 'down',
    });

    expectOrder(updates, ['a', 'c', 'b']);
  });

  it('does not move a task across the incomplete/completed boundary', () => {
    const updates = buildReorderedTodayOrders({
      tasks: [
        createTask({ id: 'a', todayOrder: 0 }),
        createTask({
          id: 'b',
          todayOrder: 1,
          completedAt: '2026-04-28T10:00:00.000Z',
        }),
      ],
      taskId: 'a',
      dayKey: '2026-04-28',
      direction: 'down',
    });

    expect(updates).toBeNull();
  });

  it('does not move a task beyond its group boundary', () => {
    const updates = buildReorderedTodayOrders({
      tasks: [
        createTask({ id: 'a', todayOrder: 0 }),
        createTask({ id: 'b', todayOrder: 1 }),
      ],
      taskId: 'a',
      dayKey: '2026-04-28',
      direction: 'up',
    });

    expect(updates).toBeNull();
  });
});
