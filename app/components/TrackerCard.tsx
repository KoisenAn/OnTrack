import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Icon from "./Icon";
import { fontSizes } from "../fonts";
import { Theme, useTheme } from "../theme";

export type TrackerData = {
  id: number;
  title: string;
  type: string;
  subtitle?: string;
  checked?: boolean;
  habitKind?: "check" | "number";
};

type TrackerCardProps = {
  tracker: TrackerData;
  onPress?: () => void;
  onAddEntry?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TrackerCard({ tracker, onPress, onAddEntry, style }: TrackerCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const isHabit = tracker.type.toLowerCase() === "habit";
  const isNumericalHabit = isHabit && tracker.habitKind === "number";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.content}>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onAddEntry?.();
          }}
          style={({ pressed }) => [
            styles.entryButton,
            tracker.checked && styles.entryButtonChecked,
            pressed && styles.entryButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Add entry to ${tracker.title}`}
        >
          <Icon
            name={isNumericalHabit ? "minus" : "check"}
            size={17}
            color={tracker.checked ? theme.colors.surface : theme.colors.primary}
          />
        </Pressable>

        <View style={styles.copy}>
          <View style={styles.header}>
            <Text style={styles.title}>{tracker.title}</Text>
          </View>
          {tracker.subtitle ? <Text style={styles.subtitle}>{tracker.subtitle}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      padding: 20,
      marginBottom: 14,
      width: "100%",
      maxWidth: 520,
      alignSelf: "center",
      shadowColor: "#2F2F2F",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.035,
      shadowRadius: 16,
      elevation: 1,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    copy: {
      flex: 1,
      minWidth: 0,
    },
    pressed: {
      opacity: 0.85,
    },
    header: {
      marginBottom: 6,
    },
    title: {
      color: theme.colors.text,
      fontSize: fontSizes.header2,
      fontWeight: "600",
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: fontSizes.header4,
      lineHeight: 19,
    },
    entryButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    entryButtonChecked: {
      backgroundColor: theme.colors.primary,
    },
    entryButtonPressed: {
      opacity: 0.75,
      transform: [{ scale: 0.98 }],
    },
  });
