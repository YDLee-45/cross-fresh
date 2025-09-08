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
      style={{ backgroundColor: bg, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 12, minWidth: 180, alignItems:"center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );

  const LangBtn = ({ code, label }) => (
    <Pressable onPress={() => setLang(code)} style={{ backgroundColor: lang===code ? c.primary : c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10, marginHorizontal:4 }}>
      <Text style={{ color:"#fff", fontWeight:"700" }}>{label}</Text>
    </Pressable>
  );

  const ThemeBtn = ({ mode, label }) => (
    <Pressable onPress={() => setThemeMode(mode)} style={{ backgroundColor: themeMode===mode ? c.primary : c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10, marginHorizontal:4 }}>
      <Text style={{ color:"#fff", fontWeight:"700" }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ color: c.text, fontSize: 22, fontWeight: "800", marginBottom: 20 }}>
        {t(lang,"app_title")} {t(lang,"reset_starter")}
      </Text>

      <Btn title={t(lang,"start_swipe")} to="Swipe"  bg={c.primary} />
      <Btn title={t(lang,"open_liked")}   to="Liked"  bg={c.muted} />
      <Btn title={t(lang,"open_filter")}  to="Filter" bg="#455a64" />

      {/* 언어 */}
      <View style={{ flexDirection:"row", marginTop: 12 }}>
        <LangBtn code="ko" label={t(lang,"lang_kr")} />
        <LangBtn code="ja" label={t(lang,"lang_jp")} />
        <LangBtn code="en" label={t(lang,"lang_en")} />
      </View>

      {/* 테마 */}
      <Text style={{ color: c.subtle, marginTop: 16, marginBottom: 6 }}>{t(lang,"theme")}</Text>
      <View style={{ flexDirection:"row" }}>
        <ThemeBtn mode="system" label={t(lang,"system")} />
        <ThemeBtn mode="light"  label={t(lang,"light")} />
        <ThemeBtn mode="dark"   label={t(lang,"dark")} />
      </View>
    </View>
  );
}
