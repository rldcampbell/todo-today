import { ScrollView, StyleSheet } from "react-native"
import { PillButton } from "@/components/common/PillButton"
import { copy, type CopyKey } from "@/copy"
import type {
  BacklogSortField,
  SortDirection,
} from "@/features/backlog/backlog-types"
import { spacing } from "@/theme/spacing"

type BacklogFilterBarProps = {
  sortField: BacklogSortField
  sortDirection: SortDirection
  sortFieldOptions: readonly BacklogSortField[]
  setSortField: (value: BacklogSortField) => void
  setSortDirection: (value: SortDirection) => void
  showClear: boolean
  clearFilters: () => void
}

const backlogSortFieldLabelKeys: Record<BacklogSortField, CopyKey> = {
  alphabetical: "backlog.sort.fields.alphabetical",
  completedAt: "backlog.sort.fields.completedAt",
  createdAt: "backlog.sort.fields.createdAt",
  dueDate: "backlog.sort.fields.dueDate",
  updatedAt: "backlog.sort.fields.updatedAt",
}

const getNextValue = <TValue extends string>(
  currentValue: TValue,
  values: readonly TValue[],
) => {
  const currentIndex = values.indexOf(currentValue)

  if (currentIndex === -1 || currentIndex === values.length - 1) {
    return values[0]
  }

  return values[currentIndex + 1]
}

const getSortDirectionLabel = (
  sortField: BacklogSortField,
  sortDirection: SortDirection,
) => {
  if (sortField === "alphabetical") {
    return sortDirection === "asc"
      ? copy("backlog.sort.directions.alphabeticalAscending")
      : copy("backlog.sort.directions.alphabeticalDescending")
  }

  if (sortField === "dueDate") {
    return sortDirection === "asc"
      ? copy("backlog.sort.directions.dueDateAscending")
      : copy("backlog.sort.directions.dueDateDescending")
  }

  return sortDirection === "asc"
    ? copy("backlog.sort.directions.dateAscending")
    : copy("backlog.sort.directions.dateDescending")
}

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
        label={`${copy("backlog.sort.prefix")} ${copy(backlogSortFieldLabelKeys[sortField])}`}
        onPress={() => setSortField(getNextValue(sortField, sortFieldOptions))}
      />
      <PillButton
        label={getSortDirectionLabel(sortField, sortDirection)}
        onPress={() =>
          setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        }
      />
      {showClear ? (
        <PillButton
          label={copy("common.actions.clear")}
          onPress={clearFilters}
        />
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
})
