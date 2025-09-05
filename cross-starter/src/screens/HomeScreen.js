import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useI18n } from "../i18n/dict";
import { useTheme, stylesFromTheme } from "../theme/theme";

export default function HomeScreen() {
  const nav = useNavigation();
  const { t, lang, setLang } = useI18n();
  const { tokens, toggle, mode } = useTheme();
  const s = stylesFromTheme(tokens);
  useEffect(() => { nav.setOptions({ title: t("starter") }); }, [nav, t, lang]);

  return (
    <View style={s.screen}>
      <Text style={s.title}>{t("starter")}</Text>

      <Pressable onPress={() => nav.navigate("Liked")} style={s.btn}><Text style={s.btnText}>{t("goLiked")}</Text></Pressable>
      <Pressable onPress={() => nav.navigate("Filter")} style={s.btn}><Text style={s.btnText}>{t("goFilter")}</Text></Pressable>
      <Pressable onPress={() => nav.navigate("Profile", { id: "u1" })} style={s.btn}><Text style={s.btnText}>{t("goProfile")}</Text></Pressable>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <Pressable onPress={toggle} style={s.chip}><Text style={s.text}>{t("theme")}: {mode}</Text></Pressable>
        <Pressable onPress={() => setLang(lang === "ko" ? "ja" : lang === "ja" ? "en" : "ko")} style={s.chip}>
          <Text style={s.text}>{t("language")}: {lang.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}
