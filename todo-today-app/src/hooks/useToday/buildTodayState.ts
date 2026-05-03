import {
  countIncompleteTasks,
  filterVisibleTodayTasks,
  selectTodayTasks,
} from "@/features/tasks/task-selectors"
import type { Task } from "@/features/tasks/task-types"
type BuildTodayStateParams = {
  allTasks: Task[]
  hideCompleted: boolean
  setHideCompleted: (value: boolean) => void
  isLoading: boolean
  dayKey: string
}
export const buildTodayState = ({
  allTasks,
  hideCompleted,
  setHideCompleted,
  isLoading,
  dayKey,
}: BuildTodayStateParams) => {
  const selectedTasks = selectTodayTasks(allTasks, dayKey)
  const allIncompleteTasks = selectedTasks.filter((task) => !task.completedAt)
  const allCompletedTasks = selectedTasks.filter((task) => {
    return Boolean(task.completedAt)
  })
  const visibleTasks = filterVisibleTodayTasks(selectedTasks, hideCompleted)
  const incompleteTasks = visibleTasks.filter((task) => !task.completedAt)
  const completedTasks = visibleTasks.filter((task) =>
    Boolean(task.completedAt),
  )

  return {
    allTasks: selectedTasks,
    allIncompleteTasks,
    allCompletedTasks,
    incompleteTasks,
    completedTasks,
    hideCompleted,
    setHideCompleted,
    incompleteCount: countIncompleteTasks(selectedTasks),
    isLoading,
  }
}
