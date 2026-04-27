import { useMemo } from 'react';

import { useAppContext } from '@/providers/AppProvider';
import { countIncompleteTasks, filterVisibleTodayTasks } from '@/features/tasks/task-selectors';
import type { Task } from '@/features/tasks/task-types';

const scaffoldTasks: Task[] = [];

export function useToday() {
  const { todayHideCompleted, setTodayHideCompleted } = useAppContext();

  return useMemo(
    () => ({
      tasks: filterVisibleTodayTasks(scaffoldTasks, todayHideCompleted),
      allTasks: scaffoldTasks,
      hideCompleted: todayHideCompleted,
      setHideCompleted: setTodayHideCompleted,
      incompleteCount: countIncompleteTasks(scaffoldTasks),
      isLoading: false,
    }),
    [todayHideCompleted, setTodayHideCompleted]
  );
}
