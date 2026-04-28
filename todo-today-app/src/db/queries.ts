export const queries = {
  today: `
    SELECT *
    FROM tasks
    WHERE selected_for_day = ?
    ORDER BY CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END ASC, today_order ASC
  `,
  current: `
    SELECT *
    FROM tasks
    WHERE
      (
        recurrence_interval IS NULL
        AND (
          completed_at IS NULL
          OR DATE(completed_at, 'localtime') = ?
        )
      )
      OR recurrence_interval IS NOT NULL
    ORDER BY
      CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END ASC,
      created_at DESC
  `,
  archived: `
    SELECT *
    FROM tasks
    WHERE recurrence_interval IS NULL
      AND completed_at IS NOT NULL
      AND DATE(completed_at, 'localtime') < ?
    ORDER BY completed_at DESC
  `,
} as const;
