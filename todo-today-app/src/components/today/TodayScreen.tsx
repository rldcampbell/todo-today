import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { TodayTaskRow } from '@/components/today/TodayTaskRow';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function TodayScreen() {
  const router = useRouter();
  const { setTaskSelectedForToday } = useTaskActions();
  const { allTasks, hideCompleted, setHideCompleted, tasks, isLoading } = useToday();

  return (
    <View style={styles.container}>
      <AppScreen
        title="Today"
        subtitle={allTasks.length > 0 ? `${allTasks.length} selected` : undefined}
        headerRight={
          <PillButton
            label={hideCompleted ? 'Show completed' : 'Hide completed'}
            onPress={() => setHideCompleted(!hideCompleted)}
          />
        }
      >
        {tasks.length === 0 ? <View style={styles.emptyState} /> : null}

        {isLoading ? <ActivityIndicator color={colors.accent} /> : null}

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TodayTaskRow
              key={task.id}
              onPress={() => router.push({ pathname: '/task/[id]', params: { id: task.id } })}
              onRemoveFromToday={() => void setTaskSelectedForToday(task.id, false)}
              task={task}
            />
          ))}
        </View>
      </AppScreen>

      <FloatingAddButton
        onPress={() => router.push({ pathname: '/task/new', params: { source: 'today' } })}
      />
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
  taskList: {
    gap: spacing.md,
  },
});
