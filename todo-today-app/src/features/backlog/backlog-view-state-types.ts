import type {
  ArchivedBacklogSortField,
  BacklogStatus,
  CurrentBacklogSortField,
  SortDirection,
} from "@/features/backlog/backlog-types"

export type BacklogViewState = {
  search: string
  category: string | null
  status: BacklogStatus
  currentSortField: CurrentBacklogSortField
  currentSortDirection: SortDirection
  archivedSortField: ArchivedBacklogSortField
  archivedSortDirection: SortDirection
}
