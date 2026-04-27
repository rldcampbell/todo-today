import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function TodayScreen() {
  const router = useRouter();
  const { hideCompleted, setHideCompleted, tasks } = useToday();

  return (
    <View style={styles.container}>
      <AppScreen
        title="Today"
        subtitle={tasks.length > 0 ? `${tasks.length} selected` : undefined}
        headerRight={
          <PillButton
            label={hideCompleted ? 'Show completed' : 'Hide completed'}
            onPress={() => setHideCompleted(!hideCompleted)}
          />
        }
      >
        {tasks.length === 0 ? <View style={styles.emptyState} /> : null}

        {tasks.length === 0 ? (
          <SurfaceCard>
            <Text style={styles.scaffoldLabel}>Scaffold state</Text>
            <Text style={styles.scaffoldBody}>
              The screen shape and controls are in place. Task selection, completion, swipe removal,
              and reordering will be added onto this route structure.
            </Text>
          </SurfaceCard>
        ) : null}
      </AppScreen>

      <FloatingAddButton onPress={() => router.push('/task/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyState: {
    minHeight: 260,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 250, 242, 0.45)',
  },
  scaffoldLabel: {
    color: colors.accent,
    fontSize: typography.meta,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scaffoldBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    paddingRight: spacing.sm,
  },
});
