import { ScrollView, StyleSheet } from 'react-native';
import { PillButton } from '@/components/common/PillButton';
import type {
  ArchivedBacklogSortField,
  CurrentBacklogSortField,
  SortDirection,
} from '@/features/backlog/backlog-types';
import { spacing } from '@/theme/spacing';

type BacklogSortField = CurrentBacklogSortField | ArchivedBacklogSortField;

type BacklogFilterBarProps = {
  sortField: BacklogSortField;
  sortDirection: SortDirection;
  sortFieldOptions: readonly BacklogSortField[];
  setSortField: (value: BacklogSortField) => void;
  setSortDirection: (value: SortDirection) => void;
  showClear: boolean;
  clearFilters: () => void;
};

const sortFieldLabels: Record<BacklogSortField, string> = {
  alphabetical: 'Name',
  completedAt: 'Completed',
  createdAt: 'Created',
  dueDate: 'Due',
  updatedAt: 'Edited',
};

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

const getSortDirectionLabel = (
  sortField: BacklogSortField,
  sortDirection: SortDirection,
) => {
  if (sortField === 'alphabetical') {
    return sortDirection === 'asc' ? 'A-Z' : 'Z-A';
  }

  if (sortField === 'dueDate') {
    return sortDirection === 'asc' ? 'Soonest' : 'Latest';
  }

  return sortDirection === 'asc' ? 'Oldest' : 'Newest';
};

export const BacklogFilterBar = ({
  sortField,
  sortDirection,
  sortFieldOptions,
  setSortField,
  setSortDirection,
  showClear,
  clearFilters,
}: BacklogFilterBarProps) => {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <PillButton
        label={`Sort: ${sortFieldLabels[sortField]}`}
        onPress={() => setSortField(getNextValue(sortField, sortFieldOptions))}
      />
      <PillButton
        label={getSortDirectionLabel(sortField, sortDirection)}
        onPress={() =>
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        }
      />
      {showClear ? <PillButton label="Clear" onPress={clearFilters} /> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
});
