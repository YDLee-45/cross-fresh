import React from "react";
import { View, Text, FlatList, Pressable, Share, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import useMatchStore from "../store/matchStore";
import USERS from "../data/users";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

export default function LikedScreen({ navigation }) {
  const { colors: c } = useTheme();
  const lang = useMatchStore(s=>s.lang);
  const likedIds = useMatchStore(s=>s.likedIds);
  const resetLikes = useMatchStore(s=>s.resetLikes);
  const likedUsers = USERS.filter(u=>likedIds.includes(u.id));

  const makeText = () => {
    const lines = likedUsers.map(u => `- ${u.name} (${u.age}) #${u.tags.join(" #")}`);
    return `${t(lang,"share_prefix")} (${likedUsers.length})\n\n` + lines.join("\n");
  };
  const doCopy = async()=>{ await Clipboard.setStringAsync(makeText()); Alert.alert(t(lang,"copied")); };
  const doShare = async()=>{ try{ await Share.share({ title:t(lang,"share_title"), message:makeText() }); }catch(e){} };

  const Item = ({ item }) => (
    <Pressable onPress={()=>navigation.navigate("Profile",{id:item.id})}>
      <View style={{ backgroundColor:c.card, borderRadius:12, padding:16, marginBottom:10 }}>
        <Text style={{ color:c.text, fontSize:18, fontWeight:"700" }}>{item.name}  {item.age}</Text>
        <Text style={{ color:c.accent, marginTop:6 }}>#{item.tags.join(" #")}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex:1, backgroundColor:c.bg, padding:16 }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <Text style={{ color:c.text, fontSize:20, fontWeight:"800" }}>{t(lang,"likes")}: {likedUsers.length}</Text>
        <View style={{ flexDirection:"row" }}>
          <Pressable onPress={doCopy} style={{ backgroundColor:c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10, marginRight:8 }}>
            <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"copy")}</Text>
          </Pressable>
          <Pressable onPress={doShare} style={{ backgroundColor:c.primary, paddingVertical:8, paddingHorizontal:12, borderRadius:10, marginRight:8 }}>
            <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"share")}</Text>
          </Pressable>
          <Pressable onPress={resetLikes} style={{ backgroundColor:c.muted, paddingVertical:8, paddingHorizontal:12, borderRadius:10 }}>
            <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"reset")}</Text>
          </Pressable>
        </View>
      </View>

      <FlatList data={likedUsers} keyExtractor={(it)=>it.id} renderItem={Item}
        ListEmptyComponent={<Text style={{ color:c.subtle, textAlign:"center", marginTop:40 }}>{t(lang,"no_likes")}</Text>}
      />
    </View>
  );
}
