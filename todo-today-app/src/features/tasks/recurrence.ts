import type { RecurrenceRule } from '@/features/tasks/task-types';
import { advanceDateByRecurrence } from '@/utils/dates';

export function describeRecurrence(rule: RecurrenceRule | null) {
  if (!rule) {
    return 'Does not repeat';
  }

  const unit = rule.interval === 1 ? rule.unit : `${rule.unit}s`;
  return `Every ${rule.interval} ${unit}`;
}

export function getNextRecurringDueDate(currentDueDate: string | null, rule: RecurrenceRule | null) {
  if (!currentDueDate || !rule) {
    return currentDueDate;
  }

  return advanceDateByRecurrence(currentDueDate, rule);
}
