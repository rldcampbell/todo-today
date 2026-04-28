import type { TaskDraft } from '@/features/tasks/task-types';

export type TaskCreateSource = 'today' | 'backlog';

export function createEmptyTaskDraft(source: TaskCreateSource): TaskDraft {
  return {
    title: '',
    description: '',
    category: '',
    dueDate: '',
    recurrenceEnabled: false,
    recurrenceInterval: 1,
    recurrenceUnit: 'week',
    selectedForToday: source === 'today',
    completed: false,
  };
}
