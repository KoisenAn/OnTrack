import { StyleSheet, Text, View } from 'react-native';
import { fontSizes } from '../fonts';
import { Theme, useTheme } from "../theme";

export default function Stats() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>Analytics</Text>
        <Text style={styles.title}>A cleaner view is ready for your data.</Text>
        <Text style={styles.subtitle}>Stats will appear here as trackers collect entries.</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: theme.spacing.screenEdge,
    },
    panel: {
      width: "100%",
      maxWidth: 520,
      alignSelf: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: 24,
      marginTop: 18,
    },
    eyebrow: {
      color: theme.colors.secondary,
      fontSize: fontSizes.body,
      fontWeight: "700",
      marginBottom: 8,
      textTransform: "uppercase",
    },
    title: {
      color: theme.colors.text,
      fontSize: fontSizes.header1,
      fontWeight: "600",
      marginBottom: 8,
    },
    subtitle: {
      color: theme.colors.muted,
      fontSize: fontSizes.header4,
      lineHeight: 20,
    },
  });
