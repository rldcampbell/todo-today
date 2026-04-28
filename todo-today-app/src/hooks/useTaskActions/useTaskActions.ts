import { useTasksContext } from '@/providers/TasksProvider';
export const useTaskActions = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    setTaskCompleted,
    moveTodayTask,
    isSaving,
  } = useTasksContext();
  return {
    createTask,
    updateTask,
    deleteTask,
    setTaskSelectedForToday,
    setTaskCompleted,
    moveTodayTask,
    isSaving,
  };
};
