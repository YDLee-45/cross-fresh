import React from "react";
import { View, Text, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

export default function HomeScreen({ navigation }) {
  const lang = useMatchStore(s => s.lang);
  const setLang = useMatchStore(s => s.setLang);
  const { colors: c, themeMode, setThemeMode } = useTheme();

  const Btn = ({ title, to, bg }) => (
    <Pressable
      onPress={() => navigation.navigate(to)}
      style={{
        backgroundColor: bg,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        minWidth: 180,
        alignItems: "center"
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );

  const Small = ({ label, onPress, active = false }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? c.primary : c.muted,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginHorizontal: 4
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ color: c.text, fontSize: 22, fontWeight: "800", marginBottom: 20 }}>
        {t(lang, "app_title")} {t(lang, "reset_starter")}
      </Text>

      <Btn title={t(lang, "start_swipe")} to="Swipe"  bg={c.primary} />
      <Btn title={t(lang, "open_liked")}   to="Liked"  bg={c.muted} />
      <Btn title={t(lang, "open_filter")}  to="Filter" bg="#455a64" />

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Small label={t(lang, "lang_kr")} onPress={() => setLang("ko")} active={lang === "ko"} />
        <Small label={t(lang, "lang_jp")} onPress={() => setLang("ja")} active={lang === "ja"} />
        <Small label={t(lang, "lang_en")} onPress={() => setLang("en")} active={lang === "en"} />
      </View>

      <Text style={{ color: c.subtle, marginTop: 16, marginBottom: 6 }}>{t(lang, "theme")}</Text>
      <View style={{ flexDirection: "row" }}>
        <Small label={t(lang, "system")} onPress={() => setThemeMode("system")} active={themeMode === "system"} />
        <Small label={t(lang, "light")}  onPress={() => setThemeMode("light")}  active={themeMode === "light"} />
        <Small label={t(lang, "dark")}   onPress={() => setThemeMode("dark")}   active={themeMode === "dark"} />
      </View>
    </View>
  );
}
