import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "./theme";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
        <Stack.Screen options={{ title: "Not found" }} />
        <View style={styles.container}>
          <Link href="/" style={styles.button}>
            Go back home
          </Link>
        </View>
    </>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: theme.colors.primary,
  }
});
