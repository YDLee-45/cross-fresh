import React from "react";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0b1020", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 20 }}>
        CROSS (Reset Starter)
      </Text>

      <Pressable
        onPress={() => navigation.navigate("Swipe")}
        style={{ backgroundColor: "#1976d2", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 12, minWidth: 180, alignItems:"center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>스와이프 시작</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Liked")}
        style={{ backgroundColor: "#374b6b", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, minWidth: 180, alignItems:"center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>좋아요 목록</Text>
      </Pressable>
    </View>
  );
}
