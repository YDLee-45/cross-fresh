// src/screens/SwipeScoreScreen.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { aiMatchScore } from "../lib/ai";
import useMatchStore from "../store/matchStore";
import { useTranslation } from "react-i18next";

import useI18nTitle from "../utils/useI18nTitle";

const ME = { age: 30, hobby: ["hiking", "movie"] };
const CARDS = [
  { id: "u1", name: "Anna", age: 28, hobby: ["movie", "cooking"] },
  { id: "u2", name: "Bob", age: 32, hobby: ["hiking", "music"] },
  { id: "u3", name: "Cara", age: 27, hobby: ["books", "movie"] },
];

export default function SwipeScoreScreen() {
  useI18nTitle("nav.swipeScore");
  const { t } = useTranslation();

  const swiperRef = useRef(null);
  const [last, setLast] = useState({ id: null, score: null, name: "" });

  // 스토어에 addResult가 없을 수도 있으니 가드
  const addResultFromStore = useMatchStore((s) => s.addResult);
  const addResult = addResultFromStore || (() => {});

  // ✅ useCallback(async …) → 안전한 일반 함수
  const onSwipedRight = (index) => {
    (async () => {
      const cand = CARDS[index];
      try {
        const res = await aiMatchScore(ME, { age: cand.age, hobby: cand.hobby });
        const score = res?.score ?? null;

        // 전역 저장 (있으면)
        addResult(cand, score);

        // footer에는 최근만 표시
        setLast({ id: cand.id, name: cand.name, score });
      } catch (e) {
        setLast({ id: cand.id, name: cand.name, score: "ERR" });
        console.warn("[score] error", e);
      }
    })();
  };

  const renderCard = (c) => (
    <View style={s.card}>
      <Text style={s.title}>{c.name} · {c.age}</Text>
      <Text style={s.sub}>{c.hobby.join(", ")}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        ref={swiperRef}
        cards={CARDS}
        renderCard={renderCard}
        onSwipedRight={onSwipedRight}
        backgroundColor="#f2f2f2"
        stackSize={3}
      />
      <View style={s.footer}>
        <Text style={s.footerText}>
          {t("recentScore")}: {last.name ? `${last.name} → ${String(last.score)}` : "-"}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 0.7,
    borderRadius: 16,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  sub: { fontSize: 16, color: "#666" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, alignItems: "center" },
  footerText: { fontSize: 16, fontWeight: "600" },
});
