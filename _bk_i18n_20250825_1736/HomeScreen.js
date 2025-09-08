import React from "react";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen({ navigation }) {
  const Btn = ({ title, to, bg }) => (
    <Pressable
      onPress={() => navigation.navigate(to)}
      style={{ backgroundColor: bg, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 12, minWidth: 180, alignItems:"center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 20 }}>
        CROSS (Reset Starter)
      </Text>
      <Btn title="스와이프 시작" to="Swipe"  bg="#1976d2" />
      <Btn title="좋아요 목록"   to="Liked"  bg="#374b6b" />
      <Btn title="필터"         to="Filter" bg="#455a64" />
    </View>
  );
}
