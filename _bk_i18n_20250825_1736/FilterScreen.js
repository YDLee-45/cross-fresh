import React from "react";
import { View, Text, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress}
      style={{ backgroundColor: active ? "#1976d2" : "#374b6b",
               paddingVertical:10, paddingHorizontal:14, borderRadius:12, marginRight:8 }}>
      <Text style={{ color:"#fff", fontWeight:"700" }}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ label, value, setValue }) {
  const dec = () => setValue(v => Math.max(18, v-1));
  const inc = () => setValue(v => Math.min(60, v+1));
  return (
    <View style={{ marginBottom:16 }}>
      <Text style={{ color:"#9fb3c8", marginBottom:8 }}>{label}: <Text style={{ color:"#fff" }}>{value} 세</Text></Text>
      <View style={{ flexDirection:"row" }}>
        <Pressable onPress={dec} style={{ backgroundColor:"#374b6b", padding:10, borderRadius:10, marginRight:8 }}>
          <Text style={{ color:"#fff", fontWeight:"800" }}>-</Text>
        </Pressable>
        <Pressable onPress={inc} style={{ backgroundColor:"#374b6b", padding:10, borderRadius:10 }}>
          <Text style={{ color:"#fff", fontWeight:"800" }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function FilterScreen({ navigation }) {
  const filters = useMatchStore(s => s.filters);
  const setFilters = useMatchStore(s => s.setFilters);
  const resetFilters = useMatchStore(s => s.resetFilters);

  const [gender, setGender] = React.useState(filters.gender);
  const [minAge, setMinAge] = React.useState(filters.ageRange[0]);
  const [maxAge, setMaxAge] = React.useState(filters.ageRange[1]);

  const apply = () => {
    const min = Math.min(minAge, maxAge);
    const max = Math.max(minAge, maxAge);
    setFilters({ gender, ageRange: [min, max] });
    navigation.goBack();
  };

  const reset = () => { resetFilters(); navigation.goBack(); };

  return (
    <View style={{ flex:1, backgroundColor:"#0b1020", padding:16 }}>
      <Text style={{ color:"#fff", fontSize:20, fontWeight:"800", marginBottom:16 }}>필터</Text>

      <Text style={{ color:"#9fb3c8", marginBottom:8 }}>성별</Text>
      <View style={{ flexDirection:"row", marginBottom:20 }}>
        <Chip label="ALL" active={!gender} onPress={() => setGender(null)} />
        <Chip label="남"  active={gender==="M"} onPress={() => setGender("M")} />
        <Chip label="여"  active={gender==="F"} onPress={() => setGender("F")} />
      </View>

      <Stepper label="나이 (최소)" value={minAge} setValue={setMinAge} />
      <Stepper label="나이 (최대)" value={maxAge} setValue={setMaxAge} />

      <View style={{ flexDirection:"row", justifyContent:"space-between", marginTop:8 }}>
        <Pressable onPress={reset} style={{ backgroundColor:"#374b6b", paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>초기화</Text>
        </Pressable>
        <Pressable onPress={apply} style={{ backgroundColor:"#1976d2", paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>적용</Text>
        </Pressable>
      </View>
    </View>
  );
}
