import { clampTaskTitle } from '@/features/tasks/clampTaskTitle';
import { MAX_TASK_TITLE_LENGTH } from '@/features/tasks/task-constants';

describe('clampTaskTitle', () => {
  it('truncates titles to the maximum length', () => {
    const longTitle = 'a'.repeat(MAX_TASK_TITLE_LENGTH + 12);

    expect(clampTaskTitle(longTitle)).toBe('a'.repeat(MAX_TASK_TITLE_LENGTH));
  });
});
