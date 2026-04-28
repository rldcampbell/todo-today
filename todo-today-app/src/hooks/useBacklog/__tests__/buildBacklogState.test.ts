import { buildBacklogState } from '@/hooks/useBacklog/buildBacklogState';

const noop = () => {};

describe('buildBacklogState', () => {
  it('selects current sort fields when backlog status is current', () => {
    const state = buildBacklogState({
      tasks: [],
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
    });

    expect(state.sortField).toBe('createdAt');
    expect(state.sortDirection).toBe('desc');
  });

  it('selects archived sort fields when backlog status is archived', () => {
    const state = buildBacklogState({
      tasks: [],
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
    });

    expect(state.sortField).toBe('completedAt');
    expect(state.sortDirection).toBe('asc');
  });
});
