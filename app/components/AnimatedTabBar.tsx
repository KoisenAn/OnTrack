import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

const TAB_COUNT = 4;
const BAR_PADDING = 4;

export default function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = (Dimensions.get('window').width - 48 - BAR_PADDING * 2) / TAB_COUNT;

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
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
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
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: BAR_PADDING,
    paddingVertical: BAR_PADDING,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    left: BAR_PADDING,
    borderRadius: 22,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
});
