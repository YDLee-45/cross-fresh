import { useColorScheme } from "react-native";
import useMatchStore from "../store/matchStore";

export const PALETTE = {
  light: {
    bg: "#f5f7fb",
    text: "#111827",
    subtle: "#4b5563",
    card: "#ffffff",
    badge: "#e0e7ff",
    muted: "#e2e8f0",
    primary: "#1976d2",
    success: "#4cd137",
    danger: "#ff6b6b",
    accent: "#1976d2"
  },
  dark: {
    bg: "#0b1020",
    text: "#ffffff",
    subtle: "#9fb3c8",
    card: "#1b2340",
    badge: "#263859",
    muted: "#374b6b",
    primary: "#1976d2",
    success: "#4cd137",
    danger: "#ff6b6b",
    accent: "#90caf9"
  }
};

export function useTheme() {
  const themeMode = useMatchStore(s => s.themeMode); // 'system' | 'light' | 'dark'
  const setThemeMode = useMatchStore(s => s.setThemeMode);
  const sys = useColorScheme(); // 'light' | 'dark' | null
  const effective = themeMode === "system" ? (sys || "light") : themeMode;
  const colors = effective === "dark" ? PALETTE.dark : PALETTE.light;
  return { colors, themeMode, setThemeMode, effective };
}
