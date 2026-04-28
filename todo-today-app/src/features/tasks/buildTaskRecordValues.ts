import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import { getNextTodayOrder } from '@/features/tasks/getNextTodayOrder';
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
const normalizeOptionalText = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};
export const buildTaskRecordValues = ({
  taskId,
  draft,
  tasks,
  nowIso,
  dayKey,
  existingTask,
}: BuildTaskRecordValuesParams): TaskRecordValues => {
  let selectedForDay: string | null = null;
  let todayOrder: number | null = null;
  const selectionBlockedByArchive = Boolean(
    existingTask && isTaskArchived(existingTask, dayKey),
  );
  if (draft.selectedForToday && !selectionBlockedByArchive) {
    selectedForDay = dayKey;
    if (
      existingTask?.selectedForDay === dayKey &&
      existingTask.todayOrder !== null
    ) {
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
    recurrenceInterval: draft.recurrenceEnabled
      ? draft.recurrenceInterval
      : null,
    recurrenceUnit: draft.recurrenceEnabled ? draft.recurrenceUnit : null,
    createdAt: existingTask?.createdAt ?? nowIso,
    updatedAt: nowIso,
    completedAt: draft.completed ? (existingTask?.completedAt ?? nowIso) : null,
    selectedForDay,
    todayOrder,
  };
};
