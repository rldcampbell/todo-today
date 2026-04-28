import { mapTaskToRecordValues } from '@/features/tasks/mapTaskToRecordValues';
import type { TaskRecordValues } from '@/db/tasks';
import type { Task } from '@/features/tasks/task-types';

type BuildTaskCompletionValuesParams = {
  task: Task;
  completed: boolean;
  nowIso: string;
};

export const buildTaskCompletionValues = ({
  task,
  completed,
  nowIso,
}: BuildTaskCompletionValuesParams): TaskRecordValues => {
  return {
    ...mapTaskToRecordValues(task),
    updatedAt: nowIso,
    completedAt: completed ? (task.completedAt ?? nowIso) : null,
  };
};
