import type { RecurrenceUnit } from '@/features/tasks/task-types';

export interface TaskRecordValues {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  dueDate: string | null;
  recurrenceInterval: number | null;
  recurrenceUnit: RecurrenceUnit | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  selectedForDay: string | null;
  todayOrder: number | null;
}
