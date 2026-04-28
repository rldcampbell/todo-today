import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import { getNextTodayOrder } from '@/features/tasks/getNextTodayOrder';
import { normalizeTaskTitle } from '@/features/tasks/normalizeTaskTitle';
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

const buildRecurrenceValues = (draft: TaskDraft, existingTask?: Task) => {
  if (draft.recurrenceEnabled) {
    return {
      recurrenceInterval: draft.recurrenceInterval,
      recurrenceUnit: draft.recurrenceUnit,
      recurrenceEnabled: true,
    };
  }

  if (existingTask?.recurrence) {
    return {
      recurrenceInterval: existingTask.recurrence.interval,
      recurrenceUnit: existingTask.recurrence.unit,
      recurrenceEnabled: false,
    };
  }

  return {
    recurrenceInterval: null,
    recurrenceUnit: null,
    recurrenceEnabled: false,
  };
};

export const buildTaskRecordValues = ({
  taskId,
  draft,
  tasks,
  nowIso,
  dayKey,
  existingTask,
}: BuildTaskRecordValuesParams): TaskRecordValues => {
  const recurrenceValues = buildRecurrenceValues(draft, existingTask);
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
    title: normalizeTaskTitle(draft.title),
    description: normalizeOptionalText(draft.description),
    category: normalizeOptionalText(draft.category),
    dueDate: normalizeOptionalText(draft.dueDate),
    recurrenceInterval: recurrenceValues.recurrenceInterval,
    recurrenceUnit: recurrenceValues.recurrenceUnit,
    recurrenceEnabled: recurrenceValues.recurrenceEnabled,
    createdAt: existingTask?.createdAt ?? nowIso,
    updatedAt: nowIso,
    completedAt: draft.completed ? (existingTask?.completedAt ?? nowIso) : null,
    selectedForDay,
    todayOrder,
  };
};
