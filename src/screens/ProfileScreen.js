import React, { useEffect, useMemo } from "react";
import { View, Text, Pressable, Share, Alert, Platform } from "react-native";
import USERS from "../data/users";
import useMatchStore from "../store/matchStore";
import { t } from "../i18n/dict";
import { useTheme } from "../theme/theme";

export default function ProfileScreen({ route, navigation }) {
  const { colors: c } = useTheme();
  const lang = useMatchStore(s => s.lang);

  // id 정규화
  const id = route?.params?.id != null ? String(route.params.id) : "";
  const user = useMemo(() => USERS.find(u => String(u.id) === id), [id]);

  // 스토어에 무엇이 있든 '좋아요 취소' 가능한 함수 고르기
  const unlikeFn =
    useMatchStore(s => s.dislike) ||
    useMatchStore(s => s.removeLike) ||
    useMatchStore(s => s.toggleLike) ||
    useMatchStore(s => s.unlike);

  useEffect(() => {
    navigation.setOptions?.({ title: user?.name ?? t(lang, "profile") });
  }, [navigation, user, lang]);

  if (!user) {
    return (
      <View style={{ flex:1, backgroundColor:c.bg, alignItems:"center", justifyContent:"center", padding:16 }}>
        <Text style={{ color:c.text, marginBottom:12 }}>Not found</Text>
        <Pressable onPress={()=>navigation.goBack()} style={{ backgroundColor:c.muted, padding:10, borderRadius:10 }}>
          <Text style={{ color:"#fff" }}>{t(lang,"close")}</Text>
        </Pressable>
      </View>
    );
  }

  const shareOne = async () => {
    const message =
      `- ${user.name} (${user.age}) #${user.tags.join(" #")}` +
      `\n\ncross://profile/${id}`; // 딥링크 같이 공유
    await Share.share({
      title: t(lang, "profile"),
      message,
      url: Platform.select({ ios: `cross://profile/${id}`, android: undefined }),
    });
  };

  const doUnlike = () => {
    try { if (typeof unlikeFn === "function") unlikeFn(user.id); } catch {}
    Alert.alert(t(lang, "unlike"));
    navigation.goBack();
  };

  return (
    <View style={{ flex:1, backgroundColor:c.bg, padding:16 }}>
      <View style={{ backgroundColor:c.card, borderRadius:16, padding:20, marginBottom:16 }}>
        <Text style={{ color:c.text, fontSize:24, fontWeight:"800", marginBottom:6 }}>{user.name}</Text>
        <Text style={{ color:c.subtle, marginBottom:8 }}>
          {user.gender === "M" ? "남" : "여"}  {user.age}
        </Text>
        <Text style={{ color:c.accent }}>#{user.tags.join(" #")}</Text>
      </View>

      <View style={{ flexDirection:"row", justifyContent:"space-between" }}>
        <Pressable onPress={()=>navigation.goBack()}
          style={{ backgroundColor:c.muted, paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"close")}</Text>
        </Pressable>

        <Pressable onPress={shareOne}
          style={{ backgroundColor:c.primary, paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>Share</Text>
        </Pressable>

        <Pressable onPress={doUnlike}
          style={{ backgroundColor:"#e53935", paddingVertical:12, paddingHorizontal:18, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>{t(lang,"unlike")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
