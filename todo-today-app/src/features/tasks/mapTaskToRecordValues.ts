import type { TaskRecordValues } from '@/db/tasks';
import type { Task } from '@/features/tasks/task-types';

export const mapTaskToRecordValues = (task: Task): TaskRecordValues => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate,
    recurrenceInterval: task.recurrence?.interval ?? null,
    recurrenceUnit: task.recurrence?.unit ?? null,
    recurrenceEnabled: task.recurrenceEnabled,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    completedAt: task.completedAt,
    selectedForDay: task.selectedForDay,
    todayOrder: task.todayOrder,
  };
};
