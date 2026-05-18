import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme";

const TAB_COUNT = 4;
const BAR_PADDING = 4;

function AnimatedTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = (Dimensions.get("window").width - 48 - BAR_PADDING * 2) / TAB_COUNT;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [state.index, tabWidth]);

  const visibleRoutes = state.routes.filter(
    (_: any, i: number) => descriptors[state.routes[i].key]?.options?.tabBarIcon
  );

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.colors.tabBarBackground, borderColor: theme.colors.border },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              width: tabWidth,
              backgroundColor: theme.colors.slider,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        />
        {visibleRoutes.map((route: any) => {
          const { options } = descriptors[route.key];
          const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
          const isFocused = state.index === routeIndex;
          const color = isFocused ? theme.colors.primary : theme.colors.secondary;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              style={[styles.tab, { width: tabWidth }]}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : { selected: false }}
            >
              {options.tabBarIcon?.({ focused: isFocused, color, size: 26 })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 30,
    paddingHorizontal: BAR_PADDING,
    paddingVertical: BAR_PADDING,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  slider: {
    position: "absolute",
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    left: BAR_PADDING,
    borderRadius: 22,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    zIndex: 1,
  },
});

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
