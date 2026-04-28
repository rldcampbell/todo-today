import type { Task } from '@/features/tasks/task-types';
export const countIncompleteTasks = (tasks: Task[]) => {
  return tasks.filter((task) => !task.completedAt).length;
};
