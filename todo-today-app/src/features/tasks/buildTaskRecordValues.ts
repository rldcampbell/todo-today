import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import type { TaskRecordValues } from '@/db/tasks';
import type { Task, TaskDraft } from '@/features/tasks/task-types';

type BuildTaskRecordValuesParams = {
  taskId: string;
  draft: TaskDraft;
  tasks: Task[];
  nowIso: string;
  dayKey: string;
  existingTask?: Task;
};

function normalizeOptionalText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getNextTodayOrder(tasks: Task[], dayKey: string) {
  let maxOrder = -1;

  for (const task of tasks) {
    if (task.selectedForDay !== dayKey || task.todayOrder === null) {
      continue;
    }

    if (task.todayOrder > maxOrder) {
      maxOrder = task.todayOrder;
    }
  }

  return maxOrder + 1;
}

export function buildTaskRecordValues({
  taskId,
  draft,
  tasks,
  nowIso,
  dayKey,
  existingTask,
}: BuildTaskRecordValuesParams): TaskRecordValues {
  let selectedForDay: string | null = null;
  let todayOrder: number | null = null;
  const selectionBlockedByArchive = Boolean(existingTask && draft.completed && isTaskArchived(existingTask, dayKey));

  if (draft.selectedForToday && !selectionBlockedByArchive) {
    selectedForDay = dayKey;

    if (existingTask?.selectedForDay === dayKey && existingTask.todayOrder !== null) {
      todayOrder = existingTask.todayOrder;
    } else {
      todayOrder = getNextTodayOrder(tasks, dayKey);
    }
  }

  return {
    id: taskId,
    title: draft.title.trim(),
    description: normalizeOptionalText(draft.description),
    category: normalizeOptionalText(draft.category),
    dueDate: normalizeOptionalText(draft.dueDate),
    recurrenceInterval: draft.recurrenceEnabled ? draft.recurrenceInterval : null,
    recurrenceUnit: draft.recurrenceEnabled ? draft.recurrenceUnit : null,
    createdAt: existingTask?.createdAt ?? nowIso,
    updatedAt: nowIso,
    completedAt: draft.completed ? existingTask?.completedAt ?? nowIso : null,
    selectedForDay,
    todayOrder,
  };
}
