import { useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  createTask,
  deleteTask,
  loadTasks,
  normalizeTodayOrdersForDay,
  updateTask,
} from '@/db/tasks';
import { buildTaskRecordValues } from '@/features/tasks/buildTaskRecordValues';
import { mapTaskToDraft } from '@/features/tasks/mapTaskToDraft';
import { runDayRollover } from '@/features/tasks/rollover';
import type { Task, TaskDraft } from '@/features/tasks/task-types';
import { getLocalDayKey } from '@/utils/dates';
import { createId } from '@/utils/ids';

type TasksContextValue = {
  tasks: Task[];
  isLoading: boolean;
  isSaving: boolean;
  refreshTasks: () => Promise<void>;
  createTask: (draft: TaskDraft) => Promise<string>;
  updateTask: (taskId: string, draft: TaskDraft) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setTaskSelectedForToday: (taskId: string, selectedForToday: boolean) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const hydrateTasks = useCallback(async () => {
    await runDayRollover(db);
    return loadTasks(db);
  }, [db]);

  const refreshTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextTasks = await hydrateTasks();
      setTasks(nextTasks);
    } finally {
      setIsLoading(false);
    }
  }, [hydrateTasks]);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const syncTasksAfterMutation = useCallback(async () => {
    await normalizeTodayOrdersForDay(db, getLocalDayKey());
    const nextTasks = await hydrateTasks();
    setTasks(nextTasks);
  }, [db, hydrateTasks]);

  const runSavingMutation = useCallback(
    <TValue,>(work: () => Promise<TValue>) => {
      setIsSaving(true);

      return work()
        .then(async (result) => {
          await syncTasksAfterMutation();
          return result;
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [syncTasksAfterMutation]
  );

  const createTaskAction = useCallback(
    async (draft: TaskDraft) => {
      const taskId = createId();
      const nowIso = new Date().toISOString();
      const dayKey = getLocalDayKey();
      const values = buildTaskRecordValues({
        taskId,
        draft,
        tasks,
        nowIso,
        dayKey,
      });

      return runSavingMutation(async () => {
        await createTask(db, values);
        return taskId;
      });
    },
    [db, runSavingMutation, tasks]
  );

  const updateTaskAction = useCallback(
    async (taskId: string, draft: TaskDraft) => {
      const existingTask = tasks.find((task) => task.id === taskId);

      if (!existingTask) {
        throw new Error(`Task not found: ${taskId}`);
      }

      const nowIso = new Date().toISOString();
      const dayKey = getLocalDayKey();
      const values = buildTaskRecordValues({
        taskId,
        draft,
        tasks,
        nowIso,
        dayKey,
        existingTask,
      });

      await runSavingMutation(async () => {
        await updateTask(db, values);
      });
    },
    [db, runSavingMutation, tasks]
  );

  const deleteTaskAction = useCallback(
    async (taskId: string) => {
      await runSavingMutation(async () => {
        await deleteTask(db, taskId);
      });
    },
    [db, runSavingMutation]
  );

  const setTaskSelectedForToday = useCallback(
    async (taskId: string, selectedForToday: boolean) => {
      const existingTask = tasks.find((task) => task.id === taskId);

      if (!existingTask) {
        throw new Error(`Task not found: ${taskId}`);
      }

      const dayKey = getLocalDayKey();
      const nextDraft = {
        ...mapTaskToDraft(existingTask, dayKey),
        selectedForToday,
      };

      await updateTaskAction(taskId, nextDraft);
    },
    [tasks, updateTaskAction]
  );

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading,
      isSaving,
      refreshTasks,
      createTask: createTaskAction,
      updateTask: updateTaskAction,
      deleteTask: deleteTaskAction,
      setTaskSelectedForToday,
    }),
    [
      tasks,
      isLoading,
      isSaving,
      refreshTasks,
      createTaskAction,
      updateTaskAction,
      deleteTaskAction,
      setTaskSelectedForToday,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasksContext must be used within TasksProvider');
  }

  return context;
}
