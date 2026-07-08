import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ColorValue, StyleProp, TextStyle } from "react-native";

type Props = {
  name: string;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
};

const ICONS: Record<string, keyof typeof FontAwesome6.glyphMap> = {
  "check-circle": "circle-check",
  "chevron-down": "chevron-down",
  "chevron-left": "chevron-left",
  "chevron-up": "chevron-up",
  check: "check",
  circle: "circle",
  clipboard: "clipboard",
  dashboard: "house",
  list: "list",
  minus: "minus",
  plus: "plus",
  settings: "gear",
  social: "users",
  stats: "chart-pie",
};

export default function Icon({ name, size = 24, color, style }: Props) {
  const iconName = ICONS[name] ?? "circle";

  return <FontAwesome6 name={iconName} size={size} color={color} style={style} />;
}
