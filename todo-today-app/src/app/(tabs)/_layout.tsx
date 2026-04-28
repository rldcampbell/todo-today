import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { useToday } from '@/hooks/useToday';
import { colors } from '@/theme/colors';
export const TabLayout = () => {
  const { incompleteCount } = useToday();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarBadge: incompleteCount > 0 ? incompleteCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              color={color}
              name="check-circle-outline"
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="backlog"
        options={{
          title: 'Backlog',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="list-alt" size={size} />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
