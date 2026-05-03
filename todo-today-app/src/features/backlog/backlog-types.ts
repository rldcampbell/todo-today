export const backlogStatuses = ["current", "archived"] as const
export type BacklogStatus = (typeof backlogStatuses)[number]

export const sortDirections = ["asc", "desc"] as const
export type SortDirection = (typeof sortDirections)[number]

export const currentBacklogSortFields = [
  "createdAt",
  "updatedAt",
  "alphabetical",
  "dueDate",
] as const
export type CurrentBacklogSortField = (typeof currentBacklogSortFields)[number]

export const archivedBacklogSortFields = [
  "completedAt",
  "createdAt",
  "updatedAt",
  "alphabetical",
  "dueDate",
] as const
export type ArchivedBacklogSortField =
  (typeof archivedBacklogSortFields)[number]

export type BacklogSortField =
  | CurrentBacklogSortField
  | ArchivedBacklogSortField

export const backlogSortFieldLabels: Record<BacklogSortField, string> = {
  alphabetical: "Name",
  completedAt: "Completed",
  createdAt: "Created",
  dueDate: "Due",
  updatedAt: "Edited",
}

export const defaultBacklogSortDirections: Record<
  BacklogSortField,
  SortDirection
> = {
  alphabetical: "asc",
  completedAt: "desc",
  createdAt: "desc",
  dueDate: "asc",
  updatedAt: "desc",
}
