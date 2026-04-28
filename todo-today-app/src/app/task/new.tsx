import { useLocalSearchParams } from 'expo-router';
import { TaskSheetScreen } from '@/components/task-sheet/TaskSheetScreen';
import type { TaskCreateSource } from '@/features/tasks/createEmptyTaskDraft';
export const NewTaskRoute = () => {
  const params = useLocalSearchParams<{
    source?: TaskCreateSource;
  }>();
  const createSource = params.source === 'today' ? 'today' : 'backlog';
  return <TaskSheetScreen createSource={createSource} mode="create" />;
};
export default NewTaskRoute;
