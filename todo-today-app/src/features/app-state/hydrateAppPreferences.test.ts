import { hydrateAppPreferences } from "@/features/app-state/hydrateAppPreferences"

describe("hydrateAppPreferences", () => {
  it("hydrates the persisted hide-completed preference", () => {
    const preferences = hydrateAppPreferences({
      "today.hideCompleted": "true",
    })

    expect(preferences).toEqual({
      todayHideCompleted: true,
    })
  })

  it("falls back when the persisted value is invalid", () => {
    const preferences = hydrateAppPreferences({
      "today.hideCompleted": "not-a-boolean",
    })

    expect(preferences).toEqual({
      todayHideCompleted: false,
    })
  })
})
