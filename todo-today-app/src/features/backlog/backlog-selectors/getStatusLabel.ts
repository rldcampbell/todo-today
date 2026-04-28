import type { BacklogStatus } from '@/features/backlog/backlog-types';

export function getStatusLabel(status: BacklogStatus) {
  return status === 'current' ? 'Current' : 'Archived';
}
