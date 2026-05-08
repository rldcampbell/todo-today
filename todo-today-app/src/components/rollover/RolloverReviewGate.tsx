import { useSegments } from "expo-router"
import { useCallback, useEffect, useRef } from "react"
import { Alert, AppState } from "react-native"
import { RolloverReviewModal } from "@/components/rollover/RolloverReviewModal"
import { copy } from "@/copy"
import type { RolloverReviewDecisions } from "@/features/tasks/rolloverReview"
import { useTasksContext } from "@/providers/TasksProvider"

const getMillisecondsUntilNextLocalDay = () => {
  const now = new Date()
  const nextDay = new Date(now)
  nextDay.setHours(24, 0, 1, 0)

  return Math.max(1000, nextDay.getTime() - now.getTime())
}

export const RolloverReviewGate = () => {
  const segments = useSegments()
  const {
    completeRolloverReview,
    isSaving,
    pendingRolloverReview,
    refreshTasks,
  } = useTasksContext()
  const isTaskSheetOpen = segments[0] === "task"
  const deferredRefreshRef = useRef(false)

  const requestRefresh = useCallback(() => {
    if (isTaskSheetOpen) {
      deferredRefreshRef.current = true
      return
    }

    void refreshTasks()
  }, [isTaskSheetOpen, refreshTasks])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const scheduleNextRefresh = () => {
      timeoutId = setTimeout(() => {
        requestRefresh()
        scheduleNextRefresh()
      }, getMillisecondsUntilNextLocalDay())
    }

    scheduleNextRefresh()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [requestRefresh])

  useEffect(() => {
    let previousState = AppState.currentState
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasBackgrounded =
        previousState === "background" || previousState === "inactive"
      if (nextState === "active" && wasBackgrounded) {
        requestRefresh()
      }
      previousState = nextState
    })

    return () => {
      subscription.remove()
    }
  }, [requestRefresh])

  useEffect(() => {
    if (isTaskSheetOpen || !deferredRefreshRef.current) {
      return
    }

    deferredRefreshRef.current = false
    void refreshTasks()
  }, [isTaskSheetOpen, refreshTasks])

  if (!pendingRolloverReview || isTaskSheetOpen) {
    return null
  }

  const handleComplete = async (decisions: RolloverReviewDecisions) => {
    try {
      await completeRolloverReview(decisions)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy("common.fallbackError")
      Alert.alert(copy("rolloverReview.error.title"), message)
    }
  }

  return (
    <RolloverReviewModal
      isSaving={isSaving}
      onComplete={handleComplete}
      review={pendingRolloverReview}
    />
  )
}
