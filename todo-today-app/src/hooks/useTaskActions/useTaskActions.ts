import { useTasksContext } from '@/providers/TasksProvider';
export const useTaskActions = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    setTaskCompleted,
    isSaving,
  } = useTasksContext();
  return {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    setTaskCompleted,
    isSaving,
  };
};
