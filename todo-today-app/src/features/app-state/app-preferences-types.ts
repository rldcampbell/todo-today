export interface AppPreferences {
  todayHideCompleted: boolean
}

export const appStateKeys = {
  todayHideCompleted: "today.hideCompleted",
} as const

export type AppStateKey = (typeof appStateKeys)[keyof typeof appStateKeys]
