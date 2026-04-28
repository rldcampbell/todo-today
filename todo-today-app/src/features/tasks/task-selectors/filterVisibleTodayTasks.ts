import type { Task } from '@/features/tasks/task-types';
export const filterVisibleTodayTasks = (
  tasks: Task[],
  hideCompleted: boolean,
) => {
  if (!hideCompleted) {
    return tasks;
  }
  return tasks.filter((task) => !task.completedAt);
};
