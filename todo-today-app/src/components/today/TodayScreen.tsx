import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/AppScreen';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { ScaffoldNotice } from '@/components/common/ScaffoldNotice';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';

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
          <ScaffoldNotice body="The screen shape and controls are in place. Task selection, completion, swipe removal, and reordering will be added onto this route structure." />
        ) : null}
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
});
