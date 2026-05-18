import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from "expo-router";
import AnimatedTabBar from "../components/AnimatedTabBar";
import { useTheme } from "../theme";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5 name="list-ul" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerTitle: "Stats",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome name="area-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sharing"
        options={{
          headerTitle: "Sharing",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome6 name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5 name="cog" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="not_found" options={{ headerShown: false }} />
    </Tabs>
  );
}
