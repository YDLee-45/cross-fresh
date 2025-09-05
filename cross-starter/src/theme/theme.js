import { useColorScheme } from "react-native";
import { create } from "zustand";

const light = { mode: "light", bg: "#ffffff", text: "#111827", primary: "#4f46e5", card: "#f3f4f6" };
const dark  = { mode: "dark",  bg: "#111827", text: "#e5e7eb", primary: "#818cf8", card: "#1f2937" };

const useThemeStore = create((set) => ({
  mode: "light",
  setMode: (m) => set({ mode: m }),
  toggle: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
}));

export function useTheme() {
  const system = useColorScheme();
  const { mode, setMode, toggle } = useThemeStore();
  return { tokens: mode === "dark" ? dark : light, mode, setMode, toggle, system };
}
export function useNavTheme() { const { mode } = useTheme(); return { mode }; }
export const stylesFromTheme = (t) => ({
  screen: { flex:1, alignItems:"center", justifyContent:"center", gap:12, backgroundColor: t.bg },
  title: { fontSize:18, fontWeight:"700", color:t.text },
  btn: { backgroundColor:t.primary, paddingHorizontal:16, paddingVertical:10, borderRadius:10 },
  btnText: { color:"#fff", fontWeight:"700" },
  text: { color:t.text },
  chip: { backgroundColor:t.card, paddingHorizontal:10, paddingVertical:6, borderRadius:999 }
});
