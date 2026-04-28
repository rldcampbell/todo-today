import { useTasksContext } from '@/providers/TasksProvider';
export const useTaskActions = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    isSaving,
  } = useTasksContext();
  return {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    isSaving,
  };
};
