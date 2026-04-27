import { useLocalSearchParams } from 'expo-router';

import { TaskSheetScreen } from '@/components/task-sheet/TaskSheetScreen';

export default function EditTaskRoute() {
  const params = useLocalSearchParams<{ id: string }>();

  return <TaskSheetScreen mode="edit" taskId={params.id} />;
}
