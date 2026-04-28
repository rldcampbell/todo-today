import type { BacklogStatus } from '@/features/backlog/backlog-types';
export const getStatusLabel = (status: BacklogStatus) => {
  return status === 'current' ? 'Current' : 'Archived';
};
