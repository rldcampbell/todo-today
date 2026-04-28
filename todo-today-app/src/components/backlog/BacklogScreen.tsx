import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppScreen } from '@/components/common/AppScreen';
import { BacklogTaskRow } from '@/components/backlog/BacklogTaskRow';
import { FloatingAddButton } from '@/components/common/FloatingAddButton';
import { PillButton } from '@/components/common/PillButton';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useBacklog } from '@/hooks/useBacklog';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getLocalDayKey } from '@/utils/dates';
const sortFieldLabels = {
  alphabetical: 'A-Z',
  completedAt: 'Completed',
  createdAt: 'Created',
  dueDate: 'Due date',
  updatedAt: 'Edited',
} as const;

const getNextValue = <TValue extends string>(
  currentValue: TValue,
  values: readonly TValue[],
) => {
  const currentIndex = values.indexOf(currentValue);

  if (currentIndex === -1 || currentIndex === values.length - 1) {
    return values[0];
  }

  return values[currentIndex + 1];
};

const getSortFieldLabel = (sortField: keyof typeof sortFieldLabels) => {
  return sortFieldLabels[sortField];
};

const getSortDirectionLabel = (
  sortField: keyof typeof sortFieldLabels,
  sortDirection: 'asc' | 'desc',
) => {
  if (sortField === 'alphabetical') {
    return sortDirection === 'asc' ? 'A-Z' : 'Z-A';
  }

  return sortDirection === 'asc' ? 'Asc' : 'Desc';
};

export const BacklogScreen = () => {
  const router = useRouter();
  const { incompleteCount } = useToday();
  const { setTaskSelectedForToday } = useTaskActions();
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
  return (
    <View style={styles.container}>
      <AppScreen title="Backlog" subtitle={`Today ${incompleteCount}`}>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search title or description"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          value={search}
        />

        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setStatus('current')}
            style={[
              styles.segmentButton,
              status === 'current' && styles.segmentButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.segmentLabel,
                status === 'current' && styles.segmentLabelSelected,
              ]}
            >
              Current
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setStatus('archived')}
            style={[
              styles.segmentButton,
              status === 'archived' && styles.segmentButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.segmentLabel,
                status === 'archived' && styles.segmentLabelSelected,
              ]}
            >
              Archived
            </Text>
          </Pressable>
        </View>

        <View style={styles.filterBar}>
          <PillButton
            label={`Sort: ${getSortFieldLabel(sortField)}`}
            onPress={() =>
              setSortField(getNextValue(sortField, sortFieldOptions))
            }
          />
          <PillButton
            label={getSortDirectionLabel(sortField, sortDirection)}
            onPress={() =>
              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
            }
          />
          {showClear ? (
            <PillButton label="Clear" onPress={clearFilters} />
          ) : null}
        </View>

        {availableCategories.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.categoryList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <PillButton
              label="All"
              onPress={() => setCategory(null)}
              selected={category === null}
            />
            {availableCategories.map((categoryValue) => (
              <PillButton
                key={categoryValue}
                label={categoryValue}
                onPress={() => setCategory(categoryValue)}
                selected={category === categoryValue}
              />
            ))}
          </ScrollView>
        ) : null}

        {isLoading ? <ActivityIndicator color={colors.accent} /> : null}

        {!isLoading && tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {status === 'current' ? 'No tasks yet' : 'No archived tasks'}
            </Text>
            <Text style={styles.emptyBody}>
              {status === 'current'
                ? 'Create a task or add one from Today.'
                : 'Completed non-recurring tasks will appear here after rollover.'}
            </Text>
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
  search: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: typography.body,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.xs,
  },
  segmentButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: colors.surface,
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  segmentLabelSelected: {
    color: colors.text,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryList: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
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
