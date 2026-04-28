import type { Task } from '@/features/tasks/task-types';

export function getTaskDescriptionPreview(task: Task) {
  if (!task.description) {
    return null;
  }

  const lines = task.description.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.length > 0) {
      return trimmedLine;
    }
  }

  return null;
}
