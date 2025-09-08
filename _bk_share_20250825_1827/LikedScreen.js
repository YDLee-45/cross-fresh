import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import useMatchStore from "../store/matchStore";
import USERS from "../data/users";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

export default function LikedScreen() {
  const { colors: c } = useTheme();
  const lang = useMatchStore((s) => s.lang);
  const likedIds = useMatchStore((s) => s.likedIds);
  const resetLikes = useMatchStore((s) => s.resetLikes);
  const likedUsers = USERS.filter(u => likedIds.includes(u.id));

  return (
    <View style={{ flex:1, backgroundColor:c.bg, padding:16 }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <Text style={{ color:c.text, fontSize:20, fontWeight:"800" }}>{t(lang,"likes")}: {likedUsers.length}</Text>
        <Pressable onPress={resetLikes} style={{ backgroundColor:c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"reset")}</Text>
        </Pressable>
      </View>

      <FlatList
        data={likedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor:c.card, borderRadius:12, padding:16, marginBottom:10 }}>
            <Text style={{ color:c.text, fontSize:18, fontWeight:"700" }}>{item.name}  {item.age}</Text>
            <Text style={{ color:c.accent, marginTop:6 }}>#{item.tags.join(" #")}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color:c.subtle, textAlign:"center", marginTop:40 }}>{t(lang,"no_likes")}</Text>
        }
      />
    </View>
  );
}
