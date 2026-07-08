import { useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontSizes } from '../fonts';
import { useTheme } from '../theme';

const BAR_PADDING = 4;

export default function AnimatedTabBar(props: any) {
  const { state, descriptors, navigation } = props;
  const { theme } = useTheme();
  const [slideAnim] = useState(() => new Animated.Value(0));
  const visibleRoutes = useMemo(() => state.routes.filter(
    (_: any, i: number) => descriptors[state.routes[i].key]?.options?.tabBarIcon
  ), [descriptors, state.routes]);
  const tabWidth = (Dimensions.get('window').width - 48 - BAR_PADDING * 2) / visibleRoutes.length;
  const focusedVisibleIndex = visibleRoutes.findIndex((route: any) => route.key === state.routes[state.index]?.key);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: Math.max(focusedVisibleIndex, 0) * tabWidth,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
    }).start();
  }, [focusedVisibleIndex, slideAnim, tabWidth]);

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.colors.tabBarBackground },
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

          const label =
            options.headerTitle ?? options.title ?? options.tabBarLabel ?? route.name;

          return (
            <Pressable
              key={route.key}
              style={[styles.tab, { width: tabWidth }]}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : { selected: false }}
            >
              <View style={styles.iconWrap}>
                {options.tabBarIcon?.({ focused: isFocused, color, size: 26 })}
                <Text style={[styles.label, { color }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
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
    borderRadius: 28,
    paddingHorizontal: BAR_PADDING,
    paddingVertical: BAR_PADDING,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    left: BAR_PADDING,
    borderRadius: 24,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: fontSizes.iconCaption,
    fontWeight: '600',
  },
});
