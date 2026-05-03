import type { Task } from "@/features/tasks/task-types"

export const getNextTodayOrder = (tasks: Task[], dayKey: string) => {
  let maxOrder = -1

  for (const task of tasks) {
    if (task.selectedForDay !== dayKey || task.todayOrder === null) {
      continue
    }

    if (task.todayOrder > maxOrder) {
      maxOrder = task.todayOrder
    }
  }

  return maxOrder + 1
}
