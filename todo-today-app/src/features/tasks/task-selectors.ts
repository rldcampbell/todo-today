import type { Task } from '@/features/tasks/task-types';

export function countIncompleteTasks(tasks: Task[]) {
  return tasks.filter((task) => !task.completedAt).length;
}

export function filterVisibleTodayTasks(tasks: Task[], hideCompleted: boolean) {
  if (!hideCompleted) {
    return tasks;
  }

  return tasks.filter((task) => !task.completedAt);
}
