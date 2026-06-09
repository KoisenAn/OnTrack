import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AddTrackerModal, { type NewTracker } from "../components/AddTrackerModal";
import Icon from "../components/Icon";
import TrackerCard, { type TrackerData } from "../components/TrackerCard";
import { fontSizes } from "../fonts";
import { Theme, useTheme } from "../theme";

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [trackers, setTrackers] = useState<TrackerData[]>([]);
  const [adding, setAdding] = useState(false);

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

  const openAddModal = () => setAdding(true);

  const handleCreateFromModal = (data: NewTracker) => {
    setTrackers((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        title: data.title,
        subtitle: `${data.type}${data.notes ? ` — ${data.notes}` : ""}`,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AddTrackerModal
        visible={adding}
        onClose={() => setAdding(false)}
        onCreate={(data) => {
          handleCreateFromModal(data);
          setAdding(false);
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {trackers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trackers yet.</Text>
          </View>
        ) : (
          trackers.map((tracker) => (
            <TrackerCard key={tracker.id} tracker={tracker} />
          ))
        )}
        <View style={{ alignItems: "center" }}>
          <Pressable onPress={openAddModal} style={styles.addButton}>
            <Icon name="plus" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Create New Tracker</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: theme.spacing.screenEdge,
  },
  content: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },  
  emptyText: {
    color: theme.colors.muted,
    paddingLeft: 8,
    alignItems: "center",
    fontSize: fontSizes.header1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 999,
    paddingVertical: 10,
    width: 175,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: fontSizes.body,
    fontWeight: "600",
    alignSelf: "center",
  },  
});