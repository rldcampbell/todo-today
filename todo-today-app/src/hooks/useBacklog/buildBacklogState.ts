import {
  filterTasksForBacklog,
  sortBacklogTasks,
} from "@/features/backlog/backlog-selectors"
import { selectTaskCategories } from "@/features/tasks/task-selectors"
import {
  archivedBacklogSortFields,
  currentBacklogSortFields,
  defaultBacklogSortDirections,
} from "@/features/backlog/backlog-types"
import type {
  ArchivedBacklogSortField,
  BacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from "@/features/backlog/backlog-types"
import type { Task } from "@/features/tasks/task-types"

type BuildBacklogStateParams = {
  tasks: Task[]
  search: string
  setSearch: (value: string) => void
  category: string | null
  setCategory: (value: string | null) => void
  status: BacklogStatus
  setStatus: (value: BacklogStatus) => void
  currentSortField: CurrentBacklogSortField
  currentSortDirection: SortDirection
  setCurrentSortField: (value: CurrentBacklogSortField) => void
  setCurrentSortDirection: (value: SortDirection) => void
  archivedSortField: ArchivedBacklogSortField
  archivedSortDirection: SortDirection
  setArchivedSortField: (value: ArchivedBacklogSortField) => void
  setArchivedSortDirection: (value: SortDirection) => void
  clearFilters: () => void
  isLoading: boolean
  dayKey: string
}
export const buildBacklogState = ({
  tasks,
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  currentSortField,
  currentSortDirection,
  setCurrentSortField,
  setCurrentSortDirection,
  archivedSortField,
  archivedSortDirection,
  setArchivedSortField,
  setArchivedSortDirection,
  clearFilters,
  isLoading,
  dayKey,
}: BuildBacklogStateParams) => {
  const availableCategories = selectTaskCategories(tasks)
  const sortField: BacklogSortField =
    status === "current" ? currentSortField : archivedSortField
  const sortDirection =
    status === "current" ? currentSortDirection : archivedSortDirection
  const sortFieldOptions: readonly BacklogSortField[] =
    status === "current" ? currentBacklogSortFields : archivedBacklogSortFields
  const setSortField = (value: BacklogSortField) => {
    if (status === "current") {
      setCurrentSortField(value as CurrentBacklogSortField)
      setCurrentSortDirection(defaultBacklogSortDirections[value])
      return
    }

    setArchivedSortField(value as ArchivedBacklogSortField)
    setArchivedSortDirection(defaultBacklogSortDirections[value])
  }
  const setSortDirection = (value: SortDirection) => {
    if (status === "current") {
      setCurrentSortDirection(value)
      return
    }

    setArchivedSortDirection(value)
  }
  const visibleTasks = sortBacklogTasks({
    tasks: filterTasksForBacklog({
      tasks,
      status,
      search,
      category,
      dayKey,
    }),
    sortField,
    sortDirection,
    status,
  })
  return {
    tasks: visibleTasks,
    search,
    setSearch,
    category,
    setCategory,
    availableCategories,
    status,
    setStatus,
    sortField,
    sortDirection,
    sortFieldOptions,
    setSortField,
    setSortDirection,
    clearFilters,
    isLoading,
  }
}
