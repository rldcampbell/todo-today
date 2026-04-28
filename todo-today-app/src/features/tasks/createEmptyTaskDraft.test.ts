import { createEmptyTaskDraft } from '@/features/tasks/createEmptyTaskDraft';
describe('createEmptyTaskDraft', () => {
  it('defaults to selected for today when created from today', () => {
    const draft = createEmptyTaskDraft('today');
    expect(draft.selectedForToday).toBe(true);
    expect(draft.recurrenceInterval).toBe(1);
    expect(draft.recurrenceUnit).toBe('week');
  });
  it('defaults to not selected for today when created from backlog', () => {
    const draft = createEmptyTaskDraft('backlog');
    expect(draft.selectedForToday).toBe(false);
  });
});
