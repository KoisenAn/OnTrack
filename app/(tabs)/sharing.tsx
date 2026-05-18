import { StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from "../theme";

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Sharing() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sharing screen.</Text>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.colors.text,
  },
});