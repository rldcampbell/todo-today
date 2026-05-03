import type { RecurrenceUnit } from "@/features/tasks/task-types"

export const formatRecurrenceUnitLabel = (
  unit: RecurrenceUnit,
  interval: number,
) => {
  if (interval === 1) {
    return unit
  }

  return `${unit}s`
}
