import { copy, type CopyKey } from "@/copy"
import type { RecurrenceUnit } from "@/features/tasks/task-types"

const recurrenceUnitLabelKeys: Record<
  RecurrenceUnit,
  {
    singular: CopyKey
    plural: CopyKey
  }
> = {
  day: {
    singular: "task.recurrence.units.day.singular",
    plural: "task.recurrence.units.day.plural",
  },
  week: {
    singular: "task.recurrence.units.week.singular",
    plural: "task.recurrence.units.week.plural",
  },
  month: {
    singular: "task.recurrence.units.month.singular",
    plural: "task.recurrence.units.month.plural",
  },
  year: {
    singular: "task.recurrence.units.year.singular",
    plural: "task.recurrence.units.year.plural",
  },
}

export const formatRecurrenceUnitLabel = (
  unit: RecurrenceUnit,
  interval: number,
) => {
  const labelKeys = recurrenceUnitLabelKeys[unit]
  return copy(interval === 1 ? labelKeys.singular : labelKeys.plural)
}
