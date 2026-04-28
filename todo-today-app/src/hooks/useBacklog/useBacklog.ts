import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import { useTasks } from '@/hooks/useTasks';
import { buildBacklogState } from '@/hooks/useBacklog/buildBacklogState';
import { getLocalDayKey } from '@/utils/dates';

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
  const dayKey = getLocalDayKey();

  return useMemo(
    () =>
      buildBacklogState({
        tasks,
        search: backlogSearch,
        setSearch: setBacklogSearch,
        category: backlogCategory,
        setCategory: setBacklogCategory,
        status: backlogStatus,
        setStatus: setBacklogStatus,
        currentSortField,
        currentSortDirection,
        archivedSortField,
        archivedSortDirection,
        clearFilters: clearBacklogFilters,
        isLoading,
        dayKey,
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
      dayKey,
    ]
  );
}
