import React from "react";
import { View, Text, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";
import { openDL } from "../utils/deeplink";

export default function HomeScreen({ navigation }) {
  const lang = useMatchStore(s => s.lang);
  const setLang = useMatchStore(s => s.setLang);
  const { colors: c, themeMode, setThemeMode } = useTheme();

  const Btn = ({ title, to, bg }) => (
    <Pressable onPress={() => navigation.navigate(to)}
      style={{ backgroundColor: bg, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 12, minWidth: 180, alignItems:"center" }}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );

  const Small = ({ label, onPress }) => (
    <Pressable onPress={onPress}
      style={{ backgroundColor: c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10, marginHorizontal:4 }}>
      <Text style={{ color:"#fff", fontWeight:"700" }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex:1, backgroundColor: c.bg, alignItems:"center", justifyContent:"center", padding:16 }}>
      <Text style={{ color: c.text, fontSize:22, fontWeight:"800", marginBottom:20 }}>
        {t(lang,"app_title")} {t(lang,"reset_starter")}
      </Text>

      {/* 기본 네비게이션 */}
      <Btn title={t(lang,"start_swipe")} to="Swipe"  bg={c.primary} />
      <Btn title={t(lang,"open_liked")}   to="Liked"  bg={c.muted} />
      <Btn title={t(lang,"open_filter")}  to="Filter" bg="#455a64" />

      {/* 언어 */}
      <View style={{ flexDirection:"row", marginTop:12 }}>
        <Small label={t(lang,"lang_kr")} onPress={() => setLang("ko")} />
        <Small label={t(lang,"lang_jp")} onPress={() => setLang("ja")} />
        <Small label={t(lang,"lang_en")} onPress={() => setLang("en")} />
      </View>

      {/* 테마 */}
      <Text style={{ color: c.subtle, marginTop: 16, marginBottom: 6 }}>{t(lang,"theme")}</Text>
      <View style={{ flexDirection:"row" }}>
        <Small label={t(lang,"system")} onPress={() => setThemeMode("system")} />
        <Small label={t(lang,"light")}  onPress={() => setThemeMode("light")} />
        <Small label={t(lang,"dark")}   onPress={() => setThemeMode("dark")} />
      </View>

      {/* 딥링크 테스트 */}
      <Text style={{ color: c.subtle, marginTop: 16, marginBottom: 6 }}>Deep Link</Text>
      <View style={{ flexDirection:"row" }}>
        <Small label="cross://liked"  onPress={() => { openDL("liked");  setTimeout(()=>navigation.navigate("Liked"), 200); }} />
        <Small label="cross://filter" onPress={() => { openDL("filter"); setTimeout(()=>navigation.navigate("Filter"), 200); }} />
        <Small label="cross://swipe"  onPress={() => { openDL("swipe");  setTimeout(()=>navigation.navigate("Swipe"), 200); }} />
      </View>
    </View>
  );
}
