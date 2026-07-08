import { createContext, useContext, useState, type PropsWithChildren } from "react";

export const light = {
  colors: {
    background: "#F7F7F7",
    surface: "#FFFFFF",
    primary: "#2F2F2F",
    secondary: "#666666",
    muted: "#9A9A9A",
    border: "#DEDEDE",
    slider: "#EEEEEE",
    text: "#2F2F2F",
    tabBarBackground: "#FFFFFF",
  },
  spacing: {
    screenEdge: 20,
  },
  radii: {
    sm: 14,
    md: 20,
    lg: 28,
  },
};

export const minimalLight = {
  colors: {
    background: "#F7F7F7",
    surface: "#FFFFFF",
    primary: "#2F2F2F",
    secondary: "#666666",
    muted: "#9A9A9A",
    border: "#DEDEDE",
    slider: "#EEEEEE",
    text: "#2F2F2F",
    tabBarBackground: "#FFFFFF",
  },
  spacing: light.spacing,
  radii: light.radii,
};

export const dark = {
  colors: {
    background: "#1F1F1F",
    surface: "#2B2B2B",
    primary: "#EEEEEE",
    secondary: "#C7C7C7",
    muted: "#999999",
    border: "#444444",
    slider: "#3A3A3A",
    text: "#F7F7F7",
    tabBarBackground: "#2B2B2B",
  },
  spacing: light.spacing,
  radii: light.radii,
};

export const minimalDark = {
  colors: {
    background: "#1F1F1F",
    surface: "#2B2B2B",
    primary: "#EEEEEE",
    secondary: "#C7C7C7",
    muted: "#999999",
    border: "#444444",
    slider: "#3A3A3A",
    text: "#F7F7F7",
    tabBarBackground: "#2B2B2B",
  },
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
}
