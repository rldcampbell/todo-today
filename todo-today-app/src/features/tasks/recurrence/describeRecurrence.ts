import { copy } from "@/copy"
import type { RecurrenceRule } from "@/features/tasks/task-types"
import { formatRecurrenceUnitLabel } from "./formatRecurrenceUnitLabel"

export const describeRecurrence = (rule: RecurrenceRule | null) => {
  if (!rule) {
    return copy("task.recurrence.none")
  }

  return `${copy("task.recurrence.every")} ${rule.interval} ${formatRecurrenceUnitLabel(rule.unit, rule.interval)}`
}
