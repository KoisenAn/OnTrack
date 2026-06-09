import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
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

const TRACKER_TYPES = ["Habit", "Record", "Log", "List"];

const TRACKER_DESCRIPTIONS: Record<string, string> = {
  Habit: "Track habits",
  Record: "Record values",
  Log: "Log entries",
  List: "Manage items"
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
  List: {
    fontawesome: "list",
    fontawesome5: "list",
    fontawesome6: "list",
    feather: "list",
  },

};

export default function AddTrackerModal({ visible, onClose, onCreate }: Props) {
  const { theme, iconLibrary } = useTheme();
  const styles = createStyles(theme);
  const [type, setType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const canSelectType = title.trim().length > 0;
  const canCreate = canSelectType && type;

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
          reset();
          onClose();
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
    setType(null);
    setTitle("");
    setNotes("");
  }

  function close() {
    backdropOpacity.value = withTiming(0, { duration: 150 });

    translateY.value = withTiming(800, { duration: 180 }, () => {
      dragY.value = 0;
      runOnJS(reset)();
      runOnJS(onClose)();
    });
  }

  function handleCreate() {
    if (!type) return;
    onCreate({ type, title: title || `${type} Tracker`, notes });
    close();
  }

  return (
  <Modal visible={visible} transparent onRequestClose={close}>
    <GestureDetector gesture={panGesture}>

      <Animated.View style={[styles.backdrop, backdropStyle]}>

        <Animated.View
          style={[styles.container, containerStyle]}
        >
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.heading}>Create tracker</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Daily Steps"
            placeholderTextColor={theme.colors.border}
            style={styles.input}
          />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            placeholderTextColor={theme.colors.border}
            style={[styles.input, { height: 70 }]}
          />

          <Text style={[styles.subheading, !canSelectType && { opacity: 0.4 }]}>
            Choose a tracker type
          </Text>

          <View style={[styles.grid, !canSelectType && styles.disabledBlock]}>
            {TRACKER_TYPES.map((t) => {
              const locked = !canSelectType;
            
              return (
                <Pressable
                  key={t}
                  onPress={() => {
                    if (locked) return;
                    setType(t);
                  }}
                  style={({ pressed }) => [
                    styles.box,
                    type === t && styles.boxActive,
                    locked && styles.boxLocked,
                    pressed && styles.boxPressed,
                  ]}
                >
                  <Icon
                    name={TRACKER_ICONS[t]?.[iconLibrary] ?? "circle"}
                    size={28}
                    color={type === t ? "#fff" : theme.colors.text}
                  />

                  <Text style={[styles.boxTitle, type === t && styles.boxTitleActive]}>
                    {t}
                  </Text>
                
                  <Text style={[styles.boxSubtitle, type === t && styles.boxSubtitleActive]}>
                    {TRACKER_DESCRIPTIONS[t]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={!canCreate}
            style={[styles.createButton, !canCreate && styles.disabled]}
          >
            <Text style={styles.createText}>Create Tracker</Text>
          </Pressable>          
        </Animated.View>
      </Animated.View>
    </GestureDetector>
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
      width: '100%',
      height: 600,
      alignSelf: 'center',
    },
    handleWrapper: {
      alignItems: 'center',
      marginBottom: 10,
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
      fontWeight: '700',
      paddingVertical: 8,
    },
    subheading: {
      fontSize: fontSizes.body,
      color: theme.colors.muted,
      marginTop: 10,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 10,
      color: theme.colors.text,
      fontSize: 13,
      marginBottom: 8,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    box: {
      width: 160,
      aspectRatio: 1,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      margin: 8,
    },
    boxActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    boxLocked: {
      opacity: 0.4,
    },
    boxPressed: {
      opacity: 0.85,
    },
    boxTitle: {
      color: theme.colors.text,
      fontSize: fontSizes.title,
      fontWeight: '500',
      marginTop: 6,
    },
    boxTitleActive: {
      color: '#fff',
    },
    boxSubtitle: {
      color: theme.colors.muted,
      fontSize: fontSizes.body,
      textAlign: 'center',
      marginTop: 2,
    },
    boxSubtitleActive: {
      color: '#fff',
    },
    disabledBlock: {
      opacity: 0.5,
    },
    createButton: {
      marginTop: 14,
      paddingVertical: 12,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: 'center',
    },
    createText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
    disabled: {
      opacity: 0.4,
    },
  });
