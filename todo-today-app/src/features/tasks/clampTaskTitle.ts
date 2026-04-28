import { MAX_TASK_TITLE_LENGTH } from '@/features/tasks/task-constants';

export const clampTaskTitle = (value: string) => {
  return value.slice(0, MAX_TASK_TITLE_LENGTH);
};
