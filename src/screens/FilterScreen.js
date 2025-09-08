import React from "react";
import { View, Text, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

function Chip({ label, active, onPress, c }) {
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: active? c.primary : c.muted, paddingVertical:10, paddingHorizontal:14, borderRadius:12, marginRight:8 }}>
      <Text style={{ color:"#fff", fontWeight:"700" }}>{label}</Text>
    </Pressable>
  );
}
function Stepper({ label, value, setValue, c }) {
  const dec = () => setValue(v=>Math.max(18,v-1));
  const inc = () => setValue(v=>Math.min(60,v+1));
  return (
    <View style={{ marginBottom:16 }}>
      <Text style={{ color:c.subtle, marginBottom:8 }}>{label}: <Text style={{ color:c.text }}>{value}</Text></Text>
      <View style={{ flexDirection:"row" }}>
        <Pressable onPress={dec} style={{ backgroundColor:c.muted, padding:10, borderRadius:10, marginRight:8 }}><Text style={{ color:"#fff", fontWeight:"800" }}>-</Text></Pressable>
        <Pressable onPress={inc} style={{ backgroundColor:c.muted, padding:10, borderRadius:10 }}><Text style={{ color:"#fff", fontWeight:"800" }}>+</Text></Pressable>
      </View>
    </View>
  );
}

export default function FilterScreen({ navigation }) {
  const { colors: c } = useTheme();
  const lang = useMatchStore(s=>s.lang);
  const filters = useMatchStore(s=>s.filters);
  const setFilters = useMatchStore(s=>s.setFilters);
  const resetFilters = useMatchStore(s=>s.resetFilters);
  const [gender,setGender]=React.useState(filters.gender);
  const [minAge,setMinAge]=React.useState(filters.ageRange[0]);
  const [maxAge,setMaxAge]=React.useState(filters.ageRange[1]);

  const apply=()=>{ const min=Math.min(minAge,maxAge); const max=Math.max(minAge,maxAge); setFilters({gender,ageRange:[min,max]}); navigation.goBack(); };
  const reset=()=>{ resetFilters(); navigation.goBack(); };

  return (
    <View style={{ flex:1, backgroundColor:c.bg, padding:16 }}>
      <Text style={{ color:c.text, fontSize:20, fontWeight:"800", marginBottom:16 }}>{t(lang,"filter")}</Text>
      <Text style={{ color:c.subtle, marginBottom:8 }}>{t(lang,"gender")}</Text>
      <View style={{ flexDirection:"row", marginBottom:20 }}>
        <Chip label={t(lang,"all")} active={!gender} onPress={()=>setGender(null)} c={c}/>
        <Chip label={t(lang,"male")} active={gender==="M"} onPress={()=>setGender("M")} c={c}/>
        <Chip label={t(lang,"female")} active={gender==="F"} onPress={()=>setGender("F")} c={c}/>
      </View>
      <Stepper label={t(lang,"min_age")} value={minAge} setValue={setMinAge} c={c}/>
      <Stepper label={t(lang,"max_age")} value={maxAge} setValue={setMaxAge} c={c}/>
      <View style={{ flexDirection:"row", justifyContent:"space-between", marginTop:8 }}>
        <Pressable onPress={reset} style={{ backgroundColor:c.muted, paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"reset")}</Text>
        </Pressable>
        <Pressable onPress={apply} style={{ backgroundColor:c.primary, paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"apply")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
