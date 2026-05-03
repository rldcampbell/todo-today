import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AppProvider } from "@/providers/AppProvider"
import { DatabaseProvider } from "@/providers/DatabaseProvider"
import { TasksProvider } from "@/providers/TasksProvider"
export const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <TasksProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="task/new"
                options={{
                  headerShown: false,
                  presentation: "formSheet",
                }}
              />
              <Stack.Screen
                name="task/[id]"
                options={{
                  headerShown: false,
                  presentation: "formSheet",
                }}
              />
            </Stack>
          </AppProvider>
        </TasksProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  )
}
export default RootLayout
