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
};

export function buildBacklogState({
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
}: BuildBacklogStateParams) {
  const sortField = status === 'current' ? currentSortField : archivedSortField;
  const sortDirection = status === 'current' ? currentSortDirection : archivedSortDirection;

  return {
    tasks,
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
}
