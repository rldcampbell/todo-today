import { useSQLiteContext } from "expo-sqlite"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"
import {
  clearTaskCategory,
  createTask,
  deleteTask,
  loadTasks,
  normalizeTodayOrdersForDay,
  updateTask,
  updateTodayOrders,
} from "@/db/tasks"
import { buildTodayOrderUpdates } from "@/features/tasks/buildTodayOrderUpdates"
import { buildTaskCompletionValues } from "@/features/tasks/buildTaskCompletionValues"
import { buildTaskRecordValues } from "@/features/tasks/buildTaskRecordValues"
import { buildTaskSelectionValues } from "@/features/tasks/buildTaskSelectionValues"
import {
  completePendingRolloverReview,
  runDayRollover,
} from "@/features/tasks/rollover"
import type {
  PendingRolloverReview,
  RolloverReviewDecisions,
} from "@/features/tasks/rolloverReview"
import type { Task, TaskDraft } from "@/features/tasks/task-types"
import { createSerialAsyncExecutor } from "@/utils/async/createSerialAsyncExecutor"
import { getLocalDayKey } from "@/utils/dates"
import { createId } from "@/utils/ids"
type TasksContextValue = {
  tasks: Task[]
  pendingRolloverReview: PendingRolloverReview | null
  isLoading: boolean
  isSaving: boolean
  refreshTasks: () => Promise<void>
  completeRolloverReview: (decisions: RolloverReviewDecisions) => Promise<void>
  createTask: (draft: TaskDraft) => Promise<string>
  updateTask: (taskId: string, draft: TaskDraft) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  deleteCategory: (category: string) => Promise<void>
  setTaskSelectedForToday: (
    taskId: string,
    selectedForToday: boolean,
  ) => Promise<void>
  setTaskCompleted: (taskId: string, completed: boolean) => Promise<void>
  reorderTodayTasks: (orderedTaskIds: string[]) => Promise<void>
}
const TasksContext = createContext<TasksContextValue | null>(null)
export const TasksProvider = ({ children }: PropsWithChildren) => {
  const db = useSQLiteContext()
  const [tasks, setTasks] = useState<Task[]>([])
  const [pendingRolloverReview, setPendingRolloverReview] =
    useState<PendingRolloverReview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const taskLoadRequestIdRef = useRef(0)
  const pendingMutationCountRef = useRef(0)
  const serialMutationRef = useRef(createSerialAsyncExecutor())
  const tasksRef = useRef<Task[]>([])
  const pendingRolloverReviewRef = useRef<PendingRolloverReview | null>(null)
  const hydrateTasks = useCallback(async () => {
    const rolloverResult = await runDayRollover(db)
    const nextTasks = await loadTasks(db)

    return {
      pendingReview:
        rolloverResult.status === "pendingReview"
          ? rolloverResult.review
          : null,
      tasks: nextTasks,
    }
  }, [db])
  const loadTasksIntoState = useCallback(
    async (showLoading: boolean) => {
      const requestId = taskLoadRequestIdRef.current + 1
      taskLoadRequestIdRef.current = requestId
      if (showLoading) {
        setIsLoading(true)
      }
      try {
        const hydrationResult = await hydrateTasks()
        if (requestId !== taskLoadRequestIdRef.current) {
          return
        }
        pendingRolloverReviewRef.current = hydrationResult.pendingReview
        setPendingRolloverReview(hydrationResult.pendingReview)
        tasksRef.current = hydrationResult.tasks
        setTasks(hydrationResult.tasks)
      } finally {
        if (requestId === taskLoadRequestIdRef.current) {
          setIsLoading(false)
        }
      }
    },
    [hydrateTasks],
  )
  const refreshTasks = useCallback(async () => {
    await loadTasksIntoState(true)
  }, [loadTasksIntoState])
  useEffect(() => {
    void refreshTasks()
  }, [refreshTasks])
  const syncTasksAfterMutation = useCallback(async () => {
    await normalizeTodayOrdersForDay(db, getLocalDayKey())
    await loadTasksIntoState(false)
  }, [db, loadTasksIntoState])

  const runSavingMutation = useCallback(
    async <TValue,>(work: () => Promise<TValue>) => {
      pendingMutationCountRef.current += 1
      setIsSaving(true)

      try {
        return await serialMutationRef.current(async () => {
          const result = await work()
          await syncTasksAfterMutation()
          return result
        })
      } finally {
        pendingMutationCountRef.current -= 1

        if (pendingMutationCountRef.current === 0) {
          setIsSaving(false)
        }
      }
    },
    [syncTasksAfterMutation],
  )

  const getTaskOrThrow = (taskList: Task[], taskId: string) => {
    const existingTask = taskList.find((task) => task.id === taskId)

    if (!existingTask) {
      throw new Error(`Task not found: ${taskId}`)
    }

    return existingTask
  }

  const createTaskAction = useCallback(
    async (draft: TaskDraft) => {
      const taskId = createId()
      return runSavingMutation(async () => {
        const nowIso = new Date().toISOString()
        const dayKey = getLocalDayKey()
        const values = buildTaskRecordValues({
          taskId,
          draft,
          tasks: tasksRef.current,
          nowIso,
          dayKey,
        })

        await createTask(db, values)
        return taskId
      })
    },
    [db, runSavingMutation],
  )
  const updateTaskAction = useCallback(
    async (taskId: string, draft: TaskDraft) => {
      await runSavingMutation(async () => {
        const taskList = tasksRef.current
        const existingTask = getTaskOrThrow(taskList, taskId)
        const nowIso = new Date().toISOString()
        const dayKey = getLocalDayKey()
        const values = buildTaskRecordValues({
          taskId,
          draft,
          tasks: taskList,
          nowIso,
          dayKey,
          existingTask,
        })

        await updateTask(db, values)
      })
    },
    [db, runSavingMutation],
  )
  const deleteTaskAction = useCallback(
    async (taskId: string) => {
      await runSavingMutation(async () => {
        await deleteTask(db, taskId)
      })
    },
    [db, runSavingMutation],
  )
  const deleteCategoryAction = useCallback(
    async (category: string) => {
      const normalizedCategory = category.trim()

      if (!normalizedCategory) {
        return
      }

      await runSavingMutation(async () => {
        await clearTaskCategory(
          db,
          normalizedCategory,
          new Date().toISOString(),
        )
      })
    },
    [db, runSavingMutation],
  )
  const completeRolloverReviewAction = useCallback(
    async (decisions: RolloverReviewDecisions) => {
      await runSavingMutation(async () => {
        const review = pendingRolloverReviewRef.current

        if (!review) {
          return
        }

        await completePendingRolloverReview(db, {
          currentDayKey: getLocalDayKey(),
          decisions,
          reviewDayKey: review.dayKey,
        })
      })
    },
    [db, runSavingMutation],
  )
  const setTaskSelectedForToday = useCallback(
    async (taskId: string, selectedForToday: boolean) => {
      await runSavingMutation(async () => {
        const taskList = tasksRef.current
        const existingTask = getTaskOrThrow(taskList, taskId)
        const dayKey = getLocalDayKey()
        const values = buildTaskSelectionValues({
          task: existingTask,
          selectedForToday,
          tasks: taskList,
          dayKey,
          nowIso: new Date().toISOString(),
        })

        await updateTask(db, values)
      })
    },
    [db, runSavingMutation],
  )
  const setTaskCompleted = useCallback(
    async (taskId: string, completed: boolean) => {
      await runSavingMutation(async () => {
        const existingTask = getTaskOrThrow(tasksRef.current, taskId)
        const values = buildTaskCompletionValues({
          task: existingTask,
          completed,
          nowIso: new Date().toISOString(),
        })

        await updateTask(db, values)
      })
    },
    [db, runSavingMutation],
  )
  const reorderTodayTasks = useCallback(
    async (orderedTaskIds: string[]) => {
      await runSavingMutation(async () => {
        const selectedTasks = tasksRef.current.filter((task) => {
          return task.selectedForDay === getLocalDayKey()
        })
        const selectedTaskIds = new Set(
          selectedTasks.map((task) => {
            return task.id
          }),
        )
        const normalizedTaskIds = orderedTaskIds.filter((taskId) => {
          return selectedTaskIds.has(taskId)
        })

        if (normalizedTaskIds.length !== selectedTasks.length) {
          throw new Error("Could not reorder Today tasks.")
        }

        const updates = buildTodayOrderUpdates(normalizedTaskIds)
        await updateTodayOrders(db, updates)
      })
    },
    [db, runSavingMutation],
  )
  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      pendingRolloverReview,
      isLoading,
      isSaving,
      refreshTasks,
      completeRolloverReview: completeRolloverReviewAction,
      createTask: createTaskAction,
      updateTask: updateTaskAction,
      deleteTask: deleteTaskAction,
      deleteCategory: deleteCategoryAction,
      setTaskSelectedForToday,
      setTaskCompleted,
      reorderTodayTasks,
    }),
    [
      tasks,
      pendingRolloverReview,
      isLoading,
      isSaving,
      refreshTasks,
      completeRolloverReviewAction,
      createTaskAction,
      updateTaskAction,
      deleteTaskAction,
      deleteCategoryAction,
      setTaskSelectedForToday,
      setTaskCompleted,
      reorderTodayTasks,
    ],
  )
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
export const useTasksContext = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasksContext must be used within TasksProvider")
  }
  return context
}
