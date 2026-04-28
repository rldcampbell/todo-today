import { hydrateAppPreferences } from '@/features/app-state/hydrateAppPreferences';

describe('hydrateAppPreferences', () => {
  it('hydrates valid persisted values', () => {
    const preferences = hydrateAppPreferences({
      'today.hideCompleted': 'true',
      'backlog.search': 'tax return',
      'backlog.category': 'Finance',
      'backlog.status': 'archived',
      'backlog.current.sortField': 'updatedAt',
      'backlog.current.sortDirection': 'asc',
      'backlog.archived.sortField': 'dueDate',
      'backlog.archived.sortDirection': 'desc',
    });

    expect(preferences).toEqual({
      todayHideCompleted: true,
      backlogSearch: 'tax return',
      backlogCategory: 'Finance',
      backlogStatus: 'archived',
      currentSortField: 'updatedAt',
      currentSortDirection: 'asc',
      archivedSortField: 'dueDate',
      archivedSortDirection: 'desc',
    });
  });

  it('falls back for invalid enum values and normalizes empty category to null', () => {
    const preferences = hydrateAppPreferences({
      'today.hideCompleted': 'not-a-boolean',
      'backlog.category': '',
      'backlog.status': 'later',
      'backlog.current.sortField': 'priority',
      'backlog.current.sortDirection': 'sideways',
      'backlog.archived.sortField': 'priority',
      'backlog.archived.sortDirection': 'sideways',
    });

    expect(preferences.todayHideCompleted).toBe(false);
    expect(preferences.backlogCategory).toBeNull();
    expect(preferences.backlogStatus).toBe('current');
    expect(preferences.currentSortField).toBe('createdAt');
    expect(preferences.currentSortDirection).toBe('desc');
    expect(preferences.archivedSortField).toBe('completedAt');
    expect(preferences.archivedSortDirection).toBe('desc');
  });
});
