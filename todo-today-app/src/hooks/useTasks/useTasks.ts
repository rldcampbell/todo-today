import { useTasksContext } from '@/providers/TasksProvider';
export const useTasks = () => {
  const { tasks, isLoading, refreshTasks } = useTasksContext();
  return {
    tasks,
    isLoading,
    refreshTasks,
  };
};
