export type TodayOrderUpdate = {
  id: string;
  todayOrder: number;
};

export const buildTodayOrderUpdates = (orderedTaskIds: string[]) => {
  return orderedTaskIds.map((taskId, index) => {
    return {
      id: taskId,
      todayOrder: index,
    };
  });
};
