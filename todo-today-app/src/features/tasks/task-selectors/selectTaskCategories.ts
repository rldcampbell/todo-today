import type { Task } from "@/features/tasks/task-types"

export const selectTaskCategories = (tasks: Task[]) => {
  const categorySet = new Set<string>()

  for (const task of tasks) {
    if (task.category) {
      categorySet.add(task.category)
    }
  }

  return [...categorySet].sort((leftCategory, rightCategory) => {
    return leftCategory.localeCompare(rightCategory)
  })
}
