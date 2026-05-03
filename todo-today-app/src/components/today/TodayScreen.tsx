import { useRouter } from "expo-router"
import * as Haptics from "expo-haptics"
import { useRef } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist"
import { AppScreen } from "@/components/common/AppScreen"
import { FloatingAddButton } from "@/components/common/FloatingAddButton"
import { PillButton } from "@/components/common/PillButton"
import { TodayTaskRow } from "@/components/today/TodayTaskRow"
import { TodaySwipeableRow } from "@/components/today/TodaySwipeableRow"
import type { Task } from "@/features/tasks/task-types"
import { useTaskActions } from "@/hooks/useTaskActions"
import { useToday } from "@/hooks/useToday"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
export const TodayScreen = () => {
  const router = useRouter()
  const { reorderTodayTasks, setTaskCompleted, setTaskSelectedForToday } =
    useTaskActions()
  const {
    allTasks,
    allCompletedTasks,
    allIncompleteTasks,
    completedTasks,
    hideCompleted,
    incompleteTasks,
    setHideCompleted,
    isLoading,
  } = useToday()
  const incompletePlaceholderIndexRef = useRef<number | null>(null)
  const completedPlaceholderIndexRef = useRef<number | null>(null)

  const triggerHaptic = () => {
    void Haptics.selectionAsync()
  }

  const handleDragBegin = (
    section: "incomplete" | "completed",
    index: number,
  ) => {
    if (section === "incomplete") {
      incompletePlaceholderIndexRef.current = index
    } else {
      completedPlaceholderIndexRef.current = index
    }

    triggerHaptic()
  }

  const handlePlaceholderIndexChange = (
    section: "incomplete" | "completed",
    index: number,
  ) => {
    const placeholderIndexRef =
      section === "incomplete"
        ? incompletePlaceholderIndexRef
        : completedPlaceholderIndexRef

    if (placeholderIndexRef.current === index) {
      return
    }

    placeholderIndexRef.current = index
    triggerHaptic()
  }

  const handleIncompleteDragEnd = (nextTasks: Task[]) => {
    incompletePlaceholderIndexRef.current = null
    void reorderTodayTasks(
      [...nextTasks, ...allCompletedTasks].map((task) => {
        return task.id
      }),
    )
  }

  const handleCompletedDragEnd = (nextTasks: Task[]) => {
    completedPlaceholderIndexRef.current = null
    void reorderTodayTasks(
      [...allIncompleteTasks, ...nextTasks].map((task) => {
        return task.id
      }),
    )
  }

  const renderTaskRow = (
    section: "incomplete" | "completed",
    { item, drag, getIndex, isActive }: RenderItemParams<Task>,
  ) => {
    const index = getIndex()
    const isFirstVisibleRow =
      index === 0 &&
      (section === "incomplete" ||
        (section === "completed" && incompleteTasks.length === 0))

    return (
      <View style={!isFirstVisibleRow ? styles.taskSpacing : undefined}>
        <ScaleDecorator activeScale={1.01}>
          <TodaySwipeableRow
            enabled={section === "incomplete" && !isActive}
            onRemove={() => void setTaskSelectedForToday(item.id, false)}
          >
            <TodayTaskRow
              isDragging={isActive}
              onLongPress={drag}
              onPress={() =>
                router.push({ pathname: "/task/[id]", params: { id: item.id } })
              }
              onToggleCompleted={() =>
                void setTaskCompleted(item.id, !item.completedAt)
              }
              task={item}
            />
          </TodaySwipeableRow>
        </ScaleDecorator>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <AppScreen
        scroll={false}
        title="Today"
        subtitle={
          allTasks.length > 0 ? `${allTasks.length} selected` : undefined
        }
        headerRight={
          <PillButton
            label={hideCompleted ? "Show completed" : "Hide completed"}
            onPress={() => setHideCompleted(!hideCompleted)}
          />
        }
      >
        <NestableScrollContainer contentContainerStyle={styles.scrollContent}>
          {allTasks.length === 0 ? <View style={styles.emptyState} /> : null}

          {isLoading ? <ActivityIndicator color={colors.accent} /> : null}

          {incompleteTasks.length > 0 ? (
            <NestableDraggableFlatList
              activationDistance={10}
              autoscrollSpeed={120}
              containerStyle={styles.flatListContainer}
              data={incompleteTasks}
              keyExtractor={(task) => task.id}
              onDragBegin={(index) => handleDragBegin("incomplete", index)}
              onDragEnd={({ data }) => handleIncompleteDragEnd(data)}
              onPlaceholderIndexChange={(index) =>
                handlePlaceholderIndexChange("incomplete", index)
              }
              renderItem={(params) => renderTaskRow("incomplete", params)}
            />
          ) : null}

          {completedTasks.length > 0 ? (
            <NestableDraggableFlatList
              activationDistance={10}
              autoscrollSpeed={120}
              containerStyle={styles.flatListContainer}
              data={completedTasks}
              keyExtractor={(task) => task.id}
              onDragBegin={(index) => handleDragBegin("completed", index)}
              onDragEnd={({ data }) => handleCompletedDragEnd(data)}
              onPlaceholderIndexChange={(index) =>
                handlePlaceholderIndexChange("completed", index)
              }
              renderItem={(params) => renderTaskRow("completed", params)}
            />
          ) : null}
        </NestableScrollContainer>
      </AppScreen>

      <FloatingAddButton
        onPress={() =>
          router.push({ pathname: "/task/new", params: { source: "today" } })
        }
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    minHeight: 260,
    borderRadius: 24,
    backgroundColor: "rgba(255, 250, 242, 0.45)",
  },
  scrollContent: {
    paddingBottom: spacing.xxxl * 2,
  },
  flatListContainer: {
    flexGrow: 0,
  },
  taskSpacing: {
    marginTop: spacing.md,
  },
})
