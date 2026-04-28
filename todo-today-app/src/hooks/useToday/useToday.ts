import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import { useTasks } from '@/hooks/useTasks';
import { buildTodayState } from '@/hooks/useToday/buildTodayState';

export function useToday() {
  const { todayHideCompleted, setTodayHideCompleted } = useAppContext();
  const { tasks: allTasks, isLoading } = useTasks();

  return useMemo(
    () =>
      buildTodayState({
        allTasks,
        hideCompleted: todayHideCompleted,
        setHideCompleted: setTodayHideCompleted,
        isLoading,
      }),
    [allTasks, todayHideCompleted, setTodayHideCompleted, isLoading]
  );
}
