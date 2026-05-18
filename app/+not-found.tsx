import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
        <Stack.Screen options={{title: "Oops! Not Found"}} /> 
        <View style={styles.container}>
          <Link href="/" style={styles.button}>
            Go back to home screen!
          </Link>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#25292e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  }
});