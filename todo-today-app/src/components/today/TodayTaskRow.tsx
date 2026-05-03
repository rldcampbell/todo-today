import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { buildTaskMetadataLabels } from '@/features/tasks/buildTaskMetadataLabels';
import { getTaskDescriptionPreview } from '@/features/tasks/getTaskDescriptionPreview';
import type { Task } from '@/features/tasks/task-types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
type TodayTaskRowProps = {
  task: Task;
  isDragging?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleCompleted?: () => void;
};
export const TodayTaskRow = ({
  task,
  isDragging = false,
  onPress,
  onLongPress,
  onToggleCompleted,
}: TodayTaskRowProps) => {
  const descriptionPreview = getTaskDescriptionPreview(task);
  const metadata = buildTaskMetadataLabels(task);
  const completed = Boolean(task.completedAt);
  return (
    <SurfaceCard>
      <View style={[styles.row, isDragging && styles.rowDragging]}>
        <Pressable
          accessibilityRole="button"
          disabled={!onToggleCompleted}
          onPress={onToggleCompleted}
          style={[
            styles.completionToggle,
            completed && styles.completionToggleCompleted,
          ]}
        >
          <Text
            style={[
              styles.completionToggleMark,
              completed && styles.completionToggleMarkCompleted,
            ]}
          >
            {completed ? '✓' : ''}
          </Text>
        </Pressable>

        <Pressable
          delayLongPress={220}
          disabled={isDragging}
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.content}
        >
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
              {metadata.join(' · ')}
            </Text>
          ) : null}
        </Pressable>
      </View>
    </SurfaceCard>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowDragging: {
    opacity: 0.96,
  },
  completionToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  completionToggleCompleted: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  completionToggleMark: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.body,
    fontWeight: '700',
  },
  completionToggleMarkCompleted: {
    color: colors.accent,
  },
  content: {
    flex: 1,
    minWidth: 0,
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
