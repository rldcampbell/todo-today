import type { Task } from "@/features/tasks/task-types"
export const selectTodayTasks = (tasks: Task[], dayKey: string) => {
  const todayTasks = tasks.filter((task) => task.selectedForDay === dayKey)
  return [...todayTasks].sort((leftTask, rightTask) => {
    const leftCompletedOrder = leftTask.completedAt ? 1 : 0
    const rightCompletedOrder = rightTask.completedAt ? 1 : 0
    if (leftCompletedOrder !== rightCompletedOrder) {
      return leftCompletedOrder - rightCompletedOrder
    }
    const leftTodayOrder = leftTask.todayOrder ?? Number.MAX_SAFE_INTEGER
    const rightTodayOrder = rightTask.todayOrder ?? Number.MAX_SAFE_INTEGER
    if (leftTodayOrder !== rightTodayOrder) {
      return leftTodayOrder - rightTodayOrder
    }
    return leftTask.createdAt.localeCompare(rightTask.createdAt)
  })
}
