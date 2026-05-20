import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes } from '../fonts';
import { Theme, useTheme } from "../theme";

export default function Stats() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Feather name="pie-chart" size={54} color={theme.colors.secondary} />
        <Text style={styles.subtitle}>Stats screen.</Text>
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
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      color: theme.colors.secondary,
      fontSize: fontSizes.body,
    },
  });