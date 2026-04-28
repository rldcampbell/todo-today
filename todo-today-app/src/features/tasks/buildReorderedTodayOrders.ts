import { selectTodayTasks } from '@/features/tasks/task-selectors';
import type { Task } from '@/features/tasks/task-types';

export type TodayReorderDirection = 'up' | 'down';

export type TodayOrderUpdate = {
  id: string;
  todayOrder: number;
};

type BuildReorderedTodayOrdersParams = {
  tasks: Task[];
  taskId: string;
  dayKey: string;
  direction: TodayReorderDirection;
};

const swapItems = <TItem>(
  items: TItem[],
  leftIndex: number,
  rightIndex: number,
) => {
  const nextItems = [...items];
  const leftItem = nextItems[leftIndex];

  nextItems[leftIndex] = nextItems[rightIndex];
  nextItems[rightIndex] = leftItem;

  return nextItems;
};

export const buildReorderedTodayOrders = ({
  tasks,
  taskId,
  dayKey,
  direction,
}: BuildReorderedTodayOrdersParams): TodayOrderUpdate[] | null => {
  const selectedTasks = selectTodayTasks(tasks, dayKey);
  const currentIndex = selectedTasks.findIndex((task) => task.id === taskId);

  if (currentIndex === -1) {
    return null;
  }

  const currentTask = selectedTasks[currentIndex];
  const currentCompleted = Boolean(currentTask.completedAt);
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  const targetTask = selectedTasks[targetIndex];

  if (!targetTask || Boolean(targetTask.completedAt) !== currentCompleted) {
    return null;
  }

  return swapItems(selectedTasks, currentIndex, targetIndex).map(
    (task, index) => {
      return {
        id: task.id,
        todayOrder: index,
      };
    },
  );
};
