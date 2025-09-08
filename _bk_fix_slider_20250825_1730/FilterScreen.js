import React from "react";
import { View, Text, Pressable } from "react-native";
import { Slider } from "expo-slider";
import useMatchStore from "../store/matchStore";

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? "#1976d2" : "#374b6b",
        paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 8
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

export default function FilterScreen({ navigation }) {
  const filters = useMatchStore((s) => s.filters);
  const setFilters = useMatchStore((s) => s.setFilters);
  const resetFilters = useMatchStore((s) => s.resetFilters);

  const [gender, setGender] = React.useState(filters.gender);
  const [minAge, setMinAge] = React.useState(filters.ageRange[0]);
  const [maxAge, setMaxAge] = React.useState(filters.ageRange[1]);

  const apply = () => {
    const min = Math.min(minAge, maxAge);
    const max = Math.max(minAge, maxAge);
    setFilters({ gender, ageRange: [min, max] });
    navigation.goBack();
  };

  const reset = () => {
    resetFilters();
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 16 }}>필터</Text>

      <Text style={{ color: "#9fb3c8", marginBottom: 8 }}>성별</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Chip label="ALL" active={!gender} onPress={() => setGender(null)} />
        <Chip label="남"  active={gender==="M"} onPress={() => setGender("M")} />
        <Chip label="여"  active={gender==="F"} onPress={() => setGender("F")} />
      </View>

      <Text style={{ color: "#9fb3c8", marginBottom: 8 }}>나이 (최소)</Text>
      <Slider
        value={minAge}
        onValueChange={setMinAge}
        minimumValue={18}
        maximumValue={60}
        step={1}
        style={{ height: 40, marginBottom: 8 }}
      />
      <Text style={{ color: "#fff", marginBottom: 16 }}>{minAge} 세</Text>

      <Text style={{ color: "#9fb3c8", marginBottom: 8 }}>나이 (최대)</Text>
      <Slider
        value={maxAge}
        onValueChange={setMaxAge}
        minimumValue={18}
        maximumValue={60}
        step={1}
        style={{ height: 40, marginBottom: 8 }}
      />
      <Text style={{ color: "#fff", marginBottom: 24 }}>{maxAge} 세</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable onPress={reset} style={{ backgroundColor: "#374b6b", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>초기화</Text>
        </Pressable>
        <Pressable onPress={apply} style={{ backgroundColor: "#1976d2", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>적용</Text>
        </Pressable>
      </View>
    </View>
  );
}
