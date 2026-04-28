import { countIncompleteTasks, filterVisibleTodayTasks } from '@/features/tasks/task-selectors';
import type { Task } from '@/features/tasks/task-types';

type BuildTodayStateParams = {
  allTasks: Task[];
  hideCompleted: boolean;
  setHideCompleted: (value: boolean) => void;
  isLoading: boolean;
};

export function buildTodayState({
  allTasks,
  hideCompleted,
  setHideCompleted,
  isLoading,
}: BuildTodayStateParams) {
  return {
    tasks: filterVisibleTodayTasks(allTasks, hideCompleted),
    allTasks,
    hideCompleted,
    setHideCompleted,
    incompleteCount: countIncompleteTasks(allTasks),
    isLoading,
  };
}
