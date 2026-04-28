import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
} from '@/features/backlog/backlog-types';

export function getDefaultSortFieldForStatus(status: BacklogStatus) {
  if (status === 'current') {
    return 'createdAt' satisfies CurrentBacklogSortField;
  }

  return 'completedAt' satisfies ArchivedBacklogSortField;
}
