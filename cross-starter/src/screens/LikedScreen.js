import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useMatchStore } from "../store/matchStore";
import { useI18n } from "../i18n/dict";
import { useNavigation } from "@react-navigation/native";
import { useTheme, stylesFromTheme } from "../theme/theme";

export default function LikedScreen() {
  const liked = useMatchStore((s) => s.liked);
  const { t } = useI18n();
  const nav = useNavigation();
  const { tokens } = useTheme();
  const s = stylesFromTheme(tokens);
  useEffect(() => { nav.setOptions({ title: t("liked") }); }, [nav, t]);

  return (
    <View style={s.screen}>
      {liked.length === 0 ? <Text style={s.text}>{t("empty")}</Text> :
        liked.map((id) => <Text key={id} style={s.text}> {id}</Text>)}
    </View>
  );
}
