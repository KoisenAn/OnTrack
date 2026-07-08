/* eslint-disable react-hooks/exhaustive-deps, react-hooks/immutability */
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Icon from "../components/Icon";
import { fontSizes } from "../fonts";
import { Theme, useTheme } from "../theme";

export type NewTracker = {
  type: string;
  title: string;
  notes?: string;
  habitKind?: "check" | "number";
  goal?: string;
  resetPeriod?: ResetPeriod;
  customReset?: string;
};

type ResetPeriod = "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
type CustomResetUnit = "years" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: NewTracker) => void;
};

const TRACKER_TYPES = ["Habit", "Record", "Log", "List"];

const TRACKER_DESCRIPTIONS: Record<string, string> = {
  Habit: "Check off a repeated action",
  Record: "Coming soon",
  Log: "Coming soon",
  List: "Coming soon"
};

const TRACKER_ICONS: Record<string, string> = {
  Habit: "check-circle",
  Record: "clipboard",
  Log: "clipboard",
  List: "list",
};

const HABIT_KIND_OPTIONS = [
  { value: "check", label: "Check / complete" },
  { value: "number", label: "Numerical value" },
] as const;

const RESET_PERIOD_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
] as const;

const CUSTOM_RESET_UNITS: { value: CustomResetUnit; label: string }[] = [
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
  { value: "weeks", label: "Weeks" },
  { value: "days", label: "Days" },
  { value: "hours", label: "Hours" },
  { value: "minutes", label: "Minutes" },
  { value: "seconds", label: "Seconds" },
];

