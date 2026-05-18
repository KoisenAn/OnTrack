import { createContext, useContext, useState, type PropsWithChildren } from "react";

export const light = {
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#007AFF",
    secondary: "#9CA3AF",
    muted: "#6B7280",
    border: "#E5E7EB",
    slider: "#EEEEEE",
    text: "#111827",
    tabBarBackground: "#ffffff",
  },
  fonts: {
    body: "System",
    heading: "System",
    mono: "System",
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 30,
  },
};

export const minimalLight = {
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#000000",
    secondary: "#9CA3AF",
    muted: "#6B7280",
    border: "#E5E7EB",
    slider: "#EEEEEE",
    text: "#000000",
    tabBarBackground: "#ffffff",
  },
  fonts: light.fonts,
  fontSizes: light.fontSizes,
  spacing: light.spacing,
  radii: light.radii,
};

export const dark = {
  colors: {
    background: "#0F172A",
    surface: "#111827",
    primary: "#60A5FA",
    secondary: "#94A3B8",
    muted: "#A1A1AA",
    border: "#1F2937",
    slider: "#1E293B",
    text: "#F8FAFC",
    tabBarBackground: "#111827",
  },
  fonts: light.fonts,
  fontSizes: light.fontSizes,
  spacing: light.spacing,
  radii: light.radii,
};

export const minimalDark = {
  colors: {
    background: "#000000",
    surface: "#f8f8f8",
    primary: "#333333",
    secondary: "#7e7e7e",
    muted: "#818181",
    border: "#e6e6e6",
    slider: "#EEEEEE",
    text: "#ffffff",
    tabBarBackground: "#616161",
  },
  fonts: light.fonts,
  fontSizes: light.fontSizes,
  spacing: light.spacing,
  radii: light.radii,
};

export type Theme = typeof dark;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: dark,
  setTheme: () => {},
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(minimalLight);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  return useContext(ThemeContext);
}
