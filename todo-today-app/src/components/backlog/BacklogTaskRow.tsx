import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { getTaskDescriptionPreview } from '@/features/tasks/getTaskDescriptionPreview';
import { describeRecurrence } from '@/features/tasks/recurrence';
import type { Task } from '@/features/tasks/task-types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatRelativeDueDate } from '@/utils/dates';

type BacklogTaskRowProps = {
  task: Task;
  selectedForToday: boolean;
  canToggleToday: boolean;
  onPress: () => void;
  onToggleSelectedForToday?: () => void;
};

export function BacklogTaskRow({
  task,
  selectedForToday,
  canToggleToday,
  onPress,
  onToggleSelectedForToday,
}: BacklogTaskRowProps) {
  const descriptionPreview = getTaskDescriptionPreview(task);
  const dueDateLabel = formatRelativeDueDate(task.dueDate);
  const recurrenceLabel = task.recurrence ? describeRecurrence(task.recurrence) : null;
  const metadata = [task.category, dueDateLabel, recurrenceLabel].filter(Boolean);
  const completed = Boolean(task.completedAt);

  return (
    <SurfaceCard>
      <View style={styles.row}>
        <Pressable onPress={onPress} style={styles.content}>
          <Text style={[styles.title, completed && styles.completedTitle]}>{task.title}</Text>
          {descriptionPreview ? (
            <Text numberOfLines={1} style={[styles.description, completed && styles.completedDescription]}>
              {descriptionPreview}
            </Text>
          ) : null}
          {metadata.length > 0 ? (
            <Text numberOfLines={1} style={styles.metadata}>
              {metadata.join(' · ')}
            </Text>
          ) : null}
        </Pressable>

        {canToggleToday ? (
          <PillButton
            label={selectedForToday ? 'Today' : 'Add'}
            onPress={onToggleSelectedForToday}
            selected={selectedForToday}
          />
        ) : null}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  completedTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
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
});
