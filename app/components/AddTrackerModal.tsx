import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Icon from "../components/Icon";
import { fontSizes } from "../fonts";
import { IconLibrary, Theme, useTheme } from "../theme";

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

const TRACKER_TYPES = ["Habit", "Record", "Log"];

const TRACKER_DESCRIPTIONS: Record<string, string> = {
  Habit: "Track habits",
  Record: "Record values",
  Log: "Log entries",
};

const TRACKER_ICONS: Record<string, Record<IconLibrary, string>> = {
  Habit: {
    fontawesome: "check-circle",
    fontawesome5: "check-circle",
    fontawesome6: "check-circle",
    feather: "check-circle",
  },
  Record: {
    fontawesome: "clipboard",
    fontawesome5: "clipboard",
    fontawesome6: "clipboard",
    feather: "clipboard",
  },
  Log: {
    fontawesome: "file-alt",
    fontawesome5: "file-alt",
    fontawesome6: "file-alt",
    feather: "file-text",
  },
};

export default function AddTrackerModal({ visible, onClose, onCreate }: Props) {
  const { theme, iconLibrary } = useTheme();
  const styles = createStyles(theme);
  const [step, setStep] = useState(1);
  const [type, setType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(800)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        panY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 8) {
          Alert.alert("Panned");
        }
        const shouldClose = gestureState.dy > 100 || gestureState.vy > 0.8;
        if (shouldClose) {
          Animated.timing(slideY, {
            toValue: 800,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            reset();
            onClose();
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(panY, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      backdropOpacity.setValue(0);
      panY.setValue(0);
      slideY.setValue(800);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isMounted) {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 800,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible, isMounted, backdropOpacity, slideY, panY]);

  function reset() {
    setStep(1);
    setType(null);
    setTitle("");
    setNotes("");
  }

  function close() {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 800,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      panY.setValue(0);
      reset();
      onClose();
    });
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
    <Modal visible={visible || isMounted} transparent onRequestClose={close}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}> 
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.container,
            { transform: [{ translateY: Animated.add(slideY, panY) }] },
          ]}
        >
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>
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
                    <Icon
                      name={TRACKER_ICONS[t]?.[iconLibrary] ?? "circle"}
                      size={28}
                      color={type === t ? "#fff" : theme.colors.text}
                      style={styles.boxIcon}
                    />
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
      borderRadius: theme.radii.lg,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: 12,
      alignSelf: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    handleWrapper: {
      alignItems: 'center',
      marginBottom: 8,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.border,
    },
    heading: {
      fontSize: fontSizes.title,
      color: theme.colors.text,
      padding: 8,
      fontWeight: '700',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: 10
    },
    box: {
      width: '45%',
      aspectRatio: 1,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
    boxActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    boxPressed: { opacity: 0.85 },
    boxTitle: {
      color: theme.colors.text,
      fontSize: fontSizes.title,
      fontWeight: '400',
      marginTop: 8,
      marginBottom: 2,
    },
    boxTitleActive: {
      color: '#fff',
    },
    boxSubtitle: {
      color: theme.colors.muted,
      fontSize: fontSizes.body,
      textAlign: 'center',
    },
    boxIcon: {
      marginBottom: 6,
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
