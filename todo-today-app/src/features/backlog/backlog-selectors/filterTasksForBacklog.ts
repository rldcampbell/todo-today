import type { BacklogStatus } from '@/features/backlog/backlog-types';
import { hasActiveRecurrence } from '@/features/tasks/hasActiveRecurrence';
import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import type { Task } from '@/features/tasks/task-types';
type FilterTasksForBacklogParams = {
  tasks: Task[];
  status: BacklogStatus;
  search: string;
  category: string | null;
  dayKey: string;
};
const matchesStatus = (task: Task, status: BacklogStatus, dayKey: string) => {
  if (!task.completedAt) {
    return status === 'current';
  }
  if (hasActiveRecurrence(task)) {
    return status === 'current';
  }
  const isArchivedTask = isTaskArchived(task, dayKey);
  if (status === 'archived') {
    return isArchivedTask;
  }
  return !isArchivedTask;
};
const matchesSearch = (task: Task, search: string) => {
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch.length === 0) {
    return true;
  }
  const titleText = task.title.toLowerCase();
  const descriptionText = (task.description ?? '').toLowerCase();
  return (
    titleText.includes(normalizedSearch) ||
    descriptionText.includes(normalizedSearch)
  );
};
const matchesCategory = (task: Task, category: string | null) => {
  if (!category) {
    return true;
  }
  return task.category === category;
};
export const filterTasksForBacklog = ({
  tasks,
  status,
  search,
  category,
  dayKey,
}: FilterTasksForBacklogParams) => {
  return tasks.filter((task) => {
    return (
      matchesStatus(task, status, dayKey) &&
      matchesSearch(task, search) &&
      matchesCategory(task, category)
    );
  });
};
