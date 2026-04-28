import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import { countIncompleteTasks, filterVisibleTodayTasks } from '@/features/tasks/task-selectors';
import { useTasks } from '@/hooks/useTasks';

export function useToday() {
  const { todayHideCompleted, setTodayHideCompleted } = useAppContext();
  const { tasks: allTasks, isLoading } = useTasks();

  return useMemo(
    () => ({
      tasks: filterVisibleTodayTasks(allTasks, todayHideCompleted),
      allTasks,
      hideCompleted: todayHideCompleted,
      setHideCompleted: setTodayHideCompleted,
      incompleteCount: countIncompleteTasks(allTasks),
      isLoading,
    }),
    [allTasks, todayHideCompleted, setTodayHideCompleted, isLoading]
  );
}
