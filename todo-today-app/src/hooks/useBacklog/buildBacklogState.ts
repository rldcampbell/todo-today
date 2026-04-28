import {
  filterTasksForBacklog,
  sortBacklogTasks,
} from '@/features/backlog/backlog-selectors';
import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';
import type { Task } from '@/features/tasks/task-types';
type BuildBacklogStateParams = {
  tasks: Task[];
  search: string;
  setSearch: (value: string) => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  status: BacklogStatus;
  setStatus: (value: BacklogStatus) => void;
  currentSortField: CurrentBacklogSortField;
  currentSortDirection: SortDirection;
  archivedSortField: ArchivedBacklogSortField;
  archivedSortDirection: SortDirection;
  clearFilters: () => void;
  isLoading: boolean;
  dayKey: string;
};
export const buildBacklogState = ({
  tasks,
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  currentSortField,
  currentSortDirection,
  archivedSortField,
  archivedSortDirection,
  clearFilters,
  isLoading,
  dayKey,
}: BuildBacklogStateParams) => {
  const sortField = status === 'current' ? currentSortField : archivedSortField;
  const sortDirection =
    status === 'current' ? currentSortDirection : archivedSortDirection;
  const visibleTasks = sortBacklogTasks({
    tasks: filterTasksForBacklog({
      tasks,
      status,
      search,
      category,
      dayKey,
    }),
    sortField,
    sortDirection,
    status,
  });
  return {
    tasks: visibleTasks,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    sortField,
    sortDirection,
    clearFilters,
    isLoading,
  };
};
