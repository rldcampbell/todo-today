import { useTasksContext } from '@/providers/TasksProvider';
export const useTaskActions = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    deleteCategory,
    setTaskSelectedForToday,
    setTaskCompleted,
    reorderTodayTasks,
    isSaving,
  } = useTasksContext();
  return {
    createTask,
    updateTask,
    deleteTask,
    deleteCategory,
    setTaskSelectedForToday,
    setTaskCompleted,
    reorderTodayTasks,
    isSaving,
  };
};
