export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';
export interface RecurrenceRule {
  interval: number;
  unit: RecurrenceUnit;
}
export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  dueDate: string | null;
  recurrence: RecurrenceRule | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  selectedForDay: string | null;
  todayOrder: number | null;
}
export interface TaskDraft {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  recurrenceEnabled: boolean;
  recurrenceInterval: number;
  recurrenceUnit: RecurrenceUnit;
  selectedForToday: boolean;
  completed: boolean;
}
