import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import { useTasks } from '@/hooks/useTasks';

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
  const { tasks, isLoading } = useTasks();

  return useMemo(
    () => ({
      tasks,
      search: backlogSearch,
      setSearch: setBacklogSearch,
      category: backlogCategory,
      setCategory: setBacklogCategory,
      status: backlogStatus,
      setStatus: setBacklogStatus,
      sortField: backlogStatus === 'current' ? currentSortField : archivedSortField,
      sortDirection: backlogStatus === 'current' ? currentSortDirection : archivedSortDirection,
      clearFilters: clearBacklogFilters,
      isLoading,
    }),
    [
      tasks,
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
      isLoading,
    ]
  );
}
