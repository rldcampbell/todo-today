import { useRouter } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PillButton } from "@/components/common/PillButton"
import { SurfaceCard } from "@/components/common/SurfaceCard"
import { TaskCategoryField } from "@/components/task-sheet/TaskCategoryField"
import { TaskDueDateField } from "@/components/task-sheet/TaskDueDateField"
import { TaskRecurrenceField } from "@/components/task-sheet/TaskRecurrenceField"
import { copy } from "@/copy"
import { clampTaskTitle } from "@/features/tasks/clampTaskTitle"
import {
  createEmptyTaskDraft,
  type TaskCreateSource,
} from "@/features/tasks/createEmptyTaskDraft"
import { isTaskArchived } from "@/features/tasks/isTaskArchived"
import { mapTaskToDraft } from "@/features/tasks/mapTaskToDraft"
import { selectTaskCategories } from "@/features/tasks/task-selectors"
import {
  MAX_TASK_TITLE_LENGTH,
  TASK_DESCRIPTION_MAX_HEIGHT,
} from "@/features/tasks/task-constants"
import type { TaskDraft } from "@/features/tasks/task-types"
import { validateTaskDraft } from "@/features/tasks/validateTaskDraft"
import { useAppContext } from "@/providers/AppProvider"
import { useTask } from "@/hooks/useTask"
import { useTaskActions } from "@/hooks/useTaskActions"
import { useTasks } from "@/hooks/useTasks"
import { colors } from "@/theme/colors"
import { spacing } from "@/theme/spacing"
import { typography } from "@/theme/typography"
type TaskSheetScreenProps = {
  mode: "create" | "edit"
  taskId?: string
  createSource?: TaskCreateSource
}
const buildInitialDraft = (
  mode: "create" | "edit",
  createSource: TaskCreateSource,
  defaultCategory: string | null,
  taskId?: string,
) => {
  if (mode === "create" || !taskId) {
    return createEmptyTaskDraft({
      source: createSource,
      category: createSource === "backlog" ? defaultCategory : null,
    })
  }
  return createEmptyTaskDraft({ source: "backlog" })
}
const areDraftsEqual = (leftDraft: TaskDraft, rightDraft: TaskDraft) => {
  return JSON.stringify(leftDraft) === JSON.stringify(rightDraft)
}
export const TaskSheetScreen = ({
  mode,
  taskId,
  createSource = "backlog",
}: TaskSheetScreenProps) => {
  const router = useRouter()
  const { backlogCategory } = useAppContext()
  const { task, isLoading } = useTask(taskId)
  const { tasks } = useTasks()
  const { createTask, updateTask, deleteTask, isSaving } = useTaskActions()
  const descriptionInputRef = useRef<TextInput>(null)
  const availableCategories = useMemo(() => {
    return selectTaskCategories(tasks)
  }, [tasks])
  const loadedDraft = useMemo(() => {
    if (mode === "edit" && task) {
      return mapTaskToDraft(task)
    }
    return buildInitialDraft(mode, createSource, backlogCategory, taskId)
  }, [backlogCategory, createSource, mode, task, taskId])
  const [draft, setDraft] = useState(loadedDraft)
  const [recurrenceIntervalText, setRecurrenceIntervalText] = useState(
    String(loadedDraft.recurrenceInterval),
  )
  useEffect(() => {
    setDraft(loadedDraft)
    setRecurrenceIntervalText(String(loadedDraft.recurrenceInterval))
  }, [loadedDraft])
  const title =
    mode === "create"
      ? copy("taskSheet.header.createTitle")
      : copy("taskSheet.header.editTitle")
  const showDelete = mode === "edit" && Boolean(taskId) && Boolean(task)
  const isDirty = !areDraftsEqual(draft, loadedDraft)
  const archivedTask = Boolean(task && isTaskArchived(task))
  const selectionBlockedByArchive = archivedTask
  const updateDraft = (nextValues: Partial<TaskDraft>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...nextValues,
    }))
  }

  const handleRecurrenceIntervalChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, "")
    setRecurrenceIntervalText(digitsOnly)
    const parsed = Number(digitsOnly)
    if (Number.isInteger(parsed) && parsed > 0) {
      updateDraft({
        recurrenceInterval: parsed,
      })
    }
  }

  const handleRecurrenceIntervalBlur = () => {
    const parsed = Number(recurrenceIntervalText)
    const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : 1
    setRecurrenceIntervalText(String(normalized))
    updateDraft({
      recurrenceInterval: normalized,
    })
  }

  const handleClose = () => {
    if (!isDirty || isSaving) {
      router.back()
      return
    }
    Alert.alert(
      copy("taskSheet.discardChanges.title"),
      copy("taskSheet.discardChanges.body"),
      [
        {
          text: copy("taskSheet.discardChanges.keepEditing"),
          style: "cancel",
        },
        {
          text: copy("taskSheet.discardChanges.discard"),
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    )
  }

  const handleSave = async () => {
    const validationError = validateTaskDraft(draft)
    if (validationError) {
      Alert.alert(copy("taskSheet.saveError.validationTitle"), validationError)
      return
    }
    try {
      if (mode === "create") {
        await createTask(draft)
      } else if (taskId) {
        await updateTask(taskId, draft)
      }

      Keyboard.dismiss()
      router.back()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy("common.fallbackError")
      Alert.alert(copy("taskSheet.saveError.unknownTitle"), message)
    }
  }

  const confirmDelete = async () => {
    if (!taskId) {
      return
    }
    try {
      await deleteTask(taskId)
      router.back()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy("common.fallbackError")
      Alert.alert(copy("taskSheet.delete.errorTitle"), message)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      copy("taskSheet.delete.confirmTitle"),
      copy("taskSheet.delete.confirmBody"),
      [
        {
          text: copy("common.actions.cancel"),
          style: "cancel",
        },
        {
          text: copy("common.actions.delete"),
          style: "destructive",
          onPress: () => {
            void confirmDelete()
          },
        },
      ],
    )
  }
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          disabled={isSaving}
          onPress={handleClose}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {copy("taskSheet.header.close")}
          </Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable
          disabled={isSaving}
          onPress={() => void handleSave()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {isSaving
              ? copy("taskSheet.header.saving")
              : copy("taskSheet.header.save")}
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.body}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {mode === "edit" && isLoading ? (
            <ActivityIndicator color={colors.accent} />
          ) : null}

          {mode === "edit" && !isLoading && !task ? (
            <SurfaceCard>
              <Text style={styles.notFoundTitle}>
                {copy("taskSheet.notFound.title")}
              </Text>
              <Text style={styles.notFoundBody}>
                {copy("taskSheet.notFound.body")}
              </Text>
            </SurfaceCard>
          ) : null}

          {(mode === "create" || task) && (
            <SurfaceCard>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  {copy("taskSheet.fields.title.label")}
                </Text>
                <TextInput
                  autoFocus={mode === "create"}
                  blurOnSubmit={false}
                  onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  onChangeText={(titleValue) =>
                    updateDraft({ title: clampTaskTitle(titleValue) })
                  }
                  maxLength={MAX_TASK_TITLE_LENGTH}
                  placeholder={copy("taskSheet.fields.title.placeholder")}
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  style={styles.input}
                  value={draft.title}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  {copy("taskSheet.fields.description.label")}
                </Text>
                <TextInput
                  ref={descriptionInputRef}
                  multiline
                  onChangeText={(descriptionValue) =>
                    updateDraft({ description: descriptionValue })
                  }
                  placeholder={copy("taskSheet.fields.description.placeholder")}
                  placeholderTextColor={colors.textMuted}
                  scrollEnabled
                  style={[styles.input, styles.textArea]}
                  textAlignVertical="top"
                  value={draft.description}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.label}>
                  {copy("taskSheet.fields.selectedForToday.label")}
                </Text>
                <Switch
                  disabled={selectionBlockedByArchive}
                  onValueChange={(selectedForToday) =>
                    updateDraft({ selectedForToday })
                  }
                  value={draft.selectedForToday}
                />
              </View>
              {selectionBlockedByArchive ? (
                <Text style={styles.helperText}>
                  {copy("taskSheet.fields.selectedForToday.archivedHelp")}
                </Text>
              ) : null}

              <View style={styles.switchRow}>
                <Text style={styles.label}>
                  {copy("taskSheet.fields.completed.label")}
                </Text>
                <Switch
                  onValueChange={(completed) => updateDraft({ completed })}
                  value={draft.completed}
                />
              </View>
              {archivedTask ? (
                <Text style={styles.helperText}>
                  {copy("taskSheet.fields.completed.archivedHelp")}
                </Text>
              ) : null}

              <TaskCategoryField
                availableCategories={availableCategories}
                category={draft.category}
                onChangeCategory={(categoryValue) =>
                  updateDraft({ category: categoryValue })
                }
              />

              <TaskDueDateField
                dueDate={draft.dueDate}
                onChangeDueDate={(dueDateValue) =>
                  updateDraft({ dueDate: dueDateValue })
                }
              />

              <TaskRecurrenceField
                onBlurRecurrenceInterval={handleRecurrenceIntervalBlur}
                onChangeRecurrenceEnabled={(recurrenceEnabled) =>
                  updateDraft({ recurrenceEnabled })
                }
                onChangeRecurrenceIntervalText={handleRecurrenceIntervalChange}
                onChangeRecurrenceUnit={(recurrenceUnit) =>
                  updateDraft({ recurrenceUnit })
                }
                recurrenceEnabled={draft.recurrenceEnabled}
                recurrenceInterval={draft.recurrenceInterval}
                recurrenceIntervalText={recurrenceIntervalText}
                recurrenceUnit={draft.recurrenceUnit}
              />
            </SurfaceCard>
          )}

          {showDelete ? (
            <PillButton
              destructive
              label={copy("taskSheet.delete.button")}
              onPress={handleDelete}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerButton: {
    minWidth: 56,
  },
  headerButtonText: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: "600",
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: "700",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.meta,
    marginTop: -4,
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  textArea: {
    minHeight: 120,
    maxHeight: TASK_DESCRIPTION_MAX_HEIGHT,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
  },
  notFoundBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
})
