import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/common/PillButton';
import { ScaffoldNotice } from '@/components/common/ScaffoldNotice';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import {
  createEmptyTaskDraft,
  type TaskCreateSource,
} from '@/features/tasks/createEmptyTaskDraft';
import type { RecurrenceUnit } from '@/features/tasks/task-types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TaskSheetScreenProps = {
  mode: 'create' | 'edit';
  taskId?: string;
  createSource?: TaskCreateSource;
};

const recurrenceUnits: RecurrenceUnit[] = ['day', 'week', 'month', 'year'];

export function TaskSheetScreen({ mode, taskId, createSource = 'backlog' }: TaskSheetScreenProps) {
  const router = useRouter();
  const initialDraft = createEmptyTaskDraft(mode === 'create' ? createSource : 'backlog');
  const [draft, setDraft] = useState(initialDraft);
  const [recurrenceIntervalText, setRecurrenceIntervalText] = useState(
    String(initialDraft.recurrenceInterval)
  );

  const title = mode === 'create' ? 'New task' : 'Task details';
  const showDelete = mode === 'edit' && Boolean(taskId);
  const recurrenceLabel = useMemo(() => {
    if (!draft.recurrenceEnabled) {
      return 'Does not repeat';
    }

    const unit = draft.recurrenceInterval === 1 ? draft.recurrenceUnit : `${draft.recurrenceUnit}s`;
    return `Every ${draft.recurrenceInterval} ${unit}`;
  }, [draft.recurrenceEnabled, draft.recurrenceInterval, draft.recurrenceUnit]);

  function handleRecurrenceIntervalChange(value: string) {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    setRecurrenceIntervalText(digitsOnly);

    const parsed = Number(digitsOnly);
    if (Number.isInteger(parsed) && parsed > 0) {
      setDraft((current) => ({
        ...current,
        recurrenceInterval: parsed,
      }));
    }
  }

  function handleRecurrenceIntervalBlur() {
    const parsed = Number(recurrenceIntervalText);
    const normalized = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

    setRecurrenceIntervalText(String(normalized));
    setDraft((current) => ({
      ...current,
      recurrenceInterval: normalized,
    }));
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Close</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <SurfaceCard>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              onChangeText={(titleValue) => setDraft((current) => ({ ...current, title: titleValue }))}
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
              onChangeText={(descriptionValue) =>
                setDraft((current) => ({ ...current, description: descriptionValue }))
              }
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
              onValueChange={(selectedForToday) =>
                setDraft((current) => ({ ...current, selectedForToday }))
              }
              value={draft.selectedForToday}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              onChangeText={(categoryValue) => setDraft((current) => ({ ...current, category: categoryValue }))}
              placeholder="Optional category"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={draft.category}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Due date</Text>
            <TextInput
              onChangeText={(dueDateValue) => setDraft((current) => ({ ...current, dueDate: dueDateValue }))}
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
                onPress={() =>
                  setDraft((current) => ({ ...current, recurrenceEnabled: !current.recurrenceEnabled }))
                }
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
                      onPress={() => setDraft((current) => ({ ...current, recurrenceUnit: unit }))}
                      selected={draft.recurrenceUnit === unit}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </SurfaceCard>

        <ScaffoldNotice
          title="Scaffold note"
          body="This shared task sheet now reflects the agreed form shape and route behavior. Persistence, validation, completion actions, restore, and delete confirmation will be wired into this surface next."
        />

        {showDelete ? <PillButton destructive label="Delete task" /> : null}
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
});
