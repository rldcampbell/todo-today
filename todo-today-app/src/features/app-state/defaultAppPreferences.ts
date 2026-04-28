import type { AppPreferences } from '@/features/app-state/app-preferences-types';

export const defaultAppPreferences: AppPreferences = {
  todayHideCompleted: false,
  backlogSearch: '',
  backlogCategory: null,
  backlogStatus: 'current',
  currentSortField: 'createdAt',
  currentSortDirection: 'desc',
  archivedSortField: 'completedAt',
  archivedSortDirection: 'desc',
};
