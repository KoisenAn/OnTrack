import { useFonts } from "expo-font";

export const fonts = {
  body: "System",
  heading: "System",
  mono: "System",
} as const;

export type Fonts = typeof fonts;

export const fontFiles = {
  "SF Pro Display Black": require("../assets/fonts/SF-Pro-Display-Black.otf"),
  "SF Pro Display Black Italic": require("../assets/fonts/SF-Pro-Display-BlackItalic.otf"),
  "SF Pro Display Bold": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
  "SF Pro Display Bold Italic": require("../assets/fonts/SF-Pro-Display-BoldItalic.otf"),
  "SF Pro Display Heavy": require("../assets/fonts/SF-Pro-Display-Heavy.otf"),
  "SF Pro Display Heavy Italic": require("../assets/fonts/SF-Pro-Display-HeavyItalic.otf"),
  "SF Pro Display Light": require("../assets/fonts/SF-Pro-Display-Light.otf"),
  "SF Pro Display Light Italic": require("../assets/fonts/SF-Pro-Display-LightItalic.otf"),
  "SF Pro Display Medium": require("../assets/fonts/SF-Pro-Display-Medium.otf"),
  "SF Pro Display Medium Italic": require("../assets/fonts/SF-Pro-Display-MediumItalic.otf"),
  "SF Pro Display Regular": require("../assets/fonts/SF-Pro-Display-Regular.otf"),
  "SF Pro Display Regular Italic": require("../assets/fonts/SF-Pro-Display-RegularItalic.otf"),
  "SF Pro Display Semibold": require("../assets/fonts/SF-Pro-Display-Semibold.otf"),
  "SF Pro Display Semibold Italic": require("../assets/fonts/SF-Pro-Display-SemiboldItalic.otf"),
  "SF Pro Display Thin": require("../assets/fonts/SF-Pro-Display-Thin.otf"),
  "SF Pro Display Thin Italic": require("../assets/fonts/SF-Pro-Display-ThinItalic.otf"),
  "SF Pro Display Ultralight": require("../assets/fonts/SF-Pro-Display-Ultralight.otf"),
  "SF Pro Display Ultralight Italic": require("../assets/fonts/SF-Pro-Display-UltralightItalic.otf"),
  "SF Pro Text Black": require("../assets/fonts/SF-Pro-Text-Black.otf"),
  "SF Pro Text Black Italic": require("../assets/fonts/SF-Pro-Text-BlackItalic.otf"),
  "SF Pro Text Bold": require("../assets/fonts/SF-Pro-Text-Bold.otf"),
  "SF Pro Text Bold Italic": require("../assets/fonts/SF-Pro-Text-BoldItalic.otf"),
  "SF Pro Text Heavy": require("../assets/fonts/SF-Pro-Text-Heavy.otf"),
  "SF Pro Text Heavy Italic": require("../assets/fonts/SF-Pro-Text-HeavyItalic.otf"),
  "SF Pro Text Light": require("../assets/fonts/SF-Pro-Text-Light.otf"),
  "SF Pro Text Light Italic": require("../assets/fonts/SF-Pro-Text-LightItalic.otf"),
  "SF Pro Text Medium": require("../assets/fonts/SF-Pro-Text-Medium.otf"),
  "SF Pro Text Medium Italic": require("../assets/fonts/SF-Pro-Text-MediumItalic.otf"),
  "SF Pro Text Regular": require("../assets/fonts/SF-Pro-Text-Regular.otf"),
  "SF Pro Text Regular Italic": require("../assets/fonts/SF-Pro-Text-RegularItalic.otf"),
  "SF Pro Text Semibold": require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
  "SF Pro Text Semibold Italic": require("../assets/fonts/SF-Pro-Text-SemiboldItalic.otf"),
  "SF Pro Text Thin": require("../assets/fonts/SF-Pro-Text-Thin.otf"),
  "SF Pro Text Thin Italic": require("../assets/fonts/SF-Pro-Text-ThinItalic.otf"),
  "SF Pro Text Ultralight": require("../assets/fonts/SF-Pro-Text-Ultralight.otf"),
  "SF Pro Text Ultralight Italic": require("../assets/fonts/SF-Pro-Text-UltralightItalic.otf"),
  "SF Pro Italic": require("../assets/fonts/SF-Pro-Italic.ttf"),
  "SF Pro": require("../assets/fonts/SF-Pro.ttf"),
  "SF Pro Rounded Black": require("../assets/fonts/SF-Pro-Rounded-Black.otf"),
  "SF Pro Rounded Bold": require("../assets/fonts/SF-Pro-Rounded-Bold.otf"),
  "SF Pro Rounded Heavy": require("../assets/fonts/SF-Pro-Rounded-Heavy.otf"),
  "SF Pro Rounded Light": require("../assets/fonts/SF-Pro-Rounded-Light.otf"),
  "SF Pro Rounded Medium": require("../assets/fonts/SF-Pro-Rounded-Medium.otf"),
  "SF Pro Rounded Regular": require("../assets/fonts/SF-Pro-Rounded-Regular.otf"),
  "SF Pro Rounded Semibold": require("../assets/fonts/SF-Pro-Rounded-Semibold.otf"),
  "SF Pro Rounded Thin": require("../assets/fonts/SF-Pro-Rounded-Thin.otf"),
  "SF Pro Rounded Ultralight": require("../assets/fonts/SF-Pro-Rounded-Ultralight.otf"),
} as const;

export const fontSizes = {
  title: 24,
  subtitle: 15,
  header1: 20,
  header2: 18,
  header3: 16,
  header4: 14,
  body: 12,
  iconCaption: 10,
} as const;

export type FontSizes = typeof fontSizes;

export type Typography = {
  fonts: Fonts;
  fontSizes: FontSizes;
};

export function useAppFonts() {
  const [loaded] = useFonts(fontFiles as Record<string, number>);
  return loaded;
}
