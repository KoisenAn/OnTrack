import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useAppFonts } from "./fonts";

export const light = {
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#007AFF",
    secondary: "#000000",
    muted: "#6B7280",
    border: "#E5E7EB",
    slider: "#EEEEEE",
    text: "#111827",
    tabBarBackground: "#ffffff",
  },
  spacing: {
    screenEdge: 10,
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
    surface: "#fafafa",
    primary: "#000000",
    secondary: "#b3b3b3",
    muted: "#707070",
    border: "#e9e9e9",
    slider: "#EEEEEE",
    text: "#000000",
    tabBarBackground: "#ffffff",
  },
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
  spacing: light.spacing,
  radii: light.radii,
};

export type Theme = typeof dark;

export type IconLibrary = 'fontawesome' | 'fontawesome5' | 'fontawesome6' | 'feather';

export const AVAILABLE_ICON_LIBRARIES: IconLibrary[] = [
  'fontawesome',
  'fontawesome5',
  'fontawesome6',
  'feather',
];

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  iconLibrary: IconLibrary;
  setIconLibrary: (lib: IconLibrary) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: dark,
  setTheme: () => {},
  iconLibrary: 'fontawesome6',
  setIconLibrary: () => {},
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const fontsLoaded = useAppFonts();
  const [theme, setTheme] = useState<Theme>(minimalLight);
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>('fontawesome6');

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, iconLibrary, setIconLibrary }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
}
