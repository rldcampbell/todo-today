import { useTasksContext } from '@/providers/TasksProvider';

export function useTasks() {
  const { tasks, isLoading, refreshTasks } = useTasksContext();

  return {
    tasks,
    isLoading,
    refreshTasks,
  };
}
