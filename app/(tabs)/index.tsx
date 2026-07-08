import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AddTrackerModal, { type NewTracker } from "../components/AddTrackerModal";
import Icon from "../components/Icon";
import TrackerCard, { type TrackerData } from "../components/TrackerCard";
import { fontSizes } from "../fonts";
import { Theme, useTheme } from "../theme";
import { addEntry } from "../../src/services/db/entryRepository";
import { createTracker, getTrackers, type TrackerRow } from "../../src/services/db/trackerRepository";

const DASHBOARD_MESSAGES = [
  "Track anything.",
  "Track what matters.",
  "Keep small habits visible.",
  "Build progress one check at a time.",
];

export default function Index() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [trackers, setTrackers] = useState<TrackerData[]>(() => getStoredTrackers());
  const [adding, setAdding] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const loadTrackers = () => {
    setTrackers(getStoredTrackers());
  };

  const openAddModal = () => setAdding(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % DASHBOARD_MESSAGES.length);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateFromModal = (data: NewTracker) => {
    const habitSummary = getHabitSummary(data);

    createTracker({
      name: data.title,
      type: data.type,
      notes: habitSummary,
    });
    loadTrackers();
  };

  const handleAddEntry = (tracker: TrackerData) => {
    const nextChecked = !tracker.checked;
    const value = tracker.type === "Habit" && nextChecked ? "checked" : "unchecked";

    addEntry(tracker.id, value);
    setTrackers((current) =>
      current.map((item) =>
        item.id === tracker.id
          ? {
              ...item,
              checked: nextChecked,
              subtitle: `${item.type} - ${nextChecked ? "checked" : "unchecked"} just now`,
            }
          : item
      )
    );
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
        <View style={styles.header}>
          <Text style={styles.description}>{DASHBOARD_MESSAGES[messageIndex]}</Text>
        </View>

        {trackers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No trackers yet</Text>
            <Text style={styles.emptyText}>
              Create your first tracker to start collecting progress in one place.
            </Text>
          </View>
        ) : (
          trackers.map((tracker) => (
            <TrackerCard
              key={tracker.id}
              tracker={tracker}
              onAddEntry={() => handleAddEntry(tracker)}
            />
          ))
        )}

        <View style={styles.actionWrap}>
          <Pressable onPress={openAddModal} style={styles.addButton}>
            <Icon name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>New tracker</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function loadTrackerData(row: TrackerRow): TrackerData {
  const habitKind = getHabitKindFromNotes(row.notes);

  return {
    id: row.id,
    title: row.name,
    type: row.type,
    subtitle: row.notes ? `${row.type} - ${row.notes}` : row.type,
    checked: false,
    habitKind,
  };
}

function getStoredTrackers() {
  return getTrackers().map(loadTrackerData);
}

function getHabitSummary(data: NewTracker) {
  if (data.type !== "Habit") {
    return data.notes;
  }

  const trackingStyle = data.habitKind === "number" ? "number" : "check";
  const pieces = [
    trackingStyle,
    data.goal ? `goal: ${data.goal}` : null,
    data.resetPeriod === "custom"
      ? `resets ${data.customReset || "custom"}`
      : data.resetPeriod
        ? `resets ${data.resetPeriod}`
        : null,
    data.notes || null,
  ];

  return pieces.filter(Boolean).join(" - ");
}

function getHabitKindFromNotes(notes: string | null): "check" | "number" {
  return notes?.startsWith("number") ? "number" : "check";
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "stretch",
    paddingHorizontal: theme.spacing.screenEdge,
    paddingTop: 18,
    paddingBottom: 120,
  },
  header: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    marginBottom: 18,
  },
  description: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
  },
  emptyState: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: 24,
    marginBottom: 14,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: fontSizes.header2,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: fontSizes.header4,
    lineHeight: 20,
  },
  actionWrap: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 8,
    marginTop: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: fontSizes.header4,
    fontWeight: "600",
    alignSelf: "center",
  },
});
