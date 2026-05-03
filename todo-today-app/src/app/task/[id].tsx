import { useLocalSearchParams } from "expo-router"
import { TaskSheetScreen } from "@/components/task-sheet/TaskSheetScreen"
export const EditTaskRoute = () => {
  const params = useLocalSearchParams<{
    id: string
  }>()
  return <TaskSheetScreen mode="edit" taskId={params.id} />
}
export default EditTaskRoute
