import { Tabs } from "expo-router";
import AnimatedTabBar from "../components/AnimatedTabBar";
import Icon from '../components/Icon';
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
        headerStyle: { backgroundColor: theme.colors.background},
        headerShadowVisible: false,
        headerTitleStyle: { color: theme.colors.text, fontSize: fontSizes.header1, fontWeight: "700", paddingLeft: 0 },
        headerTitleAlign: "center",
        headerTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="dashboard" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerTitle: "Analytics",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="stats" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          headerTitle: "Social",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="social" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Icon name="settings" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="not_found" options={{ headerShown: false }} />
    </Tabs>
  );
}
