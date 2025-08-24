// src/screens/AIDemoScreen.jsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from "react-native";
import { translateText } from "../services/ai/translation";
import { getQuickReplies } from "../services/ai/chatAssist";

import useI18nTitle from "../utils/useI18nTitle";
import { useTranslation } from "react-i18next";

export default function AIDemoScreen() {
  useI18nTitle("nav.aiDemo");
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>
        {t("ai.demoTitle", { defaultValue: "AI Demo (oss-20b 스캐폴드 점검)" })}
      </Text>
      <TranslateBlock />
      <RepliesBlock />
    </ScrollView>
  );
}

function TranslateBlock() {
  const { t } = useTranslation();
  const [src, setSrc] = useState(
    t("ai.placeholderHello", { defaultValue: "안녕하세요!" })
  );
  const [dst, setDst] = useState("");
  const [loading, setLoading] = useState(false);

  async function onTranslate() {
    try {
      setLoading(true);
      const out = await translateText(src, "ja");
      setDst(out);
    } catch (e) {
      console.log("[AI Demo] translate error:", e);
      Alert.alert(
        t("error.unknown", { defaultValue: "알 수 없는 오류가 발생했습니다." }),
        String(e?.message || e)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{t("ai.translateDemo", { defaultValue: "번역 데모" })}</Text>
      <TextInput
        value={src}
        onChangeText={setSrc}
        placeholder={t("ai.placeholderSource", { defaultValue: "원문 입력" })}
        style={s.input}
      />
      <Pressable onPress={onTranslate} style={[s.btn, loading && { opacity: 0.6 }]} disabled={loading}>
        <Text style={s.btnText}>
          {loading
            ? t("ai.translating", { defaultValue: "번역 중..." })
            : t("ai.translateJa", { defaultValue: "AI 번역(ja)" })}
        </Text>
      </Pressable>
      <Text style={s.out}>{dst}</Text>
    </View>
  );
}

function RepliesBlock() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setItems([
        t("ai.wait", { defaultValue: "잠깐만요..." }),
        t("ai.analyzing", { defaultValue: "입력 분석 중" }),
      ]);

      console.time("suggest");
      const list = await getQuickReplies("안녕하세요, 반가워요!");
      console.timeEnd("suggest");

      const arr = Array.isArray(list)
        ? list
        : Array.isArray(list?.suggestions)
        ? list.suggestions
        : [];

      setItems(
        arr.length
          ? arr
          : ["첫 만남 반가워요! 😊", "관심사가 궁금해요!", "주말엔 뭐 하세요?"]
      );
    } catch (e) {
      console.log("[AI Demo] suggest error:", e);
      Alert.alert(
        t("error.unknown", { defaultValue: "알 수 없는 오류가 발생했습니다." }),
        String(e?.message || e)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{t("ai.quickReplyDemo", { defaultValue: "빠른 답장 데모" })}</Text>
      <Pressable onPress={load} style={[s.btn, loading && { opacity: 0.6 }]} disabled={loading}>
        <Text style={s.btnText}>
          {loading
            ? t("ai.loadingReplies", { defaultValue: "불러오는 중..." })
            : t("ai.loadSuggestions", { defaultValue: "추천 불러오기" })}
        </Text>
      </Pressable>
      <View style={s.row}>
        {items.map((text, i) => (
          <Pressable
            key={`${i}-${text}`}
            style={s.chip}
            onPress={() => Alert.alert(t("ai.quickReplyDemo", { defaultValue: "빠른 답장 데모" }), text)}
          >
            <Text>{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  card: { marginTop: 16, padding: 12, backgroundColor: "#f4f4f4", borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  btn: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: "#1f6feb" },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  out: { marginTop: 10, fontSize: 15 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
});
