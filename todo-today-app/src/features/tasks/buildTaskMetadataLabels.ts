import { formatRelativeDueDate } from '@/utils/dates';
import { hasActiveRecurrence } from '@/features/tasks/hasActiveRecurrence';
import { describeRecurrence } from '@/features/tasks/recurrence';
import type { Task } from '@/features/tasks/task-types';

type BuildTaskMetadataLabelsOptions = {
  includeCategory?: boolean;
  includeDueDate?: boolean;
  includeRecurrence?: boolean;
};

const isPresentLabel = (value: string | null): value is string => {
  return Boolean(value);
};

export const buildTaskMetadataLabels = (
  task: Task,
  {
    includeCategory = true,
    includeDueDate = true,
    includeRecurrence = true,
  }: BuildTaskMetadataLabelsOptions = {},
) => {
  const recurrenceLabel =
    includeRecurrence && hasActiveRecurrence(task)
      ? describeRecurrence(task.recurrence)
      : null;

  return [
    includeCategory ? task.category : null,
    includeDueDate ? formatRelativeDueDate(task.dueDate) : null,
    recurrenceLabel,
  ].filter(isPresentLabel);
};
