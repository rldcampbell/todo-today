import { useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { AppState } from 'react-native';
import {
  createTask,
  deleteTask,
  loadTasks,
  normalizeTodayOrdersForDay,
  updateTask,
  updateTodayOrders,
} from '@/db/tasks';
import { buildTodayOrderUpdates } from '@/features/tasks/buildTodayOrderUpdates';
import { buildTaskCompletionValues } from '@/features/tasks/buildTaskCompletionValues';
import { buildTaskRecordValues } from '@/features/tasks/buildTaskRecordValues';
import { buildTaskSelectionValues } from '@/features/tasks/buildTaskSelectionValues';
import { runDayRollover } from '@/features/tasks/rollover';
import type { Task, TaskDraft } from '@/features/tasks/task-types';
import { createSerialAsyncExecutor } from '@/utils/async/createSerialAsyncExecutor';
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
  setTaskSelectedForToday: (
    taskId: string,
    selectedForToday: boolean,
  ) => Promise<void>;
  setTaskCompleted: (taskId: string, completed: boolean) => Promise<void>;
  reorderTodayTasks: (orderedTaskIds: string[]) => Promise<void>;
};
const TasksContext = createContext<TasksContextValue | null>(null);
export const TasksProvider = ({ children }: PropsWithChildren) => {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const taskLoadRequestIdRef = useRef(0);
  const pendingMutationCountRef = useRef(0);
  const serialMutationRef = useRef(createSerialAsyncExecutor());
  const tasksRef = useRef<Task[]>([]);
  const hydrateTasks = useCallback(async () => {
    await runDayRollover(db);
    return loadTasks(db);
  }, [db]);
  const loadTasksIntoState = useCallback(
    async (showLoading: boolean) => {
      const requestId = taskLoadRequestIdRef.current + 1;
      taskLoadRequestIdRef.current = requestId;
      if (showLoading) {
        setIsLoading(true);
      }
      try {
        const nextTasks = await hydrateTasks();
        if (requestId !== taskLoadRequestIdRef.current) {
          return;
        }
        tasksRef.current = nextTasks;
        setTasks(nextTasks);
      } finally {
        if (requestId === taskLoadRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [hydrateTasks],
  );
  const refreshTasks = useCallback(async () => {
    await loadTasksIntoState(true);
  }, [loadTasksIntoState]);
  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);
  useEffect(() => {
    let previousState = AppState.currentState;
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackgrounded =
        previousState === 'background' || previousState === 'inactive';
      if (nextState === 'active' && wasBackgrounded) {
        void refreshTasks();
      }
      previousState = nextState;
    });
    return () => {
      subscription.remove();
    };
  }, [refreshTasks]);
  const syncTasksAfterMutation = useCallback(async () => {
    await normalizeTodayOrdersForDay(db, getLocalDayKey());
    await loadTasksIntoState(false);
  }, [db, loadTasksIntoState]);

  const runSavingMutation = useCallback(
    async <TValue,>(work: () => Promise<TValue>) => {
      pendingMutationCountRef.current += 1;
      setIsSaving(true);

      try {
        return await serialMutationRef.current(async () => {
          const result = await work();
          await syncTasksAfterMutation();
          return result;
        });
      } finally {
        pendingMutationCountRef.current -= 1;

        if (pendingMutationCountRef.current === 0) {
          setIsSaving(false);
        }
      }
    },
    [syncTasksAfterMutation],
  );

  const getTaskOrThrow = (taskList: Task[], taskId: string) => {
    const existingTask = taskList.find((task) => task.id === taskId);

    if (!existingTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    return existingTask;
  };

  const createTaskAction = useCallback(
    async (draft: TaskDraft) => {
      const taskId = createId();
      return runSavingMutation(async () => {
        const nowIso = new Date().toISOString();
        const dayKey = getLocalDayKey();
        const values = buildTaskRecordValues({
          taskId,
          draft,
          tasks: tasksRef.current,
          nowIso,
          dayKey,
        });

        await createTask(db, values);
        return taskId;
      });
    },
    [db, runSavingMutation],
  );
  const updateTaskAction = useCallback(
    async (taskId: string, draft: TaskDraft) => {
      await runSavingMutation(async () => {
        const taskList = tasksRef.current;
        const existingTask = getTaskOrThrow(taskList, taskId);
        const nowIso = new Date().toISOString();
        const dayKey = getLocalDayKey();
        const values = buildTaskRecordValues({
          taskId,
          draft,
          tasks: taskList,
          nowIso,
          dayKey,
          existingTask,
        });

        await updateTask(db, values);
      });
    },
    [db, runSavingMutation],
  );
  const deleteTaskAction = useCallback(
    async (taskId: string) => {
      await runSavingMutation(async () => {
        await deleteTask(db, taskId);
      });
    },
    [db, runSavingMutation],
  );
  const setTaskSelectedForToday = useCallback(
    async (taskId: string, selectedForToday: boolean) => {
      await runSavingMutation(async () => {
        const taskList = tasksRef.current;
        const existingTask = getTaskOrThrow(taskList, taskId);
        const dayKey = getLocalDayKey();
        const values = buildTaskSelectionValues({
          task: existingTask,
          selectedForToday,
          tasks: taskList,
          dayKey,
          nowIso: new Date().toISOString(),
        });

        await updateTask(db, values);
      });
    },
    [db, runSavingMutation],
  );
  const setTaskCompleted = useCallback(
    async (taskId: string, completed: boolean) => {
      await runSavingMutation(async () => {
        const existingTask = getTaskOrThrow(tasksRef.current, taskId);
        const values = buildTaskCompletionValues({
          task: existingTask,
          completed,
          nowIso: new Date().toISOString(),
        });

        await updateTask(db, values);
      });
    },
    [db, runSavingMutation],
  );
  const reorderTodayTasks = useCallback(
    async (orderedTaskIds: string[]) => {
      await runSavingMutation(async () => {
        const selectedTasks = tasksRef.current.filter((task) => {
          return task.selectedForDay === getLocalDayKey();
        });
        const selectedTaskIds = new Set(
          selectedTasks.map((task) => {
            return task.id;
          }),
        );
        const normalizedTaskIds = orderedTaskIds.filter((taskId) => {
          return selectedTaskIds.has(taskId);
        });

        if (normalizedTaskIds.length !== selectedTasks.length) {
          throw new Error('Could not reorder Today tasks.');
        }

        const updates = buildTodayOrderUpdates(normalizedTaskIds);
        await updateTodayOrders(db, updates);
      });
    },
    [db, runSavingMutation],
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
      setTaskCompleted,
      reorderTodayTasks,
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
      setTaskCompleted,
      reorderTodayTasks,
    ],
  );
  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within TasksProvider');
  }
  return context;
};
