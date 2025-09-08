import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { getQuickReplies } from "../services/ai/chatAssist";

export default function QuickReplies({ lastMessage = "", onPick }) {
  const [items, setItems] = useState([]);

  async function load() {
    const list = await getQuickReplies(lastMessage);
    setItems(list);
  }

  return (
    <View style={s.wrap}>
      <Pressable onPress={load} style={s.btn}>
        <Text style={s.btnText}>AI 추천 답장</Text>
      </Pressable>
      <View style={s.row}>
        {items.map((t, i) => (
          <Pressable key={i} style={s.chip} onPress={() => onPick?.(t)}>
            <Text style={s.chipText}>{t}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ paddingVertical:8 },
  btn:{ padding:10, backgroundColor:"#222", borderRadius:10, alignSelf:"flex-start" },
  btnText:{ color:"#fff", fontWeight:"600" },
  row:{ flexDirection:"row", flexWrap:"wrap", gap:8, marginTop:10 },
  chip:{ paddingVertical:8, paddingHorizontal:10, borderRadius:999, borderWidth:1, borderColor:"#ccc" },
  chipText:{ fontSize:14 }
});
