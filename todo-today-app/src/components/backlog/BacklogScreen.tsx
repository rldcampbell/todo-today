import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '@/components/common/AppScreen';
import { BacklogCategoryStrip } from '@/components/backlog/BacklogCategoryStrip';
import { BacklogFilterBar } from '@/components/backlog/BacklogFilterBar';
import { BacklogSearchInput } from '@/components/backlog/BacklogSearchInput';
import { BacklogStatusControl } from '@/components/backlog/BacklogStatusControl';
import { BacklogTaskRow } from '@/components/backlog/BacklogTaskRow';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useBacklog } from '@/hooks/useBacklog';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getLocalDayKey } from '@/utils/dates';

const getBacklogResultLabel = (
  taskCount: number,
  status: 'current' | 'archived',
) => {
  const taskLabel = taskCount === 1 ? 'task' : 'tasks';

  if (status === 'archived') {
    return `${taskCount} archived ${taskLabel}`;
  }

  return `${taskCount} ${taskLabel}`;
};

const getEmptyStateCopy = (
  status: 'current' | 'archived',
  hasActiveFilters: boolean,
) => {
  if (hasActiveFilters) {
    return {
      title: 'No matching tasks',
      body: 'Try clearing search or category.',
    };
  }

  if (status === 'archived') {
    return {
      title: 'No archived tasks',
      body: 'Completed non-recurring tasks will appear here after rollover.',
    };
  }

  return {
    title: 'No tasks yet',
    body: 'Create a task or add one from Today.',
  };
};

export const BacklogScreen = () => {
  const router = useRouter();
  const { deleteCategory, isSaving, setTaskSelectedForToday } =
    useTaskActions();
  const {
    search,
    setSearch,
    status,
    setStatus,
    sortField,
    sortDirection,
    sortFieldOptions,
    setSortField,
    setSortDirection,
    category,
    setCategory,
    availableCategories,
    clearFilters,
    tasks,
    isLoading,
  } = useBacklog();
  const dayKey = getLocalDayKey();
  const showClear = search.length > 0 || category !== null;
  const emptyState = getEmptyStateCopy(status, showClear);
  const confirmDeleteCategory = async (categoryValue: string) => {
    try {
      await deleteCategory(categoryValue);

      if (category === categoryValue) {
        setCategory(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not delete category', message);
    }
  };
  const handleDeleteCategory = (categoryValue: string) => {
    Alert.alert(
      'Delete category?',
      `This clears "${categoryValue}" from every task. The tasks are kept.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void confirmDeleteCategory(categoryValue);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <AppScreen title="Backlog">
        <View style={styles.controls}>
          <BacklogSearchInput onChangeText={setSearch} value={search} />
          <BacklogStatusControl onChange={setStatus} status={status} />
          <BacklogFilterBar
            clearFilters={clearFilters}
            setSortDirection={setSortDirection}
            setSortField={setSortField}
            showClear={showClear}
            sortDirection={sortDirection}
            sortField={sortField}
            sortFieldOptions={sortFieldOptions}
          />
          <BacklogCategoryStrip
            availableCategories={availableCategories}
            category={category}
            deleteDisabled={isSaving}
            onDeleteCategory={handleDeleteCategory}
            setCategory={setCategory}
          />
        </View>

        {isLoading ? <ActivityIndicator color={colors.accent} /> : null}

        {!isLoading ? (
          <Text style={styles.resultsMeta}>
            {getBacklogResultLabel(tasks.length, status)}
          </Text>
        ) : null}

        {!isLoading && tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{emptyState.title}</Text>
            <Text style={styles.emptyBody}>{emptyState.body}</Text>
          </View>
        ) : null}

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <BacklogTaskRow
              canToggleToday={status === 'current'}
              key={task.id}
              onPress={() =>
                router.push({ pathname: '/task/[id]', params: { id: task.id } })
              }
              onToggleSelectedForToday={() =>
                void setTaskSelectedForToday(
                  task.id,
                  task.selectedForDay !== dayKey,
                )
              }
              selectedForToday={task.selectedForDay === dayKey}
              sortField={sortField}
              task={task}
            />
          ))}
        </View>
      </AppScreen>

      <FloatingAddButton
        onPress={() =>
          router.push({ pathname: '/task/new', params: { source: 'backlog' } })
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
  controls: {
    gap: spacing.md,
  },
  resultsMeta: {
    color: colors.tabMuted,
    fontSize: typography.meta,
  },
  taskList: {
    gap: spacing.md,
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
