import type { TaskDraft } from '@/features/tasks/task-types';

export function createEmptyTaskDraft(selectedForToday: boolean): TaskDraft {
  return {
    title: '',
    description: '',
    category: '',
    dueDate: '',
    recurrenceEnabled: false,
    recurrenceInterval: 1,
    recurrenceUnit: 'week',
    selectedForToday,
    completed: false,
  };
}
