import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Theme, useTheme } from "../theme";

export type NewTracker = {
  type: string;
  title: string;
  notes?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: NewTracker) => void;
};

const TRACKER_TYPES = ["Habit", "Counter", "Timer", "Numeric"];

const TRACKER_DESCRIPTIONS: Record<string, string> = {
  Habit: "Track daily habits",
  Counter: "Count occurrences",
  Timer: "Time activities",
  Numeric: "Log numbers",
};

export default function AddTrackerModal({ visible, onClose, onCreate }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [step, setStep] = useState(1);
  const [type, setType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(slideY, {
          toValue: 500,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, slideY]);

  function reset() {
    setStep(1);
    setType(null);
    setTitle("");
    setNotes("");
  }

  function close() {
    reset();
    onClose();
  }

  function handleNext() {
    setStep((s) => s + 1);
  }

  function handleCreate() {
    if (!type) return;
    onCreate({ type, title: title || `${type} Tracker`, notes });
    close();
  }

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={close}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Animated.View style={[styles.container, { transform: [{ translateY: slideY }] }]}>
          {step === 1 && (
            <View>
              <Text style={styles.heading}>Select tracker type</Text>
              <View style={styles.grid}>
                {TRACKER_TYPES.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={({ pressed }) => [
                      styles.box,
                      type === t && styles.boxActive,
                      pressed && styles.boxPressed,
                    ]}
                  >
                    <Text style={[styles.boxTitle, type === t && styles.boxTitleActive]}>{t}</Text>
                    <Text style={[styles.boxSubtitle, type === t && styles.boxSubtitleActive]}>
                      {TRACKER_DESCRIPTIONS[t]}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.row}>
                <Pressable onPress={close} style={styles.cancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleNext} style={[styles.next, !type && styles.disabled]} disabled={!type}>
                  <Text style={styles.nextText}>Next</Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.heading}>Name your tracker</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Daily Steps"
                placeholderTextColor={theme.colors.border}
                style={styles.input}
              />
              <Text style={[styles.help]}>Optional notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes or description"
                placeholderTextColor={theme.colors.border}
                style={[styles.input, { height: 80 }]}
                multiline
              />
              <View style={styles.row}>
                <Pressable onPress={() => setStep(1)} style={styles.cancel}>
                  <Text style={styles.cancelText}>Back</Text>
                </Pressable>
                <Pressable onPress={handleNext} style={styles.next}>
                  <Text style={styles.nextText}>Review</Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.heading}>Confirm</Text>
              <Text style={styles.summaryLabel}>Type</Text>
              <Text style={styles.summaryValue}>{type}</Text>
              <Text style={styles.summaryLabel}>Title</Text>
              <Text style={styles.summaryValue}>{title || `${type} Tracker`}</Text>
              {notes ? (
                <>
                  <Text style={styles.summaryLabel}>Notes</Text>
                  <Text style={styles.summaryValue}>{notes}</Text>
                </>
              ) : null}

              <View style={styles.row}>
                <Pressable onPress={() => setStep(2)} style={styles.cancel}>
                  <Text style={styles.cancelText}>Back</Text>
                </Pressable>
                <Pressable onPress={handleCreate} style={styles.next}>
                  <Text style={styles.nextText}>Create</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: 12,
      maxWidth: '80%',
      alignSelf: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 340,
    },
    heading: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 10,
      fontWeight: '700',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    box: {
      width: '40%',
      aspectRatio: 1,
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    boxActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    boxPressed: { opacity: 0.85 },
    boxTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 2,
    },
    boxTitleActive: {
      color: '#fff',
    },
    boxSubtitle: {
      color: theme.colors.muted,
      fontSize: 9,
      textAlign: 'center',
    },
    boxSubtitleActive: {
      color: '#fff',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    cancel: {
      padding: 8,
    },
    cancelText: {
      color: theme.colors.muted,
      fontSize: 12,
    },
    next: {
      padding: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    disabled: {
      opacity: 0.4,
    },
    nextText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 8,
      color: theme.colors.text,
      marginBottom: 6,
      fontSize: 12,
    },
    help: {
      color: theme.colors.muted,
      marginBottom: 4,
      fontSize: 12,
    },
    summaryLabel: {
      color: theme.colors.muted,
      fontSize: 11,
      marginTop: 6,
    },
    summaryValue: {
      color: theme.colors.text,
      fontSize: 14,
    },
    pressed: { opacity: 0.85 },
  });
