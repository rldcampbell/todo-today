import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import type { Task } from '@/features/tasks/task-types';

const scaffoldTasks: Task[] = [];

export function useBacklog() {
  const {
    backlogSearch,
    setBacklogSearch,
    backlogCategory,
    setBacklogCategory,
    backlogStatus,
    setBacklogStatus,
    currentSortField,
    currentSortDirection,
    archivedSortField,
    archivedSortDirection,
    clearBacklogFilters,
  } = useAppContext();

  return useMemo(
    () => ({
      tasks: scaffoldTasks,
      search: backlogSearch,
      setSearch: setBacklogSearch,
      category: backlogCategory,
      setCategory: setBacklogCategory,
      status: backlogStatus,
      setStatus: setBacklogStatus,
      sortField: backlogStatus === 'current' ? currentSortField : archivedSortField,
      sortDirection: backlogStatus === 'current' ? currentSortDirection : archivedSortDirection,
      clearFilters: clearBacklogFilters,
      isLoading: false,
    }),
    [
      backlogSearch,
      setBacklogSearch,
      backlogCategory,
      setBacklogCategory,
      backlogStatus,
      setBacklogStatus,
      currentSortField,
      currentSortDirection,
      archivedSortField,
      archivedSortDirection,
      clearBacklogFilters,
    ]
  );
}
