export type BacklogStatus = 'current' | 'archived';
export type SortDirection = 'asc' | 'desc';
export type CurrentBacklogSortField = 'createdAt' | 'updatedAt' | 'alphabetical' | 'dueDate';
export type ArchivedBacklogSortField =
  | 'completedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'alphabetical'
  | 'dueDate';

export interface BacklogSortConfig<TField extends string> {
  field: TField;
  direction: SortDirection;
}
