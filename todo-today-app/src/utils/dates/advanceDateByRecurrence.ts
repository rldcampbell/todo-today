import type { RecurrenceRule } from "@/features/tasks/task-types"
import { getLocalDayKey } from "@/utils/dates/getLocalDayKey"
import { parseDayKey } from "@/utils/dates/parseDayKey"

export const advanceDateByRecurrence = (
  dayKey: string,
  recurrence: RecurrenceRule,
) => {
  const date = parseDayKey(dayKey)

  if (!date) {
    return dayKey
  }

  switch (recurrence.unit) {
    case "day":
      date.setDate(date.getDate() + recurrence.interval)
      break
    case "week":
      date.setDate(date.getDate() + recurrence.interval * 7)
      break
    case "month":
      date.setMonth(date.getMonth() + recurrence.interval)
      break
    case "year":
      date.setFullYear(date.getFullYear() + recurrence.interval)
      break
  }

  return getLocalDayKey(date)
}
