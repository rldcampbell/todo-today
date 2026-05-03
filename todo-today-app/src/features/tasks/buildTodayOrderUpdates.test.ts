import { buildTodayOrderUpdates } from "@/features/tasks/buildTodayOrderUpdates"

describe("buildTodayOrderUpdates", () => {
  it("assigns sequential today order values from the given task ids", () => {
    expect(buildTodayOrderUpdates(["a", "b", "c"])).toEqual([
      { id: "a", todayOrder: 0 },
      { id: "b", todayOrder: 1 },
      { id: "c", todayOrder: 2 },
    ])
  })
})
