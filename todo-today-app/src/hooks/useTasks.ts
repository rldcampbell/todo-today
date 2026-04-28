import { scaffoldTasks } from '@/features/tasks/scaffold-data';

export function useTasks() {
  return {
    tasks: scaffoldTasks,
    isLoading: false,
  };
}
