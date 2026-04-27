import type { Task } from '@/features/tasks/task-types';

export function useTasks() {
  return {
    tasks: [] as Task[],
    isLoading: false,
  };
}
