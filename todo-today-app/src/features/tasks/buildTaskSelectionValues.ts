import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import { getNextTodayOrder } from '@/features/tasks/getNextTodayOrder';
import { mapTaskToRecordValues } from '@/features/tasks/mapTaskToRecordValues';
import type { TaskRecordValues } from '@/db/tasks';
import type { Task } from '@/features/tasks/task-types';

type BuildTaskSelectionValuesParams = {
  task: Task;
  selectedForToday: boolean;
  tasks: Task[];
  dayKey: string;
  nowIso: string;
};

export const buildTaskSelectionValues = ({
  task,
  selectedForToday,
  tasks,
  dayKey,
  nowIso,
}: BuildTaskSelectionValuesParams): TaskRecordValues => {
  let nextSelectedForDay: string | null = null;
  let nextTodayOrder: number | null = null;

  if (selectedForToday && !isTaskArchived(task, dayKey)) {
    nextSelectedForDay = dayKey;

    if (task.selectedForDay === dayKey && task.todayOrder !== null) {
      nextTodayOrder = task.todayOrder;
    } else {
      nextTodayOrder = getNextTodayOrder(tasks, dayKey);
    }
  }

  return {
    ...mapTaskToRecordValues(task),
    updatedAt: nowIso,
    selectedForDay: nextSelectedForDay,
    todayOrder: nextTodayOrder,
  };
};
