import type { RecurrenceRule } from "@/features/tasks/task-types"
import { formatRecurrenceUnitLabel } from "./formatRecurrenceUnitLabel"

export const describeRecurrence = (rule: RecurrenceRule | null) => {
  if (!rule) {
    return "Does not repeat"
  }

  return `Every ${rule.interval} ${formatRecurrenceUnitLabel(rule.unit, rule.interval)}`
}
