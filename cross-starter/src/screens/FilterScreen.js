import React from "react";
import { View, Text, Pressable } from "react-native";
import { useMatchStore } from "../store/matchStore";
import { useTheme, stylesFromTheme } from "../theme/theme";

export default function FilterScreen() {
  const { tokens } = useTheme();
  const s = stylesFromTheme(tokens);
  const filters = useMatchStore((st) => st.filters);
  const setFilters = useMatchStore((st) => st.setFilters);

  return (
    <View style={s.screen}>
      <Text style={s.text}>gender: {String(filters.gender)}</Text>
      <Text style={s.text}>ageRange: {filters.ageRange[0]}~{filters.ageRange[1]}</Text>
      <Pressable onPress={() => setFilters({ ageRange: [25, 40] })} style={s.btn}>
        <Text style={s.btnText}>나이 25~40로 설정</Text>
      </Pressable>
    </View>
  );
}
