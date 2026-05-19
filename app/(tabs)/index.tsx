import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import TrackerCard, { type TrackerData } from "../components/TrackerCard";
import { Theme, useTheme } from "../theme";

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [trackers, setTrackers] = useState<TrackerData[]>([]);
  const navigation: any = useNavigation();

  const nextTrackerTitle = useMemo(
    () => `Tracker ${trackers.length + 1}`,
    [trackers.length]
  );

  const handleAddTracker = () => {
    setTrackers((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        title: nextTrackerTitle,
        subtitle: "New section added to the dashboard.",
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleAddTracker} style={{ paddingHorizontal: 20 }}>
          <Feather name="plus" size={24} color={theme.colors.secondary} />
        </Pressable>
      ),
    });
  }, [navigation, handleAddTracker, theme.colors.secondary]);

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        {trackers.length === 0 ? (
          <Text style={styles.emptyText}>Tap + to add a tracker.</Text>
        ) : (
          trackers.map((tracker) => <TrackerCard key={tracker.id} tracker={tracker} />)
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  pageTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    paddingLeft: 10,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 16,
  },
});