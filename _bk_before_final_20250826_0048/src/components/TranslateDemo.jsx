import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { translateText } from "../services/ai/translation";

export default function TranslateDemo() {
  const [src, setSrc] = useState("안녕하세요!");
  const [dst, setDst] = useState("");

  async function onTranslate() {
    const out = await translateText(src, "ja");
    setDst(out);
  }

  return (
    <View style={s.wrap}>
      <Text style={s.title}>AI 번역 데모</Text>
      <TextInput
        value={src}
        onChangeText={setSrc}
        placeholder="원문 입력"
        style={s.input}
      />
      <Pressable onPress={onTranslate} style={s.btn}>
        <Text style={s.btnText}>AI 번역(ja)</Text>
      </Pressable>
      <Text style={s.out}>{dst}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ padding:16 },
  title:{ fontSize:18, fontWeight:"600", marginBottom:8 },
  input:{ borderWidth:1, borderColor:"#ccc", borderRadius:8, paddingHorizontal:12, paddingVertical:10 },
  btn:{ marginTop:12, padding:12, borderRadius:10, backgroundColor:"#222" },
  btnText:{ color:"#fff", textAlign:"center", fontWeight:"600" },
  out:{ marginTop:12, fontSize:16 }
});
