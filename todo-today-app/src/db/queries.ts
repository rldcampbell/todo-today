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
    WHERE completed_at IS NULL
    ORDER BY created_at DESC
  `,
  archived: `
    SELECT *
    FROM tasks
    WHERE completed_at IS NOT NULL
    ORDER BY completed_at DESC
  `,
} as const;
