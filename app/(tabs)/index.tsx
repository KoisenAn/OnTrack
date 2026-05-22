import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useMemo, useState } from "react";
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={openAddModal} style={{ paddingHorizontal: theme.spacing.screenEdge }}>
          <Icon name="plus" size={30} color={theme.colors.secondary} />
        </Pressable>
      ),
    });
  }, [navigation, openAddModal, theme.colors.secondary]);

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
    padding: theme.spacing.screenEdge,
  },
  content: {
    paddingLeft: 0,
  },
  emptyText: {
    color: theme.colors.muted,
    paddingLeft: 8,
    alignItems: "center",
    fontSize: fontSizes.header,
  },
});