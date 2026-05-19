import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Theme, useTheme } from "../theme";

export type TrackerData = {
  id: string;
  title: string;
  subtitle?: string;
};

type TrackerCardProps = {
  tracker: TrackerData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TrackerCard({ tracker, onPress, style }: TrackerCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{tracker.title}</Text>
      </View>
      {tracker.subtitle ? <Text style={styles.subtitle}>{tracker.subtitle}</Text> : null}
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: {
      opacity: 0.85,
    },
    header: {
      marginBottom: 6,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: 14,
      lineHeight: 20,
    },
  });
