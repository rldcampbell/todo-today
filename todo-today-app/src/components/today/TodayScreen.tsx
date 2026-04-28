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
export const TodayScreen = () => {
  const router = useRouter();
  const { moveTodayTask, setTaskCompleted, setTaskSelectedForToday } =
    useTaskActions();
  const { allTasks, hideCompleted, rows, setHideCompleted, isLoading } =
    useToday();
  return (
    <View style={styles.container}>
      <AppScreen
        title="Today"
        subtitle={
          allTasks.length > 0 ? `${allTasks.length} selected` : undefined
        }
        headerRight={
          <PillButton
            label={hideCompleted ? 'Show completed' : 'Hide completed'}
            onPress={() => setHideCompleted(!hideCompleted)}
          />
        }
      >
        {rows.length === 0 ? <View style={styles.emptyState} /> : null}

        {isLoading ? <ActivityIndicator color={colors.accent} /> : null}

        <View style={styles.taskList}>
          {rows.map(({ task, canMoveUp, canMoveDown }) => (
            <TodayTaskRow
              key={task.id}
              canMoveDown={canMoveDown}
              canMoveUp={canMoveUp}
              onPress={() =>
                router.push({ pathname: '/task/[id]', params: { id: task.id } })
              }
              onMoveDown={() => void moveTodayTask(task.id, 'down')}
              onMoveUp={() => void moveTodayTask(task.id, 'up')}
              onToggleCompleted={() =>
                void setTaskCompleted(task.id, !task.completedAt)
              }
              onRemoveFromToday={() =>
                void setTaskSelectedForToday(task.id, false)
              }
              task={task}
            />
          ))}
        </View>
      </AppScreen>

      <FloatingAddButton
        onPress={() =>
          router.push({ pathname: '/task/new', params: { source: 'today' } })
        }
      />
    </View>
  );
};
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
