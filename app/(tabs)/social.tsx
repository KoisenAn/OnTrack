import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from "../theme";

export default function Social() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
      </View>

      <View style={styles.center}>
        <Feather name="users" size={54} color={theme.colors.secondary} />
        <Text style={styles.subtitle}>Social screen.</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 20,
    },
    headerRow: {
      marginBottom: 18,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      marginTop: 12,
      color: theme.colors.muted,
      fontSize: 16,
    },
  });