import { copy } from "@/copy"
import { getLocalDayKey } from "@/utils/dates/getLocalDayKey"
import { parseDayKey } from "@/utils/dates/parseDayKey"

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export const formatRelativeDueDate = (
  dayKey: string | null,
  now = new Date(),
) => {
  if (!dayKey) {
    return null
  }

  const today = getLocalDayKey(now)

  if (dayKey === today) {
    return copy("dates.today")
  }

  const tomorrowDate = new Date(now)
  tomorrowDate.setDate(now.getDate() + 1)
  const tomorrow = getLocalDayKey(tomorrowDate)

  if (dayKey === tomorrow) {
    return copy("dates.tomorrow")
  }

  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(now.getDate() - 1)
  const yesterday = getLocalDayKey(yesterdayDate)

  if (dayKey === yesterday) {
    return copy("dates.yesterday")
  }

  const parsedDate = parseDayKey(dayKey)

  if (!parsedDate) {
    return dayKey
  }

  return dateFormatter.format(parsedDate)
}
