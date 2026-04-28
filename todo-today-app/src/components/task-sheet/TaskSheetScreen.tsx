import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import {
  createEmptyTaskDraft,
  type TaskCreateSource,
} from '@/features/tasks/createEmptyTaskDraft';
import { isTaskArchived } from '@/features/tasks/isTaskArchived';
import { mapTaskToDraft } from '@/features/tasks/mapTaskToDraft';
import type { RecurrenceUnit, TaskDraft } from '@/features/tasks/task-types';
import { validateTaskDraft } from '@/features/tasks/validateTaskDraft';
import { useTask } from '@/hooks/useTask';
import { useTaskActions } from '@/hooks/useTaskActions';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TaskSheetScreenProps = {
  mode: 'create' | 'edit';
  taskId?: string;
  createSource?: TaskCreateSource;
};

const recurrenceUnits: RecurrenceUnit[] = ['day', 'week', 'month', 'year'];

function buildInitialDraft(mode: 'create' | 'edit', createSource: TaskCreateSource, taskId?: string) {
  if (mode === 'create' || !taskId) {
    return createEmptyTaskDraft(createSource);
  }

  return createEmptyTaskDraft('backlog');
}

function areDraftsEqual(leftDraft: TaskDraft, rightDraft: TaskDraft) {
  return JSON.stringify(leftDraft) === JSON.stringify(rightDraft);
}

