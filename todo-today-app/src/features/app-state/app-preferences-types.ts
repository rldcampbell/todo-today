import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';

export interface AppPreferences {
  todayHideCompleted: boolean;
  backlogSearch: string;
  backlogCategory: string | null;
  backlogStatus: BacklogStatus;
  currentSortField: CurrentBacklogSortField;
  currentSortDirection: SortDirection;
  archivedSortField: ArchivedBacklogSortField;
  archivedSortDirection: SortDirection;
}

export const appStateKeys = {
  todayHideCompleted: 'today.hideCompleted',
  backlogSearch: 'backlog.search',
  backlogCategory: 'backlog.category',
  backlogStatus: 'backlog.status',
  currentSortField: 'backlog.current.sortField',
  currentSortDirection: 'backlog.current.sortDirection',
  archivedSortField: 'backlog.archived.sortField',
  archivedSortDirection: 'backlog.archived.sortDirection',
} as const;

export type AppStateKey = (typeof appStateKeys)[keyof typeof appStateKeys];
