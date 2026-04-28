import { useMemo } from 'react';

import { useTasks } from '@/hooks/useTasks';

export function useTask(taskId?: string) {
  const { tasks, isLoading } = useTasks();

  return useMemo(() => {
    if (!taskId) {
      return {
        task: null,
        isLoading,
      };
    }

    return {
      task: tasks.find((task) => task.id === taskId) ?? null,
      isLoading,
    };
  }, [tasks, taskId, isLoading]);
}