export function TaskSheetScreen({ mode, taskId, createSource = 'backlog' }: TaskSheetScreenProps) {
  const router = useRouter();
  const { task, isLoading } = useTask(taskId);
  const { createTask, updateTask, deleteTask, isSaving } = useTaskActions();
  const loadedDraft = useMemo(() => {
    if (mode === 'edit' && task) {
      return mapTaskToDraft(task);
    }

    return buildInitialDraft(mode, createSource, taskId);
  }, [createSource, mode, task, taskId]);
  const [draft, setDraft] = useState(loadedDraft);
  const [recurrenceIntervalText, setRecurrenceIntervalText] = useState(
    String(loadedDraft.recurrenceInterval)
  );

  useEffect(() => {
    setDraft(loadedDraft);
    setRecurrenceIntervalText(String(loadedDraft.recurrenceInterval));
  }, [loadedDraft]);

  const title = mode === 'create' ? 'New task' : 'Task details';
  const showDelete = mode === 'edit' && Boolean(taskId) && Boolean(task);
  const isDirty = !areDraftsEqual(draft, loadedDraft);
  const selectionBlockedByArchive = Boolean(task && draft.completed && isTaskArchived(task));
  const recurrenceLabel = useMemo(() => {
    if (!draft.recurrenceEnabled) {
      return 'Does not repeat';
    }

    const unit = draft.recurrenceInterval === 1 ? draft.recurrenceUnit : `${draft.recurrenceUnit}s`;
    return `Every ${draft.recurrenceInterval} ${unit}`;
  }, [draft.recurrenceEnabled, draft.recurrenceInterval, draft.recurrenceUnit]);

  function updateDraft(nextValues: Partial<TaskDraft>) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...nextValues,
    }));
  }

  function handleRecurrenceIntervalChange(value: string) {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    setRecurrenceIntervalText(digitsOnly);

    const parsed = Number(digitsOnly);
    if (Number.isInteger(parsed) && parsed > 0) {
      updateDraft({
        recurrenceInterval: parsed,
      });
    }
  }

  function handleRecurrenceIntervalBlur() {
    const parsed = Number(recurrenceIntervalText);
    const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

    setRecurrenceIntervalText(String(normalized));
    updateDraft({
      recurrenceInterval: normalized,
    });
  }

  function handleClose() {
    if (!isDirty || isSaving) {
      router.back();
      return;
    }

    Alert.alert('Discard changes?', 'Your edits have not been saved.', [
      {
        text: 'Keep editing',
        style: 'cancel',
      },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
  }

  async function handleSave() {
    const validationError = validateTaskDraft(draft);

    if (validationError) {
      Alert.alert('Cannot save task', validationError);
      return;
    }

    try {
      if (mode === 'create') {
        await createTask(draft);
      } else if (taskId) {
        await updateTask(taskId, draft);
      }

      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not save task', message);
    }
  }

  async function confirmDelete() {
    if (!taskId) {
      return;
    }

    try {
      await deleteTask(taskId);
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not delete task', message);
    }
  }

  function handleDelete() {
    Alert.alert('Delete task?', 'This permanently removes the task from the backlog.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void confirmDelete();
        },
      },
    ]);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable disabled={isSaving} onPress={handleClose} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Close</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable disabled={isSaving} onPress={() => void handleSave()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>{isSaving ? 'Saving' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mode === 'edit' && isLoading ? <ActivityIndicator color={colors.accent} /> : null}

        {mode === 'edit' && !isLoading && !task ? (
          <SurfaceCard>
            <Text style={styles.notFoundTitle}>Task not found</Text>
            <Text style={styles.notFoundBody}>
              This task may have been deleted or is no longer available.
            </Text>
          </SurfaceCard>
        ) : null}

        {(mode === 'create' || task) && (
          <SurfaceCard>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                onChangeText={(titleValue) => updateDraft({ title: titleValue })}
                placeholder="Task title"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={draft.title}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                multiline
                onChangeText={(descriptionValue) => updateDraft({ description: descriptionValue })}
                placeholder="Optional notes and links"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
                value={draft.description}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Selected for today</Text>
              <Switch
                disabled={selectionBlockedByArchive}
                onValueChange={(selectedForToday) => updateDraft({ selectedForToday })}
                value={draft.selectedForToday}
              />
            </View>
            {selectionBlockedByArchive ? (
              <Text style={styles.helperText}>Restore the task before selecting it for Today.</Text>
            ) : null}

            <View style={styles.switchRow}>
              <Text style={styles.label}>Completed</Text>
              <Switch onValueChange={(completed) => updateDraft({ completed })} value={draft.completed} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                onChangeText={(categoryValue) => updateDraft({ category: categoryValue })}
                placeholder="Optional category"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={draft.category}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Due date</Text>
              <TextInput
                onChangeText={(dueDateValue) => updateDraft({ dueDate: dueDateValue })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={draft.dueDate}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Recurrence</Text>
              <View style={styles.filterRow}>
                <PillButton
                  label={draft.recurrenceEnabled ? 'Repeats' : 'Does not repeat'}
                  onPress={() => updateDraft({ recurrenceEnabled: !draft.recurrenceEnabled })}
                  selected={draft.recurrenceEnabled}
                />
                {draft.recurrenceEnabled ? <PillButton label={recurrenceLabel} /> : null}
              </View>
              {draft.recurrenceEnabled ? (
                <View style={styles.recurrenceEditor}>
                  <TextInput
                    keyboardType="number-pad"
                    onBlur={handleRecurrenceIntervalBlur}
                    onChangeText={handleRecurrenceIntervalChange}
                    selectTextOnFocus
                    style={[styles.input, styles.intervalInput]}
                    value={recurrenceIntervalText}
                  />
                  <View style={styles.filterRow}>
                    {recurrenceUnits.map((unit) => (
                      <PillButton
                        key={unit}
                        label={unit}
                        onPress={() => updateDraft({ recurrenceUnit: unit })}
                        selected={draft.recurrenceUnit === unit}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </SurfaceCard>
        )}

        {showDelete ? <PillButton destructive label="Delete task" onPress={handleDelete} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerButton: {
    minWidth: 56,
  },
  headerButtonText: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
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
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recurrenceEditor: {
    gap: spacing.sm,
  },
  intervalInput: {
    maxWidth: 88,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  notFoundBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
