import { getLocalDayKey } from '@/utils/dates';
import type { Task, TaskDraft } from '@/features/tasks/task-types';
export const mapTaskToDraft = (
  task: Task,
  dayKey = getLocalDayKey(),
): TaskDraft => {
  return {
    title: task.title,
    description: task.description ?? '',
    category: task.category ?? '',
    dueDate: task.dueDate ?? '',
    recurrenceEnabled: Boolean(task.recurrence),
    recurrenceInterval: task.recurrence?.interval ?? 1,
    recurrenceUnit: task.recurrence?.unit ?? 'week',
    selectedForToday: task.selectedForDay === dayKey,
    completed: Boolean(task.completedAt),
  };
};
