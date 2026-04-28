import { createEmptyTaskDraft } from '@/features/tasks/createEmptyTaskDraft';
describe('createEmptyTaskDraft', () => {
  it('defaults to selected for today when created from today', () => {
    const draft = createEmptyTaskDraft({ source: 'today' });
    expect(draft.selectedForToday).toBe(true);
    expect(draft.recurrenceInterval).toBe(1);
    expect(draft.recurrenceUnit).toBe('week');
  });
  it('defaults to not selected for today when created from backlog', () => {
    const draft = createEmptyTaskDraft({ source: 'backlog' });
    expect(draft.selectedForToday).toBe(false);
  });
  it('preselects a category when one is provided', () => {
    const draft = createEmptyTaskDraft({
      source: 'backlog',
      category: 'Finance',
    });

    expect(draft.category).toBe('Finance');
  });
});
