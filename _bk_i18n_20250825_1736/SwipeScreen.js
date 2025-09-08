import React from "react";
import { View, Text, Pressable } from "react-native";
import Swiper from "react-native-deck-swiper";
import USERS from "../data/users";
import useMatchStore from "../store/matchStore";

export default function SwipeScreen({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const like = useMatchStore((s) => s.like);
  const dislike = useMatchStore((s) => s.dislike);
  const likedCount = useMatchStore((s) => s.likedIds.length);
  const filters = useMatchStore((s) => s.filters);

  const filtered = React.useMemo(() => {
    const [min, max] = filters.ageRange || [20,35];
    return USERS.filter(u => 
      (!filters.gender || u.gender === filters.gender) &&
      u.age >= min && u.age <= max
    );
  }, [filters]);

  React.useEffect(() => { setIndex(0); }, [filters]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", paddingTop: 56, paddingHorizontal: 16 }}>
      {/* 상단 배지들 */}
      <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: "#263859", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>
          필터 {filters.gender ?? "ALL"}  {filters.ageRange[0]}~{filters.ageRange[1]}
        </Text>
      </View>
      <View style={{ position: "absolute", top: 12, right: 12, backgroundColor: "#263859", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "800" }}> {likedCount}</Text>
      </View>

      {/* 필터 버튼 */}
      <Pressable onPress={() => navigation.navigate("Filter")} style={{ position: "absolute", top: 12, alignSelf: "center", backgroundColor:"#374b6b", paddingVertical:6, paddingHorizontal:10, borderRadius:10 }}>
        <Text style={{ color:"#fff", fontWeight:"700" }}>필터 수정</Text>
      </Pressable>

      <Swiper
        cards={filtered}
        cardIndex={index}
        onSwiped={() => setIndex((i) => i + 1)}
        onSwipedLeft={(cardIndex) => { const c = filtered[cardIndex]; if (c) dislike(c.id); }}
        onSwipedRight={(cardIndex) => { const c = filtered[cardIndex]; if (c) like(c.id); }}
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
              <Text style={{ color: "#cfd8dc" }}>{card.gender === "M" ? "남" : "여"}  {card.age}</Text>
              <Text style={{ color: "#90caf9", marginTop: 8 }}>#{card.tags.join(" #")}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
