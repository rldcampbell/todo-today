import type { RecurrenceRule } from '@/features/tasks/task-types';
export const describeRecurrence = (rule: RecurrenceRule | null) => {
  if (!rule) {
    return 'Does not repeat';
  }
  const unit = rule.interval === 1 ? rule.unit : `${rule.unit}s`;
  return `Every ${rule.interval} ${unit}`;
};
