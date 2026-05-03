import { Pressable, StyleSheet, Text, View } from "react-native"
import { BacklogTodayToggle } from "@/components/backlog/BacklogTodayToggle"
import { SurfaceCard } from "@/components/common/SurfaceCard"
import { buildBacklogTaskSortValue } from "@/features/backlog/buildBacklogTaskSortValue"
import type { BacklogSortField } from "@/features/backlog/backlog-types"
import { buildTaskMetadataLabels } from "@/features/tasks/buildTaskMetadataLabels"
import { getTaskDescriptionPreview } from "@/features/tasks/getTaskDescriptionPreview"
import type { Task } from "@/features/tasks/task-types"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"
type BacklogTaskRowProps = {
  task: Task
  sortField: BacklogSortField
  selectedForToday: boolean
  canToggleToday: boolean
  onPress: () => void
  onToggleSelectedForToday?: () => void
}
export const BacklogTaskRow = ({
  task,
  sortField,
  selectedForToday,
  canToggleToday,
  onPress,
  onToggleSelectedForToday,
}: BacklogTaskRowProps) => {
  const descriptionPreview = getTaskDescriptionPreview(task)
  const metadata = buildTaskMetadataLabels(task, {
    includeDueDate: sortField !== "dueDate",
  })
  const sortValue = buildBacklogTaskSortValue(task, sortField)
  const completed = Boolean(task.completedAt)
  return (
    <SurfaceCard style={selectedForToday && styles.selectedCard}>
      <View style={styles.row}>
        <Pressable onPress={onPress} style={styles.content}>
          <Text style={[styles.title, completed && styles.completedTitle]}>
            {task.title}
          </Text>
          {descriptionPreview ? (
            <Text
              numberOfLines={1}
              style={[
                styles.description,
                completed && styles.completedDescription,
              ]}
            >
              {descriptionPreview}
            </Text>
          ) : null}
          {metadata.length > 0 ? (
            <Text numberOfLines={1} style={styles.metadata}>
              {metadata.join(" · ")}
            </Text>
          ) : null}
        </Pressable>

        {sortValue ? (
          <View style={styles.sortValue}>
            <Text numberOfLines={1} style={styles.sortValueLabel}>
              {sortValue.label}
            </Text>
            <Text numberOfLines={1} style={styles.sortValueText}>
              {sortValue.value}
            </Text>
          </View>
        ) : null}

        {canToggleToday ? (
          <BacklogTodayToggle
            onPress={onToggleSelectedForToday}
            selected={selectedForToday}
          />
        ) : null}
      </View>
    </SurfaceCard>
  )
}
const styles = StyleSheet.create({
  selectedCard: {
    borderColor: colors.accent,
    backgroundColor: "rgba(220, 232, 216, 0.55)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  completedTitle: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  completedDescription: {
    color: colors.tabMuted,
  },
  metadata: {
    color: colors.tabMuted,
    fontSize: typography.meta,
  },
  sortValue: {
    minWidth: 72,
    maxWidth: 104,
    alignItems: "flex-end",
    gap: 2,
  },
  sortValueLabel: {
    color: colors.tabMuted,
    fontSize: typography.meta,
    fontWeight: "600",
  },
  sortValueText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },
})
