import Feather from '@expo/vector-icons/Feather';
import { Tabs } from "expo-router";
import AnimatedTabBar from "../components/AnimatedTabBar";
import { fontSizes } from '../fonts';
import { useTheme } from "../theme";

export default function TabsLayout() {
  const { theme } = useTheme();
  const iconSize = 20;

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: { height: 100, backgroundColor: theme.colors.background},
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text, fontSize: fontSizes.pageTitle, fontWeight: "800", paddingLeft: 0 },
        headerTitleAlign: "left",
        headerTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="list" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerTitle: "Analytics",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="pie-chart" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          headerTitle: "Social",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="users" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Feather name="settings" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="not_found" options={{ headerShown: false }} />
    </Tabs>
  );
}
