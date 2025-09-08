import React from "react";
import { View, Text } from "react-native";
import Swiper from "react-native-deck-swiper";
import USERS from "../data/users";
import useMatchStore from "../store/matchStore";

export default function SwipeScreen() {
  const [index, setIndex] = React.useState(0);
  const like = useMatchStore((s) => s.like);
  const dislike = useMatchStore((s) => s.dislike);
  const likedCount = useMatchStore((s) => s.likedIds.length);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", paddingTop: 56, paddingHorizontal: 16 }}>
      {/* 좋아요 카운트 배지 */}
      <View style={{ position: "absolute", top: 12, right: 12, backgroundColor: "#263859", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, zIndex: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "800" }}> {likedCount}</Text>
      </View>

      <Swiper
        cards={USERS}
        cardIndex={index}
        onSwiped={() => setIndex((i) => i + 1)}
        onSwipedLeft={(cardIndex) => { const c = USERS[cardIndex]; if (c) dislike(c.id); }}
        onSwipedRight={(cardIndex) => { const c = USERS[cardIndex]; if (c) like(c.id); }}
        stackSize={3}
        backgroundColor={"#0b1020"}
        overlayLabels={{
          left:  { title: "NO",   style: { label: { color: "#ff6b6b", fontSize: 32, fontWeight: "800" } } },
          right: { title: "LIKE", style: { label: { color: "#4cd137", fontSize: 32, fontWeight: "800" } } }
        }}
        renderCard={(card) => {
          if (!card) return <View style={{ flex: 1 }} />;
          return (
            <View style={{ flex: 1, borderRadius: 16, backgroundColor: "#1b2340", padding: 20, justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 }}>{card.name}</Text>
              <Text style={{ color: "#cfd8dc" }}>Age {card.age}</Text>
              <Text style={{ color: "#90caf9", marginTop: 8 }}>#{card.tags.join(" #")}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
