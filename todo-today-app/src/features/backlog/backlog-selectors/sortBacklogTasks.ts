import type {
  BacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';
import type { Task } from '@/features/tasks/task-types';
type SortBacklogTasksParams = {
  tasks: Task[];
  sortField: BacklogSortField;
  sortDirection: SortDirection;
  status: 'current' | 'archived';
};
const compareText = (
  leftValue: string | null,
  rightValue: string | null,
  direction: SortDirection,
) => {
  const leftText = (leftValue ?? '').toLowerCase();
  const rightText = (rightValue ?? '').toLowerCase();
  const result = leftText.localeCompare(rightText);
  return direction === 'asc' ? result : -result;
};
const compareDateValue = (
  leftValue: string | null,
  rightValue: string | null,
  direction: SortDirection,
  options: {
    emptyLast?: boolean;
  } = {},
) => {
  if (options.emptyLast) {
    if (!leftValue && !rightValue) {
      return 0;
    }
    if (!leftValue) {
      return 1;
    }
    if (!rightValue) {
      return -1;
    }
  }
  const leftComparable = leftValue ?? '';
  const rightComparable = rightValue ?? '';
  if (leftComparable === rightComparable) {
    return 0;
  }
  if (direction === 'asc') {
    return leftComparable < rightComparable ? -1 : 1;
  }
  return leftComparable > rightComparable ? -1 : 1;
};
const compareByField = (
  leftTask: Task,
  rightTask: Task,
  sortField: BacklogSortField,
  sortDirection: SortDirection,
) => {
  switch (sortField) {
    case 'alphabetical':
      return compareText(leftTask.title, rightTask.title, sortDirection);
    case 'updatedAt':
      return compareDateValue(
        leftTask.updatedAt,
        rightTask.updatedAt,
        sortDirection,
      );
    case 'dueDate':
      return compareDateValue(
        leftTask.dueDate,
        rightTask.dueDate,
        sortDirection,
        { emptyLast: true },
      );
    case 'completedAt':
      return compareDateValue(
        leftTask.completedAt,
        rightTask.completedAt,
        sortDirection,
      );
    case 'createdAt':
    default:
      return compareDateValue(
        leftTask.createdAt,
        rightTask.createdAt,
        sortDirection,
      );
  }
};
export const sortBacklogTasks = ({
  tasks,
  sortField,
  sortDirection,
}: SortBacklogTasksParams) => {
  const nextTasks = [...tasks];
  nextTasks.sort((leftTask, rightTask) => {
    const fieldResult = compareByField(
      leftTask,
      rightTask,
      sortField,
      sortDirection,
    );
    if (fieldResult !== 0) {
      return fieldResult;
    }
    return leftTask.createdAt.localeCompare(rightTask.createdAt);
  });
  return nextTasks;
};
