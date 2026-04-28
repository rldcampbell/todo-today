import type { Task } from '@/features/tasks/task-types';
import { buildBacklogState } from '@/hooks/useBacklog/buildBacklogState';
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
    selectedForDay: null,
    todayOrder: null,
    ...overrides,
  };
};
describe('buildBacklogState', () => {
  it('selects current sort fields when backlog status is current', () => {
    const state = buildBacklogState({
      tasks: [
        createTask({ id: 'current-a', title: 'Current A' }),
        createTask({
          id: 'completed-today',
          title: 'Completed today',
          completedAt: '2026-04-28T10:00:00.000Z',
        }),
        createTask({
          id: 'archived',
          title: 'Archived',
          completedAt: '2026-04-20T10:00:00.000Z',
        }),
      ],
      search: '',
      setSearch: noop,
      category: null,
      setCategory: noop,
      status: 'current',
      setStatus: noop,
      currentSortField: 'createdAt',
      currentSortDirection: 'desc',
      archivedSortField: 'completedAt',
      archivedSortDirection: 'asc',
      clearFilters: noop,
      isLoading: false,
      dayKey: '2026-04-28',
    });
    expect(state.sortField).toBe('createdAt');
    expect(state.sortDirection).toBe('desc');
    expect(state.tasks.map((task) => task.id)).toEqual([
      'current-a',
      'completed-today',
    ]);
  });
  it('selects archived sort fields when backlog status is archived', () => {
    const state = buildBacklogState({
      tasks: [
        createTask({
          id: 'archived-b',
          title: 'Archived B',
          completedAt: '2026-04-21T10:00:00.000Z',
        }),
        createTask({
          id: 'archived-a',
          title: 'Archived A',
          completedAt: '2026-04-22T10:00:00.000Z',
        }),
        createTask({
          id: 'current',
          title: 'Current',
        }),
      ],
      search: '',
      setSearch: noop,
      category: null,
      setCategory: noop,
      status: 'archived',
      setStatus: noop,
      currentSortField: 'createdAt',
      currentSortDirection: 'desc',
      archivedSortField: 'completedAt',
      archivedSortDirection: 'asc',
      clearFilters: noop,
      isLoading: false,
      dayKey: '2026-04-28',
    });
    expect(state.sortField).toBe('completedAt');
    expect(state.sortDirection).toBe('asc');
    expect(state.tasks.map((task) => task.id)).toEqual([
      'archived-b',
      'archived-a',
    ]);
  });
  it('filters current backlog results by title and description search', () => {
    const state = buildBacklogState({
      tasks: [
        createTask({
          id: 'match-title',
          title: 'Garden',
        }),
        createTask({
          id: 'match-description',
          title: 'Errand',
          description: 'Pick up garden twine',
        }),
        createTask({
          id: 'no-match',
          title: 'Laundry',
        }),
      ],
      search: 'garden',
      setSearch: noop,
      category: null,
      setCategory: noop,
      status: 'current',
      setStatus: noop,
      currentSortField: 'createdAt',
      currentSortDirection: 'desc',
      archivedSortField: 'completedAt',
      archivedSortDirection: 'asc',
      clearFilters: noop,
      isLoading: false,
      dayKey: '2026-04-28',
    });
    expect(state.tasks.map((task) => task.id)).toEqual([
      'match-title',
      'match-description',
    ]);
  });
});
