import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
} from '@/features/backlog/backlog-types';

export function getDefaultSortFieldForStatus(status: BacklogStatus) {
  return status === 'current' ? ('createdAt' satisfies CurrentBacklogSortField) : ('completedAt' satisfies ArchivedBacklogSortField);
}

export function getStatusLabel(status: BacklogStatus) {
  return status === 'current' ? 'Current' : 'Archived';
}
