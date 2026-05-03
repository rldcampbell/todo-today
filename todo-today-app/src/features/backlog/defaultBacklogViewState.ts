import type { BacklogViewState } from "@/features/backlog/backlog-view-state-types"

export const defaultBacklogViewState: BacklogViewState = {
  search: "",
  category: null,
  status: "current",
  currentSortField: "createdAt",
  currentSortDirection: "desc",
  archivedSortField: "completedAt",
  archivedSortDirection: "desc",
}
