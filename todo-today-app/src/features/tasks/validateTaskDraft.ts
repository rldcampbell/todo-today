import type { TaskDraft } from '@/features/tasks/task-types';
export const validateTaskDraft = (draft: TaskDraft) => {
  if (draft.title.trim().length === 0) {
    return 'Title is required.';
  }
  if (draft.recurrenceEnabled && draft.dueDate.trim().length === 0) {
    return 'Recurring tasks need a due date.';
  }
  return null;
};
