import { clampTaskTitle } from "@/features/tasks/clampTaskTitle"

export const normalizeTaskTitle = (value: string) => {
  return clampTaskTitle(value.trim())
}
