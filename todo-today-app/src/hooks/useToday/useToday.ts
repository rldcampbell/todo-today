import { useMemo } from "react"
import { useAppContext } from "@/providers/AppProvider"
import { useTasks } from "@/hooks/useTasks"
import { buildTodayState } from "@/hooks/useToday/buildTodayState"
import { getLocalDayKey } from "@/utils/dates"
export const useToday = () => {
  const { todayHideCompleted, setTodayHideCompleted } = useAppContext()
  const { tasks: allTasks, isLoading } = useTasks()
  const dayKey = getLocalDayKey()
  return useMemo(
    () =>
      buildTodayState({
        allTasks,
        hideCompleted: todayHideCompleted,
        setHideCompleted: setTodayHideCompleted,
        isLoading,
        dayKey,
      }),
    [allTasks, todayHideCompleted, setTodayHideCompleted, isLoading, dayKey],
  )
}
