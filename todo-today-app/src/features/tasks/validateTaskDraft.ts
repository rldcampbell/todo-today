import { normalizeTaskTitle } from '@/features/tasks/normalizeTaskTitle';
import type { TaskDraft } from '@/features/tasks/task-types';
import { parseDayKey } from '@/utils/dates';

export const validateTaskDraft = (draft: TaskDraft) => {
  if (normalizeTaskTitle(draft.title).length === 0) {
    return 'Title is required.';
  }

  const normalizedDueDate = draft.dueDate.trim();

  if (normalizedDueDate.length > 0 && !parseDayKey(normalizedDueDate)) {
    return 'Due date must be a valid date.';
  }

  if (draft.recurrenceEnabled && normalizedDueDate.length === 0) {
    return 'Recurring tasks need a due date.';
  }

  return null;
};
