import {
  countIncompleteTasks,
  filterVisibleTodayTasks,
  selectTodayTasks,
} from '@/features/tasks/task-selectors';
import type { Task } from '@/features/tasks/task-types';
type BuildTodayStateParams = {
  allTasks: Task[];
  hideCompleted: boolean;
  setHideCompleted: (value: boolean) => void;
  isLoading: boolean;
  dayKey: string;
};
export const buildTodayState = ({
  allTasks,
  hideCompleted,
  setHideCompleted,
  isLoading,
  dayKey,
}: BuildTodayStateParams) => {
  const selectedTasks = selectTodayTasks(allTasks, dayKey);
  return {
    tasks: filterVisibleTodayTasks(selectedTasks, hideCompleted),
    allTasks: selectedTasks,
    hideCompleted,
    setHideCompleted,
    incompleteCount: countIncompleteTasks(selectedTasks),
    isLoading,
  };
};
