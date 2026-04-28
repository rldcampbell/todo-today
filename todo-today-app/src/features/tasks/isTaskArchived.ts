import { getLocalDayKey } from '@/utils/dates';
import type { Task } from '@/features/tasks/task-types';
export const isTaskArchived = (task: Task, dayKey = getLocalDayKey()) => {
  if (!task.completedAt) {
    return false;
  }
  if (task.recurrence) {
    return false;
  }
  const completedDayKey = getLocalDayKey(new Date(task.completedAt));
  return completedDayKey < dayKey;
};