export default function AddTrackerModal({ visible, onClose, onCreate }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [step, setStep] = useState<"type" | "habit-options">("type");
  const [type, setType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [habitKind, setHabitKind] = useState<"check" | "number">("check");
  const [goal, setGoal] = useState("");
  const [resetPeriod, setResetPeriod] = useState<ResetPeriod>("daily");
  const [habitKindOpen, setHabitKindOpen] = useState(false);
  const [resetPeriodOpen, setResetPeriodOpen] = useState(false);
  const [customReset, setCustomReset] = useState<Record<CustomResetUnit, string>>({
    years: "",
    months: "",
    weeks: "",
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  const canCreate = type === "Habit" && title.trim().length > 0;

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(800);
  const dragY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        dragY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      const shouldClose = e.translationY > 100 || e.velocityY > 800;

      if (shouldClose) {
        translateY.value = withTiming(800, { duration: 180 }, () => {
          dragY.value = 0;
          runOnJS(reset)();
          runOnJS(onClose)();
        });
      } else {
        dragY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value + dragY.value,
        },
      ],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 150 });

      requestAnimationFrame(() => {
        translateY.value = withTiming(0, { duration: 220 });
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150 });

      translateY.value = withTiming(800, { duration: 200 });
    }
  }, [visible]);

  function reset() {
    setStep("type");
    setType(null);
    setTitle("");
    setNotes("");
    setHabitKind("check");
    setGoal("");
    setResetPeriod("daily");
    setHabitKindOpen(false);
    setResetPeriodOpen(false);
    setCustomReset({
      years: "",
      months: "",
      weeks: "",
      days: "",
      hours: "",
      minutes: "",
      seconds: "",
    });
  }

  function close() {
    backdropOpacity.value = withTiming(0, { duration: 150 });

    translateY.value = withTiming(800, { duration: 180 }, () => {
      dragY.value = 0;
      runOnJS(reset)();
      runOnJS(onClose)();
    });
  }

  function selectType(nextType: string) {
    if (nextType !== "Habit") {
      return;
    }

    setType(nextType);
    setStep("habit-options");
  }

  function handleCreate() {
    if (!canCreate) return;
    onCreate({
      type: "Habit",
      title: title.trim(),
      notes: notes.trim(),
      habitKind,
      goal: goal.trim(),
      resetPeriod,
      customReset: getCustomResetLabel(customReset),
    });
    close();
  }

  return (
    <Modal visible={visible} transparent onRequestClose={close}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.handleWrapper}>
              <View style={styles.handle} />
            </View>

            {step === "type" ? (
              <>
                <Text style={styles.heading}>Create tracker</Text>
                <Text style={styles.subheading}>Choose a tracker type</Text>

                <View style={styles.grid}>
                  {TRACKER_TYPES.map((trackerType) => {
                    const disabled = trackerType !== "Habit";

                    return (
                      <Pressable
                        key={trackerType}
                        onPress={() => selectType(trackerType)}
                        style={({ pressed }) => [
                          styles.box,
                          disabled && styles.boxLocked,
                          pressed && !disabled && styles.boxPressed,
                        ]}
                      >
                        <Icon
                          name={TRACKER_ICONS[trackerType] ?? "circle"}
                          size={24}
                          color={theme.colors.primary}
                        />

                        <Text style={styles.boxTitle}>{trackerType}</Text>
                        <Text style={styles.boxSubtitle}>
                          {TRACKER_DESCRIPTIONS[trackerType]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable onPress={() => setStep("type")} style={styles.backButton}>
                  <Icon name="chevron-left" size={16} color={theme.colors.primary} />
                  <Text style={styles.backButtonText}>Types</Text>
                </Pressable>

                <Text style={styles.heading}>Habit options</Text>
                <Text style={styles.subheading}>Set what you want to track and when it resets.</Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Daily steps"
                  placeholderTextColor={theme.colors.muted}
                  style={styles.input}
                />

                <Text style={styles.fieldLabel}>Tracking style</Text>
                <Pressable
                  onPress={() => setHabitKindOpen((open) => !open)}
                  style={styles.dropdown}
                >
                  <Text style={styles.dropdownText}>{getHabitKindLabel(habitKind)}</Text>
                  <Icon name={habitKindOpen ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.primary} />
                </Pressable>
                {habitKindOpen ? (
                  <View style={styles.dropdownMenu}>
                    {HABIT_KIND_OPTIONS.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          setHabitKind(option.value);
                          setHabitKindOpen(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                <TextInput
                  value={goal}
                  onChangeText={setGoal}
                  placeholder={habitKind === "number" ? "Optional goal, e.g. 10,000" : "Optional goal"}
                  placeholderTextColor={theme.colors.muted}
                  keyboardType={habitKind === "number" ? "numeric" : "default"}
                  style={styles.input}
                />

                <Text style={styles.fieldLabel}>Reset period</Text>
                <Pressable
                  onPress={() => setResetPeriodOpen((open) => !open)}
                  style={styles.dropdown}
                >
                  <Text style={styles.dropdownText}>{getResetPeriodLabel(resetPeriod)}</Text>
                  <Icon name={resetPeriodOpen ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.primary} />
                </Pressable>
                {resetPeriodOpen ? (
                  <View style={styles.dropdownMenu}>
                    {RESET_PERIOD_OPTIONS.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          setResetPeriod(option.value);
                          setResetPeriodOpen(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                {resetPeriod === "custom" ? (
                  <View style={styles.customResetGrid}>
                    {CUSTOM_RESET_UNITS.map((unit) => (
                      <View key={unit.value} style={styles.customResetField}>
                        <Text style={styles.customResetLabel}>{unit.label}</Text>
                        <TextInput
                          value={customReset[unit.value]}
                          onChangeText={(value) => {
                            setCustomReset((current) => ({
                              ...current,
                              [unit.value]: value.replace(/[^0-9]/g, ""),
                            }));
                          }}
                          keyboardType="number-pad"
                          placeholder="0"
                          placeholderTextColor={theme.colors.muted}
                          style={styles.customResetInput}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}

                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Optional notes"
                  placeholderTextColor={theme.colors.muted}
                  style={[styles.input, styles.notesInput]}
                  multiline
                />

                <Pressable
                  onPress={handleCreate}
                  disabled={!canCreate}
                  style={[styles.createButton, !canCreate && styles.disabled]}
                >
                  <Text style={styles.createText}>Create habit</Text>
                </Pressable>
              </ScrollView>
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

function getHabitKindLabel(value: "check" | "number") {
  return HABIT_KIND_OPTIONS.find((option) => option.value === value)?.label ?? "Check / complete";
}

function getResetPeriodLabel(value: ResetPeriod) {
  return RESET_PERIOD_OPTIONS.find((option) => option.value === value)?.label ?? "Daily";
}

function getCustomResetLabel(customReset: Record<CustomResetUnit, string>) {
  return CUSTOM_RESET_UNITS
    .map((unit) => {
      const amount = Number(customReset[unit.value]);

      if (!amount) {
        return null;
      }

      return `${amount} ${amount === 1 ? unit.value.slice(0, -1) : unit.value}`;
    })
    .filter(Boolean)
    .join(", ");
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(32,33,35,0.22)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radii.lg,
      borderTopRightRadius: theme.radii.lg,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 24,
      width: "100%",
      minHeight: 500,
      alignSelf: "center",
      shadowColor: "#2F2F2F",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.05,
      shadowRadius: 24,
    },
    handleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.border,
    },
    heading: {
      fontSize: fontSizes.header1,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 8,
    },
    subheading: {
      fontSize: fontSizes.header4,
      color: theme.colors.muted,
      marginBottom: 14,
      lineHeight: 20,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 4,
      marginBottom: 12,
      paddingVertical: 4,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: fontSizes.header4,
      fontWeight: "600",
    },
    input: {
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 12,
      color: theme.colors.text,
      fontSize: fontSizes.header4,
      marginBottom: 10,
    },
    fieldLabel: {
      color: theme.colors.secondary,
      fontSize: fontSizes.body,
      fontWeight: "700",
      marginBottom: 8,
      marginTop: 2,
      textTransform: "uppercase",
    },
    dropdown: {
      minHeight: 44,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 14,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    dropdownText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: fontSizes.header4,
      fontWeight: "600",
    },
    dropdownMenu: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radii.sm,
      marginBottom: 10,
      overflow: "hidden",
    },
    dropdownItem: {
      minHeight: 40,
      justifyContent: "center",
      paddingHorizontal: 14,
    },
    dropdownItemText: {
      color: theme.colors.secondary,
      fontSize: fontSizes.header4,
      fontWeight: "600",
    },
    customResetGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 10,
    },
    customResetField: {
      width: "31%",
    },
    customResetLabel: {
      color: theme.colors.muted,
      fontSize: fontSizes.iconCaption,
      fontWeight: "700",
      marginBottom: 4,
      textTransform: "uppercase",
    },
    customResetInput: {
      minHeight: 40,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontSize: fontSizes.header4,
      paddingHorizontal: 10,
    },
    notesInput: {
      minHeight: 86,
      textAlignVertical: "top",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
    },
    box: {
      width: "48%",
      minHeight: 126,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 14,
    },
    boxLocked: {
      opacity: 0.45,
    },
    boxPressed: {
      opacity: 0.85,
    },
    boxTitle: {
      color: theme.colors.text,
      fontSize: fontSizes.header3,
      fontWeight: "600",
      marginTop: 8,
    },
    boxSubtitle: {
      color: theme.colors.muted,
      fontSize: fontSizes.body,
      textAlign: "center",
      marginTop: 4,
    },
    createButton: {
      marginTop: 10,
      paddingVertical: 13,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.lg,
      alignItems: "center",
    },
    createText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 13,
    },
    disabled: {
      opacity: 0.4,
    },
  });
