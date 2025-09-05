import React from "react";
import { View, Text, Pressable } from "react-native";
import { useMatchStore } from "../store/matchStore";
import { useI18n } from "../i18n/dict";
import { useTheme, stylesFromTheme } from "../theme/theme";

export default function ProfileScreen({ route }) {
  const id = route?.params?.id ?? "unknown";
  const { tokens } = useTheme();
  const s = stylesFromTheme(tokens);
  const { t } = useI18n();
  const toggleLike = useMatchStore((st) => st.toggleLike);
  const liked = useMatchStore((st) => st.liked);
  const isLiked = liked.includes(id);

  return (
    <View style={s.screen}>
      <Text style={s.title}>Profile: {id}</Text>
      <Pressable onPress={() => toggleLike(id)} style={s.btn}>
        <Text style={s.btnText}>{t("toggleLike")} ({isLiked ? "" : ""})</Text>
      </Pressable>
    </View>
  );
}
