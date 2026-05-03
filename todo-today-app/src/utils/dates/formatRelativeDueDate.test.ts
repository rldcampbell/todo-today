import { formatRelativeDueDate } from "@/utils/dates/formatRelativeDueDate"

describe("formatRelativeDueDate", () => {
  const referenceDate = new Date("2026-04-28T10:00:00.000Z")

  it("formats today, tomorrow, and yesterday with relative labels", () => {
    expect(formatRelativeDueDate("2026-04-28", referenceDate)).toBe("Today")
    expect(formatRelativeDueDate("2026-04-29", referenceDate)).toBe("Tomorrow")
    expect(formatRelativeDueDate("2026-04-27", referenceDate)).toBe("Yesterday")
  })

  it("formats other dates as D MMM YYYY", () => {
    expect(formatRelativeDueDate("2026-04-20", referenceDate)).toBe(
      "20 Apr 2026",
    )
    expect(formatRelativeDueDate("2026-05-03", referenceDate)).toBe(
      "3 May 2026",
    )
  })

  it("returns the raw value if the stored day key is invalid", () => {
    expect(formatRelativeDueDate("2026-02-30", referenceDate)).toBe(
      "2026-02-30",
    )
  })
})
