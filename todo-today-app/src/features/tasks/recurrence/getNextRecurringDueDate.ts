import type { RecurrenceRule } from '@/features/tasks/task-types';
import { advanceDateByRecurrence } from '@/utils/dates';

export function getNextRecurringDueDate(currentDueDate: string | null, rule: RecurrenceRule | null) {
  if (!currentDueDate || !rule) {
    return currentDueDate;
  }

  return advanceDateByRecurrence(currentDueDate, rule);
}
