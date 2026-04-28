import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { getTaskDescriptionPreview } from '@/features/tasks/getTaskDescriptionPreview';
import type { Task } from '@/features/tasks/task-types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TodayTaskRowProps = {
  task: Task;
  onPress: () => void;
  onRemoveFromToday?: () => void;
};

export function TodayTaskRow({ task, onPress, onRemoveFromToday }: TodayTaskRowProps) {
  const descriptionPreview = getTaskDescriptionPreview(task);
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
        </Pressable>

        {!completed && onRemoveFromToday ? <PillButton label="Remove" onPress={onRemoveFromToday} /> : null}
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
});
