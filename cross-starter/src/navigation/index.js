import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LikedScreen from "../screens/LikedScreen";
import FilterScreen from "../screens/FilterScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
export default function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "홈" }} />
      <Stack.Screen name="Liked" component={LikedScreen} options={{ title: "좋아요" }} />
      <Stack.Screen name="Filter" component={FilterScreen} options={{ title: "필터" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "프로필" }} />
    </Stack.Navigator>
  );
}
