import type { Task } from "@/features/tasks/task-types"
export interface TodayViewState {
  tasks: Task[]
  incompleteCount: number
  hideCompleted: boolean
}
