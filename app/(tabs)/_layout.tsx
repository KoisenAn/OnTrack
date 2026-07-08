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
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: fontSizes.header2,
          fontWeight: "600",
          paddingLeft: 0,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Icon name="dashboard" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerTitle: "Analytics",
          tabBarIcon: ({ color }) => (
            <Icon name="stats" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
