import type { Task } from '@/features/tasks/task-types';

export type TodayTaskRowModel = {
  task: Task;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export const buildTodayTaskRows = (tasks: Task[]): TodayTaskRowModel[] => {
  return tasks.map((task, index) => {
    const previousTask = tasks[index - 1];
    const nextTask = tasks[index + 1];
    const completed = Boolean(task.completedAt);

    return {
      task,
      canMoveUp: Boolean(
        previousTask && Boolean(previousTask.completedAt) === completed,
      ),
      canMoveDown: Boolean(
        nextTask && Boolean(nextTask.completedAt) === completed,
      ),
    };
  });
};
