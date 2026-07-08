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
