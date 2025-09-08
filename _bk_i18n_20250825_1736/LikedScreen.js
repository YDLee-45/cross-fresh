import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";
import USERS from "../data/users";

export default function LikedScreen() {
  const likedIds = useMatchStore((s) => s.likedIds);
  const resetLikes = useMatchStore((s) => s.resetLikes);
  const likedUsers = USERS.filter(u => likedIds.includes(u.id));

  return (
    <View style={{ flex:1, backgroundColor:"#0b1020", padding:16 }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <Text style={{ color:"#fff", fontSize:20, fontWeight:"800" }}>좋아요: {likedUsers.length}명</Text>
        <Pressable onPress={resetLikes} style={{ backgroundColor:"#374b6b", paddingVertical:8, paddingHorizontal:12, borderRadius:10 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>초기화</Text>
        </Pressable>
      </View>

      <FlatList
        data={likedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor:"#1b2340", borderRadius:12, padding:16, marginBottom:10 }}>
            <Text style={{ color:"#fff", fontSize:18, fontWeight:"700" }}>{item.name}  {item.age}</Text>
            <Text style={{ color:"#90caf9", marginTop:6 }}>#{item.tags.join(" #")}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color:"#9fb3c8", textAlign:"center", marginTop:40 }}>아직 좋아요가 없습니다. 스와이프에서 오른쪽으로 넘겨보세요.</Text>
        }
      />
    </View>
  );
}
