import React from "react";
import { View, Text } from "react-native";
import Swiper from "react-native-deck-swiper";
import USERS from "../data/users";

export default function SwipeScreen() {
  const [index, setIndex] = React.useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", paddingTop: 56, paddingHorizontal: 16 }}>
      <Swiper
        cards={USERS}
        cardIndex={index}
        onSwiped={() => setIndex((i) => i + 1)}
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
