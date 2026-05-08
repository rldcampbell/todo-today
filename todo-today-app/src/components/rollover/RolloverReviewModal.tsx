import { useEffect, useMemo, useState } from "react"
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PillButton } from "@/components/common/PillButton"
import { SurfaceCard } from "@/components/common/SurfaceCard"
import { copy } from "@/copy"
import { buildTaskMetadataLabels } from "@/features/tasks/buildTaskMetadataLabels"
import { getTaskDescriptionPreview } from "@/features/tasks/getTaskDescriptionPreview"
import {
  getIncompleteRolloverReviewTasks,
  type PendingRolloverReview,
  type RolloverReviewDecision,
  type RolloverReviewDecisions,
} from "@/features/tasks/rolloverReview"
import type { Task } from "@/features/tasks/task-types"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"

type RolloverReviewModalProps = {
  isSaving: boolean
  onComplete: (decisions: RolloverReviewDecisions) => Promise<void>
  review: PendingRolloverReview
}

const decisionLabels: Record<RolloverReviewDecision, string> = {
  backlog: copy("rolloverReview.actions.backlog"),
  today: copy("rolloverReview.actions.today"),
  done: copy("rolloverReview.actions.done"),
}

const getDecision = (
  decisions: RolloverReviewDecisions,
  taskId: string,
): RolloverReviewDecision => {
  return decisions[taskId] ?? "backlog"
}

const RolloverReviewTaskRow = ({
  decision,
  disabled,
  onChangeDecision,
  task,
}: {
  decision: RolloverReviewDecision
  disabled: boolean
  onChangeDecision: (decision: RolloverReviewDecision) => void
  task: Task
}) => {
  const descriptionPreview = getTaskDescriptionPreview(task)
  const metadata = buildTaskMetadataLabels(task)

  return (
    <SurfaceCard>
      <View style={styles.taskText}>
        <Text
          style={[
            styles.taskTitle,
            decision === "done" && styles.completedTaskTitle,
          ]}
        >
          {task.title}
        </Text>
        {descriptionPreview ? (
          <Text numberOfLines={1} style={styles.taskDescription}>
            {descriptionPreview}
          </Text>
        ) : null}
        {metadata.length > 0 ? (
          <Text numberOfLines={1} style={styles.taskMetadata}>
            {metadata.join(" · ")}
          </Text>
        ) : null}
      </View>

      <View style={styles.decisionControls}>
        {(["backlog", "today", "done"] as const).map((nextDecision) => (
          <PillButton
            disabled={disabled}
            key={nextDecision}
            label={decisionLabels[nextDecision]}
            onPress={() => onChangeDecision(nextDecision)}
            selected={decision === nextDecision}
          />
        ))}
      </View>
    </SurfaceCard>
  )
}

const CompletedRolloverTaskRow = ({ task }: { task: Task }) => {
  const descriptionPreview = getTaskDescriptionPreview(task)

  return (
    <SurfaceCard>
      <View style={styles.taskText}>
        <Text style={[styles.taskTitle, styles.completedTaskTitle]}>
          {task.title}
        </Text>
        {descriptionPreview ? (
          <Text numberOfLines={1} style={styles.taskDescription}>
            {descriptionPreview}
          </Text>
        ) : null}
      </View>
      <Text style={styles.completedLabel}>
        {copy("rolloverReview.status.completed")}
      </Text>
    </SurfaceCard>
  )
}

export const RolloverReviewModal = ({
  isSaving,
  onComplete,
  review,
}: RolloverReviewModalProps) => {
  const [decisions, setDecisions] = useState<RolloverReviewDecisions>({})
  const incompleteTasks = useMemo(() => {
    return getIncompleteRolloverReviewTasks(review)
  }, [review])
  const completedTasks = useMemo(() => {
    return review.tasks.filter((task) => Boolean(task.completedAt))
  }, [review])
  const taskSignature = useMemo(() => {
    return review.tasks.map((task) => task.id).join(":")
  }, [review.tasks])

  useEffect(() => {
    setDecisions({})
  }, [review.dayKey, taskSignature])

  const setTaskDecision = (
    taskId: string,
    decision: RolloverReviewDecision,
  ) => {
    setDecisions((currentDecisions) => ({
      ...currentDecisions,
      [taskId]: decision,
    }))
  }

  const setAllIncompleteTasks = (decision: RolloverReviewDecision) => {
    const nextDecisions: RolloverReviewDecisions = {}
    for (const task of incompleteTasks) {
      nextDecisions[task.id] = decision
    }
    setDecisions(nextDecisions)
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => {}}
      presentationStyle="fullScreen"
      visible
    >
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{copy("rolloverReview.title")}</Text>
          <Text style={styles.subtitle}>
            {copy("rolloverReview.subtitle")} {review.dayKey}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bulkActions}>
            <PillButton
              disabled={isSaving}
              label={copy("rolloverReview.bulk.today")}
              onPress={() => setAllIncompleteTasks("today")}
            />
            <PillButton
              disabled={isSaving}
              label={copy("rolloverReview.bulk.none")}
              onPress={() => setAllIncompleteTasks("backlog")}
            />
          </View>

          {incompleteTasks.map((task) => (
            <RolloverReviewTaskRow
              decision={getDecision(decisions, task.id)}
              disabled={isSaving}
              key={task.id}
              onChangeDecision={(decision) =>
                setTaskDecision(task.id, decision)
              }
              task={task}
            />
          ))}

          {completedTasks.map((task) => (
            <CompletedRolloverTaskRow key={task.id} task={task} />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={isSaving}
            onPress={() => void onComplete(decisions)}
            style={({ pressed }) => [
              styles.primaryButton,
              isSaving && styles.primaryButtonDisabled,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving
                ? copy("rolloverReview.actions.starting")
                : copy("rolloverReview.actions.startToday")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  bulkActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  taskText: {
    gap: spacing.xs,
  },
  taskTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  completedTaskTitle: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  taskDescription: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  taskMetadata: {
    color: colors.tabMuted,
    fontSize: typography.meta,
  },
  decisionControls: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  completedLabel: {
    alignSelf: "flex-start",
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  footer: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    padding: spacing.xl,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: colors.accent,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonPressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: "700",
  },
})
